from django.db import models
from django.utils import timezone

class Location(models.Model):
    """Water sampling locations"""
    site_name = models.CharField(max_length=200)
    site_code = models.CharField(max_length=50, unique=True)
    address = models.TextField()
    area_type = models.CharField(max_length=50, choices=[
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('industrial', 'Industrial'),
        ('mixed', 'Mixed Use'),
    ])
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    elevation = models.FloatField(null=True, blank=True)
    water_source = models.CharField(max_length=50, choices=[
        ('municipal', 'Municipal Supply'),
        ('well', 'Well'),
        ('river', 'River'),
        ('lake', 'Lake'),
        ('reservoir', 'Reservoir'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.site_name} ({self.site_code})"

class WaterSample(models.Model):
    """Water quality samples"""
    sample_id = models.CharField(max_length=100, unique=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='samples')
    collection_date = models.DateTimeField()
    collector_name = models.CharField(max_length=200)
    sample_type = models.CharField(max_length=50, choices=[
        ('routine', 'Routine'),
        ('complaint', 'Complaint'),
        ('emergency', 'Emergency'),
        ('research', 'Research'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sample {self.sample_id} from {self.location.site_name}"

class WaterQualityParameter(models.Model):
    """Water quality measurements"""
    sample = models.ForeignKey(WaterSample, on_delete=models.CASCADE, related_name='parameters')
    
    # Physical Parameters
    ph = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    turbidity = models.FloatField(null=True, blank=True)
    color = models.FloatField(null=True, blank=True)
    conductivity = models.FloatField(null=True, blank=True)
    
    # Chemical Parameters
    hardness = models.FloatField(null=True, blank=True)
    alkalinity = models.FloatField(null=True, blank=True)
    chlorine = models.FloatField(null=True, blank=True)
    nitrate = models.FloatField(null=True, blank=True)
    tds = models.FloatField(null=True, blank=True)
    dissolved_oxygen = models.FloatField(null=True, blank=True)
    
    # Heavy Metals
    arsenic = models.FloatField(null=True, blank=True)
    mercury = models.FloatField(null=True, blank=True)
    cadmium = models.FloatField(null=True, blank=True)
    
    # Microbiological Parameters
    total_coliform = models.FloatField(null=True, blank=True)
    fecal_coliform = models.FloatField(null=True, blank=True)
    e_coli = models.FloatField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Parameters for {self.sample.sample_id}"

class WaterQualityAlert(models.Model):
    """Water quality alerts"""
    parameter = models.CharField(max_length=100)
    value = models.FloatField()
    unit = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=[
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('caution', 'Caution'),
        ('warning', 'Warning'),
        ('alert', 'Alert'),
        ('critical', 'Critical'),
        ('danger', 'Danger'),
    ])
    message = models.TextField()
    recommendation = models.TextField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='alerts')
    acknowledged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert: {self.parameter} - {self.status}"

class WaterQualityIndex(models.Model):
    """Water Quality Index calculations"""
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='wqi_values')
    wqi_score = models.FloatField()
    overall_status = models.CharField(max_length=20)
    calculation_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"WQI {self.wqi_score} for {self.location.site_name}"
