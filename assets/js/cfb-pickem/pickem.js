const userID = sessionStorage.getItem('userid');
const savePicksButton = document.getElementById('save-picks');
const serverGetEndpoint = 'http://127.0.0.1:5000/all-picks';
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
};
const today = new Date();
const utcTime = today.getTime();
const offset = new Date().getTimezoneOffset() * 60000;
const pstOffset = 8 * 60 * 60 * 1000; 
const pstTime = new Date(utcTime - offset + pstOffset);
const pstHours = pstTime.getUTCHours();
const pstMinutes = pstTime.getUTCMinutes();

let allPicks = [];


function updateDB(updatedPicks) {
    updatedPicks.forEach(pick => {
        let serverPutEndpoint = `http://127.0.0.1:5000/submit-pick?userid=${pick.userID}&gameid=${pick.gameID}&selected=${pick.selectedTeam}`;
        console.log('Starting request to ', serverPutEndpoint);
        fetch(serverPutEndpoint)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to update data.');
            });
    });
}

function compilePicks() {
    let radioInputs = document.querySelectorAll('input[type="radio"]');
    let updatedPicks = [];
    console.log('Compiling picks...');
    radioInputs.forEach(radio => {
        if (radio.checked) {
            let gameID = radio.name;
            let selectedTeam = radio.value;
            let pickObject = {
                'userID': userID,
                'gameID': gameID,
                'selectedTeam': selectedTeam
            };
            updatedPicks.push(pickObject);
        }
    });
    console.log(updatedPicks);
    return updatedPicks;
}

function renderPicks(userWeekPicks) {
    let picksBodyInnerHTML = '<table id="picks-table">';

    for (i = 0; i < userWeekPicks.length; i++) {
        let pick = userWeekPicks[i];
        let selectionCellDivInnerHTML;
        let awayOverallRecord;
        let awayConferenceRecord;
        let homeOverallRecord;
        let homeConferenceRecord;
        let gameTimestamp = new Date(`${pick.gameDate} ${pick.gameTime}`);
        let pickDeadline = new Date(`${pick.gameDate} 9:00 AM`);

        if ((pick.userID == userID) || (gameTimestamp <= pickDeadline)) {
            savePicksButton.removeAttribute('hidden');
            // Current User
            if (pick.teamPicked != null) {
                // Pick Submitted
                if (pick.teamPicked == pick.awayTeam) {
                    // Current User / Away Team Picked
                    selectionCellDivInnerHTML = `<input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" checked>
                                                     <span id="${pick.gameID}-pick"></span>
                                                  <input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'">`;
                } else {
                    // Current User / Home Team Picked
                    selectionCellDivInnerHTML = `<input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'">
                                                     <span id="${pick.gameID}-pick"></span>
                                                  <input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" checked>`;
                }

            } else {
                // Current User / No Pick submitted yet
                selectionCellDivInnerHTML = `<input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'">
                                                     <span id="${pick.gameID}-pick"></span>
                                                  <input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'">`;

            }

        } else {
            // Other User
            savePicksButton.setAttribute('hidden', '');
            if (pick.teamPicked != null) {
                // Pick Submitted
                if (pick.teamPicked == pick.awayTeam) {
                    // Other User / Away Team Picked
                    selectionCellDivInnerHTML = `<input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" checked disabled>
                                                     <span id="${pick.gameID}-pick"></span>
                                                  <input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" disabled>`;
                } else {
                    // Other User / Home Team Picked
                    selectionCellDivInnerHTML = `<input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" disabled>
                                                     <span id="${pick.gameID}-pick"></span>
                                                  <input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" checked disabled>`;
                }
            } else {
                // Other User / No Pick submitted yet
                selectionCellDivInnerHTML = `<input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" disabled>
                                                     <span id="${pick.gameID}-pick"></span>
                                                  <input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" disabled>`;
            }
        }

        
        if (pick.awayOverallTies == 0) {
            awayOverallRecord = `${pick.awayOverallWins}-${pick.awayOverallLosses}`;
        } else {
            awayOverallRecord = `${pick.awayOverallWins}-${pick.awayOverallLosses}-${pick.awayOverallTies}`;
        }
        if (pick.awayConferenceTies == 0) {
            awayConferenceRecord = `${pick.awayConferenceWins}-${pick.awayConferenceLosses}`;
        } else {
            awayConferenceRecord = `${pick.awayConferenceWins}-${pick.awayConferenceLosses}-${pick.awayConferenceTies}`;
        }

        if (pick.homeOverallTies == 0) {
            homeOverallRecord = `${pick.homeOverallWins}-${pick.homeOverallLosses}`;
        } else {
            homeOverallRecord = `${pick.homeOverallWins}-${pick.homeOverallLosses}-${pick.homeOverallTies}`;
        }
        if (pick.homeConferenceTies == 0) {
            homeConferenceRecord = `${pick.homeConferenceWins}-${pick.homeConferenceLosses}`;
        } else {
            homeConferenceRecord = `${pick.homeConferenceWins}-${pick.homeConferenceLosses}-${pick.homeConferenceTies}`;
        }

        picksBodyInnerHTML = `${picksBodyInnerHTML}
        <tr>
            <td class="away-team-logo">
                <img src="${pick.awayLogoURL}">
                <span class="tooltip">
                    ${pick.awayTeamName}<br>
                    ${pick.awayTeamMascot}<br>
                    Record: ${awayOverallRecord}<br>
                    (Conference: ${awayConferenceRecord})
                </span>
            </td>

            <td class="selection-cell">
                <form>
                    <div id="${pick.gameID}-div">${selectionCellDivInnerHTML}</div>
                </form>
            </td>
            
            <td class="home-team-logo">
                <img src="${pick.homeLogoURL}">
                <span class="tooltip">
                    ${pick.homeTeamName}<br>
                    ${pick.homeTeamMascot}<br>
                    Record: ${homeOverallRecord}<br>
                    (Conference: ${homeConferenceRecord})
                </span>
            </td>

            <td class="info-cell">
                <span class="material-symbols-outlined">
                    info
                </span>
                <span class="tooltip">
                    ${pick.gameDate}, ${pick.gameTime}<br>
                    ${pick.awayTeamName}<br>
                    ${pick.awayTeamMascot}<br>
                    @<br>
                    ${pick.homeTeamName}<br>
                    ${pick.homeTeamMascot}<br>
                    ${pick.stadium}<br>
                    TV ${pick.tvCoverage}<br>
                    Betting Line: ${pick.bettingLine}<br>
                    Over/Under: ${pick.bettingLineOverUnder}<br>
                    ${pick.awayTeamName} Win %: ${pick.awayWinPercentage}<br>
                    ${pick.homeTeamName} Win %: ${pick.homeWinPercentage}
                </span>
            </td>
        </tr>`
    }
    picksBodyInnerHTML = `${picksBodyInnerHTML}</table>`;
    document.getElementById('picks-body').innerHTML = picksBodyInnerHTML;
}

