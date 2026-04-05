// Django API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Water Safety Advisory Rules Engine
const WATER_SAFETY_RULES = {
    // pH Safety Rules
    ph: {
        critical: { min: 0, max: 6.0, message: "DANGEROUS: Water is highly acidic - Unsafe for consumption", color: "#dc3545", icon: "times-circle" },
        warning: { min: 6.0, max: 6.5, message: "CAUTION: Water is acidic - May cause health issues", color: "#ffc107", icon: "exclamation-triangle" },
        caution: { min: 6.5, max: 8.5, message: "ACCEPTABLE: Water is within safe range", color: "#17a2b8", icon: "info-circle" },
        good: { min: 8.5, max: 9.0, message: "GOOD: Water quality is acceptable", color: "#28a745", icon: "check-circle" },
        alert: { min: 9.0, max: 14.0, message: "WARNING: Water is alkaline - May cause irritation", color: "#ffc107", icon: "exclamation-triangle" },
        danger: { min: 14.0, max: 100, message: "DANGEROUS: Water is highly alkaline - Unsafe", color: "#dc3545", icon: "times-circle" }
    },
    
    // Temperature Safety Rules
    temperature: {
        critical: { min: 0, max: 5, message: "DANGEROUS: Water is too cold - Potential bacterial growth", color: "#dc3545", icon: "times-circle" },
        warning: { min: 5, max: 15, message: "CAUTION: Cold water - May contain contaminants", color: "#ffc107", icon: "exclamation-triangle" },
        good: { min: 15, max: 25, message: "OPTIMAL: Temperature is ideal for drinking", color: "#28a745", icon: "check-circle" },
        caution: { min: 25, max: 35, message: "ACCEPTABLE: Warm water - Monitor quality", color: "#17a2b8", icon: "info-circle" },
        alert: { min: 35, max: 45, message: "WARNING: Hot water - Potential contamination", color: "#ffc107", icon: "exclamation-triangle" },
        danger: { min: 45, max: 100, message: "DANGEROUS: Water is too hot - Unsafe", color: "#dc3545", icon: "times-circle" }
    },
    
    // Turbidity Safety Rules (NTU)
    turbidity: {
        excellent: { min: 0, max: 1, message: "EXCELLENT: Crystal clear water", color: "#28a745", icon: "award" },
        good: { min: 1, max: 5, message: "GOOD: Clear water - Safe for consumption", color: "#17a2b8", icon: "check-circle" },
        caution: { min: 5, max: 10, message: "CAUTION: Cloudy water - Filter before use", color: "#ffc107", icon: "exclamation-triangle" },
        warning: { min: 10, max: 25, message: "WARNING: Very cloudy - Unsafe appearance", color: "#fd7e14", icon: "exclamation-circle" },
        danger: { min: 25, max: 100, message: "DANGEROUS: Extremely cloudy - Do not consume", color: "#dc3545", icon: "times-circle" }
    },
    
    // TDS Safety Rules (mg/L)
    tds: {
        excellent: { min: 0, max: 300, message: "EXCELLENT: Very low dissolved solids", color: "#28a745", icon: "award" },
        good: { min: 300, max: 600, message: "GOOD: Low dissolved solids - Safe", color: "#17a2b8", icon: "check-circle" },
        caution: { min: 600, max: 1000, message: "CAUTION: Moderate dissolved solids - Monitor", color: "#ffc107", icon: "exclamation-triangle" },
        warning: { min: 1000, max: 1500, message: "WARNING: High dissolved solids - Filter recommended", color: "#fd7e14", icon: "exclamation-circle" },
        danger: { min: 1500, max: 10000, message: "DANGEROUS: Very high dissolved solids - Unsafe", color: "#dc3545", icon: "times-circle" }
    },
    
    // Conductivity Safety Rules (μS/cm)
    conductivity: {
        excellent: { min: 0, max: 500, message: "EXCELLENT: Very low conductivity", color: "#28a745", icon: "award" },
        good: { min: 500, max: 1500, message: "GOOD: Low conductivity - Safe", color: "#17a2b8", icon: "check-circle" },
        caution: { min: 1500, max: 2500, message: "CAUTION: Moderate conductivity - Check source", color: "#ffc107", icon: "exclamation-triangle" },
        warning: { min: 2500, max: 3000, message: "WARNING: High conductivity - Possible contamination", color: "#fd7e14", icon: "exclamation-circle" },
        danger: { min: 3000, max: 10000, message: "DANGEROUS: Very high conductivity - Unsafe", color: "#dc3545", icon: "times-circle" }
    }
};

