import abc
from utils.db_util import DBUtil

class Base(abc.ABC):
    def __init__(self):
        self.class_name = type(self).__name__
        self.collection_name = self.class_name.lower()
        self.db = DBUtil().get_collection(self.collection_name)