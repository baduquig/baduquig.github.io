// Data Objects
let gamesData = {};
let schoolsData = {};
let conferencesData = {};
let filteredGames = gamesData;

// Input field variables
let weekArray = [];
let weekOptions = '';
let weekDropdown = document.getElementById('week');

let dayDropdown = document.getElementById('day');
let conferenceDropdown = document.getElementById('conference');
let schoolDropdown = document.getElementById('school');


// Input field functions
function updateDayOptions(weekNum) {
    dayDropdown.value = null;
    let dayArray = [];
    let dayOptions = '<option disabled selected value></option>';
    filterGames();
    
    for (i = 0; i < filteredGames.length; i++) {
        day = filteredGames[i].game_date;
        if ((filteredGames[i].week == weekNum) && (!dayArray.includes(day))) {
            dayArray.push(day);
            dayOptions += '<option value="' + day.split(',')[0] + '">' + day + '</option>';
        }
    }
    dayDropdown.innerHTML = dayOptions;
}

function updateSchoolOptions(conference) {
    let schoolArray = [];
    let schoolOptions = '<option disabled selected value></option>';
    filterGames();

    for (i = 0; i < schoolsData.length; i++) {
        schoolName = schoolsData[i].name;
        if ((schoolsData[i].conference_id == conference) && (!schoolArray.includes(schoolName))) {
            schoolArray.push(schoolName);
            schoolOptions += '<option value="' + schoolsData[i].school_id + '">' + schoolName + '</option>'
        }
    }
    schoolDropdown.innerHTML = schoolOptions;
}

function setWeekDropdown(weekNum) {
    for (i = 0; i < gamesData.length; i++) {
        weekNum = gamesData[i].week;
        if (!weekArray.includes(weekNum)) {
            weekArray.push(weekNum);
            weekOptions += '<option value="' + weekNum + '">' + weekNum + '</option>';
        }
    }
    weekDropdown.innerHTML = weekOptions;
    updateDayOptions(weekNum);
}

function setConferenceDropdown() {
    let conferenceArray = [];
    let conferenceOptions = '<option disabled selected value></option>';

    for (i = 0; i < conferencesData.length; i++) {
        conferenceName = conferencesData[i].conference_name;
        conferenceId = conferencesData[i].conference_id;
        if (!conferenceArray.includes(conferenceName)) {
            conferenceArray.push(conferenceName);
            conferenceOptions += '<option value="' + conferenceId + '">' + conferenceName + '</option>';
        }
    }        
    conferenceDropdown.innerHTML = conferenceOptions;
}


function filterGames() {
    let selectedWeek = weekDropdown.value;
    let selectedDay = dayDropdown.value;
    let selectedConference = conferenceDropdown.value;
    let selectedSchool = schoolDropdown.value;

    if ((selectedDay == null || selectedDay == '') && (selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 1');
        filteredGames = gamesData.filter(game => {
            return (game.week == selectedWeek)
        });
    } else if ((selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 2');
        filteredGames = gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.game_date.split(',')[0] == selectedDay)
            )
        });
    } else if ((selectedDay == null || selectedDay == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 3');
        filteredGames = gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.conference_id == selectedConference) 
            )
        });
    } else if (selectedDay == null || selectedDay == '') {
        console.log('Here 4');
        filteredGames = gamesData.filter(game => {
            return ((game.week === selectedWeek)
                    && (game.conference_id == selectedConference) 
                    && ((game.away_school == selectedSchool) || (game.home_school == selectedSchool))
            )
        });
    } else if (selectedSchool == null || selectedSchool == '') {
        console.log('Here 5');
        filteredGames = gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.game_date == selectedDay) 
                    && (game.conference_id == selectedConference)
            )
        });
    } else {
        console.log('Here 6');
        filteredGames = gamesData.filter(game => {
            return ((game.week === selectedWeek) 
                    && (game.game_date == selectedDay) 
                    && (game.conference_id == selectedConference) 
                    && ((game.away_school == selectedSchool) || (game.home_school == selectedSchool))
            )
        });
    }
    console.log('HERE!');
    for (i = 0; i < filteredGames.length; i++) {
        console.log('Starting loop...')
        let awayJoined = false;
        let homeJoined = false;
        let j = 0;

        while (!awayJoined && !homeJoined) {
            console.log(filteredGames[i].away_school);
            console.log(schoolsData[j].school_id);
            if (filteredGames[i].away_school === schoolsData[j].school_id) {
                awayJoined = true;
                filteredGames[i].away_school_name = schoolsData[j].name;
                filteredGames[i].away_school_mascot = schoolsData[j].mascot;
            }
            if (filteredGames[i].home_school === schoolsData[j].school_id) {
                homeJoined = true;
                filteredGames[i].home_school_name = schoolsData[j].name;
                filteredGames[i].home_school_mascot = schoolsData[j].mascot;
            }
            j++;
        }
    }
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
        setWeekDropdown(gamesData);
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

