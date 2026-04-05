
console.log("JS WORKING");

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

// BIS 10500 & WHO Standards Reference
const WATER_STANDARDS = {
    // Physical Parameters
    temperature: { min: 0, max: 50, unit: '°C', bis: 'N/A', who: 'N/A' },
    ph: { min: 6.5, max: 8.5, unit: 'pH', bis: '6.5-8.5', who: '6.5-8.5' },
    turbidity: { min: 0, max: 5, unit: 'NTU', bis: '≤5', who: '≤5' },
    color: { min: 0, max: 5, unit: 'HU', bis: '≤5', who: '≤15' },
    conductivity: { min: 0, max: 3000, unit: 'μS/cm', bis: 'N/A', who: 'N/A' },

    // Chemical Parameters
    hardness: { min: 200, max: 600, unit: 'mg/L', bis: '200-600', who: '≤500' },
    alkalinity: { min: 200, max: 600, unit: 'mg/L', bis: '200-600', who: 'N/A' },
    chloride: { min: 0, max: 250, unit: 'mg/L', bis: '≤250', who: '≤250' },
    sulfate: { min: 0, max: 200, unit: 'mg/L', bis: '≤200', who: '≤250' },
    nitrate: { min: 0, max: 45, unit: 'mg/L', bis: '≤45', who: '≤50' },
    fluoride: { min: 1.0, max: 1.5, unit: 'mg/L', bis: '1.0-1.5', who: '≤1.5' },

    // Heavy Metals
    lead: { min: 0, max: 0.01, unit: 'mg/L', bis: '≤0.01', who: '≤0.01' },
    arsenic: { min: 0, max: 0.01, unit: 'mg/L', bis: '≤0.01', who: '≤0.01' },
    mercury: { min: 0, max: 0.001, unit: 'mg/L', bis: '≤0.001', who: '≤0.002' },
    cadmium: { min: 0, max: 0.003, unit: 'mg/L', bis: '≤0.003', who: '≤0.003' },

    // Microbiological Parameters
    totalColiform: { min: 0, max: 10, unit: 'MPN/100ml', bis: '≤10', who: 'N/A' },
    fecalColiform: { min: 0, max: 0, unit: 'MPN/100ml', bis: '0', who: 'N/A' },
    eColi: { min: 0, max: 0, unit: 'MPN/100ml', bis: '0', who: 'N/A' }
};

// Water Safety Advisory Classification Engine
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

    // Classify Temperature
    const tempValue = parseFloat(sampleData.temperature);
    const tempAdvisory = getParameterAdvisory('temperature', tempValue);
    if (tempAdvisory) {
        advisories.push({
            parameter: 'Temperature',
            value: tempValue,
            unit: '°C',
            status: tempAdvisory.level,
            message: tempAdvisory.rule.message,
            color: tempAdvisory.rule.color,
            icon: tempAdvisory.rule.icon,
            recommendation: getRecommendation('temperature', tempAdvisory.level)
        });
        overallStatus = getWorstStatus(overallStatus, tempAdvisory.level);
        highestRisk = getWorstRisk(highestRisk, tempAdvisory.level);
    }

    // Classify Turbidity
    const turbidityValue = parseFloat(sampleData.turbidity);
    const turbidityAdvisory = getParameterAdvisory('turbidity', turbidityValue);
    if (turbidityAdvisory) {
        advisories.push({
            parameter: 'Turbidity',
            value: turbidityValue,
            unit: 'NTU',
            status: turbidityAdvisory.level,
            message: turbidityAdvisory.rule.message,
            color: turbidityAdvisory.rule.color,
            icon: turbidityAdvisory.rule.icon,
            recommendation: getRecommendation('turbidity', turbidityAdvisory.level)
        });
        overallStatus = getWorstStatus(overallStatus, turbidityAdvisory.level);
        highestRisk = getWorstRisk(highestRisk, turbidityAdvisory.level);
    }

    // Classify TDS
    const tdsValue = parseFloat(sampleData.tds);
    const tdsAdvisory = getParameterAdvisory('tds', tdsValue);
    if (tdsAdvisory) {
        advisories.push({
            parameter: 'Total Dissolved Solids',
            value: tdsValue,
            unit: 'mg/L',
            status: tdsAdvisory.level,
            message: tdsAdvisory.rule.message,
            color: tdsAdvisory.rule.color,
            icon: tdsAdvisory.rule.icon,
            recommendation: getRecommendation('tds', tdsAdvisory.level)
        });
        overallStatus = getWorstStatus(overallStatus, tdsAdvisory.level);
        highestRisk = getWorstRisk(highestRisk, tdsAdvisory.level);
    }

    // Classify Conductivity
    const conductivityValue = parseFloat(sampleData.conductivity);
    const conductivityAdvisory = getParameterAdvisory('conductivity', conductivityValue);
    if (conductivityAdvisory) {
        advisories.push({
            parameter: 'Conductivity',
            value: conductivityValue,
            unit: 'μS/cm',
            status: conductivityAdvisory.level,
            message: conductivityAdvisory.rule.message,
            color: conductivityAdvisory.rule.color,
            icon: conductivityAdvisory.rule.icon,
            recommendation: getRecommendation('conductivity', conductivityAdvisory.level)
        });
        overallStatus = getWorstStatus(overallStatus, conductivityAdvisory.level);
        highestRisk = getWorstRisk(highestRisk, conductivityAdvisory.level);
    }

    return {
        overallStatus,
        highestRisk,
        advisories,
        timestamp: new Date().toISOString(),
        location: sampleData.siteName || 'Unknown Location'
    };
}

// Get parameter advisory based on value
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

