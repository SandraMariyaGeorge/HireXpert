import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

class DBUtil:
    def __init__(self, db_name="Prathibhimb"):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client[db_name]

    def get_db(self):
        return self.db

    def get_collection(self, collection_name):
        return self.db[collection_name]
    
    def close_db(self):
        self.client.close()