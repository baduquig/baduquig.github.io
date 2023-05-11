
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
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        } else if (selectedDay == null || selectedDay == '') {
            console.log('HERE 4');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek)
                        && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        } else if (selectedSchool == null || selectedSchool == '') {
            console.log('HERE 5');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay)
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        } else {
            console.log('HERE 6');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay)
                        && ((game.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool))
                        && ((game.awayConferenceID == selectedConference) || (game.homeConferenceID == selectedConference)))
            });
        }
        console.log('filteredData set');
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
        console.log('Updating day options');
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
        console.log('Finished setting school options');
        this.schoolDropdown.innerHTML = schoolOptions;
    } // end updateSchoolOptions() method

} // end filterAllData class


class ScatterPlot {
    constructor(data) {
        this.data = data;
    }
    
    renderScatterPlot() {
        console.log('Rendering map');
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



// Initial function calls to instantiate page
const cfb = new GameLocator();
