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
    let serverEndpoint = `http://127.0.0.1:5000/get-user?username=${usernameInput.value}&pw=${passwordInput.value}`;
    console.log('Starting request to ', serverEndpoint);

    fetch(serverEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Request successful: ', data);
            if (data['userid'] > 0) {
                console.log('User exists');
                // create user token
            } else {
                console.log('user does not exist');
                loginErrorDiv.removeAttribute('hidden');
            }
        })
        .catch(error => {
            console.error('Error: ', error);
        });
}


usernameInput.addEventListener("input", checkCredentialsInputs);
passwordInput.addEventListener("input", checkCredentialsInputs);
signinButton.addEventListener("click", checkIfUserExists)

checkCredentialsInputs();