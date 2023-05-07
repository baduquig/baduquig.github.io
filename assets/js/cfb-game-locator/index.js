// Data Objects
let allData = {};
let gamesData = {};
let schoolsData = {};
let conferencesData = {};
let locationsData = {};
let filteredData = {};

// Input field variables
let weekDropdown = document.getElementById('week');
let dayDropdown = document.getElementById('day');
let conferenceDropdown = document.getElementById('conference');
let schoolDropdown = document.getElementById('school');


// Initialize Week and Conference dropdown options
function setWeekDropdown(weeks) {
    let weekOptions = '<option disabled selected value></option>';
    
    for (i = 0; i < weeks; i++) {
        let weekNum = i + 1;
        weekOptions += '<option value="' + weekNum + '">' + weekNum + '</option>';
    }
    weekDropdown.innerHTML = weekOptions;
}

function setConferenceDropdown(conferences) {
    let conferenceArray = [];
    let conferenceOptions = '<option disabled selected value></option>';

    for (i = 0; i < conferences.length; i++) {
        let conferenceName = conferences[i].conferenceName;
        let conferenceID = conferences[i].conferenceID;
        if (!conferenceArray.includes(conferenceName)) {
            conferenceArray.push(conferenceName);
            conferenceOptions += '<option value="' + conferenceID + '">' + conferenceName + '</option>';
        }
    }        
    conferenceDropdown.innerHTML = conferenceOptions;
}

// Input field functions
function updateDayOptions(weekNum) {
    dayDropdown.value = null;
    let dayArray = [];
    let dayOptions = '<option disabled selected value></option>';
    filterGames();
    
    for (i = 0; i < filteredData.length; i++) {
        let day = filteredData[i].gameDate;
        if ((filteredData[i].week == weekNum) && (!dayArray.includes(day))) {
            dayArray.push(day);
            dayOptions += '<option value="' + day.split(',')[0] + '">' + day + '</option>';
        }
    }
    dayDropdown.innerHTML = dayOptions;
}

function updateSchoolOptions(conference) {
    schoolDropdown.value = null;
    let schoolArray = [];
    let schoolOptions = '<option disabled selected value></option>';
    filterGames();

    for (i = 0; i < schoolsData.length; i++) {
        schoolName = schoolsData[i].name;
        if ((schoolsData[i].conferenceID === conference) && (!schoolArray.includes(schoolName))) {
            schoolArray.push(schoolName);
            schoolOptions += '<option value="' + schoolsData[i].school_id + '">' + schoolName + '</option>';
        }
    }
    schoolDropdown.innerHTML = schoolOptions;
}


function applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool) {
    // TODO: Fix conferene filters to filter for home/away conference
    if ((selectedDay == null || selectedDay == '') && (selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 1');
        filteredData= gamesData.filter(game => {
            return (game.week == selectedWeek)
        });
    } else if ((selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 2');
        filteredData= gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.gameDate.split(',')[0] == selectedDay)
            )
        });
    } else if ((selectedDay == null || selectedDay == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 3');
        filteredData= gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.conferenceID == selectedConference) 
            )
        });
    } else if (selectedDay == null || selectedDay == '') {
        console.log('Here 4');
        filteredData= gamesData.filter(game => {
            return ((game.week == selectedWeek)
                    && (game.conferenceID == selectedConference) 
                    && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
            )
        });
    } else if (selectedSchool == null || selectedSchool == '') {
        console.log('Here 5');
        filteredData= gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.gameDate == selectedDay) 
                    && (game.conferenceID == selectedConference)
            )
        });
    } else {
        console.log('Here 6');
        filteredData= gamesData.filter(game => {
            return ((game.week == selectedWeek) 
                    && (game.gameDate == selectedDay) 
                    && (game.conferenceID == selectedConference) 
                    && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
            )
        });
    }
}


function renderMap(data) {
    var plotPoints = {
        type:'scattergeo',
        locationmode: 'USA-states',
        //lat: filteredData.map(game => game.latitude),
        //lon: filteredData.map(game => game.longitude),
        //hoverinfor:  unpack(rows, 'airport'),
        //text:  unpack(rows, 'airport'),
        mode: 'markers'
        }
    };

    var layout = {
        colorbar: true,
        geo: {
            scope: 'usa',
            projection: {
                type: 'usa'
            }
        },
        margin: {
            l: 5,
            r: 5,
            b: 5,
            t: 5,
            pad: 2
          }
    };

    Plotly.newPlot('map', plotPoints, layout);
}


