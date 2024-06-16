const loginErrorDiv = document.getElementById('login-error');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signinButton = document.getElementById('sign-in-btn');

function checkCredentialsInputs() {
    loginErrorDiv.setAttribute('hidden', '');
    if ((usernameInput.value.length == 0) || (passwordInput.value.length == 0)) {
        signinButton.setAttribute('hidden', '');
    } else {
        signinButton.removeAttribute('hidden');
    }
}

function checkIfUserExists() {
    // call /get-user endpoint
    /* if user does not exist, unhide login error message
        else, open pickem page */
}


usernameInput.addEventListener("input", checkCredentialsInputs);
passwordInput.addEventListener("input", checkCredentialsInputs);
signinButton.addEventListener("click", checkIfUserExists)

checkCredentialsInputs();