// API Functions
async function fetchFromAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Load data from Django API
async function loadDashboardData() {
    try {
        // Load dashboard stats
        const stats = await fetchFromAPI('/dashboard-stats/');
        updateDashboardStatsFromAPI(stats);
        
        // Load recent samples
        const samples = await fetchFromAPI('/samples/');
        updateRecentSamplesFromAPI(samples);
        
        // Load chart data
        const chartData = await fetchFromAPI('/chart-data/');
        updateChartFromAPI(chartData);
        
        // Load alerts
        const alerts = await fetchFromAPI('/alerts/');
        updateAlertsFromAPI(alerts);
        
        // Update advisory
        updateAdvisoryFromLatestSample();
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
    }
}

// Update dashboard stats from API
function updateDashboardStatsFromAPI(stats) {
    const totalSamplesElement = document.querySelector('.stat-card:nth-child(1) h3');
    const wqiElement = document.querySelector('.stat-card:nth-child(2) h3');
    const complianceElement = document.querySelector('.stat-card:nth-child(3) h3');
    const alertsElement = document.querySelector('.stat-card:nth-child(4) h3');
    
    if (totalSamplesElement) totalSamplesElement.textContent = stats.totalSamples;
    if (wqiElement) wqiElement.textContent = stats.wqi;
    if (complianceElement) complianceElement.textContent = stats.complianceRate + '%';
    if (alertsElement) alertsElement.textContent = stats.activeAlerts;
}

// Update recent samples from API
function updateRecentSamplesFromAPI(samples) {
    const sampleList = document.querySelector('.sample-list');
    if (!sampleList) return;
    
    if (samples.length === 0) {
        sampleList.innerHTML = '<div class="no-samples">No samples recorded yet</div>';
        return;
    }
    
    sampleList.innerHTML = '';
    samples.forEach(sample => {
        const sampleItem = createSampleItem(sample);
        sampleList.appendChild(sampleItem);
    });
}

// Update chart from API data
function updateChartFromAPI(chartData) {
    if (chartData.length === 0) return;
    
    // Update chart with new data
    drawChart(chartData);
}

// Update alerts from API
function updateAlertsFromAPI(alerts) {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) return;
    
    alerts.forEach(alert => {
        if (!alert.acknowledged) {
            showInAppAlert(alert);
        }
    });
}

// Save sample data to Django API
async function saveSampleDataToAPI(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetchFromAPI('/samples/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        console.log('Sample saved to API:', response);
        
        // Reload dashboard data
        await loadDashboardData();
        
        // Show success message
        showSuccessMessage('Sample saved successfully!');
        
    } catch (error) {
        console.error('Failed to save sample:', error);
        showErrorMessage('Failed to save sample. Please try again.');
    }
}

// Save parameters to Django API
async function saveParametersToAPI(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetchFromAPI('/parameters/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        console.log('Parameters saved to API:', response);
        
        // Reload dashboard data
        await loadDashboardData();
        
        // Show success message
        showSuccessMessage('Parameters saved successfully!');
        
    } catch (error) {
        console.error('Failed to save parameters:', error);
        showErrorMessage('Failed to save parameters. Please try again.');
    }
}

// Show success message
function showSuccessMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Show error message
function showErrorMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'error-message';
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 1rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Fallback functions for localStorage
function loadFromLocalStorage() {
    updateDashboardStats();
    updateRecentSamples();
    initializeChart();
}