// Get worst status level
function getWorstStatus(current, newLevel) {
    const severityOrder = ['danger', 'critical', 'warning', 'alert', 'caution', 'good', 'excellent'];
    const currentIndex = severityOrder.indexOf(current);
    const newIndex = severityOrder.indexOf(newLevel);
    return newIndex > currentIndex ? newLevel : current;
}

// Get worst risk level
function getWorstRisk(current, newLevel) {
    const riskOrder = ['danger', 'critical', 'warning', 'alert', 'caution', 'good', 'excellent'];
    const currentIndex = riskOrder.indexOf(current);
    const newIndex = riskOrder.indexOf(newLevel);
    return newIndex > currentIndex ? newLevel : current;
}

// Alert System Configuration
const ALERT_CONFIG = {
    enabled: true,
    thresholdLevels: ['danger', 'critical', 'warning'],
    notificationDuration: 5000, // 5 seconds
    soundEnabled: true,
    emailEnabled: false, // Can be extended to send email alerts
    smsEnabled: false,  // Can be extended to send SMS alerts
};

// Alert History
let alertHistory = JSON.parse(localStorage.getItem('alertHistory') || '[]');

// Check and send alerts for water quality
function checkAndSendAlerts(advisory) {
    if (!ALERT_CONFIG.enabled) return;

    const alertsSent = [];

    advisory.advisories.forEach(item => {
        if (ALERT_CONFIG.thresholdLevels.includes(item.status)) {
            const alert = {
                id: Date.now() + Math.random(),
                parameter: item.parameter,
                value: item.value,
                unit: item.unit || '',
                status: item.status,
                message: item.message,
                recommendation: item.recommendation,
                location: advisory.location,
                timestamp: new Date().toISOString(),
                acknowledged: false
            };

            // Store alert
            alertHistory.push(alert);
            alertsSent.push(alert);

            // Send notification
            sendWaterQualityAlert(alert);
        }
    });

    // Save alert history
    localStorage.setItem('alertHistory', JSON.stringify(alertHistory));

    // Update alert count in dashboard
    updateAlertCount();

    return alertsSent;
}

// Send water quality alert
function sendWaterQualityAlert(alert) {
    // Browser notification
    if (Notification.permission === 'granted') {
        const notification = new Notification(`[Alert] Water Quality: ${alert.status.toUpperCase()}`, {
            body: `${alert.parameter}: ${alert.value}${alert.unit} - ${alert.message}`,
            icon: '/favicon.ico',
            tag: `water-quality-${alert.id}`,
            requireInteraction: true
        });

        notification.onclick = function () {
            window.focus();
            notification.close();
            showAlertDetails(alert);
        };

        // Auto-close after duration
        setTimeout(() => {
            notification.close();
        }, ALERT_CONFIG.notificationDuration);
    }

    // In-app alert notification
    showInAppAlert(alert);

    // Console log for debugging
    console.warn('🚨 Water Quality Alert:', alert);
}

