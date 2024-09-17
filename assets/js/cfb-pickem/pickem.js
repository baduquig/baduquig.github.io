const userID = sessionStorage.getItem('userid');
const savePicksButton = document.getElementById('save-picks');
const serverGetEndpoint = 'https://gbaduqui.pythonanywhere.com/all-picks';
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

function showTooltip(cellID) {
    document.getElementById(cellID).style.display = 'block';
}
function closeTooltip(cellID) {
    document.getElementById(cellID).style.display = 'none';
}

function updateDB(updatedPicks) {
    updatedPicks.forEach(pick => {
        let serverPutEndpoint = `https://gbaduqui.pythonanywhere.com/submit-pick?userid=${pick.userID}&gameid=${pick.gameID}&selected=${pick.selectedTeam}`;
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
                alert('Failed to update data for Game ID ', pick.gameID, '. Let the app developer know his system sucks :(');
            });
    });
    alert('Picks saved successfully!');
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
        let pickBorderColor;
        //let gameTimestamp = new Date(`${pick.gameDate} ${pick.gameTime}`);
        //let pickDeadline = new Date(`${pick.gameDate} 9:00 AM`);
        //let gameTimestamp = new Date(`${pick.gameDate}`);
        let pickDeadline = new Date(`${pick.gameDate}`);

        if ((pick.userID == userID) && (today < pickDeadline)) {
            savePicksButton.removeAttribute('hidden');
            // Current User
            if (pick.teamPicked != null) {
                // Pick Submitted
                if (pick.teamPicked == pick.awayTeam) {
                    // Current User / Away Team Picked
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')" checked></td>
                                                        <td class="selection-text"><span id="${pick.gameID}-pick">${pick.awayTeamName}</span></td>
                                                      <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.homeTeam}', '${pick.homeTeamName}')"></td>
                                                 </tr></table>`;
                } else {
                    // Current User / Home Team Picked
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')"></td>
                                                        <td class="selection-text"><span id="${pick.gameID}-pick">${pick.homeTeamName}</span></td>
                                                      <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.homeTeam}', '${pick.homeTeamName}')" checked></td>
                                                 </tr></table>`;
                }

            } else {
                // Current User / No Pick submitted yet
                selectionCellDivInnerHTML = `<table><tr>
                                                <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')"></td>
                                                     <td class="selection-text"><span id="${pick.gameID}-pick"></span></td>
                                                  <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.homeTeam}', '${pick.homeTeamName}')"></td>
                                             </tr></table>`;
                pick.teamPicked = '0';

            }

        } else {
            // Other User
            savePicksButton.setAttribute('hidden', '');
            if (pick.teamPicked != null) {
                // Pick Submitted
                if (pick.teamPicked == pick.awayTeam) {
                    // Other User / Away Team Picked
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')" checked disabled></td>
                                                        <td class="selection-text"><span id="${pick.gameID}-pick">${pick.awayTeamName}</span></td>
                                                    <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.homeTeam}', '${pick.homeTeamName}')" disabled></td>
                                                </tr></table>`;
                } else {
                    // Other User / Home Team Picked
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')" disabled></td>
                                                         <td class="selection-text"><span id="${pick.gameID}-pick">${pick.homeTeamName}</span></td>
                                                      <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.homeTeam}', '${pick.homeTeamName}')" checked disabled></td>
                                                 </tr></table>`;
                }
            } else {
                // Other User / No Pick submitted yet
                selectionCellDivInnerHTML = `<table><tr>
                                                <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')" disabled></td>
                                                     <td class="selection-text"><span id="${pick.gameID}-pick"></span></td>
                                                  <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.homeTeam}', '${pick.homeTeamName}')" disabled></td>
                                             </tr></table>`;
                pick.teamPicked = '0';

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

        if (today <= pickDeadline) {
            pickBorderColor = '#474642';
        }
        else if (((pick.teamPicked == pick.homeTeam) && (Number(pick.homeTotal) > Number(pick.awayTotal))) || ((pick.teamPicked == pick.awayTeam) && (Number(pick.awayTotal) > Number(pick.homeTotal)))) {
            pickBorderColor = '#3cf213';
        }
        else {
            pickBorderColor = '#f21317';
        }
        
        picksBodyInnerHTML = `${picksBodyInnerHTML}        
        <tr>
            <td class="logo away-team-logo">
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
                    <div class="selection-div" id="${pick.gameID}-div" style="accent-color:${colors[pick.teamPicked][1]}; background:${colors[pick.teamPicked][0]}; border: 2px solid ${pickBorderColor}; color:${colors[pick.teamPicked][1]};">${selectionCellDivInnerHTML}</div>
                </form>
            </td>
            
            <td class="logo home-team-logo">
                <img src="${pick.homeLogoURL}">
                <span class="tooltip">
                    ${pick.homeTeamName}<br>
                    ${pick.homeTeamMascot}<br>
                    Record: ${homeOverallRecord}<br>
                    (Conference: ${homeConferenceRecord})
                </span>
            </td>

            <td class="info-cell">
                <span class="material-symbols-outlined" onclick="showTooltip('${pick.gameID}-info')">
                    info
                </span>
                <span class="tooltip" id="${pick.gameID}-info" style="display: none;">
                    ${pick.gameDate}<br>
                    ${pick.gameTime}<br><br>
                    ${pick.awayTeamName}<br>
                    ${pick.awayTeamMascot}<br>
                    @<br>
                    ${pick.homeTeamName}<br>
                    ${pick.homeTeamMascot}<br><br>
                    ${pick.stadium}<br>
                    ${pick.city}, ${pick.state}<br><br>
                    <a href="https://www.espn.com/college-football/game/_/gameId/${pick.gameID}/">Game Details</a><br>
                    <span class="material-symbols-outlined" style="padding-top:10px; padding-bottom:10px;" onclick="closeTooltip('${pick.gameID}-info')">
                        cancel
                    </span>
                </span>
            </td>
        </tr>`
    }
    picksBodyInnerHTML = `${picksBodyInnerHTML}</table>`;
    document.getElementById('picks-body').innerHTML = picksBodyInnerHTML;

} // end renderPicks()

