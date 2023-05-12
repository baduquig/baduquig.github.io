class GameLocator {
    constructor() {
        this.getJSON('allData.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.allData = data;
                this.setWeekDropdown(15);
            }
        });
        this.getJSON('conferences.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.setConferenceDropdown(data);
            }
        });

        this.weekDropdown = document.getElementById('week');
        this.dayDropdown = document.getElementById('day');
        this.conferenceDropdown = document.getElementById('conference');
        this.schoolDropdown = document.getElementById('school');

        this.filteredData = {};
    }

    // Function to retrieve data from JSON files via HTTP Request
    getJSON = (jsonFile, callback) => {
        let xhr = new XMLHttpRequest();
        const url = 'https://raw.githubusercontent.com/baduquig/espn-college-football-schedule-data-wrangling/main/data/' + jsonFile;
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
      

    // Initialize Week and Conference dropdown options
    setWeekDropdown(weeks) {
        let weekOptions = '';
        for (let i = 0; i < weeks; i++) {
            const weekNum = i + 1;
            weekOptions += '<option value="' + weekNum + '">' + weekNum + '</option>';
        }
        this.weekDropdown.innerHTML = weekOptions;
        this.updateDayOptions(1);
    }

    setConferenceDropdown(conferenceData) {
        let conferencesArray = [];
        let conferenceOptions = '<option selected value></option>';
        for (let i = 0; i < conferenceData.length; i++) {
            const conferenceID = conferenceData[i].conferenceID;
            if (!conferencesArray.includes(conferenceID)) {
                const conferenceName = conferenceData[i].conferenceName;

                conferencesArray.push(conferenceID)
                conferenceOptions += '<option value="' + conferenceID + '">' + conferenceName + '</option>';
            }
        }        
        this.conferenceDropdown.innerHTML = conferenceOptions;
    }


    // Filter for selected data elements
    applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool) {
        if ((selectedDay == null || selectedDay == '') && (selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
            this.filteredData = this.allData.filter(game => {
                return game.week == selectedWeek
            });
        } else if ((selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
        } else if ((selectedDay == null || selectedDay == '') && (selectedSchool == null || selectedSchool == '')) {
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek)
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        } else if (selectedDay == null || selectedDay == '') {
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek)
                        && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        } else if (selectedSchool == null || selectedSchool == '') {
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay)
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        } else {
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay)
                        && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        }
    } // end applySelectedFilters() method

    filterGames() {
        const selectedWeek = this.weekDropdown.value;
        const selectedDay = this.dayDropdown.value;
        const selectedConference = this.conferenceDropdown.value;
        const selectedSchool = this.schoolDropdown.value;

        // Apply filters
        this.applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool);

        // Render US Scatterplot
        const sctPlt = new ScatterPlot(this.filteredData);
        sctPlt.renderScatterPlot();
    } // end filterGames() method 


    // Update Input field functions
    updateDayOptions(weekNum) {
        this.dayDropdown.value = null;
        this.filterGames();
        let dayArray = [];
        let dayOptions = '<option selected value></option>';
        
        for (let i = 0; i < this.filteredData.length; i++) {
            const day = this.filteredData[i].gameDate;

            if ((this.filteredData[i].week == weekNum) && (!dayArray.includes(day))) {
                dayArray.push(day);
                dayOptions += '<option value="' + day + '">' + day + '</option>';
            }
        }
        this.dayDropdown.innerHTML = dayOptions;        
    } // end updateDayOptions() method

    updateSchoolOptions(conferenceID) {
        this.schoolDropdown.value = null;
        this.filterGames();
        let schoolArray = [];
        let schoolOptions = '<option selected value></option>';
        
        for (let i = 0; i < this.filteredData.length; i++) {
            const awayConferenceID = this.filteredData[i].awayConferenceID;
            const homeConferenceID = this.filteredData[i].homeConferenceID;
            const awaySchoolID = this.filteredData[i].awaySchool;
            const awaySchoolName = this.filteredData[i].awaySchoolName;
            const homeSchoolID = this.filteredData[i].homeSchool;
            const homeSchoolName = this.filteredData[i].homeSchoolName;

            if ((awayConferenceID == conferenceID) && (!schoolArray.includes(awaySchoolName))) {
                schoolArray.push(awaySchoolName);
                schoolOptions += '<option value="' + awaySchoolID + '">' + awaySchoolName + '</option>';
            }
            if ((homeConferenceID == conferenceID) && (!schoolArray.includes(homeSchoolName))) {
                schoolArray.push(homeSchoolName);
                schoolOptions += '<option value="' + homeSchoolID + '">' + homeSchoolName + '</option>';
            }
        }
        this.schoolDropdown.innerHTML = schoolOptions;
    } // end updateSchoolOptions() method

} // end filterAllData class


