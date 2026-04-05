# Urban Water Quality Monitoring Dashboard - Django Integration

A comprehensive web-based water quality monitoring system built with Django backend and responsive frontend.

## Features

- **Real-time Water Quality Monitoring**: Track pH, temperature, turbidity, TDS, conductivity, and more
- **Water Safety Advisory System**: Rule-based AI logic for water safety classification
- **Automatic Alerts**: Browser and in-app notifications for poor water quality
- **Interactive Dashboard**: Live statistics, charts, and recent samples
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Django Integration**: Full backend API with database storage

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

### 4. Start Django Server
```bash
python manage.py runserver
```

### 5. Open Frontend
Open `index.html` in your browser or serve it with a web server:
```bash
# Option 1: Python server
python -m http.server 8080

# Option 2: Node.js server
npx serve -s . -l 8080
```

## Project Structure

```
├── water_quality/           # Django app
│   ├── models.py          # Database models
│   ├── views.py           # API endpoints
│   ├── urls.py            # App URL patterns
│   └── admin.py          # Django admin configuration
├── water_quality_project/   # Django project settings
│   ├── settings.py        # Project configuration
│   └── urls.py           # Main URL patterns
├── index.html              # Frontend dashboard
├── script.js              # Frontend JavaScript
├── styles.css              # Frontend styling
├── manage.py              # Django management script
└── requirements.txt        # Python dependencies
```

## API Endpoints

- `GET /api/locations/` - List all sampling locations
- `POST /api/locations/` - Create new location
- `GET /api/samples/` - List water samples
- `POST /api/samples/` - Submit new water sample
- `GET /api/parameters/` - List water quality parameters
- `POST /api/parameters/` - Submit water quality parameters
- `GET /api/dashboard-stats/` - Dashboard statistics
- `GET /api/chart-data/` - Chart data
- `GET /api/alerts/` - Water quality alerts

## Water Quality Parameters

### Physical Parameters
- **pH**: 6.5-8.5 (BIS/WHO standard)
- **Temperature**: 0-50°C
- **Turbidity**: ≤5 NTU
- **Conductivity**: ≤3000 μS/cm
- **TDS**: ≤1000 mg/L

### Chemical Parameters
- Hardness, Alkalinity, Chlorine, Nitrate, Dissolved Oxygen

### Microbiological Parameters
- Total Coliform, Fecal Coliform, E. coli

## Alert System

The system automatically generates alerts when water quality parameters exceed safe thresholds:

### Alert Levels
- **🟢 Excellent**: Optimal water quality
- **🔵 Good**: Acceptable water quality
- **🟡 Caution**: Monitor closely
- **🟠 Warning**: Take corrective action
- **🔴 Critical/Danger**: Immediate action required

### Alert Types
- **Browser Notifications**: Native system alerts
- **In-App Alerts**: Floating notification cards
- **Dashboard Integration**: Alert counter and history
- **Real-time Validation**: Input field alerts

## Water Quality Index (WQI)

The system calculates a weighted Water Quality Index based on:
- pH levels
- Turbidity
- Total Dissolved Solids (TDS)
- Conductivity
- Temperature

**WQI Scale:**
- 90-100: Excellent
- 70-89: Good
- 50-69: Fair
- 30-49: Poor
- 0-29: Danger

## Django Admin

Access the Django admin interface at `http://localhost:8000/admin/` to:
- Manage sampling locations
- View and edit water samples
- Monitor water quality parameters
- Track and acknowledge alerts
- View Water Quality Index calculations

## Configuration

### Database Settings
Default uses SQLite. To use PostgreSQL or MySQL, modify `DATABASES` in `settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'water_quality_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### CORS Settings
For production, update CORS settings in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

## Development

### Running Tests
```bash
python manage.py test
```

### Creating New Migrations
```bash
python manage.py makemigrations water_quality
```

### Applying Migrations
```bash
python manage.py migrate
```

## Production Deployment

### Security Considerations
1. Change `SECRET_KEY` in production
2. Set `DEBUG = False`
3. Configure proper database
4. Set up proper CORS origins
5. Use HTTPS
6. Configure web server (nginx/Apache)

### Environment Variables
```bash
export DJANGO_SETTINGS_MODULE=water_quality_project.settings
export SECRET_KEY=your-production-secret-key
export DEBUG=False
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the Django admin for detailed logs
- Review browser console for JavaScript errors
- Verify Django server is running on port 8000
- Ensure frontend is served on port 8080
