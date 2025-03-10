from models.base_model import Base
from pydantic import BaseModel

from pymongo import MongoClient
from google import genai

from bson import ObjectId

# Initialize Gemini client
gemini_client = genai.Client(api_key="AIzaSyBhwkZ1_Ro1ilYsRkkkUt0leeOLhK-w7Og")

# Initialize MongoDB
mongo_client = MongoClient("mongodb+srv://user:user123@cluster0.q30qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = mongo_client["job_database"]
collection = db["job_embeddings"]


class Jobs(Base):

    def generate_embedding(self, text: str) -> list:
        """Generate embedding for search query using Gemini."""
        try:
            result = gemini_client.models.embed_content(
                model="text-embedding-004",
                contents=text
            )
            return result.embeddings[0].values
        except Exception as e:
            return []

    def search_jobs_vector(self, query: str, limit: int = 5) -> list:
        """Search for jobs using MongoDB Atlas Vector Search."""
        # Generate embedding for the query
        query_embedding = self.generate_embedding(query)
        
        if not query_embedding:
            return []

        # Define the vector search pipeline
        pipeline = [
            {
                "$vectorSearch": {
                    "index": "job_index",
                    "path": "values",
                    "queryVector": query_embedding,
                    "numCandidates": 100,
                    "limit": limit
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "metadata": 1,
                    "score": {
                        "$meta": "vectorSearchScore"
                    }
                }
            }
        ]
        
        try:
            # Execute the search
            results = list(collection.aggregate(pipeline))
            return [{"id": str(doc["_id"]), "metadata": doc["metadata"], "score": doc["score"]} for doc in results]
        except Exception as e:
            return []
        
    def get_job_by_id(self, id: str) -> dict:
        """Get job details by ID."""
        try:
            result = collection.find_one({"_id": id})
            if not result:
                return {"error": "Job not found"}
            return {
                "id": str(result["_id"]),
                "metadata": result.get("metadata", {}),
            }
        except Exception as e:
            return {"error": str(e)}


