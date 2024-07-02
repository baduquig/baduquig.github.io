const serverEndpoint = 'http://127.0.0.1:5000/all-picks';
let allPicks = [];

fetch(serverEndpoint)
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        allPicks = data;
        console.log('Request successful!');
    })
    .catch(error => {
        console.error('Error: ', error);
    });