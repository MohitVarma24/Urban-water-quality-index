from django.urls import path
from . import views

app_name = 'water_quality'

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),
    
    # API Endpoints
    path('api/locations/', views.api_locations, name='api_locations'),
    path('api/samples/', views.api_samples, name='api_samples'),
    path('api/parameters/', views.api_parameters, name='api_parameters'),
    path('api/dashboard-stats/', views.api_dashboard_stats, name='api_dashboard_stats'),
    path('api/chart-data/', views.api_chart_data, name='api_chart_data'),
    path('api/alerts/', views.api_alerts, name='api_alerts'),
]