// Water Safety Advisory Classification Engine (same as before)
function classifyWaterSafety(sampleData) {
    const advisories = [];
    let overallStatus = 'safe';
    let highestRisk = 'excellent';
    
    // Classify pH
    const phValue = parseFloat(sampleData.ph);
    const phAdvisory = getParameterAdvisory('ph', phValue);
    if (phAdvisory) {
        advisories.push({
            parameter: 'pH Level',
            value: phValue,
            status: phAdvisory.level,
            message: phAdvisory.rule.message,
            color: phAdvisory.rule.color,
            icon: phAdvisory.rule.icon,
            recommendation: getRecommendation('ph', phAdvisory.level)
        });
        overallStatus = getWorstStatus(overallStatus, phAdvisory.level);
        highestRisk = getWorstRisk(highestRisk, phAdvisory.level);
    }
    
    // Similar classification for other parameters...
    
    return {
        overallStatus,
        highestRisk,
        advisories,
        timestamp: new Date().toISOString(),
        location: sampleData.siteName || 'Unknown Location'
    };
}

// Helper functions (same as before)
function getParameterAdvisory(parameter, value) {
    const rules = WATER_SAFETY_RULES[parameter];
    if (!rules || isNaN(value)) return null;
    
    for (const [level, rule] of Object.entries(rules)) {
        if (value >= rule.min && value <= rule.max) {
            return { level, rule };
        }
    }
    
    return null;
}

function getWorstStatus(current, newLevel) {
    const severityOrder = ['danger', 'critical', 'warning', 'alert', 'caution', 'good', 'excellent'];
    const currentIndex = severityOrder.indexOf(current);
    const newIndex = severityOrder.indexOf(newLevel);
    return newIndex > currentIndex ? newLevel : current;
}

function getWorstRisk(current, newLevel) {
    const riskOrder = ['danger', 'critical', 'warning', 'alert', 'caution', 'good', 'excellent'];
    const currentIndex = riskOrder.indexOf(current);
    const newIndex = riskOrder.indexOf(newLevel);
    return newIndex > currentIndex ? newLevel : current;
}

function getRecommendation(parameter, level) {
    const recommendations = {
        ph: {
            danger: "Immediate water treatment required - Contact water authority",
            critical: "Urgent pH correction needed - Use neutralizing agents",
            warning: "pH adjustment recommended - Consult water treatment specialist",
            alert: "Monitor pH levels - Consider filtration",
            caution: "Regular pH monitoring recommended",
            good: "Maintain current pH balance",
            excellent: "Optimal pH levels maintained"
        }
        // Add recommendations for other parameters...
    };
    
    return recommendations[parameter]?.[level] || "Consult water quality specialist";
}

// Real-time pH input validation with alerts
function validatePhInput(input) {
    const phValue = parseFloat(input.value);
    
    if (isNaN(phValue)) return;
    
    clearPhInputAlerts();
    
    if (phValue < 6.5 || phValue > 8.5) {
        const alertType = phValue < 6.5 ? 'low' : 'high';
        const alertData = {
            low: {
                message: "DANGEROUS: pH is too acidic (below 6.5)",
                color: "#dc3545",
                icon: "times-circle",
                recommendation: "Add alkaline treatment immediately"
            },
            high: {
                message: "DANGEROUS: pH is too alkaline (above 8.5)", 
                color: "#dc3545",
                icon: "times-circle",
                recommendation: "Add acidic treatment immediately"
            }
        };
        
        const alert = alertData[alertType];
        showPhInputAlert(input, alert);
        
        if (Notification.permission === 'granted') {
            new Notification(`🚨 pH Level Alert`, {
                body: alert.message,
                icon: '/favicon.ico',
                tag: `ph-alert-${Date.now()}`
            });
        }
    }
}

