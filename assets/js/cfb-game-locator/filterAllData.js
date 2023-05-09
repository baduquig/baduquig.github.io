
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

