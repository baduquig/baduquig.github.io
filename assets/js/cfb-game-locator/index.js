// Data Objects
let gamesData = {};
let schoolsData = {};
let conferencesData = {};
let locationsData = {};
let filteredGames = gamesData;

// Input field variables
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

function setWeekDropdown() {
    let weekOptions = '<option disabled selected value></option>';

    for (i = 0; i < 15; i++) {
        weekNum = i + 1;
        weekOptions += '<option value="' + weekNum + '">' + weekNum + '</option>';
    }
    weekDropdown.innerHTML = weekOptions;
    updateDayOptions(1);
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

    // Apply filters that are populated
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

    // Iterate through all objects in filteredGames 
    for (i = 0; i < filteredGames.length; i++) {
        let awayJoined = false;
        let homeJoined = false;
        let locationJoined = false;
        let j = 0;

        while (!awayJoined || !homeJoined || !locationJoined) {
            // Join Away School Name and Mascot on School ID
            if (!awayJoined) {
                if (j < schoolsData.length) {
                    if (filteredGames[i].away_school === schoolsData[j].school_id) {
                        awayJoined = true;
                        filteredGames[i].away_school_name = schoolsData[j].name;
                        filteredGames[i].away_school_mascot = schoolsData[j].mascot;
                    }
                } else {
                    awayJoined = true;
                    filteredGames[i].away_school_name = 'Away School';
                    filteredGames[i].away_school_mascot = 'Away Mascot';
                }
            }

            // Join Home School Name and Mascot on School ID
            if (!homeJoined) {
                if (j < schoolsData.length) {
                    if (filteredGames[i].home_school === schoolsData[j].school_id) {
                        homeJoined = true;
                        filteredGames[i].home_school_name = schoolsData[j].name;
                        filteredGames[i].home_school_mascot = schoolsData[j].mascot;
                    }
                } else {
                    homeJoined = true;
                    filteredGames[i].home_school_name = 'Home School';
                    filteredGames[i].home_school_mascot = 'Home Mascot';
                }
            }

            // Join Location Name and Geocoordinates on Location ID
            if (!locationJoined) {
                if (j < locationsData.length) {
                    if (filteredGames[i].location_id == locationsData[j].location_id) {
                        locationJoined = true;
                        filteredGames[i].location_name = locationsData[j].location_name;
                        filteredGames[i].city = locationsData[j].city;
                        filteredGames[i].state = locationsData[j].state;
                        filteredGames[i].latitude = locationsData[j].latitude;
                        filteredGames[i].longitude = locationsData[j].longitude;
                    }
                } else {
                    locationJoined = true;
                    filteredGames[i].location_name = 'Stadium Name';
                    filteredGames[i].city = 'City';
                    filteredGames[i].state = 'State';
                    filteredGames[i].latitude = 0;
                    filteredGames[i].longitude = 0;
                }
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
        setWeekDropdown();
    }
});

getJSON('schools.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        schoolsData = data;
    }
});

getJSON('conferences.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        conferencesData = data;
        setConferenceDropdown(conferencesData);
    }
});

getJSON('locations.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        locationsData = data;
    }
});