function filterPicks() {
    const user = document.getElementById('user-select').value;
    const week = document.getElementById('week-select').value;
    const weekStart = seasonWeeks[week];
    const weekEnd = seasonWeeks[(parseInt(week) + 1)];
    console.log(weekStart)
    console.log(weekEnd);
    let filteredPicks = [];

    for (i = 0; i < allPicks.length; i++) {
        let gameDate = new Date(allPicks[i].gameDate);
        
        if ((allPicks[i].username == user) && (weekStart <= gameDate && gameDate < weekEnd)) {
            let keys = Object.keys(allPicks[i]);
            let objectCopy = {}
            for (j = 0; j < keys.length; j++) {
                let key = keys[j];
                objectCopy[key] = allPicks[i][key];
            }
            filteredPicks.push(objectCopy);
        }
    }
    console.log('Filtered all user picks for week ', week);
    console.log(filteredPicks);
    return filteredPicks;
}

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
            if (allPicks[i].userID == userID) {
                distinctUsers.unshift(allPicks[i].username);
            } else {
                distinctUsers.push(allPicks[i].username);
            }
        }
    }
    return distinctUsers;
}

function createWeeksDropdown(currentWeek) {
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
    for (i = 0; i <= Object.keys(seasonWeeks).length; i++) {
        console.log('Current week: ', i);
        if (today <= seasonWeeks[i]) {
            return i;
        }
    }
    return 14;
}

function instantiatePage() {
    fetch(serverGetEndpoint)
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

            // Instantiate `picks`
            renderPicks(filterPicks());
        })
        .catch(error => {
            console.error('Error: ', error);
        });
}

// Instantiate page
instantiatePage()

savePicksButton.addEventListener("click", () => {
    const updatedPicks = compilePicks();
    updateDB(updatedPicks);
});

document.getElementById('user-select').addEventListener("change", () =>{
    const filteredPicks = filterPicks();
    renderPicks(filteredPicks);
});

document.getElementById('week-select').addEventListener("change", () =>{
    const filteredPicks = filterPicks();
    renderPicks(filteredPicks);
});