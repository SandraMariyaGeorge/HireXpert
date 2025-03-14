import json
from bs4 import BeautifulSoup
import requests
import re
from pymongo import MongoClient
import openai  # Add OpenAI import
from google import genai

# Initialize Gemini client
gemini_client = genai.Client(api_key="AIzaSyBhwkZ1_Ro1ilYsRkkkUt0leeOLhK-w7Og")

# Initialize MongoDB
mongo_client = MongoClient("mongodb+srv://user:user123@cluster0.q30qd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = mongo_client["job_database"]
collection = db["job_embeddings"]

def clean_text(text: str) -> str:
    """Removes HTML tags and excessive whitespace from input text."""
    soup = BeautifulSoup(text, 'html.parser')
    new_text = soup.get_text(separator="\n", strip=True)
    return re.sub(r'\s+', ' ', new_text).strip()

def create_embeddings(data):
    """Generate embeddings and store them in MongoDB."""
    try:
        # Generate embeddings using Gemini
        result = gemini_client.models.embed_content(
            model="text-embedding-004",
            contents=data['job_title'] + " " + data['description'] + " " + data['qualification'] + " " + data['responsibilities']
        )
        
        # The output shows that result.embeddings[0] contains values property
        embeddings = result.embeddings[0].values
        
        # Extract embedding values
        data['values'] = embeddings

        # Ensure required format for MongoDB
        document = {
            "_id": data['job_id'],
            "values": data['values'],
            "metadata": {
                "title": data['job_title'],
                "location": data['location'],
                "description": data['description'],
                "qualification": data['qualification'],
                "responsibilities": data['responsibilities'],
            }
        }
        
        collection.insert_one(document)
        print(f"Successfully inserted job {data['job_id']} into MongoDB.")

    except Exception as e:
        print(f"Error creating embeddings: {e}")

def scrape_microsoft_jobs(api_url, page_number):
    """Scrapes job listings from Microsoft's API."""
    
    full_api_url = f"{api_url}&pg={page_number}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }  # Mimic browser to prevent blocking

    try:
        response = requests.get(full_api_url, headers=headers)
        response.raise_for_status()
        data = response.json()

        if data["operationResult"]["status"] == "Success":
            jobs = data["operationResult"]["result"]["jobs"]
            for job in jobs:
                job_details = {
                    'job_id': job['jobId'],
                    'job_title': job['title'],
                    'posting_date': job['postingDate'],
                    'location': job['properties'].get('primaryLocation', 'Unknown'),
                }

                # Fetch full job details
                job_api_url = f"https://gcsservices.careers.microsoft.com/search/api/v1/job/{job['jobId']}?lang=en_us"
                try:
                    job_response = requests.get(job_api_url, headers=headers)
                    job_response.raise_for_status()
                    job_data = job_response.json()
                    result = job_data['operationResult']['result']

                    job_details['description'] = clean_text(result.get('description', ''))
                    job_details['qualification'] = clean_text(result.get('qualifications', ''))
                    job_details['responsibilities'] = clean_text(result.get('responsibilities', ''))

                    print(f"Processing job {job_details['job_id']}: {job_details['job_title']}")
                    create_embeddings(job_details)

                except requests.exceptions.RequestException as e:
                    print(f"Error fetching job details from {job_api_url}: {e}")
                except json.JSONDecodeError as e:
                    print(f"JSON decode error for response from {job_api_url}: {e}")
                except KeyError as e:
                    print(f"KeyError: {e} in job details. Check the API response structure.")

                print("--------------------------------------")

        else:
            print(f"API request failed. Status: {data['operationResult']['status']}")
            if "errorInfo" in data:
                print(f"Error Details: {data['errorInfo']}")

    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
    except KeyError as e:
        print(f"Key error: {e}. Check the API response structure.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    base_api_url = "https://gcsservices.careers.microsoft.com/search/api/v1/search?l=en_us&pgSz=20&o=Relevance&flt=true"
    
    num_pages = 3  # Example: Scrape pages 1-3

    for page in range(1, num_pages + 1):
        print(f"\n--- Scraping Page {page} ---")
        scrape_microsoft_jobs(base_api_url, page)
