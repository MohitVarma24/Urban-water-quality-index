from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.db.models import Avg, Max, Min, Count
from .models import Location, WaterSample, WaterQualityParameter, WaterQualityAlert, WaterQualityIndex
import json
import math

def dashboard_view(request):
    """Main dashboard view"""
    return render(request, 'water_quality/dashboard.html')

@csrf_exempt
@require_http_methods(["GET", "POST"])
def api_locations(request):
    """API endpoint for locations"""
    if request.method == 'GET':
        locations = Location.objects.all().values()
        return JsonResponse(list(locations), safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        location = Location.objects.create(
            site_name=data['siteName'],
            site_code=data['siteCode'],
            address=data['address'],
            area_type=data['areaType'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            elevation=data.get('elevation'),
            water_source=data['waterSource']
        )
        return JsonResponse({'id': location.id, 'message': 'Location saved successfully'})

@csrf_exempt
@require_http_methods(["GET", "POST"])
def api_samples(request):
    """API endpoint for water samples"""
    if request.method == 'GET':
        samples = WaterSample.objects.select_related('location').all().order_by('-created_at')[:10]
        sample_data = []
        for sample in samples:
            sample_data.append({
                'sampleId': sample.sample_id,
                'siteName': sample.location.site_name,
                'collectionDate': sample.collection_date.isoformat(),
                'collectorName': sample.collector_name,
                'sampleType': sample.sample_type,
                'timestamp': sample.created_at.isoformat()
            })
        return JsonResponse(sample_data, safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        
        # Get or create location
        location, created = Location.objects.get_or_create(
            site_name=data['siteName'],
            defaults={
                'site_code': data.get('siteCode', 'AUTO'),
                'address': data.get('address', 'Auto-generated'),
                'area_type': 'mixed',
                'latitude': 0.0,
                'longitude': 0.0,
                'water_source': 'municipal'
            }
        )
        
        # Create sample
        sample = WaterSample.objects.create(
            sample_id=data['sampleId'],
            location=location,
            collection_date=timezone.now(),
            collector_name=data.get('collectorName', 'System'),
            sample_type=data.get('sampleType', 'routine')
        )
        
        # Create parameters
        WaterQualityParameter.objects.create(
            sample=sample,
            ph=data.get('ph'),
            temperature=data.get('temperature'),
            turbidity=data.get('turbidity'),
            tds=data.get('tds'),
            conductivity=data.get('conductivity'),
            hardness=data.get('hardness'),
            alkalinity=data.get('alkalinity'),
            chlorine=data.get('chlorine'),
            nitrate=data.get('nitrate'),
            dissolved_oxygen=data.get('dissolvedOxygen')
        )
        
        # Calculate and save WQI
        calculate_wqi(sample)
        
        return JsonResponse({'message': 'Sample saved successfully'})

@csrf_exempt
@require_http_methods(["GET", "POST"])
def api_parameters(request):
    """API endpoint for water quality parameters"""
    if request.method == 'POST':
        data = json.loads(request.body)
        
        # Get latest sample for the location
        sample = WaterSample.objects.filter(
            location__site_name=data.get('siteName')
        ).order_by('-created_at').first()
        
        if sample:
            # Update or create parameters
            WaterQualityParameter.objects.update_or_create(
                sample=sample,
                defaults={
                    'ph': data.get('ph'),
                    'temperature': data.get('temperature'),
                    'turbidity': data.get('turbidity'),
                    'tds': data.get('tds'),
                    'conductivity': data.get('conductivity'),
                    'hardness': data.get('hardness'),
                    'alkalinity': data.get('alkalinity'),
                    'chlorine': data.get('chlorine'),
                    'nitrate': data.get('nitrate'),
                    'dissolved_oxygen': data.get('dissolvedOxygen')
                }
            )
            
            # Recalculate WQI
            calculate_wqi(sample)
            
            return JsonResponse({'message': 'Parameters saved successfully'})
        
        return JsonResponse({'error': 'No sample found for this location'}, status=400)

def api_dashboard_stats(request):
    """API endpoint for dashboard statistics"""
    total_samples = WaterSample.objects.count()
    total_locations = Location.objects.count()
    
    # Calculate latest WQI
    latest_wqi = WaterQualityIndex.objects.order_by('-created_at').first()
    wqi_score = latest_wqi.wqi_score if latest_wqi else 0
    
    # Calculate compliance rate
    compliant_samples = 0
    for param in WaterQualityParameter.objects.all():
        if is_compliant(param):
            compliant_samples += 1
    total_parameters = WaterQualityParameter.objects.count()
    compliance_rate = (compliant_samples / total_parameters * 100) if total_parameters > 0 else 0
    
    # Active alerts
    active_alerts = WaterQualityAlert.objects.filter(acknowledged=False).count()
    
    return JsonResponse({
        'totalSamples': total_samples,
        'wqi': round(wqi_score, 1),
        'complianceRate': round(compliance_rate, 1),
        'activeAlerts': active_alerts
    })

def api_chart_data(request):
    """API endpoint for chart data"""
    samples = WaterSample.objects.select_related('location', 'parameters').order_by('-created_at')[:10]
    
    chart_data = []
    for sample in samples:
        try:
            param = sample.parameters.first()
            chart_data.append({
                'date': sample.collection_date.strftime('%Y-%m-%d'),
                'ph': param.ph if param else 7,
                'turbidity': param.turbidity if param else 5,
                'tds': param.tds if param else 300,
                'conductivity': param.conductivity if param else 1000
            })
        except:
            chart_data.append({
                'date': sample.collection_date.strftime('%Y-%m-%d'),
                'ph': 7,
                'turbidity': 5,
                'tds': 300,
                'conductivity': 1000
            })
    
    return JsonResponse(list(reversed(chart_data)), safe=False)

def api_alerts(request):
    """API endpoint for water quality alerts"""
    alerts = WaterQualityAlert.objects.filter(acknowledged=False).order_by('-created_at')
    
    alert_data = []
    for alert in alerts:
        alert_data.append({
            'id': alert.id,
            'parameter': alert.parameter,
            'value': alert.value,
            'unit': alert.unit,
            'status': alert.status,
            'message': alert.message,
            'recommendation': alert.recommendation,
            'location': alert.location.site_name,
            'timestamp': alert.created_at.isoformat(),
            'acknowledged': alert.acknowledged
        })
    
    return JsonResponse(alert_data, safe=False)

def calculate_wqi(sample):
    """Calculate Water Quality Index"""
    try:
        param = sample.parameters.first()
        if not param:
            return
        
        # Simplified WQI calculation (you can enhance this)
        weights = {
            'ph': 0.2,
            'turbidity': 0.2,
            'tds': 0.2,
            'conductivity': 0.2,
            'temperature': 0.2
        }
        
        scores = {}
        if param.ph:
            scores['ph'] = max(0, 100 - abs(param.ph - 7) * 10)
        if param.turbidity:
            scores['turbidity'] = max(0, 100 - param.turbidity * 4)
        if param.tds:
            scores['tds'] = max(0, 100 - param.tds / 10)
        if param.conductivity:
            scores['conductivity'] = max(0, 100 - param.conductivity / 30)
        if param.temperature:
            scores['temperature'] = max(0, 100 - abs(param.temperature - 25) * 2)
        
        wqi_score = sum(scores[key] * weights[key] for key in scores if key in weights)
        
        # Determine status
        if wqi_score >= 90:
            status = 'excellent'
        elif wqi_score >= 70:
            status = 'good'
        elif wqi_score >= 50:
            status = 'fair'
        elif wqi_score >= 30:
            status = 'poor'
        else:
            status = 'danger'
        
        # Save WQI
        WaterQualityIndex.objects.update_or_create(
            location=sample.location,
            defaults={
                'wqi_score': wqi_score,
                'overall_status': status,
                'calculation_date': timezone.now()
            }
        )
        
        # Generate alerts for poor quality
        if wqi_score < 50:
            generate_alerts(sample, param)
            
    except Exception as e:
        print(f"WQI calculation error: {e}")

def generate_alerts(sample, param):
    """Generate alerts for poor water quality"""
    location = sample.location
    
    # pH alerts
    if param.ph and (param.ph < 6.5 or param.ph > 8.5):
        status = 'danger' if param.ph < 6.0 or param.ph > 9.0 else 'warning'
        message = f"pH is {'too acidic' if param.ph < 6.5 else 'too alkaline'}"
        recommendation = f"Add {'alkaline' if param.ph < 6.5 else 'acidic'} treatment"
        
        WaterQualityAlert.objects.get_or_create(
            parameter='pH Level',
            value=param.ph,
            unit='pH',
            defaults={
                'status': status,
                'message': message,
                'recommendation': recommendation,
                'location': location
            }
        )
    
    # Similar alerts for other parameters...
    # (You can add more alert logic for turbidity, TDS, etc.)

def is_compliant(param):
    """Check if parameters are compliant with standards"""
    if param.ph and (param.ph < 6.5 or param.ph > 8.5):
        return False
    if param.turbidity and param.turbidity > 5:
        return False
    if param.tds and param.tds > 1000:
        return False
    if param.conductivity and param.conductivity > 3000:
        return False
    return True