// Show in-app alert notification
function showInAppAlert(alert) {
    const alertContainer = document.getElementById('alertContainer') || createAlertContainer();

    const alertElement = document.createElement('div');
    alertElement.className = `alert-notification alert-${alert.status}`;
    alertElement.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-${getAdvisoryIcon(alert.status)}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-title">Water Quality Alert</div>
            <div class="alert-message">${alert.parameter}: ${alert.value}${alert.unit}</div>
            <div class="alert-description">${alert.message}</div>
        </div>
        <div class="alert-actions">
            <button class="alert-acknowledge" onclick="acknowledgeAlert('${alert.id}')">
                <i class="fas fa-check"></i> Acknowledge
            </button>
            <button class="alert-details" onclick="showAlertDetails('${alert.id}')">
                <i class="fas fa-info-circle"></i> Details
            </button>
        </div>
    `;

    alertContainer.appendChild(alertElement);

    // Auto-remove after duration
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, ALERT_CONFIG.notificationDuration);
}
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alertContainer';
    container.className = 'alert-container';
    document.body.appendChild(container);
    return container;
}

// Acknowledge alert
function acknowledgeAlert(alertId) {
    const alert = alertHistory.find(a => a.id == alertId);
    if (alert) {
        alert.acknowledged = true;
        localStorage.setItem('alertHistory', JSON.stringify(alertHistory));
    }

    // Remove alert from display
    const alertElement = document.querySelector(`[onclick*="${alertId}"]`)?.closest('.alert-notification');
    if (alertElement) {
        alertElement.remove();
    }

    updateAlertCount();
}

// Show alert details
function showAlertDetails(alertId) {
    const alert = alertHistory.find(a => a.id == alertId);
    if (!alert) return;

    const modal = document.createElement('div');
    modal.className = 'alert-modal';
    modal.innerHTML = `
        <div class="alert-modal-content">
            <div class="alert-modal-header">
                <h3>🚨 Water Quality Alert Details</h3>
                <button class="alert-modal-close" onclick="this.closest('.alert-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="alert-modal-body">
                <div class="alert-detail-item">
                    <label>Parameter:</label>
                    <span>${alert.parameter}</span>
                </div>
                <div class="alert-detail-item">
                    <label>Value:</label>
                    <span>${alert.value}${alert.unit}</span>
                </div>
                <div class="alert-detail-item">
                    <label>Status:</label>
                    <span class="alert-status-badge alert-${alert.status}">${alert.status.toUpperCase()}</span>
                </div>
                <div class="alert-detail-item">
                    <label>Location:</label>
                    <span>${alert.location}</span>
                </div>
                <div class="alert-detail-item">
                    <label>Time:</label>
                    <span>${new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                <div class="alert-detail-item">
                    <label>Message:</label>
                    <span>${alert.message}</span>
                </div>
                <div class="alert-detail-item">
                    <label>Recommendation:</label>
                    <span>${alert.recommendation}</span>
                </div>
            </div>
            <div class="alert-modal-footer">
                <button class="btn btn-primary" onclick="acknowledgeAlert('${alert.id}'); this.closest('.alert-modal').remove();">
                    <i class="fas fa-check"></i> Acknowledge Alert
                </button>
                <button class="btn btn-secondary" onclick="this.closest('.alert-modal').remove();">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Update alert count in dashboard
function updateAlertCount() {
    const unacknowledgedAlerts = alertHistory.filter(a => !a.acknowledged);
    const alertsElement = document.querySelector('.stat-card:nth-child(4) h3');

    if (alertsElement) {
        alertsElement.textContent = unacknowledgedAlerts.length;

        // Pulse animation for new alerts
        if (unacknowledgedAlerts.length > 0) {
            alertsElement.closest('.stat-card').classList.add('updated');
            setTimeout(() => alertsElement.closest('.stat-card').classList.remove('updated'), 500);
        }
    }
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
        });
    }
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
        },
        temperature: {
            danger: "Water heating/cooling system malfunction - Do not use",
            critical: "Extreme temperature - Potential health hazard",
            warning: "Temperature control needed - Check water source",
            alert: "Monitor temperature variations",
            caution: "Temperature monitoring advised",
            good: "Temperature is acceptable",
            excellent: "Optimal drinking temperature"
        },
        turbidity: {
            danger: "Emergency filtration required - Water unsafe",
            critical: "Advanced filtration system needed immediately",
            warning: "Install water filtration system",
            alert: "Filter water before consumption",
            caution: "Consider water filtration",
            good: "Water clarity is acceptable",
            excellent: "Excellent water clarity"
        },
        tds: {
            danger: "Reverse osmosis treatment required urgently",
            critical: "Advanced water purification needed",
            warning: "Water purification recommended",
            alert: "Consider water treatment options",
            caution: "Monitor TDS levels regularly",
            good: "TDS levels are acceptable",
            excellent: "Excellent water purity"
        },
        conductivity: {
            danger: "Water source contamination suspected - Investigate immediately",
            critical: "Contamination likely - Water testing required",
            warning: "Possible contamination - Test water source",
            alert: "Monitor water conductivity",
            caution: "Regular water testing advised",
            good: "Conductivity levels normal",
            excellent: "Excellent water quality"
        }
    };

    return recommendations[parameter]?.[level] || "Consult water quality specialist";
}
document.addEventListener('DOMContentLoaded', function () {
    // Request notification permission for alerts
    requestNotificationPermission();

    // Initialize navigation
    initializeNavigation();

    // Initialize form validations
    initializeFormValidations();

    // Initialize dashboard
    initializeDashboard();

    // Update alert count on load
    updateAlertCount();

    // Set current datetime for collection date
    setDefaultDateTime();
});

// Real-time pH input validation with alerts
function validatePhInput(input) {
    const phValue = parseFloat(input.value);

    if (isNaN(phValue)) return;

    // Clear previous alerts for this input
    clearPhInputAlerts();

    // Check for dangerous pH levels
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

        // Send browser notification
        if (Notification.permission === 'granted') {
            new Notification(`🚨 pH Level Alert`, {
                body: alert.message,
                icon: '/favicon.ico',
                tag: `ph-alert-${Date.now()}`
            });
        }
    }
}

// Show pH input alert
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

    // Position alert near the input
    const inputRect = input.getBoundingClientRect();
    alertElement.style.position = 'fixed';
    alertElement.style.top = (inputRect.bottom + 5) + 'px';
    alertElement.style.left = inputRect.left + 'px';
    alertElement.style.zIndex = '1000';

    document.body.appendChild(alertElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertElement.parentNode) {
            alertElement.remove();
        }
    }, 5000);
}

// Clear pH input alerts
function clearPhInputAlerts() {
    const existingAlerts = document.querySelectorAll('.ph-input-alert');
    existingAlerts.forEach(alert => alert.remove());
}
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Form validation functions
function initializeFormValidations() {
    // Sample form validation
    const sampleForm = document.getElementById('sampleForm');
    if (sampleForm) {
        sampleForm.addEventListener('submit', validateSampleForm);

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

    // Location form validation
    const locationForm = document.getElementById('locationForm');
    if (locationForm) {
        locationForm.addEventListener('submit', validateLocationForm);

        const locationInputs = locationForm.querySelectorAll('input[type="number"], input[type="text"], select');
        locationInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearError(input));
        });
    }

    // Parameters form validation
    const parametersForm = document.getElementById('parametersForm');
    if (parametersForm) {
        parametersForm.addEventListener('submit', validateParametersForm);

        const parameterInputs = parametersForm.querySelectorAll('input[type="number"], select');
        parameterInputs.forEach(input => {
            input.addEventListener('blur', () => validateParameterField(input));
            input.addEventListener('input', () => clearError(input));
        });
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const errorMsg = field.parentElement.querySelector('.error-message');

    // Reset error state
    field.classList.remove('error');
    if (errorMsg) errorMsg.textContent = '';

    // Check if required and empty
    if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required');
        return false;
    }

    // Number field validation
    if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        const min = parseFloat(field.getAttribute('min'));
        const max = parseFloat(field.getAttribute('max'));

        if (isNaN(numValue)) {
            showError(field, 'Please enter a valid number');
            return false;
        }

        if (min !== undefined && numValue < min) {
            showError(field, `Value must be at least ${min}`);
            return false;
        }

        if (max !== undefined && numValue > max) {
            showError(field, `Value must be no more than ${max}`);
            return false;
        }
    }

    // Text field validation
    if (field.type === 'text' && value) {
        if (value.length < 2) {
            showError(field, 'Please enter at least 2 characters');
            return false;
        }
    }

    return true;
}

