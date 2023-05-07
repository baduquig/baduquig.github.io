// Data Objects
// let allData = {};
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
    //let weekOptions = '<option disabled selected value></option>';
    let weekOptions = '';

    for (i = 0; i < weeks; i++) {
        weekNum = i + 1;
        weekOptions += '<option value="' + weekNum + '">' + weekNum + '</option>';
    }
    weekDropdown.innerHTML = weekOptions;
}

function setConferenceDropdown(conferences) {
    let conferenceArray = [];
    let conferenceOptions = '<option disabled selected value></option>';

    for (i = 0; i < conferences.length; i++) {
        conferenceName = conferences[i].conferenceName;
        conferenceID = conferences[i].conferenceID;
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
    filter();

    for (i = 0; i < filteredData.length; i++) {
        day = filteredData[i].gameDate;
        if ((filteredData[i].week === weekNum) && (!dayArray.includes(day))) {
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
    filter();

    for (i = 0; i < schoolsData.length; i++) {
        schoolName = schoolsData[i].name;
        if ((schoolsData[i].conferenceID === conference) && (!schoolArray.includes(schoolName))) {
            schoolArray.push(schoolName);
            schoolOptions += '<option value="' + schoolsData[i].school_id + '">' + schoolName + '</option>'
        }
    }
    schoolDropdown.innerHTML = schoolOptions;
}


function applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool) {
    x = {};
    
    if ((selectedDay == null || selectedDay == '') && (selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 1');
        x = gamesData.filter(game => {
            return (game.week === selectedWeek)
        });
    } else if ((selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 2');
        x = gamesData.filter(game => {
            return ((game.week === selectedWeek) 
                    && (game.gameDate.split(',')[0] == selectedDay)
            )
        });
    } else if ((selectedDay == null || selectedDay == '') && (selectedSchool == null || selectedSchool == '')) {
        console.log('Here 3');
        x = gamesData.filter(game => {
            return ((game.week === selectedWeek) 
                    && (game.conferenceID == selectedConference) 
            )
        });
    } else if (selectedDay == null || selectedDay == '') {
        console.log('Here 4');
        x = gamesData.filter(game => {
            return ((game.week === selectedWeek)
                    && (game.conferenceID == selectedConference) 
                    && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
            )
        });
    } else if (selectedSchool == null || selectedSchool == '') {
        console.log('Here 5');
        x = gamesData.filter(game => {
            return ((game.week === selectedWeek) 
                    && (game.gameDate == selectedDay) 
                    && (game.conferenceID == selectedConference)
            )
        });
    } else {
        console.log('Here 6');
        x = gamesData.filter(game => {
            return ((game.week === selectedWeek) 
                    && (game.gameDate == selectedDay) 
                    && (game.conferenceID == selectedConference) 
                    && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
            )
        });
    }
    filteredData = x;
}


function renderMap(data) {
    var plotPoints = [{
        type:'scattergeo',
        locationmode: 'USA-states',
        //lon: unpack(rows, 'long'),
        //lat: unpack(rows, 'lat'),
        //hoverinfor:  unpack(rows, 'airport'),
        //text:  unpack(rows, 'airport'),
        mode: 'markers',
        marker: {
            size: 8,
            opacity: 0.8,
            reversescale: true,
            autocolorscale: false,
            /*symbol: 'square',
            line: {
                width: 1,
                color: 'rgb(102,102,102)'
            },
            colorscale: scl,
            cmin: 0,
            color: unpack(rows, 'cnt'),
            colorbar: {
                title: 'Incoming Flights February 2011'
            }*/
        }
    }];

    var layout = {
        colorbar: true,
        geo: {
            scope: 'usa',
            projection: {
                type: 'albers usa'
            },
            showland: true,
            landcolor: 'rgb(250,250,250)',
            subunitcolor: 'rgb(217,217,217)',
            countrycolor: 'rgb(217,217,217)',
            countrywidth: 1,
            subunitwidth: 1
        }
    };

    Plotly.newPlot('map', plotPoints, layout);
}


function filter() {
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