
class cfbGameLocator {
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
            const conferenceID = conferences[i].conferenceID;
            const conferenceName = conferences[i].conferenceName;

            if (!conferenceArray.includes(conferenceName)) {
                conferenceArray.push(conferenceName);
                conferenceOptions += '<option value="' + conferenceID + '">' + conferenceName + '</option>';
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
} // End cfbGameLocator class


class filterAllData extends cfbGameLocator {
    constructor() {
        super();
        this.filteredData = {};
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
                return (game.week == selectedWeek)
            });
            this.allData = this.schoolsData.filter(school => {
                return (school.conferenceID == selectedConference)
            })
        } else if (selectedDay == null || selectedDay == '') {
            console.log('HERE 4');
            this.filteredData = this.allData.filter(game => {
                return (game.week == selectedWeek)
            });
            this.filteredData = this.schoolsData.filter(school => {
                return ((school.conferenceID == selectedConference) 
                        && ((school.awaySchool == selectedSchool) || (school.homeSchool == selectedSchool)))
            });
        } else if (selectedSchool == null || selectedSchool == '') {
            console.log('HERE 5');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
            this.filteredData = this.schoolsData.filter(school => {
                return (school.conferenceID == selectedConference)
            });
        } else {
            console.log('HERE 6');
            this.filteredData = this.allData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
            this.filteredData = this.schoolsData.filter(school => {
                return((school.conferenceID == selectedConference) 
                       && ((school.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool)))
            });
        }
    } // end applySelectedFilters() method

    filterGames() {
        console.log('HERE');
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



// Initial function calls to instantiate page
const cfb = new cfbGameLocator();
cfb.setWeekDropdown(15);

// Instantiate filterAllData object
fltr = new filterAllData();
fltr.filterGames();
























function joinAllData() {
    console.log('Done');
}