// Parameter field validation with BIS/WHO standards
function validateParameterField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorMsg = field.parentElement.querySelector('.error-message');

    // Reset error state
    field.classList.remove('error');
    if (errorMsg) errorMsg.textContent = '';

    if (!value) return true; // Optional fields

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        showError(field, 'Please enter a valid number');
        return false;
    }

    // Check against water quality standards
    const standard = WATER_STANDARDS[fieldName];
    if (standard) {
        if (numValue < standard.min || numValue > standard.max) {
            const standardRange = standard.bis || `${standard.min}-${standard.max} ${standard.unit}`;
            showError(field, `Value must be within BIS standard: ${standardRange}`);
            return false;
        }
    }

    return true;
}

// Show error message
function showError(field, message) {
    field.classList.add('error');
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.textContent = message;
    }
}

// Clear error message
function clearError(field) {
    field.classList.remove('error');
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.textContent = '';
    }
}

// Sample form validation
function validateSampleForm(e) {


    const form = e.target;
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (isValid) {
        // Additional validation for pH
        const phValue = parseFloat(form.ph.value);
        if (phValue < 6.5 || phValue > 8.5) {
            showError(form.ph, 'pH must be between 6.5 and 8.5 (BIS standard)');
            isValid = false;
        }

        // Additional validation for turbidity
        const turbidityValue = parseFloat(form.turbidity.value);
        if (turbidityValue > 5) {
            showError(form.turbidity, 'Turbidity should not exceed 5 NTU (BIS standard)');
            isValid = false;
        }
    }

    if (isValid) {
        showMessage('Sample data saved successfully!', 'success');
        HTMLFormElement.prototype.submit.call(form);
    }
}

// Location form validation
function validateLocationForm(e) {
    const form = e.target;
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Validate coordinates
    if (isValid) {
        const lat = parseFloat(form.latitude.value);
        const lng = parseFloat(form.longitude.value);

        if (lat < -90 || lat > 90) {
            showError(form.latitude, 'Latitude must be between -90 and 90');
            isValid = false;
        }

        if (lng < -180 || lng > 180) {
            showError(form.longitude, 'Longitude must be between -180 and 180');
            isValid = false;
        }
    }

    if (isValid) {
        saveLocationData(form);
        showMessage('Location data saved successfully!', 'success');
        form.reset();
    }
}

// Parameters form validation
function validateParametersForm(e) {

    const form = e.target;
    const inputs = form.querySelectorAll('input[type="number"], select');
    let isValid = true;
    let hasAnyValue = false;

    inputs.forEach(input => {
        if (input.value.trim()) {
            hasAnyValue = true;
            if (!validateParameterField(input)) {
                isValid = false;
            }
        }
    });

    if (!hasAnyValue) {
        showMessage('Please enter at least one parameter value', 'error');
        return;
    }

    if (isValid) {
        saveParametersData(form);
        showMessage('Parameters data saved successfully!', 'success');
        form.reset();
    }
}

// Save data functions (mock implementation)
function saveSampleData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add timestamp
    data.timestamp = new Date().toISOString();

    // Store in localStorage (mock implementation)
    let samples = JSON.parse(localStorage.getItem('waterSamples') || '[]');
    samples.push(data);
    localStorage.setItem('waterSamples', JSON.stringify(samples));

    console.log('Sample data saved:', data);

    // Update chart with new data
    updateChart(data);

    // Update recent samples display
    updateRecentSamples();

    // Update water safety advisory
    updateAdvisory();

    updateDashboardStats();
}

function saveLocationData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.timestamp = new Date().toISOString();

    let locations = JSON.parse(localStorage.getItem('waterLocations') || '[]');
    locations.push(data);
    localStorage.setItem('waterLocations', JSON.stringify(locations));

    console.log('Location data saved:', data);
}

function saveParametersData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.timestamp = new Date().toISOString();

    let parameters = JSON.parse(localStorage.getItem('waterParameters') || '[]');
    parameters.push(data);
    localStorage.setItem('waterParameters', JSON.stringify(parameters));

    console.log('Parameters data saved:', data);

    // Update chart with new data
    updateChart(data);

    updateDashboardStats();
}

// Show message function
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-container');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-container';
    messageDiv.textContent = message;

    // Insert at the top of the active section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        activeSection.insertBefore(messageDiv, activeSection.firstChild);
    }

    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Set default datetime
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

// Initialize dashboard
function initializeDashboard() {
    updateDashboardStats();
    updateRecentSamples();
    updateAdvisory();
    initializeChart();
}

// Update water safety advisory
function updateAdvisory() {
    const samples = JSON.parse(localStorage.getItem('waterSamples') || '[]');
    const advisoryContent = document.getElementById('advisoryContent');

    if (!advisoryContent) return;

    // Get most recent sample for advisory
    if (samples.length === 0) {
        advisoryContent.innerHTML = `
            <div class="advisory-loading">
                <i class="fas fa-info-circle"></i>
                <p>No water quality data available. Submit samples to generate safety advisories.</p>
            </div>
        `;
        return;
    }

    const latestSample = samples[samples.length - 1];
    const advisory = classifyWaterSafety(latestSample);

    // Generate advisory HTML
    const advisoryHTML = generateAdvisoryHTML(advisory);
    advisoryContent.innerHTML = advisoryHTML;

    // Check and send alerts for poor water quality
    checkAndSendAlerts(advisory);
}

