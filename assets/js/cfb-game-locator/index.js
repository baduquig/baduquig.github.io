
class cfbGameLocator {
    constructor() {
        this.getJSON('allData.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.allDataFile = data;
                console.log(this.allDataFile);
            }
        });

        this.getJSON('games.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.gamesData = data;
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
        
        this.getJSON('locations.json', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.locationsData = data;
            }
        });

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
        this.allData = {};
    }

    // Filter for selected data elements
    applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool) {
        if ((selectedDay == null || selectedDay == '') && (selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
            console.log('Here 1');
            this.allData = this.gamesData.filter(game => {
                return game.week == selectedWeek
            });
        } else if ((selectedConference == null || selectedConference == '') && (selectedSchool == null || selectedSchool == '')) {
            console.log('HERE 2');
            this.allData = this.gamesData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
        } else if ((selectedDay == null || selectedDay == '') && (selectedSchool == null || selectedSchool == '')) {
            console.log('HERE 3');
            this.allData = this.gamesData.filter(game => {
                return (game.week == selectedWeek)
            });
            this.allData = this.schoolsData.filter(school => {
                return (school.conferenceID == selectedConference)
            })
        } else if (selectedDay == null || selectedDay == '') {
            console.log('HERE 4');
            this.allData = this.gamesData.filter(game => {
                return (game.week == selectedWeek)
            });
            this.allData = this.schoolsData.filter(school => {
                return ((school.conferenceID == selectedConference) 
                        && ((school.awaySchool == selectedSchool) || (school.homeSchool == selectedSchool)))
            });
        } else if (selectedSchool == null || selectedSchool == '') {
            console.log('HERE 5');
            this.allData = this.gamesData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
            this.allData = this.schoolsData.filter(school => {
                return (school.conferenceID == selectedConference)
            });
        } else {
            console.log('HERE 6');
            this.allData = this.gamesData.filter(game => {
                return ((game.week == selectedWeek) 
                        && (game.gameDate == selectedDay))
            });
            this.allData = this.schoolsData.filter(school => {
                return((school.conferenceID == selectedConference) 
                       && ((school.awaySchool == selectedSchool) || (game.homeSchool == selectedSchool)))
            });
        }
    } // end applySelectedFilters() method

    joinAllProperties() {
        console.log('Joining all data:');
        for (let x = 0; x < this.allData.length; x++) {
            let awaySchoolJoined = false;
            let homeSchoolJoined = false;
            let awayConferenceJoined = false;
            let homeConferenceJoined = false;
            let locationJoined = false;
            let y = 0;
            
            while ((!awaySchoolJoined) || (!homeSchoolJoined) || (!awayConferenceJoined) || (!homeConferenceJoined) || (!locationJoined)) {
                if (!awaySchoolJoined) {
                    if (y < this.schoolsData.length) {
                        if (this.allData[x].awaySchool == this.schoolsData[y].schoolID) {
                            this.allData[x].awaySchoolName = this.schoolsData[y].name;
                            this.allData[x].awaySchoolMascot = this.schoolsData[y].mascot;
                            this.allData[x].awaySchoolDivisionID = this.schoolsData[y].divisionID;
                            awaySchoolJoined = true;
                        }
                    } else {
                        this.allData[x].awaySchoolName = 'Away School';
                        this.allData[x].awaySchoolMascot = 'Away Mascot';
                        this.allData[x].awaySchoolDivisionID = 0;
                    }
                }
                
                if (!homeSchoolJoined) {
                    if (y < this.schoolsData.length) {
                        if (this.allData[x].homeSchool == this.schoolsData[y].schoolID) {
                            this.allData[x].homeSchoolName = this.schoolsData[y].name;
                            this.allData[x].homeSchoolMascot = this.schoolsData[y].mascot;
                            this.allData[x].homeSchoolDivisionID = this.schoolsData[y].divisionID;
                            homeSchoolJoined = true;
                        }
                    } else {
                        this.allData[x].homeSchoolName = 'Home School';
                        this.allData[x].homeSchoolMascot = 'Home Mascot';
                        this.allData[x].homeSchoolDivisionID = 0;
                    }
                }
                
                if (!awayConferenceJoined) {
                    if (y < this.conferencesData.length) {
                        if (this.allData[x].awayDivisionID == this.conferencesData[y].divisionID) {
                            this.allData[x].awayConferenceID = this.conferencesData[y].conferenceID;
                            this.allData[x].awayConferenceName = this.conferencesData[y].conferenceName;
                            awayConferenceJoined = true;
                        }
                    } else {
                        this.allData[x].awayConferenceID = 0;
                        this.allData[x].awayConferenceName = 'Conference Name';
                    }
                }
                
                if (!homeConferenceJoined) {
                    if (y < this.conferencesData.length) {
                        if (this.allData[x].homeDivisionID == this.conferencesData[y].divisionID) {
                            this.allData[x].homeConferenceID = this.conferencesData[y].conferenceID;
                            this.allData[x].homeConferenceName = this.conferencesData[y].conferenceName;
                            homeConferenceJoined = true;
                        }
                    } else {
                        this.allData[x].homeConferenceID = 0;
                        this.allData[x].homeConferenceName = 'Conference Name';
                    }
                }
                
                if (!locationJoined) {
                    if (y < this.locationsData.length) {
                        if (this.allData[x].locationID == this.locationsData[y].locationID) {
                            this.allData[x].locationName = this.locationsData[y].locationName;
                            this.allData[x].city = this.locationsData[y].city;
                            this.allData[x].state = this.locationsData[y].state;
                            this.allData[x].latitude = this.locationsData[y].latitude;
                            this.allData[x].longitude = this.locationsData[y].longitude;
                            locationJoined = true;
                        }
                    } else {
                        this.allData[x].locationName = 'Location Name';
                        this.allData[x].city = 'City';
                        this.allData[x].state = 'State';
                        this.allData[x].latitude = 0;
                        this.allData[x].longitude = 0;
                    }
                }
                
            }
            y++;
        }
        console.log('this.allData:');
        console.log(this.allData);
    }

    filterGames() {
        console.log('HERE');
        const selectedWeek = this.weekDropdown.value;
        const selectedDay = this.dayDropdown.value;
        const selectedConference = this.conferenceDropdown.value;
        const selectedSchool = this.schoolDropdown.value;

        // Ensure gamesData object is initialized before calling
        const intervalId = setInterval(() => {
            if (this.gamesData) {
                
                // Apply filters
                this.applySelectedFilters(selectedWeek, selectedDay, selectedConference, selectedSchool);

                // Join additional data properties from schoolsData, conferencesData and locationsData objects
                //this.joinAllProperties();

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
        //filterGames();
        
        for (let i = 0; i < this.gamesData.length; i++) {
            const day = this.gamesData[i].gameDate;

            if ((this.gamesData[i].week == weekNum) && (!dayArray.includes(day))) {
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
        //filterGames();
        
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


