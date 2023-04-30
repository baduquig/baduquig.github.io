
fetch('https://raw.githubusercontent.com/baduquig/espn-college-football-schedule-data-wrangling/main/data/games.json')
    .then(response => response.json())
    .then(gamesData => {
        console.log('gamesData');
        console.log(gamesData); // do something with the games data
    })
    .catch(error => console.error(error));

fetch('https://raw.githubusercontent.com/baduquig/espn-college-football-schedule-data-wrangling/main/data/schools.json')
    .then(response => response.json())
    .then(schoolsData => {
        console.log('schoolsData');
        console.log(schoolsData); // do something with the games data
    })
    .catch(error => console.error(error));
    
fetch('https://raw.githubusercontent.com/baduquig/espn-college-football-schedule-data-wrangling/main/data/conferences.json')
    .then(response => response.json())
    .then(conferencesData => {
        console.log('conferencesData');
        console.log(conferencesData); // do something with the games data
    })
    .catch(error => console.error(error));
