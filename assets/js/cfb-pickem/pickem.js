const serverEndpoint = 'http://127.0.0.1:5000/all-picks';
const seasonWeeks = {
    0: new Date('August 20, 2024'),
    1: new Date('August 27, 2024'),
    2: new Date('September 3, 2024'),
    3: new Date('September 10, 2024'),
    4: new Date('September 17, 2024'),
    5: new Date('September 24, 2024'),
    6: new Date('October 1, 2024'),
    7: new Date('October 8, 2024'),
    8: new Date('October 15, 2024'),
    9: new Date('October 22, 2024'),
    10: new Date('October 29, 2024'),
    11: new Date('November 5, 2024'),
    12: new Date('November 12, 2024'),
    13: new Date('November 19, 2024'),
    14: new Date('November 26, 2024'),
    15: new Date('December 3, 2024'),
    16: new Date('December 10, 2024'),
    17: new Date('December 17, 2024'),
    18: new Date('December 24, 2024')
}
let allPicks = [];
let currentWeek;

function createUsersDropdown(distinctUsersArray) {
    let usersSelectInnerHTML = '';
    for (i = 0; i < distinctUsersArray.length; i++) {
        usersSelectInnerHTML = `${usersSelectInnerHTML}<option value=${distinctUsersArray[i]}>${distinctUsersArray[i]}</option>`
    }
    document.getElementById('user-select').innerHTML = usersSelectInnerHTML;
}

function setDistinctUsers() {
    let distinctUsers = [];

    for (i = 0; i < allPicks.length; i++) {
        if (!distinctUsers.includes(allPicks[i].username)) {
            distinctUsers.push(allPicks[i].username);
        }
    }
    return distinctUsers;
}

function createWeeksDropdown() {
    let weekSelectInnerHTML = '';
    for (i = 0; i <= Object.keys(seasonWeeks).length; i++) {
        if (i == currentWeek) {
            weekSelectInnerHTML = `${weekSelectInnerHTML}<option value=${i} selected>Week ${i} Picks</option>`
        } else {
            weekSelectInnerHTML = `${weekSelectInnerHTML}<option value=${i}>Week ${i} Picks</option>`;
        }
    }
    document.getElementById('week-select').innerHTML = weekSelectInnerHTML;
}

function setCurrentWeek() {
    const today = new Date();
    
    for (i = 0; i <= Object.keys(seasonWeeks).length; i++) {
        console.log('Current week: ', i);
        if (today <= seasonWeeks[i]) {
            return i;
        }
    }
    return 14;
}

fetch(serverEndpoint)
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // Instantiate `allData`
        allPicks = data;
        console.log('HTTP request successful!');

        // Instantiate `currentWeek`
        createWeeksDropdown(setCurrentWeek());

        // Instantiate `users`
        createUsersDropdown(setDistinctUsers());
    })
    .catch(error => {
        console.error('Error: ', error);
    });

    