function renderLeaderBoard() {
    let leaderBoardInnerHTML = `<span>Week ${document.getElementById('week-select').value} Leaderboard</span><table><tr><td style="font-weight:550; text-align:left;">User</td><td style="font-weight:550;">Correct</td><td style="font-weight:550;">Wrong</td><td style="font-weight:550;">Skipped</td><td style="font-weight:550;">Total Games</td></tr>`;
    let compiledStats = [];

    for (i = 0; i < allPicks.length; i++) {
        let gameDate = new Date(allPicks[i].gameDate);
        let pickCorrect = 'na';
        let userInCompiledStats = compiledStats.find(user => user.username == allPicks[i].username);
        const beginWeekRange = seasonWeeks[document.getElementById('week-select').value];
        const endWeekRange = seasonWeeks[Number(document.getElementById('week-select').value) + 1];
        
        if ((beginWeekRange <= gameDate) && (gameDate < endWeekRange)) {
            if (today > gameDate) {
                if ((allPicks[i].teamPicked == allPicks[i].homeTeam) && (Number(allPicks[i].homeTotal) > Number(allPicks[i].awayTotal))) {
                    pickCorrect = true;
                } else if ((allPicks[i].teamPicked == allPicks[i].awayTeam) && (Number(allPicks[i].awayTotal) > Number(allPicks[i].homeTotal))) {
                    pickCorrect = true;
                } else if (allPicks[i].teamPicked == null) {
                    pickCorrect = 'na';
                } else {
                    pickCorrect = false;
                }
            }
    
            if (userInCompiledStats) {
                if (pickCorrect == 'na') {
                    userInCompiledStats.skipped += 1;
                } else if (pickCorrect) {
                    userInCompiledStats.correct += 1;
                } else {
                    userInCompiledStats.wrong += 1;
                }
                userInCompiledStats.total += 1;
            } else {
                let distinctUser = {};
                distinctUser.username = allPicks[i].username;
                if (pickCorrect == 'na') {
                    distinctUser.correct = 0;
                    distinctUser.wrong = 0;
                    distinctUser.skipped = 1;
                } else if (pickCorrect) {
                    distinctUser.correct = 1;
                    distinctUser.wrong = 0;
                    distinctUser.skipped = 0;
                } else {
                    distinctUser.correct = 0;
                    distinctUser.wrong = 1;
                    distinctUser.skipped = 0;
                }
                distinctUser.total = 1;
                compiledStats.push(distinctUser);
            }
        }
    }
    compiledStats.sort((a, b) => b.correct - a.correct);
    console.log('compiledStats: ', compiledStats);

    for (i = 0; i < compiledStats.length; i++) {
        leaderBoardInnerHTML = `${leaderBoardInnerHTML}<tr><td style="text-align:left">${compiledStats[i].username}</td><td>${compiledStats[i].correct}</td><td>${compiledStats[i].wrong}</td><td>${compiledStats[i].skipped}</td><td>${compiledStats[i].total}</td></tr>`;
    }

    leaderBoardInnerHTML = `${leaderBoardInnerHTML}</table>`;
    document.getElementById('leaderboard-body').innerHTML = leaderBoardInnerHTML;
}