function filterGames() {
    let selectedWeek = weekDropdown.value;
    let selectedDay = dayDropdown.value;
    let selectedConference = conferenceDropdown.value;
    let selectedSchool = schoolDropdown.value;

    applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool);
    renderMap(filteredData);
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

/* getJSON('allData.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        allData = data;
        setWeekDropdown();
    }
}); */

setWeekDropdown(15);

getJSON('games.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        gamesData = data;
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
        setConferenceDropdown(data);
        conferencesData = data;
    }
});

getJSON('locations.json', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        locationsData = data;
    }
});

allData = gamesData;
for (x = 0; x < allData.length; x++) {
    let awaySchoolJoined = false;
    let homeSchoolJoined = false;
    let awayConferenceJoined = false;
    let homeConferenceJoined = false;
    let locationJoined = false;
    let y = 0;

    // TODO: Finish joining properties from schoolsData, conferencesData, locationsData objects
    while ((!awaySchoolJoined) || (!homeSchoolJoined) || (!awayConferenceJoined) || (!homeConferenceJoined) || (!locationJoined)) {
        if (!awaySchoolJoined) {
            if (y < schoolsData.length) {
                if (allData[x].awaySchool == schoolData[y].schoolID) {
                    allData[x].awaySchoolName = schoolData[y].name;
                    allData[x].awaySchoolMascot = schoolData[y].mascot;
                    allData[x].awaySchoolDivisionID = schoolData[y].divisionID;
                    awaySchoolJoined = true;
                }
            } else {
                allData[x].awaySchoolName = 'Away School';
                allData[x].awaySchoolMascot = 'Away Mascot';
                allData[x].awaySchoolDivisionID = 0;
            }
        }
        
        if (!homeSchoolJoined) {
            if (y < schoolsData.length) {
                if (allData[x].homeSchool == schoolData[y].schoolID) {
                    allData[x].homeSchoolName = schoolData[y].name;
                    allData[x].homeSchoolMascot = schoolData[y].mascot;
                    allData[x].homeSchoolDivisionID = schoolData[y].divisionID;
                    homeSchoolJoined = true;
                }
            } else {
                allData[x].homeSchoolName = 'Home School';
                allData[x].homeSchoolMascot = 'Home Mascot';
                allData[x].homeSchoolDivisionID = 0;
            }
        }
        
        if (!awayConferenceJoined) {
            if (y < conferencesData.length) {
                if (allData[x].awayDivisionID == conferencesData[y].divisionID) {
                    allData[x].awayConferenceID = conferencesData[y].conferenceID;
                    allData[x].awayConferenceName = conferencesData[y].conferenceName;
                    awayConferenceJoined = true;
                }
            } else {
                allData[x].awayConferenceID = 0;
                allData[x].awayConferenceName = 'Conference Name';
            }
        }
        
        if (!homeConferenceJoined) {
            if (y < conferencesData.length) {
                if (allData[x].homeDivisionID == conferencesData[y].divisionID) {
                    allData[x].homeConferenceID = conferencesData[y].conferenceID;
                    allData[x].homeConferenceName = conferencesData[y].conferenceName;
                    homeConferenceJoined = true;
                }
            } else {
                allData[x].homeConferenceID = 0;
                allData[x].homeConferenceName = 'Conference Name';
            }
        }
        
        if (!locationJoined) {
            if (y < locationsData.length) {
                if (allData[x].locationID == locationsData[y].locationID) {
                    allData[x].locationName = locationsData[y].locationName;
                    allData[x].city = locationsData[y].city;
                    allData[x].state = locationsData[y].state;
                    allData[x].latitude = locationsData[y].latitude;
                    allData[x].longitude = locationsData[y].longitude;
                    locationJoined = true;
                }
            } else {
                allData[x].locationName = 'Location Name';
                allData[x].city = 'City';
                allData[x].state = 'State';
                allData[x].latitude = 0;
                allData[x].longitude = 0;
            }
        }
        
    }
    y++;
}