// Generate advisory HTML
function generateAdvisoryHTML(advisory) {
    const statusClass = `status-${advisory.highestRisk}`;
    const statusText = advisory.highestRisk.toUpperCase();

    let html = `
        <div class="advisory-overview">
            <div class="advisory-status ${statusClass}">
                <i class="fas fa-${getAdvisoryIcon(advisory.highestRisk)}"></i>
                <span>Overall Status: ${statusText}</span>
            </div>
            <div class="advisory-summary">
                <p><strong>Location:</strong> ${advisory.location}</p>
                <p><strong>Assessment Time:</strong> ${new Date(advisory.timestamp).toLocaleString()}</p>
            </div>
        </div>
    `;

    // Add parameter advisories
    advisory.advisories.forEach((item, index) => {
        html += `
            <div class="advisory-item" style="border-left: 4px solid ${item.color};">
                <div class="advisory-icon" style="background: ${item.color};">
                    <i class="fas fa-${item.icon}"></i>
                </div>
                <div class="advisory-details">
                    <div class="advisory-parameter">${item.parameter}</div>
                    <div class="advisory-value">${item.value}${item.unit || ''}</div>
                    <div class="advisory-message">${item.message}</div>
                    <div class="advisory-recommendation">
                        <strong>Recommendation:</strong> ${item.recommendation}
                    </div>
                </div>
            </div>
        `;
    });

    return html;
}

// Get advisory icon based on risk level
function getAdvisoryIcon(riskLevel) {
    const iconMap = {
        'excellent': 'award',
        'good': 'check-circle',
        'caution': 'exclamation-triangle',
        'alert': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'critical': 'times-circle',
        'danger': 'times-circle'
    };
    return iconMap[riskLevel] || 'info-circle';
}

// Update dashboard statistics
function updateDashboardStats() {
    const samples = JSON.parse(localStorage.getItem('waterSamples') || '[]');
    const locations = JSON.parse(localStorage.getItem('waterLocations') || '[]');
    const parameters = JSON.parse(localStorage.getItem('waterParameters') || '[]');

    // Update stats if elements exist
    const totalSamplesElement = document.querySelector('.stat-card:nth-child(1) h3');
    const wqiElement = document.querySelector('.stat-card:nth-child(2) h3');
    const complianceElement = document.querySelector('.stat-card:nth-child(3) h3');
    const alertsElement = document.querySelector('.stat-card:nth-child(4) h3');

    if (totalSamplesElement) {
        const oldValue = totalSamplesElement.textContent;
        const newValue = samples.length;
        totalSamplesElement.textContent = newValue;
        if (oldValue !== newValue.toString()) {
            totalSamplesElement.closest('.stat-card').classList.add('updated');
            setTimeout(() => totalSamplesElement.closest('.stat-card').classList.remove('updated'), 500);
        }
    }

    // Calculate Water Quality Index
    const wqi = calculateWaterQualityIndex(samples);
    if (wqiElement) {
        const oldValue = wqiElement.textContent;
        const newValue = wqi;
        wqiElement.textContent = newValue;

        // Update icon color based on WQI value
        const wqiIcon = wqiElement.closest('.stat-card').querySelector('.stat-icon');
        wqiIcon.classList.remove('blue', 'green', 'yellow', 'red');

        if (wqi >= 80) {
            wqiIcon.classList.add('green');
        } else if (wqi >= 60) {
            wqiIcon.classList.add('yellow');
        } else if (wqi >= 40) {
            wqiIcon.classList.add('blue');
        } else {
            wqiIcon.classList.add('red');
        }

        if (oldValue !== newValue.toString()) {
            wqiElement.closest('.stat-card').classList.add('updated');
            setTimeout(() => wqiElement.closest('.stat-card').classList.remove('updated'), 500);
        }
    }

    // Calculate compliance rate
    const complianceRate = calculateComplianceRate(samples);
    if (complianceElement) {
        const oldValue = complianceElement.textContent.replace('%', '');
        const newValue = complianceRate + '%';
        complianceElement.textContent = newValue;
        if (oldValue !== complianceRate.toString()) {
            complianceElement.closest('.stat-card').classList.add('updated');
            setTimeout(() => complianceElement.closest('.stat-card').classList.remove('updated'), 500);
        }
    }

    // Calculate active alerts
    const alertCount = calculateActiveAlerts(samples);
    if (alertsElement) {
        const oldValue = alertsElement.textContent;
        const newValue = alertCount;
        alertsElement.textContent = newValue;
        if (oldValue !== newValue.toString()) {
            alertsElement.closest('.stat-card').classList.add('updated');
            setTimeout(() => alertsElement.closest('.stat-card').classList.remove('updated'), 500);
        }
    }
}

