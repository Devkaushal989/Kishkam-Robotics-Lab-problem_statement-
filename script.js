const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const successMessage = document.getElementById('successMessage');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

document.addEventListener('DOMContentLoaded', () => {
    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    messageInput.addEventListener('blur', () => validateMessage());

    nameInput.addEventListener('input', clearError.bind(null, nameError, nameInput));
    emailInput.addEventListener('input', clearError.bind(null, emailError, emailInput));
    messageInput.addEventListener('input', clearError.bind(null, messageError, messageInput));

    contactForm.addEventListener('submit', handleFormSubmit);
});

function validateName() {
    const name = nameInput.value.trim();
    if (!name) {
        showError(nameError, nameInput, 'Name is required');
        return false;
    }
    if (name.length < 2) {
        showError(nameError, nameInput, 'Name must be at least 2 characters');
        return false;
    }
    clearError(nameError, nameInput);
    return true;
}

function validateEmail() {
    const email = emailInput.value.trim();
    if (!email) {
        showError(emailError, emailInput, 'Email is required');
        return false;
    }
    if (!emailRegex.test(email)) {
        showError(emailError, emailInput, 'Please enter a valid email address');
        return false;
    }
    clearError(emailError, emailInput);
    return true;
}

function validateMessage() {
    const message = messageInput.value.trim();
    if (!message) {
        showError(messageError, messageInput, 'Message is required');
        return false;
    }
    if (message.length < 10) {
        showError(messageError, messageInput, 'Message must be at least 10 characters');
        return false;
    }
    clearError(messageError, messageInput);
    return true;
}

function showError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    inputElement.classList.add('error');
}

function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
}

function handleFormSubmit(e) {
    e.preventDefault();
    successMessage.classList.remove('show');

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim(),
            timestamp: new Date().toISOString()
        };

        saveToLocalStorage(formData);

        showSuccessMessage();

        contactForm.reset();

        clearError(nameError, nameInput);
        clearError(emailError, emailInput);
        clearError(messageError, messageInput);

        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        if (!isNameValid) {
            nameInput.focus();
        } else if (!isEmailValid) {
            emailInput.focus();
        } else if (!isMessageValid) {
            messageInput.focus();
        }
    }
}

function saveToLocalStorage(formData) {
    try {
        let submissions = JSON.parse(localStorage.getItem('kishkamContactSubmissions') || '[]');

        submissions.push(formData);

        if (submissions.length > 50) {
            submissions = submissions.slice(-50);
        }

        localStorage.setItem('kishkamContactSubmissions', JSON.stringify(submissions));

        console.log('Form data saved to localStorage:', formData);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

function showSuccessMessage() {
    successMessage.textContent = 'Thank you! Your message has been sent successfully. We will get back to you soon.';
    successMessage.classList.add('show');

    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 5000);
}

function applyForRole(roleName) {
    localStorage.setItem('selectedRole', roleName);

    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
        messageInput.value = `I am interested in applying for the ${roleName} position. `;
        messageInput.focus();
    }, 500);

    showTemporaryNotification(`Pre-filled form for ${roleName}`);
}

function showTemporaryNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: var(--primary-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);