/**
 * Form Validation JavaScript file for Data Engineer Portfolio
 * Handles contact form validation and submission
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initFormValidation();
});

/**
 * Initialize form validation
 */
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    // Handle form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

/**
 * Validate individual field
 * @param {Event} event - Blur event
 */
function validateField(event) {
    const field = event.target;
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name can only contain letters and spaces';
            }
            break;

        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;

        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Subject is required';
            } else if (value.length < 5) {
                isValid = false;
                errorMessage = 'Subject must be at least 5 characters long';
            }
            break;

        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            } else if (value.length > 1000) {
                isValid = false;
                errorMessage = 'Message must be less than 1000 characters';
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError.call(field);
    }

    return isValid;
}

/**
 * Show error message for a field
 * @param {Element} field - The form field
 * @param {string} message - Error message
 */
function showFieldError(field, message) {
    clearFieldError.call(field);

    field.classList.add('error');

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');

    field.parentNode.appendChild(errorElement);

    // Add ARIA attributes for accessibility
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', `error-${field.name}`);
    errorElement.id = `error-${field.name}`;
}

/**
 * Clear error message for a field
 */
function clearFieldError() {
    this.classList.remove('error');

    const errorElement = this.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }

    // Remove ARIA attributes
    this.removeAttribute('aria-invalid');
    this.removeAttribute('aria-describedby');
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Handle form submission
 * @param {Event} event - Submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('form-message');

    // Clear previous messages
    clearFormMessage();

    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showFormMessage('Please correct the errors above', 'error');
        return;
    }

    // Show loading state
    setLoadingState(submitButton, true);

    // Simulate form submission (replace with actual submission logic)
    simulateFormSubmission(form)
        .then(() => {
            showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            form.reset();
        })
        .catch(() => {
            showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        })
        .finally(() => {
            setLoadingState(submitButton, false);
        });
}

/**
 * Simulate form submission (replace with actual AJAX call)
 * @param {Element} form - The form element
 * @returns {Promise} - Promise that resolves on success
 */
function simulateFormSubmission(form) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate random success/failure (90% success rate)
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject();
            }
        }, 2000);
    });
}

/**
 * Set loading state for submit button
 * @param {Element} button - The submit button
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.textContent = 'Sending...';
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        button.textContent = 'Send Message';
    }
}

/**
 * Show form message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            clearFormMessage();
        }, 5000);
    }

    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear form message
 */
function clearFormMessage() {
    const formMessage = document.getElementById('form-message');
    if (formMessage) {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        formMessage.style.display = 'none';
    }
}

/**
 * Add character counter for message field
 */
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;

    const maxLength = 1000;
    const counterElement = document.createElement('div');
    counterElement.className = 'character-counter';
    counterElement.textContent = `0 / ${maxLength}`;

    messageField.parentNode.appendChild(counterElement);

    messageField.addEventListener('input', function() {
        const length = this.value.length;
        counterElement.textContent = `${length} / ${maxLength}`;

        if (length > maxLength * 0.9) {
            counterElement.classList.add('warning');
        } else {
            counterElement.classList.remove('warning');
        }
    });
}

/**
 * Add form field enhancements
 */
function initFormEnhancements() {
    // Auto-resize textarea
    const textarea = document.getElementById('message');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }

    // Add input masks if needed (e.g., phone number)
    // const phoneField = document.getElementById('phone');
    // if (phoneField) {
    //     phoneField.addEventListener('input', formatPhoneNumber);
    // }
}

/**
 * Format phone number input
 * @param {Event} event - Input event
 */
function formatPhoneNumber(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length >= 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})/, '($1) ');
    }

    input.value = value;
}

/**
 * Initialize form accessibility features
 */
function initFormAccessibility() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Add form labels programmatically if missing
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
            const label = form.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                if (!label.id) {
                    label.id = `label-${input.id}`;
                }
            }
        }
    });

    // Add skip link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#contact-form';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to contact form';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Handle form data persistence (optional)
 */
function initFormPersistence() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Save form data to localStorage
    form.addEventListener('input', debounce(saveFormData, 500));

    // Restore form data on page load
    restoreFormData();

    function saveFormData() {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }

    function restoreFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
        }
    }
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize additional form features
initCharacterCounter();
initFormEnhancements();
initFormAccessibility();
initFormPersistence();