// Calculate Water Quality Index (0-100 scale)
function calculateWaterQualityIndex(samples) {
    if (samples.length === 0) return 0;

    let totalScore = 0;
    let validSamples = 0;

    samples.forEach(sample => {
        const ph = parseFloat(sample.ph);
        const turbidity = parseFloat(sample.turbidity);
        const tds = parseFloat(sample.tds);
        const conductivity = parseFloat(sample.conductivity);
        const temperature = parseFloat(sample.temperature);

        let sampleScore = 0;
        let parametersCount = 0;

        // pH score (weight: 25%)
        if (ph >= 6.5 && ph <= 8.5) {
            sampleScore += 25;
        } else if (ph >= 6.0 && ph <= 9.0) {
            sampleScore += 15;
        }
        parametersCount++;

        // Turbidity score (weight: 20%)
        if (turbidity <= 1) {
            sampleScore += 20;
        } else if (turbidity <= 5) {
            sampleScore += 15;
        } else if (turbidity <= 10) {
            sampleScore += 10;
        }
        parametersCount++;

        // TDS score (weight: 20%)
        if (tds <= 300) {
            sampleScore += 20;
        } else if (tds <= 1000) {
            sampleScore += 15;
        } else if (tds <= 1500) {
            sampleScore += 10;
        }
        parametersCount++;

        // Conductivity score (weight: 15%)
        if (conductivity <= 500) {
            sampleScore += 15;
        } else if (conductivity <= 2000) {
            sampleScore += 10;
        } else if (conductivity <= 3000) {
            sampleScore += 5;
        }
        parametersCount++;

        // Temperature score (weight: 20%)
        if (temperature >= 15 && temperature <= 25) {
            sampleScore += 20;
        } else if (temperature >= 10 && temperature <= 30) {
            sampleScore += 15;
        } else if (temperature >= 5 && temperature <= 35) {
            sampleScore += 10;
        }
        parametersCount++;

        if (parametersCount >= 3) { // Require at least 3 parameters
            totalScore += sampleScore;
            validSamples++;
        }
    });

    if (validSamples === 0) return 0;

    // Calculate average score
    const averageScore = Math.round(totalScore / validSamples);

    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, averageScore));
}

// Calculate active alerts based on water quality parameters
function calculateActiveAlerts(samples) {
    let alertCount = 0;

    samples.forEach(sample => {
        const ph = parseFloat(sample.ph);
        const turbidity = parseFloat(sample.turbidity);
        const tds = parseFloat(sample.tds);
        const temperature = parseFloat(sample.temperature);

        // Check for critical conditions that trigger alerts
        if (ph < 6.5 || ph > 8.5 ||
            turbidity > 5 ||
            tds > 1000 ||
            temperature > 35) {
            alertCount++;
        }
    });

    return alertCount;
}

// Calculate compliance rate
function calculateComplianceRate(samples) {
    if (samples.length === 0) return 0;

    let compliantCount = 0;
    let totalCount = 0;

    samples.forEach(sample => {
        const ph = parseFloat(sample.ph);
        const turbidity = parseFloat(sample.turbidity);
        const tds = parseFloat(sample.tds);
        const conductivity = parseFloat(sample.conductivity);

        // Check BIS/WHO compliance for each parameter
        const checks = [
            ph >= 6.5 && ph <= 8.5, // pH compliance
            turbidity <= 5, // Turbidity compliance
            tds <= 1000, // TDS compliance
            conductivity <= 3000 // Conductivity compliance
        ];

        checks.forEach(compliant => {
            if (compliant !== undefined) {
                if (compliant) compliantCount++;
                totalCount++;
            }
        });
    });

    return totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 0;
}

// Update recent samples display
function updateRecentSamples() {
    const samples = JSON.parse(localStorage.getItem('waterSamples') || '[]');
    const sampleList = document.querySelector('.sample-list');

    if (!sampleList) return;

    // Clear existing samples
    sampleList.innerHTML = '';

    // If no samples, show message
    if (samples.length === 0) {
        sampleList.innerHTML = '<div class="no-samples">No samples recorded yet. Submit your first water quality sample!</div>';
        return;
    }

    // Sort samples by date (most recent first)
    const sortedSamples = samples.sort((a, b) => {
        const dateA = new Date(a.timestamp || a.collectionDate);
        const dateB = new Date(b.timestamp || b.collectionDate);
        return dateB - dateA;
    });

    // Display last 5 samples
    const recentSamples = sortedSamples.slice(0, 5);

    recentSamples.forEach(sample => {
        const sampleItem = createSampleItem(sample);
        sampleList.appendChild(sampleItem);
    });
}

// Create sample item element
function createSampleItem(sample) {
    const sampleItem = document.createElement('div');
    sampleItem.className = 'sample-item';

    // Get location name
    const locationName = sample.siteName || 'Unknown Location';

    // Format date
    const sampleDate = new Date(sample.timestamp || sample.collectionDate);
    const formattedDate = sampleDate.toLocaleDateString() + ' ' + sampleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Determine status based on water quality parameters
    const status = getSampleStatus(sample);

    sampleItem.innerHTML = `
        <div class="sample-info">
            <h4>${locationName}</h4>
            <p>${formattedDate}</p>
        </div>
        <div class="sample-status ${status.class}">
            <i class="fas fa-${status.icon}"></i> ${status.text}
        </div>
    `;

    return sampleItem;
}

// Get sample status based on water quality
function getSampleStatus(sample) {
    const ph = parseFloat(sample.ph);
    const turbidity = parseFloat(sample.turbidity);
    const tds = parseFloat(sample.tds);

    // Check for critical issues
    if (ph < 6.5 || ph > 8.5 || turbidity > 10 || tds > 1500) {
        return { class: 'critical', icon: 'times', text: 'Critical' };
    }

    // Check for warnings
    if (ph < 6.8 || ph > 8.2 || turbidity > 5 || tds > 1000) {
        return { class: 'warning', icon: 'exclamation', text: 'Warning' };
    }

    // Good quality
    return { class: 'good', icon: 'check', text: 'Good' };
}

