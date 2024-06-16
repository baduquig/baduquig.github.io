const registrationErrorDiv = document.getElementById('registration-error');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const createButton = document.getElementById('create-btn');

function checkCredentialsInputted() {
    registrationErrorDiv.setAttribute('hidden', '');
    if ((usernameInput.value.length > 0) && (passwordInput.value.length > 0) && (confirmPasswordInput.value.length > 0)) {
        return true;
    } else {
        return false;
    }
}

function checkPasswordsMatch() {
    if ((passwordInput.value === confirmPasswordInput.value)) {
        return true;
    } else {
        return false;
    }
}

function registrationCompleted() {
    let credentialsInputted = checkCredentialsInputted();
    let passwordsMatch = checkPasswordsMatch();

    if (credentialsInputted && passwordsMatch) {
        createButton.removeAttribute('hidden');
        confirmPasswordInput.style.borderColor = '';
    } else {
        createButton.setAttribute('hidden', '');
        if (!passwordsMatch) {
            confirmPasswordInput.style.borderColor = 'red';
        }
    }
}

function checkIfUserExists() {
    // call /get-user endpoint
    /* if user does not exist, call /create-user endpoint
        else, render username already exists message */
}

usernameInput.addEventListener("input", registrationCompleted);
passwordInput.addEventListener("input", registrationCompleted);
confirmPasswordInput.addEventListener("input", registrationCompleted);

registrationCompleted();