class ScatterPlot {
    constructor(data) {
        this.data = data;
    }
    
    renderScatterPlot() {
        const fontSize = (document.getElementById('map').offsetWidth) * .05;
        const markerSize = (document.getElementById('map').offsetWidth) * .005;

        var plotPoints = [{
            type:'scattergeo',
            locationmode: 'USA-states',
            lat: this.data.map(game => game.latitude),
            lon: this.data.map(game => game.longitude),
            text: this.data.map(game => [game.awaySchoolName + ' @ ' + game.homeSchoolName + '<br>' + game.gameDate + '<br>' + game.locationName]),
            textfont: {
                size: fontSize
            },
            textposition: 'middle center',
            hovertemplate: '%{text}',
            mode: 'markers',
            marker: {
                color: '#000000',
                size: markerSize, 
                opacity: 0.8
            }
            
        }];
    
    
        var layout = {
            dragmode: false,
            geo: {
                scope: 'usa',
                projection: {
                    type: 'usa'
                },
                width: '100%'
            },
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            }
        };
    
        Plotly.newPlot('map', plotPoints, layout, {showLink: false});

    }
} // end renderScatterPlot class


class travelDistance {
    constructor() {
        cfb.getJSON('locations.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.setLocationDatalist(data);
                this.locationsData = data;
            }
        });

        this.orsResponse = '';
        this.startLocationList = document.getElementById('startLocationList');
        this.endLocationList = document.getElementById('endLocationList');
    }

    // Initialize Locations datalist
    setLocationDatalist(locationsData) {
        let locationOptions = '';
        for (let i = 0; i < locationsData.length; i++) {
            const latLongValue = locationsData[i].longitude + ',' + locationsData[i].latitude;
            const locationName = locationsData[i].locationName;
            //locationOptions += '<option value="' + latLongValue + '">' + locationName + '</option>';
            locationOptions += '<option value="' + locationName + '">';
            //locationOptions += '<option>' + locationName + '</option>';
        }
        this.startLocationList.innerHTML = locationOptions;
        this.endLocationList.innerHTML = locationOptions;
    }

    orsGetRequest(startLongitude, startLatitude, endLongitude, endLatitude) {
        console.log('here 4');
        let request = new XMLHttpRequest();
        const orsDirectionsEndpoint = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=';
        const orsKey = '5b3ce3597851110001cf624815b3b2ce7e0747dc90221abdc70363e5';
        const start = startLongitude + ',' + startLatitude;
        const end = endLongitude + ',' + endLatitude;
        const url = orsDirectionsEndpoint + orsKey + '&start=' + start + '&end=' + end;
        console.log(url);
        request.open('GET', url, true);
        request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                const travelData = JSON.parse(this.responseText);
                const unformattedDistance = travelData.features[0].properties.segments[0].distance;
                const unformattedDuration = travelData.features[0].properties.segments[0].duration;
                const distance = Math.round(unformattedDistance * 0.00062137) + ' Mi.';
                const hours = Math.floor(unformattedDuration / 3600);
                const minutes = Math.floor((unformattedDuration % 3600) / 60);
                const duration = hours + 'Hrs ' + minutes + 'min';

                document.getElementById('driveDistance').innerHTML = distance;
                document.getElementById('driveDuration').innerHTML = duration;
            }
        }
        request.send();
    }

    getTravelResults() {        
        console.log('here');
        const startValue = document.getElementById('startLocation').value;
        const endValue = document.getElementById('endLocation').value;

        if ((startValue.length > 0) && (endValue.length > 0)) {
            console.log('here 2');
            const startLocation = this.locationsData.filter(location => {
                return location.locationName == startValue;
            });
            const endLocation = this.locationsData.filter(location => {
                return location.locationName == endValue;
            });

            const startLongitude = startLocation[0].longitude;
            const startLatitude = startLocation[0].latitude;
            const endLongitude = endLocation[0].longitude;
            const endLatitude = endLocation[0].latitude;
            
            this.orsGetRequest(startLongitude, startLatitude, endLongitude, endLatitude);
        }
    }

    clearTravelInput(id) {
        document.getElementById(id).value = null;
    }

}


// Initial function calls to instantiate page
const cfb = new GameLocator();
const trvl = new travelDistance();