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

function createUser() {
    //let serverEndpoint = `http://127.0.0.1:5000/create-user?username=${usernameInput.value}&pw=${passwordInput.value}`;
    let serverEndpoint = `https://gbaduqui.pythonanywhere.com/create-user?username=${usernameInput.value}&pw=${passwordInput.value}`;
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
            if (data['status'] == 200) {                
                console.log('User created successfully');
                
                fetch(`https://gbaduqui.pythonanywhere.com/get-user?username=${usernameInput.value}&pw=${passwordInput.value}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Response was not ok: ' + response.statusText);
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data['userid'] > 0) {
                            sessionStorage.setItem('userid', data['userid']);
                            window.location.href = 'pickem.html';
                        } else {
                            console.log('Error occurred logging in!');
                        }
                    })
                    .catch(error => {
                        console.error('Error: ', error);
                    });

            } else {
                console.log('Error occurred creating user account');
            }
        })
        .catch(error => {
            console.error('Error: ', error);
        });
}

function checkIfUserExists() {
    let serverEndpoint = `https://gbaduqui.pythonanywhere.com/get-user?username=${usernameInput.value}&pw=${passwordInput.value}`;
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
                console.log('User already exists');
                registrationErrorDiv.removeAttribute('hidden');
            } else {
                console.log('user does not exist');
                createUser();
            }
        })
        .catch(error => {
            console.error('Error: ', error);
        });
}

usernameInput.addEventListener("input", registrationCompleted);
passwordInput.addEventListener("input", registrationCompleted);
confirmPasswordInput.addEventListener("input", registrationCompleted);
createButton.addEventListener("click", checkIfUserExists);

registrationCompleted();