let gamesData = {};
let schoolsData = {};
let conferencesData = {};

let getJSON = (jsonFile, callback) => {
    let url = 'https://raw.githubusercontent.com/baduquig/espn-college-football-schedule-data-wrangling/main/data/' + jsonFile;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.status === 200) {
            callback(null, xhr.response);
        } else {
            callback(xhr.status, xhr.response);
        }
    }
    xhr.send();
}

getJSON('games.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        gamesData = data;
    }
}
);

getJSON('schools.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        schoolsData = data;
    }
}
);

getJSON('conferences.json', (err, data) => {
        if (err !== null) {
            console.log(err);
        } else {
            conferencesData = data;
        }
    }
);