// Initialize chart (responsive implementation)
function initializeChart() {
    const chartCanvas = document.getElementById('qualityChart');
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext('2d');

    // Set canvas size for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = chartCanvas.getBoundingClientRect();

    chartCanvas.width = rect.width * dpr;
    chartCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Store chart data
    window.chartData = {
        ph: [],
        temperature: [],
        turbidity: [],
        tds: [],
        timestamps: []
    };

    // Load existing data from localStorage
    loadChartData();

    // Draw initial chart
    drawChart(ctx, rect.width, rect.height);

    // Make canvas responsive
    window.addEventListener('resize', () => {
        const newRect = chartCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        chartCanvas.width = newRect.width * dpr;
        chartCanvas.height = newRect.height * dpr;
        const ctx = chartCanvas.getContext('2d');
        ctx.scale(dpr, dpr);
        drawChart(ctx, newRect.width, newRect.height);
    });
}

// Load chart data from localStorage
function loadChartData() {
    const samples = JSON.parse(localStorage.getItem('waterSamples') || '[]');
    const parameters = JSON.parse(localStorage.getItem('waterParameters') || '[]');

    // Add sample data if no data exists
    if (samples.length === 0 && parameters.length === 0) {
        // Generate more sample data for better visualization
        for (let i = 0; i < 10; i++) {
            window.chartData.ph.push(6.5 + Math.random() * 2);
            window.chartData.temperature.push(15 + Math.random() * 20);
            window.chartData.turbidity.push(0.5 + Math.random() * 4.5);
            window.chartData.tds.push(200 + Math.random() * 600);
            window.chartData.timestamps.push(new Date(Date.now() - (9 - i) * 3600000));
        }
    }

    // Process sample data
    samples.forEach(sample => {
        if (sample.ph) {
            window.chartData.ph.push(parseFloat(sample.ph));
            window.chartData.temperature.push(parseFloat(sample.temperature || 0));
            window.chartData.turbidity.push(parseFloat(sample.turbidity || 0));
            window.chartData.tds.push(parseFloat(sample.tds || 0));
            window.chartData.timestamps.push(new Date(sample.timestamp || sample.collectionDate));
        }
    });

    // Process parameter data
    parameters.forEach(param => {
        if (param.ph) {
            window.chartData.ph.push(parseFloat(param.ph));
            window.chartData.temperature.push(parseFloat(param.temperature || 0));
            window.chartData.turbidity.push(parseFloat(param.turbidity || 0));
            window.chartData.tds.push(parseFloat(param.tds || 0));
            window.chartData.timestamps.push(new Date(param.timestamp));
        }
    });

    // Keep only last 20 data points for readability
    if (window.chartData.ph.length > 20) {
        window.chartData.ph = window.chartData.ph.slice(-20);
        window.chartData.temperature = window.chartData.temperature.slice(-20);
        window.chartData.turbidity = window.chartData.turbidity.slice(-20);
        window.chartData.tds = window.chartData.tds.slice(-20);
        window.chartData.timestamps = window.chartData.timestamps.slice(-20);
    }
}

// Draw responsive chart
function drawChart(ctx, width, height) {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set up chart dimensions
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw chart area background
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(padding, padding, chartWidth, chartHeight);

    // Draw grid with better styling
    ctx.strokeStyle = '#e1e4e8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Horizontal grid lines with labels
    for (let i = 0; i <= 6; i++) {
        const y = padding + (chartHeight / 6) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        // Y-axis labels
        ctx.fillStyle = '#586069';
        ctx.font = '11px Arial';
        ctx.textAlign = 'right';
        const value = Math.round(100 - (100 / 6) * i);
        ctx.fillText(value + '%', padding - 10, y + 4);
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
        const x = padding + (chartWidth / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }

    ctx.setLineDash([]);

    // Draw axes with better styling
    ctx.strokeStyle = '#24292e';
    ctx.lineWidth = 2;

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw data if available
    if (window.chartData.ph.length > 0) {
        // Draw data lines with improved styling
        drawDataLine(ctx, window.chartData.ph, '#0366d6', chartWidth, chartHeight, padding, 0, 14, 3);
        drawDataLine(ctx, window.chartData.temperature, '#d73a49', chartWidth, chartHeight, padding, 0, 50, 3);
        drawDataLine(ctx, window.chartData.turbidity, '#f66a0a', chartWidth, chartHeight, padding, 0, 10, 3);
        drawDataLine(ctx, window.chartData.tds, '#28a745', chartWidth, chartHeight, padding, 0, 1000, 3);

        // Draw data points with better visibility
        drawDataPoints(ctx, window.chartData.ph, '#0366d6', chartWidth, chartHeight, padding, 0, 14);
        drawDataPoints(ctx, window.chartData.temperature, '#d73a49', chartWidth, chartHeight, padding, 0, 50);
        drawDataPoints(ctx, window.chartData.turbidity, '#f66a0a', chartWidth, chartHeight, padding, 0, 10);
        drawDataPoints(ctx, window.chartData.tds, '#28a745', chartWidth, chartHeight, padding, 0, 1000);
    }

    // Draw enhanced legend
    drawEnhancedLegend(ctx, width, padding);

    // Draw title with better styling
    ctx.fillStyle = '#24292e';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Water Quality Parameters Trend Analysis', width / 2, 30);

    // Draw subtitle
    ctx.fillStyle = '#586069';
    ctx.font = '12px Arial';
    ctx.fillText('Real-time monitoring of key water quality indicators', width / 2, 48);

    // Draw axis labels
    ctx.fillStyle = '#586069';
    ctx.font = '11px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Time (Recent Samples)', width / 2, height - 20);

    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Normalized Values (%)', 0, 0);
    ctx.restore();
}