function showPhInputAlert(input, alert) {
    const alertElement = document.createElement('div');
    alertElement.className = 'ph-input-alert';
    alertElement.innerHTML = `
        <div class="ph-alert-content">
            <i class="fas fa-${alert.icon}" style="color: ${alert.color};"></i>
            <span class="ph-alert-message">${alert.message}</span>
            <div class="ph-alert-recommendation">
                <strong>Recommendation:</strong> ${alert.recommendation}
            </div>
        </div>
    `;
    
    const inputRect = input.getBoundingClientRect();
    alertElement.style.position = 'fixed';
    alertElement.style.top = (inputRect.bottom + 5) + 'px';
    alertElement.style.left = inputRect.left + 'px';
    alertElement.style.zIndex = '1000';
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

function clearPhInputAlerts() {
    const existingAlerts = document.querySelectorAll('.ph-input-alert');
    existingAlerts.forEach(alert => alert.remove());
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Request notification permission for alerts
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
        });
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize form validations
    initializeFormValidations();
    
    // Load data from Django API
    loadDashboardData();
    
    // Set current datetime for collection date
    setDefaultDateTime();
});

// Navigation between sections
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Initialize form validations
function initializeFormValidations() {
    // Sample form validation
    const sampleForm = document.getElementById('sampleForm');
    if (sampleForm) {
        sampleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateSampleForm(this)) {
                saveSampleDataToAPI(this);
            }
        });
        
        // Real-time validation
        const sampleInputs = sampleForm.querySelectorAll('input[type="number"], input[type="text"], select, textarea');
        sampleInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
            
            // Special pH input validation with alerts
            if (input.id === 'ph') {
                input.addEventListener('input', () => validatePhInput(input));
                input.addEventListener('blur', () => validatePhInput(input));
            }
        });
    }
    
    // Parameters form validation
    const parametersForm = document.getElementById('parametersForm');
    if (parametersForm) {
        parametersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateParametersForm(this)) {
                saveParametersToAPI(this);
            }
        });
        
        const parameterInputs = parametersForm.querySelectorAll('input[type="number"]');
        parameterInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
    }
}

// Form validation functions
function validateSampleForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            clearError(field);
        }
    });
    
    return isValid;
}

function validateParametersForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'This field is required');
            isValid = false;
        } else {
            clearError(field);
        }
    });
    
    return isValid;
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'number') {
        const value = parseFloat(field.value);
        const min = parseFloat(field.min);
        const max = parseFloat(field.max);
        
        if (!isNaN(value)) {
            if (!isNaN(min) && value < min) {
                showError(field, `Value must be at least ${min}`);
                return false;
            }
            if (!isNaN(max) && value > max) {
                showError(field, `Value must be at most ${max}`);
                return false;
            }
        }
    }
    
    clearError(field);
    return true;
}

function showError(field, message) {
    clearError(field);
    field.classList.add('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = message;
    }
}

function clearError(field) {
    field.classList.remove('error');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.textContent = '';
    }
}

// Set current datetime for collection date
function setDefaultDateTime() {
    const collectionDateField = document.getElementById('collectionDate');
    if (collectionDateField) {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        collectionDateField.value = localDateTime;
    }
}

// Chart functions (simplified)
function drawChart(data) {
    const canvas = document.getElementById('qualityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Simple chart drawing logic
    console.log('Drawing chart with data:', data);
}

// Update advisory from latest sample
function updateAdvisoryFromLatestSample() {
    // This would be implemented based on the latest sample data
    console.log('Updating advisory from latest sample');
}

// Create sample item for display
function createSampleItem(sample) {
    const div = document.createElement('div');
    div.className = 'sample-item';
    div.innerHTML = `
        <div class="sample-header">
            <span class="sample-id">${sample.sampleId}</span>
            <span class="sample-date">${new Date(sample.collectionDate).toLocaleDateString()}</span>
        </div>
        <div class="sample-details">
            <p><strong>Location:</strong> ${sample.siteName}</p>
            <p><strong>Collector:</strong> ${sample.collectorName}</p>
            <p><strong>Type:</strong> ${sample.sampleType}</p>
        </div>
    `;
    return div;
}