function setSelectedCell(pickedGameID, pickedTeamID, pickedTeamName) {
    document.getElementById(`${pickedGameID}-pick`).innerHTML = `${pickedTeamName}`;
    document.getElementById(`${pickedGameID}-div`).style.backgroundColor = `${colors[pickedTeamID][0]}`;
    document.getElementById(`${pickedGameID}-div`).getElementsByClassName('selection-text')[0].style.color = `${colors[pickedTeamID][1]}`;
    document.getElementById(`${pickedTeamID}`).style.accentColor = `${colors[pickedTeamID][1]}`;
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
        if ((today <= seasonWeeks[i]) && (today > seasonWeeks[i - 1])) {
            return i - 1;
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
            // Instantiate `all
            allPicks = data;
            console.log('HTTP request successful!');

            // Instantiate `currentWeek`
            createWeeksDropdown(setCurrentWeek());

            // Instantiate `users`
            createUsersDropdown(setDistinctUsers());

            // Instantiate `picks`
            renderPicks(filterPicks());

            // Instantiate `leaderboard`
            renderLeaderBoard();
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

document.getElementById('user-select').addEventListener("change", () => {
    const filteredPicks = filterPicks();
    renderPicks(filteredPicks);
});

document.getElementById('week-select').addEventListener("change", () => {
    const filteredPicks = filterPicks();
    renderPicks(filteredPicks);
    renderLeaderBoard();
});

document.getElementById('previous-week').addEventListener("click", () => {
    const currentWeek = document.getElementById('week-select').value;
    const previousWeek = Number(currentWeek) - 1;
    document.getElementById('week-select').value = previousWeek;

    const filteredPicks = filterPicks();
    renderPicks(filteredPicks);
    renderLeaderBoard();
});

document.getElementById('next-week').addEventListener("click", () => {
    const currentWeek = document.getElementById('week-select').value;
    const previousWeek = Number(currentWeek) + 1;
    document.getElementById('week-select').value = previousWeek;
    
    const filteredPicks = filterPicks();
    renderPicks(filteredPicks);
    renderLeaderBoard();
});



const colors = {
    '0': ['#474642', '#474642'],
    '103': ['#98002E', '#BC9B6A'],
    '107': ['#602D89', '#FFFFFF'],
    '113': ['#971B2F', '#B1B3B3'],
    '119': ['#FFBB00', '#3C3C3C'],
    '12': ['#CC0033', '#003366'],
    '120': ['#E03A3E', '#FFD520'],
    '127': ['#18453B', '#FFFFFF'],
    '13': ['#003831', '#FFE395'],
    '130': ['#00274C', '#FFCB05'],
    '135': ['#7A0019', '#FFCC33'],
    '142': ['#000000', '#F1B82D'],
    '145': ['#CE1126', '#14213D'],
    '147': ['#00205B', '#B9975B'],
    '150': ['#003087', '#FFFFFF'],
    '151': ['#592A8A', '#FDC82F'],
    '152': ['#CC0000', '#000000'],
    '153': ['#7BAFD4', '#FFFFFF'],
    '154': ['#9E7E38', '#000000'],
    '155': ['#009A44', '#AAAEAD'],
    '158': ['#E41C38', '#FDF2D9'],
    '16': ['#043927', '#C4B581'],
    '160': ['#041E42', '#BBBCBC'],
    '164': ['#CC0033', '#5F6A72'],
    '166': ['#861F41', '#97999B'],
    '167': ['#BA0C2F', '#A7A8AA'],
    '183': ['#F76900', '#000E54'],
    '189': ['#FE5000', '#4F2C1D'],
    '193': ['#B61E2E', '#000000'],
    '194': ['#BB0000', '#666666'],
    '195': ['#00694E', '#000000'],
    '197': ['#FF7300', '#000000'],
    '2': ['#0C2340', '#E87722'],
    '2000': ['#4F2170', '#FFFFFF'],
    '2005': ['#003087', '#8A8D8F'],
    '2006': ['#041E42', '#A89968'],
    '201': ['#841617', '#FDF9D8'],
    '2010': ['#660000', '#FFFFFF'],
    '2016': ['#CE8E00', '#4B306A'],
    '202': ['#002D72', '#C8102E'],
    '2026': ['#222222', '#FFCC00'],
    '2029': ['#EFA522', '#000000'],
    '2032': ['#CC092F', '#000000'],
    '204': ['#DC4405', '#000000'],
    '2046': ['#C41E3A', '#ADAFAA'],
    '2050': ['#BA0C2F', '#000000'],
    '2065': ['#6F263D', '#F2A900'],
    '2083': ['#E87722', '#003865'],
    '2084': ['#005BBB', '#FFFFFF'],
    '2097': ['#F58025', '#231F20'],
    '21': ['#A6192E', '#000000'],
    '2110': ['#4F2D7F', '#818A8F'],
    '2115': ['#00539B', '#FFFFFF'],
    '2116': ['#BA9B37', '#000000'],
    '2117': ['#6A0032', '#FFC82E'],
    '2127': ['#A8996E', '#002855'],
    '213': ['#041E42', '#FFFFFF'],
    '2132': ['#E00122', '#000000'],
    '2142': ['#821019', '#D2D4D6'],
    '2169': ['#EE3124', '#72CDF4'],
    '218': ['#9D2235', '#C1C6C8'],
    '2184': ['#041E42', '#BA0C2F'],
    '2193': ['#041E42', '#FFC72C'],
    '2197': ['#919295', '#004B83'],
    '2198': ['#8A0039', '#FFFFFF'],
    '2199': ['#006633', '#000000'],
    '221': ['#003594', '#FFB81C'],
    '2210': ['#73000A', '#B59A57'],
    '222': ['#00205B', '#13B5EA'],
    '2226': ['#003366', '#CC0000'],
    '2229': ['#081E3F', '#B6862C'],
    '2230': ['#860038', '#FFFFFF'],
    '2241': ['#BF2F37', '#FFFFFF'],
    '2247': ['#0039A6', '#FFFFFF'],
    '227': ['#68ABE8', '#002147'],
    '2277': ['#273A80', '#C64027'],
    '228': ['#F56600', '#522D80'],
    '2287': ['#CE1126', '#F9DD16'],
    '2294': ['#FFCD00', '#000000'],
    '2296': ['#002147', '#FFFFFF'],
    '23': ['#0055A2', '#E5A823'],
    '2305': ['#0051BA', '#E8000D'],
    '2306': ['#512888', '#D1D1D1'],
    '2309': ['#002664', '#EAAB00'],
    '231': ['#582C83', '#A7A8AA'],
    '2320': ['#DC0032', '#FFFFFF'],
    '2329': ['#653600', '#CFAB7A'],
    '233': ['#AD0000', '#B4B4B4'],
    '2335': ['#002D62', '#C41230'],
    '2341': ['#69B3E7', '#FFC72C'],
    '2348': ['#002F8B', '#E31B23'],
    '235': ['#003087', '#898D8D'],
    '236': ['#00386B', '#E0AA0F'],
    '2377': ['#00529B', '#FFD204'],
    '238': ['#000000', '#866D4B'],
    '2382': ['#F76800', '#000000'],
    '239': ['#154734', '#FFB81C'],
    '2390': ['#F47321', '#005030'],
    '2393': ['#0066CC', '#000000'],
    '24': ['#8C1515', '#FFFFFF'],
    '2405': ['#041E42', '#FFFFFF'],
    '2415': ['#1B4383', '#F47937'],
    '242': ['#00205B', '#C1C6C8'],
    '2426': ['#00205B', '#C5B783'],
    '2428': ['#880023', '#8E9093'],
    '2429': ['#046A38', '#B9975B'],
    '2433': ['#840029', '#FDB913'],
    '2439': ['#CF0A2C', '#CAC8C8'],
    '2440': ['#003366', '#807F84'],
    '2447': ['#AE132A', '#72808A'],
    '2448': ['#F3B237', '#003D6D'],
    '2449': ['#0A5640', '#FFC72A'],
    '245': ['#500000', '#FFFFFF'],
    '2450': ['#007A53', '#F3D03E'],
    '2453': ['#46166B', '#DB9F11'],
    '2458': ['#013C65', '#F6B000'],
    '2459': ['#BA0C2F', '#000000'],
    '2460': ['#4B116F', '#FFCC00'],
    '2464': ['#003466', '#FFD200'],
    '2466': ['#663399', '#FF6600'],
    '248': ['#C8102E', '#000000'],
    '2483': ['#154733', '#FEE123'],
    '249': ['#00853E', '#000000'],
    '25': ['#003262', '#FDB515'],
    '2502': ['#154734', '#FFFFFF'],
    '2504': ['#330066', '#FFCC33'],
    '2509': ['#CEB888', '#000000'],
    '251': ['#BF5700', '#FFFFFF'],
    '252': ['#0062B8', '#FFFFFF'],
    '2523': ['#14234B', '#A6192E'],
    '253': ['#C41425', '#FFFFFF'],
    '2534': ['#FE5100', '#FFFFFF'],
    '2535': ['#002649', '#FFFFFF'],
    '254': ['#CC0000', '#FFFFFF'],
    '2545': ['#006341', '#EAAA00'],
    '2546': ['#000000', '#C8102E'],
    '256': ['#450084', '#CBB677'],
    '2567': ['#0033A0', '#C8102E'],
    '2569': ['#862633', '#001A72'],
    '257': ['#000066', '#990000'],
    '2571': ['#0033A0', '#FFD100'],
    '2572': ['#000000', '#FFD046'],
    '2579': ['#73000A', '#000000'],
    '258': ['#232D4B', '#E57200'],
    '259': ['#630031', 'E5751F'],
    '2598': ['#8E908F', '#BD1F25'],
    '26': ['#2774AE', '#FFD100'],
    '2617': ['#613393', '#FFFFFF'],
    '2619': ['#990000', '#16243E'],
    '2623': ['#5E0009', '#FFFFFF'],
    '2627': ['#4F2D7F', '#FFFFFF'],
    '2628': ['#4D1979', '#FFFFFF'],
    '2630': ['#F79728', '#002A5B'],
    '2633': ['#FF8200', '#FFFFFF'],
    '2635': ['#4F2984', '#FFDD00'],
    '2636': ['#F15A22', '#0C2340'],
    '2638': ['#FF8200', '#041E42'],
    '264': ['#4B2E83', '#B7A57A'],
    '2640': ['#7C183E', '#9DA6AB'],
    '2641': ['#CC0000', '#000000'],
    '2643': ['#7badd3', '#002856'],
    '2649': ['#15397F', '#FFDA00'],
    '265': ['#981E32', '#5E6A71'],
    '2653': ['#8A2432', '#B3B5B8'],
    '2655': ['#285C4D', '#71C5E8'],
    '2678': ['#A71F23', '#FFD520'],
    '2681': ['#00483A', '#B9BBBD'],
    '2692': ['#4B2682', '#A1A1A4'],
    '2710': ['#663399', '#FFCC00'],
    '2711': ['#6C4023', '#B5A167'],
    '2717': ['#592C88', '#C1A875'],
    '2729': ['#115740', '#F0B323'],
    '2747': ['#C7B37F', '#000000'],
    '275': ['#C5050C', '#FFFFFF'],
    '2751': ['#FFC425', '#492F24'],
    '2754': ['#C8102E', '#F3D54E'],
    '2755': ['#000000', '#EAA921'],
    '276': ['#006140', '#FFFFFF'],
    '277': ['#002855', '#EAAA00'],
    '2771': ['#003768', '#FDB813'],
    '278': ['#DB0032', '#002E6D'],
    '2815': ['#B5A36A', '#000000'],
    '282': ['#0142BC', '#FFFFFF'],
    '2837': ['#00386C', '#F1B20F'],
    '290': ['#011E41', '#A3AAAE'],
    '295': ['#92C1E9', '#003057'],
    '30': ['#990000', '#FFCC00'],
    '302': ['#002855', '#B3A369'],
    '304': ['#FF671F', '#000000'],
    '309': ['#CE181E', '#0A0203'],
    '3101': ['#BA1C21', '#003058'],
    '311': ['#003263', '#B0D7FF'],
    '322': ['#A8996E', '#98002E'],
    '324': ['#006F71', '#FFFFFF'],
    '326': ['#501214', '#8D734A'],
    '328': ['#00263A', '#FFFFFF'],
    '331': ['#006633', '#FFFFFF'],
    '333': ['#9E1B32', '#FFFFFF'],
    '338': ['#FDBB30', '#000000'],
    '344': ['#660000', '#FFFFFF'],
    '349': ['#D4BF91', '#000000'],
    '356': ['#FF5F05', '#13294B'],
    '36': ['#1E4D2B', '#C8C372'],
    '38': ['#CFB87C', '#000000'],
    '399': ['#461660', '#EEB211'],
    '41': ['#000E2F', '#FFFFFF'],
    '47': ['#003A63', '#6A808C'],
    '5': ['#006341', '#CC8A00'],
    '50': ['#EE7624', '#1B5633'],
    '52': ['#782F40', '#CEB888'],
    '55': ['#CC0000', '#FFFFFF'],
    '57': ['#0021A5', '#FA4616'],
    '58': ['#006747', '#CFC493'],
    '59': ['#B3A369', '#003057'],
    '6': ['#BF0D3E', '#00205B'],
    '61': ['#000000', '#BA0C2F'],
    '62': ['#024731', '#000000'],
    '66': ['#C8102E', '#F1BE48'],
    '68': ['#0033A0', '#D64309'],
    '70': ['#EAAB00', '#000000'],
    '77': ['#4E2A84', '#FFFFFF'],
    '79': ['#720000', '#FFFFFF'],
    '8': ['#9D2235', '#FFFFFF'],
    '84': ['#990000', '#EEEDEB'],
    '87': ['#00843D', '#C99700'],
    '9': ['#8C1D40', '#FFC627'],
    '93': ['#ECAC00', '#002144'],
    '96': ['#0033A0', '#000000'],
    '97': ['#AD0000', '#000000'],
    '98': ['#B01E24', '#A2A4A3'],
    '99': ['#461D7C', '#FDD023']
};