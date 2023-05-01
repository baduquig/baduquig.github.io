let gamesData = {};
let schoolsData = {};
let conferencesData = {};

let weeksArray = []
let weekOptions = '';
let weekDropdown = document.getElementById('week');

let conferenceArray = []
let conferenceOptions = '';
let conferencesDropdown = document.getElementById('conference');

function setWeeksDropdown() {
    for (i = 0; i < gamesData.length; i++) {
        week = gamesData[i].week;
        if (!weeksArray.includes(week)) {
            weeksArray.push(week);
            weekOptions += '<option value="' + week + '">' + week + '</option>';
        }
    }        
    weekDropdown.innerHTML = weekOptions;
}

function setConferenceDropdown() {
    for (i = 0; i < conferencesData.length; i++) {
        conferenceName = conferencesData[i].conference_name;
        if (!conferenceArray.includes(conferenceName)) {
            conferenceArray.push(conferenceName);
            conferenceOptions += '<option value="' + conferencesData[i].conference_id + '">' + conferenceName + '</option>';
        }
    }        
    conferencesDropdown.innerHTML = conferenceOptions;
}

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
        setWeeksDropdown(gamesData);
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
            setConferenceDropdown(conferencesData);
        }
    }
);

