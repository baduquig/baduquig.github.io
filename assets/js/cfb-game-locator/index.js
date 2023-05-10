
class GameLocator {
    constructor() {
        /* this.getJSON('games.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.gamesData = data;
            }
        }); */
        this.getJSON('allData.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.allData = data;
            }
        });
        
        this.getJSON('schools.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.schoolsData = data;
            }
        });
        
        this.getJSON('conferences.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.setConferenceDropdown(data);
                this.conferencesData = data;
            }
        });
        
        /* this.getJSON('locations.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.locationsData = data;
            }
        }); */

        this.weekDropdown = document.getElementById('week');
        this.dayDropdown = document.getElementById('day');
        this.conferenceDropdown = document.getElementById('conference');
        this.schoolDropdown = document.getElementById('school');

        this.filteredData = {};
      }
      

    // Initialize Week and Conference dropdown options
    setWeekDropdown(weeks) {
        let weekOptions = '';
        //let weekOptions = '<option disabled selected value></option>';
        
        for (let i = 0; i < weeks; i++) {
            const weekNum = i + 1;
            weekOptions += '<option value="' + weekNum + '">' + weekNum + '</option>';
        }
        this.weekDropdown.innerHTML = weekOptions;
    }

    setConferenceDropdown(conferences) {
        let conferenceArray = [];
        let conferenceOptions = '<option disabled selected value></option>';

        for (let i = 0; i < conferences.length; i++) {
            //const conferenceID = conferences[i].conferenceID;
            const conferenceName = conferences[i].conferenceName;

            if (!conferenceArray.includes(conferenceName)) {
                conferenceArray.push(conferenceName);
                conferenceOptions += '<option value="' + conferenceName + '">' + conferenceName + '</option>';
            }
        }        
        this.conferenceDropdown.innerHTML = conferenceOptions;
    }


    // Function to retrieve data from JSON files via HTTP Request
    getJSON = (jsonFile, callback) => {
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


    // Filter for selected data elements
    applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool) {
        console.log(selectedWeek);
        console.log(selectedDay);
        console.log(selectedConference);
        console.log(selectedSchool);
        if ((selectedDay == null || selectedDay == '') && (selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
            console.log('Here 1');
            this.filteredData = this.allData.filter(game => {
                return game.week == selectedWeek
            });
        } else if ((selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
            console.log('HERE 2');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
        } else if ((selectedDay == null || selectedDay == '') && (selectedSchool == null || selectedSchool == '')) {
            console.log('HERE 3');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek)
                        && ((game.awayConferenceName == selectedConference) || (game.homeConferenceName == selectedConference)))
            });
        } else if (selectedDay == null || selectedDay == '') {
            console.log('HERE 4');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek)
                        && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
                        && ((game.awayConferenceName == selectedConference) || (game.homeConferenceName == selectedConference)))
            });
        } else if (selectedSchool == null || selectedSchool == '') {
            console.log('HERE 5');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay)
                        && ((game.awayConferenceName == selectedConference) || (game.homeConferenceName == selectedConference)))
            });
        } else {
            console.log('HERE 6');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay)
                        && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
                        && ((game.awayConferenceName == selectedConference) || (game.homeConferenceName == selectedConference)))
            });
        }
        console.log('filteredData set');
        console.log(this.filteredData);
    } // end applySelectedFilters() method

    filterGames() {
        const selectedWeek = this.weekDropdown.value;
        const selectedDay = this.dayDropdown.value;
        const selectedConference = this.conferenceDropdown.value;
        const selectedSchool = this.schoolDropdown.value;

        // Ensure gamesData object is initialized before calling
        const intervalId = setInterval(() => {
            if (this.allData) {
                
                // Apply filters
                this.applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool);

                // Render US Scatterplot
                const sctPlt = new ScatterPlot(this.filteredData);
                console.log('ScatterPlot class initialized');
                sctPlt.renderScatterPlot();

              clearInterval(intervalId); // Stop the loop
            } else {
                console.log('gamesData not initialized yet...');
            }
          }, 100);
    } // end filterGames() method


    // Update Input field functions
    updateDayOptions(weekNum) {
        this.dayDropdown.value = null;
        let dayArray = [];
        let dayOptions = '<option disabled selected value></option>';
        this.filterGames();
        
        for (let i = 0; i < this.filteredData.length; i++) {
            const day = this.filteredData[i].gameDate;

            if ((this.allData[i].week == weekNum) && (!dayArray.includes(day))) {
                dayArray.push(day);
                dayOptions += '<option value="' + day + '">' + day + '</option>';
            }
        }
        this.dayDropdown.innerHTML = dayOptions;
    } // end updateDayOptions() method

    updateSchoolOptions(conferenceID) {
        this.schoolDropdown.value = null;
        let schoolArray = [];
        let schoolOptions = '<option disabled selected value></option>';
        const divisionObjects = this.conferencesData.filter(division => {
            return (division.conferenceID == conferenceID)
        });
        const divisionsList = divisionObjects.map(divObj => divObj.divisionID);
        this.filterGames();
        
        for (let i = 0; i < this.schoolsData.length; i++) {
            const divisionID = this.schoolsData[i].divisionID;
            const schoolID = this.schoolsData[i].schoolID;
            const schoolName = this.schoolsData[i].name;

            if ((divisionsList.includes(divisionID)) && (!schoolArray.includes(schoolName))) {
                schoolArray.push(schoolName);
                schoolOptions += '<option value="' + schoolID + '">' + schoolName + '</option>';
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
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].hoverText = this.data[i].awaySchoolName + ' @ ' + this.data[i].homeSchoolName;
        }

        var plotPoints = [{
            type:'scattergeo',
            locationmode: 'USA-states',
            lat: this.data.map(game => game.latitude),
            lon: this.data.map(game => game.longitude),
            text: this.data.map(game => game.hoverText),
            texttemplate: '%{text}<extra></extra>',
            //lon: unpack(rows, 'long'),
            //lat: unpack(rows, 'lat'),
            //hoverinfor:  unpack(rows, 'airport'),
            //text:  unpack(rows, 'airport'),
            mode: 'markers',
            marker: {
                size: 5,
                opacity: 0.8,
                color: '#000000'
            }
            
        }];
    
    
        var layout = {
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



// Initial function calls to instantiate page
const cfb = new GameLocator();
cfb.setWeekDropdown(15);
cfb.filterGames();
























function joinAllData() {
    console.log('Done');
}


