from django.contrib import admin
from .models import Location, WaterSample, WaterQualityParameter, WaterQualityAlert, WaterQualityIndex

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['site_name', 'site_code', 'area_type', 'water_source', 'created_at']
    search_fields = ['site_name', 'site_code']
    list_filter = ['area_type', 'water_source', 'created_at']

@admin.register(WaterSample)
class WaterSampleAdmin(admin.ModelAdmin):
    list_display = ['sample_id', 'location', 'collection_date', 'collector_name', 'sample_type', 'created_at']
    search_fields = ['sample_id', 'location__site_name']
    list_filter = ['sample_type', 'collection_date', 'created_at']

@admin.register(WaterQualityParameter)
class WaterQualityParameterAdmin(admin.ModelAdmin):
    list_display = ['sample', 'ph', 'temperature', 'turbidity', 'tds', 'conductivity', 'created_at']
    search_fields = ['sample__sample_id', 'sample__location__site_name']
    list_filter = ['created_at']

@admin.register(WaterQualityAlert)
class WaterQualityAlertAdmin(admin.ModelAdmin):
    list_display = ['parameter', 'value', 'status', 'location', 'acknowledged', 'created_at']
    search_fields = ['parameter', 'location__site_name', 'message']
    list_filter = ['status', 'acknowledged', 'created_at']
    actions = ['acknowledge_alerts']

    def acknowledge_alerts(self, request, queryset):
        queryset.update(acknowledged=True)
    acknowledge_alerts.short_description = "Mark selected alerts as acknowledged"

@admin.register(WaterQualityIndex)
class WaterQualityIndexAdmin(admin.ModelAdmin):
    list_display = ['location', 'wqi_score', 'overall_status', 'calculation_date', 'created_at']
    search_fields = ['location__site_name']
    list_filter = ['overall_status', 'calculation_date']
