import pymongo
from django.conf import settings

# Usually, MongoDB runs on localhost:27017 by default
client = pymongo.MongoClient('mongodb://localhost:27017/')

# Create or connect to a database named 'water_dashboard'
db = client['water_dashboard']

# Create or connect to a collection named 'water_samples'
water_samples_collection = db['water_samples']