// Draw enhanced data line with gradient
function drawDataLine(ctx, data, color, chartWidth, chartHeight, padding, minValue, maxValue, lineWidth) {
    if (data.length === 0) return;

    // Create gradient for line
    const gradient = ctx.createLinearGradient(padding, padding, padding, padding + chartHeight);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + '40');

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw filled area under line
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const y = padding + chartHeight - (normalizedValue * chartHeight);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    // Complete the area
    if (data.length > 0) {
        const lastX = padding + (chartWidth / (data.length - 1 || 1)) * (data.length - 1);
        ctx.lineTo(lastX, padding + chartHeight);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.closePath();

        ctx.fillStyle = color + '20';
        ctx.fill();
    }

    // Draw the line
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const y = padding + chartHeight - (normalizedValue * chartHeight);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();
}

// Draw enhanced data points
function drawDataPoints(ctx, data, color, chartWidth, chartHeight, padding, minValue, maxValue) {
    if (data.length === 0) return;

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1 || 1)) * index;
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const y = padding + chartHeight - (normalizedValue * chartHeight);

        // Outer circle
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    });
}

// Draw enhanced legend
function drawEnhancedLegend(ctx, width, padding) {
    const legends = [
        { color: '#0366d6', label: 'pH Level', unit: '(6.5-8.5)' },
        { color: '#d73a49', label: 'Temperature', unit: '(°C)' },
        { color: '#f66a0a', label: 'Turbidity', unit: '(NTU)' },
        { color: '#28a745', label: 'TDS', unit: '(mg/L)' }
    ];

    // Legend background
    const legendWidth = 320;
    const legendHeight = 35;
    const legendX = width - legendWidth - 20;
    const legendY = 20;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    ctx.strokeStyle = '#e1e4e8';
    ctx.lineWidth = 1;
    ctx.strokeRect(legendX, legendY, legendWidth, legendHeight);

    ctx.font = '11px Arial';
    ctx.textAlign = 'left';

    legends.forEach((legend, index) => {
        const x = legendX + 15 + index * 75;
        const y = legendY + 22;

        // Draw color box with rounded corners
        ctx.fillStyle = legend.color;
        ctx.fillRect(x, y - 8, 12, 12);

        // Draw label
        ctx.fillStyle = '#24292e';
        ctx.font = '10px Arial';
        ctx.fillText(legend.label, x + 18, y);

        // Draw unit
        ctx.fillStyle = '#586069';
        ctx.font = '9px Arial';
        ctx.fillText(legend.unit, x + 18, y + 10);
    });
}

// Update chart with new data
function updateChart(newData) {
    if (!window.chartData) return;

    // Add new data point
    window.chartData.ph.push(parseFloat(newData.ph || 0));
    window.chartData.temperature.push(parseFloat(newData.temperature || 0));
    window.chartData.turbidity.push(parseFloat(newData.turbidity || 0));
    window.chartData.tds.push(parseFloat(newData.tds || 0));
    window.chartData.timestamps.push(new Date());

    // Keep only last 20 data points
    if (window.chartData.ph.length > 20) {
        window.chartData.ph.shift();
        window.chartData.temperature.shift();
        window.chartData.turbidity.shift();
        window.chartData.tds.shift();
        window.chartData.timestamps.shift();
    }

    // Redraw chart
    const chartCanvas = document.getElementById('qualityChart');
    if (chartCanvas) {
        const ctx = chartCanvas.getContext('2d');
        const rect = chartCanvas.getBoundingClientRect();
        drawChart(ctx, rect.width, rect.height);
    }
}

// Report generation
document.addEventListener('DOMContentLoaded', function () {
    const generateReportBtn = document.querySelector('.report-filters .btn-primary');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
});

function generateReport() {
    const period = document.getElementById('reportPeriod').value;
    const site = document.getElementById('reportSite').value;

    showMessage(`Generating ${period} report for ${site === 'all' ? 'all sites' : site}...`, 'success');

    // Mock report generation
    setTimeout(() => {
        showMessage('Report generated successfully!', 'success');
    }, 1500);
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Utility function to validate sample ID format
function validateSampleId(sampleId) {
    const pattern = /^[A-Z]{2}\d{6}$/; // Format: AB123456
    return pattern.test(sampleId);
}

// Add sample ID validation
document.addEventListener('DOMContentLoaded', function () {
    const sampleIdField = document.getElementById('sampleId');
    if (sampleIdField) {
        sampleIdField.addEventListener('blur', function () {
            const value = this.value.trim();
            if (value && !validateSampleId(value)) {
                showError(this, 'Sample ID must be in format: AB123456 (2 letters + 6 digits)');
            }
        });
    }
});

// Export data functionality
function exportData(format) {
    const samples = JSON.parse(localStorage.getItem('waterSamples') || '[]');
    const locations = JSON.parse(localStorage.getItem('waterLocations') || '[]');
    const parameters = JSON.parse(localStorage.getItem('waterParameters') || '[]');

    const data = {
        samples: samples,
        locations: locations,
        parameters: parameters,
        exportDate: new Date().toISOString()
    };

    if (format === 'json') {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `water-quality-data-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    showMessage(`Data exported as ${format.toUpperCase()} successfully!`, 'success');
}

// Add export buttons to dashboard
document.addEventListener('DOMContentLoaded', function () {
    const dashboardSection = document.getElementById('dashboard');
    if (dashboardSection) {
        const exportDiv = document.createElement('div');
        exportDiv.style.cssText = 'margin-top: 2rem; text-align: center;';
        exportDiv.innerHTML = `
            <h3>Export Data</h3>
            <button class="btn btn-primary" onclick="exportData('json')" style="margin: 0 0.5rem;">
                <i class="fas fa-download"></i> Export as JSON
            </button>
        `;
        dashboardSection.appendChild(exportDiv);
    }
});