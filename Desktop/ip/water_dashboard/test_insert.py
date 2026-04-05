import pymongo

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['water_dashboard']
collection = db['water_samples']

collection.insert_one({
    "sample_id": "SPL-001",
    "collection_date": "2026-03-14T10:00",
    "collector_name": "Tester",
    "sample_type": "Drinking",
    "location": "Zone A",
    "temperature": 25.5,
    "ph": 7.2,
    "turbidity": 0.5,
    "conductivity": 300
})
print("Inserted dummy record.")
