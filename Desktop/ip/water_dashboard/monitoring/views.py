from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .db import water_samples_collection

@csrf_exempt
def index(request):

    if request.method == "POST":

        sample_id = request.POST.get("sampleId")
        collection_date = request.POST.get("collectionDate")
        collector_name = request.POST.get("collectorName")
        sample_type = request.POST.get("sampleType")
        location = request.POST.get("siteName", "Unknown") # siteName is not required by default in HTML but good to handle

        temperature = request.POST.get("temperature")
        ph = request.POST.get("ph")
        turbidity = request.POST.get("turbidity")
        conductivity = request.POST.get("conductivity")

        print("FORM DATA RECEIVED:", request.POST)
        print(f"Condition check: {bool(sample_id and collection_date and collector_name and sample_type and temperature and ph and turbidity and conductivity)}")

        if sample_id and collection_date and collector_name and sample_type and temperature and ph and turbidity and conductivity:
            water_samples_collection.insert_one({
                "sample_id": sample_id,
                "collection_date": collection_date,
                "collector_name": collector_name,
                "sample_type": sample_type,
                "location": location,
                "temperature": float(temperature),
                "ph": float(ph),
                "turbidity": float(turbidity),
                "conductivity": float(conductivity)
            })

        return redirect("/")   # ← MUST be inside POST block

    samples = list(water_samples_collection.find().sort("_id", -1))

    return render(request, "index.html", {"samples": samples})
