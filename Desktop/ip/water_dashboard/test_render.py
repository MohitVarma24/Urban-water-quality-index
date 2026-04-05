import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'water_dashboard.settings')
django.setup()

from django.template.loader import render_to_string
from monitoring.db import water_samples_collection

samples = list(water_samples_collection.find().sort("_id", -1))
print("SAMPLES_LEN:", len(samples))
html = render_to_string('index.html', {'samples': samples})
print("HAS_SPL_001:", "SPL-001" in html)
print("HAS_NO_SAMPLES_YET:", "No samples yet" in html)
