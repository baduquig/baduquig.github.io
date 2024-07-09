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
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')" checked></td>
                                                        <td class="selection-text"><span id="${pick.gameID}-pick">${pick.awayTeamName}</span></td>
                                                      <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'"></td>
                                                 </tr></table>`;
                } else {
                    // Current User / Home Team Picked
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'"></td>
                                                        <td class="selection-text"><span id="${pick.gameID}-pick">${pick.homeTeamName}</span></td>
                                                      <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" checked></td>
                                                 </tr></table>`;
                }

            } else {
                // Current User / No Pick submitted yet
                selectionCellDivInnerHTML = `<table><tr>
                                                <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="setSelectedCell(${pick.gameID}, '${pick.awayTeam}', '${pick.awayTeamName}')"></td>
                                                     <td class="selection-text"><span id="${pick.gameID}-pick"></span></td>
                                                  <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'"></td>
                                             </tr></table>`;

            }

        } else {
            // Other User
            savePicksButton.setAttribute('hidden', '');
            if (pick.teamPicked != null) {
                // Pick Submitted
                if (pick.teamPicked == pick.awayTeam) {
                    // Other User / Away Team Picked                    
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" checked disabled></td>
                                                        <td class="selection-text"><span id="${pick.gameID}-pick">${pick.awayTeamName}</span></td>
                                                    <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" disabled></td>
                                                </tr></table>`;
                } else {
                    // Other User / Home Team Picked
                    selectionCellDivInnerHTML = `<table><tr>
                                                    <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" disabled></td>
                                                         <td class="selection-text"><span id="${pick.gameID}-pick">${pick.homeTeamName}</span></td>
                                                      <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" checked disabled></td>
                                                 </tr></table>`;
                }
            } else {
                // Other User / No Pick submitted yet
                selectionCellDivInnerHTML = `<table><tr>
                                                <td class="away-radio"><input type="radio" id="${pick.awayTeam}" name="${pick.gameID}" value="${pick.awayTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.awayTeamName}'" disabled></td>
                                                     <td class="selection-text"><span id="${pick.gameID}-pick"></span></td>
                                                  <td class="home-radio"><input type="radio" id="${pick.homeTeam}" name="${pick.gameID}" value="${pick.homeTeam}" onclick="document.getElementById('${pick.gameID}-pick').innerHTML = '${pick.homeTeamName}'" disabled></td>
                                             </tr></table>`;
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
                    <div id="${pick.gameID}-div">${selectionCellDivInnerHTML}</div>
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

function setSelectedCell(pickedGameID, pickedTeamID, pickedTeamName) {
    console.log('setting innerhtml');
    document.getElementById(`${pickedGameID}-pick`).innerHTML = `${pickedTeamName}`;
    console.log('background color: ', colors[pickedTeamID][0]);
    document.getElementById(`${pickedGameID}-pick`).style.backgroundColor = `${colors[pickedTeamID][0]}`;
    console.log('text color: ', colors[pickedTeamID][1]);
    document.getElementById(`${pickedGameID}-pick`).style.color = `${colors[pickedTeamID][1]}`;
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



const colors = {
    '103': ['#98002E;', '#BC9B6A;'],
    '107': ['#602D89;', '#FFFFFF;'],
    '113': ['#971B2F;', '#B1B3B3;'],
    '119': ['#FFBB00;', '#3C3C3C;'],
    '12': ['#CC0033;', '#003366;'],
    '120': ['#E03A3E;', '#FFD520;'],
    '127': ['#18453B;', '#FFFFFF;'],
    '13': ['#003831;', '#FFE395;'],
    '130': ['#00274C;', '#FFCB05;'],
    '135': ['#7A0019;', '#FFCC33;'],
    '142': ['#000000;', '#F1B82D;'],
    '145': ['#CE1126;', '#14213D;'],
    '147': ['#00205B;', '#B9975B;'],
    '150': ['#003087;', '#FFFFFF;'],
    '151': ['#592A8A;', '#FDC82F;'],
    '152': ['#CC0000;', '#000000;'],
    '153': ['#7BAFD4;', '#FFFFFF;'],
    '154': ['#9E7E38;', '#000000;'],
    '155': ['#009A44;', '#AAAEAD;'],
    '158': ['#E41C38;', '#FDF2D9;'],
    '16': ['#043927;', '#C4B581;'],
    '160': ['#041E42;', '#BBBCBC;'],
    '164': ['#CC0033;', '#5F6A72;'],
    '166': ['#861F41;', '#97999B;'],
    '167': ['#BA0C2F;', '#A7A8AA;'],
    '183': ['#F76900;', '#000E54;'],
    '189': ['#FE5000;', '#4F2C1D;'],
    '193': ['#B61E2E;', '#000000;'],
    '194': ['#BB0000;', '#666666;'],
    '195': ['#00694E;', '#000000;'],
    '197': ['#FF7300;', '#000000;'],
    '2': ['#0C2340;', '#E87722;'],
    '2000': ['#4F2170;', '#FFFFFF;'],
    '2005': ['#003087;', '#8A8D8F;'],
    '2006': ['#041E42;', '#A89968;'],
    '201': ['#841617;', '#FDF9D8;'],
    '2010': ['#660000;', '#FFFFFF;'],
    '2016': ['#CE8E00;', '#4B306A;'],
    '202': ['#002D72;', '#C8102E;'],
    '2026': ['#222222;', '#FFCC00;'],
    '2029': ['#EFA522;', '#000000;'],
    '2032': ['#CC092F;', '#000000;'],
    '204': ['#DC4405;', '#000000;'],
    '2046': ['#C41E3A;', '#ADAFAA;'],
    '2050': ['#BA0C2F;', '#000000;'],
    '2065': ['#6F263D;', '#F2A900;'],
    '2083': ['#E87722;', '#003865;'],
    '2084': ['#005BBB;', '#FFFFFF;'],
    '2097': ['#F58025;', '#231F20;'],
    '21': ['#A6192E;', '#000000;'],
    '2110': ['#4F2D7F;', '#818A8F;'],
    '2115': ['#00539B;', '#FFFFFF;'],
    '2116': ['#BA9B37;', '#000000;'],
    '2117': ['#6A0032;', '#FFC82E;'],
    '2127': ['#A8996E;', '#002855;'],
    '213': ['#041E42;', '#FFFFFF;'],
    '2132': ['#E00122;', '#000000;'],
    '2142': ['#821019;', '#D2D4D6;'],
    '2169': ['#EE3124;', '#72CDF4;'],
    '218': ['#9D2235;', '#C1C6C8;'],
    '2184': ['#041E42;', '#BA0C2F;'],
    '2193': ['#041E42;', '#FFC72C;'],
    '2197': ['#919295;', '#004B83;'],
    '2198': ['#8A0039;', '#FFFFFF;'],
    '2199': ['#006633;', '#000000;'],
    '221': ['#003594;', '#FFB81C;'],
    '2210': ['#73000A;', '#B59A57;'],
    '222': ['#00205B;', '#13B5EA;'],
    '2226': ['#003366;', '#CC0000;'],
    '2229': ['#081E3F;', '#B6862C;'],
    '2230': ['#860038;', '#FFFFFF;'],
    '2241': ['#BF2F37;', '#FFFFFF;'],
    '2247': ['#0039A6;', '#FFFFFF;'],
    '227': ['#68ABE8;', '#002147;'],
    '2277': ['#273A80;', '#C64027;'],
    '228': ['#F56600;', '#522D80;'],
    '2287': ['#CE1126;', '#F9DD16;'],
    '2294': ['#FFCD00;', '#000000;'],
    '2296': ['#002147;', '#FFFFFF;'],
    '23': ['#0055A2;', '#E5A823;'],
    '2305': ['#0051BA;', '#E8000D;'],
    '2306': ['#512888;', '#D1D1D1;'],
    '2309': ['#002664;', '#EAAB00;'],
    '231': ['#582C83;', '#A7A8AA;'],
    '2320': ['#DC0032;', '#FFFFFF;'],
    '2329': ['#653600;', '#CFAB7A;'],
    '233': ['#AD0000;', '#B4B4B4;'],
    '2335': ['#002D62;', '#C41230;'],
    '2341': ['#69B3E7;', '#FFC72C;'],
    '2348': ['#002F8B;', '#E31B23;'],
    '235': ['#003087;', '#898D8D;'],
    '236': ['#00386B;', '#E0AA0F;'],
    '2377': ['#00529B;', '#FFD204;'],
    '238': ['#000000;', '#866D4B;'],
    '2382': ['#F76800;', '#000000;'],
    '239': ['#154734;', '#FFB81C;'],
    '2390': ['#F47321;', '#005030;'],
    '2393': ['#0066CC;', '#000000;'],
    '24': ['#8C1515;', '#FFFFFF;'],
    '2405': ['#041E42;', '#FFFFFF;'],
    '2415': ['#1B4383;', '#F47937;'],
    '242': ['#;', '#;'],
    '2426': ['#;', '#;'],
    '2428': ['#;', '#;'],
    '2429': ['#;', '#;'],
    '2433': ['#;', '#;'],
    '2439': ['#;', '#;'],
    '2440': ['#;', '#;'],
    '2447': ['#;', '#;'],
    '2448': ['#;', '#;'],
    '2449': ['#;', '#;'],
    '245': ['#;', '#;'],
    '2450': ['#;', '#;'],
    '2453': ['#;', '#;'],
    '2458': ['#;', '#;'],
    '2459': ['#;', '#;'],
    '2460': ['#;', '#;'],
    '2464': ['#;', '#;'],
    '2466': ['#;', '#;'],
    '248': ['#;', '#;'],
    '2483': ['#;', '#;'],
    '249': ['#;', '#;'],
    '25': ['#;', '#;'],
    '2502': ['#;', '#;'],
    '2504': ['#;', '#;'],
    '2509': ['#;', '#;'],
    '251': ['#;', '#;'],
    '252': ['#;', '#;'],
    '2523': ['#;', '#;'],
    '253': ['#;', '#;'],
    '2534': ['#;', '#;'],
    '2535': ['#;', '#;'],
    '254': ['#;', '#;'],
    '2545': ['#;', '#;'],
    '2546': ['#;', '#;'],
    '256': ['#;', '#;'],
    '2567': ['#;', '#;'],
    '2569': ['#;', '#;'],
    '257': ['#;', '#;'],
    '2571': ['#;', '#;'],
    '2572': ['#;', '#;'],
    '2579': ['#;', '#;'],
    '258': ['#;', '#;'],
    '259': ['#;', '#;'],
    '2598': ['#;', '#;'],
    '26': ['#;', '#;'],
    '2617': ['#;', '#;'],
    '2619': ['#;', '#;'],
    '2623': ['#;', '#;'],
    '2627': ['#;', '#;'],
    '2628': ['#;', '#;'],
    '2630': ['#;', '#;'],
    '2633': ['#;', '#;'],
    '2635': ['#;', '#;'],
    '2636': ['#;', '#;'],
    '2638': ['#;', '#;'],
    '264': ['#;', '#;'],
    '2640': ['#;', '#;'],
    '2641': ['#;', '#;'],
    '2643': ['#;', '#;'],
    '2649': ['#;', '#;'],
    '265': ['#;', '#;'],
    '2653': ['#;', '#;'],
    '2655': ['#;', '#;'],
    '2678': ['#;', '#;'],
    '2681': ['#;', '#;'],
    '2692': ['#;', '#;'],
    '2710': ['#;', '#;'],
    '2711': ['#;', '#;'],
    '2717': ['#;', '#;'],
    '2729': ['#;', '#;'],
    '2747': ['#;', '#;'],
    '275': ['#;', '#;'],
    '2751': ['#;', '#;'],
    '2754': ['#;', '#;'],
    '2755': ['#;', '#;'],
    '276': ['#;', '#;'],
    '277': ['#;', '#;'],
    '2771': ['#;', '#;'],
    '278': ['#;', '#;'],
    '2815': ['#;', '#;'],
    '282': ['#;', '#;'],
    '2837': ['#;', '#;'],
    '290': ['#;', '#;'],
    '295': ['#;', '#;'],
    '30': ['#;', '#;'],
    '302': ['#;', '#;'],
    '304': ['#;', '#;'],
    '309': ['#;', '#;'],
    '3101': ['#;', '#;'],
    '311': ['#;', '#;'],
    '322': ['#;', '#;'],
    '324': ['#;', '#;'],
    '326': ['#;', '#;'],
    '328': ['#;', '#;'],
    '331': ['#;', '#;'],
    '333': ['#;', '#;'],
    '338': ['#;', '#;'],
    '344': ['#;', '#;'],
    '349': ['#;', '#;'],
    '356': ['#;', '#;'],
    '36': ['#;', '#;'],
    '38': ['#;', '#;'],
    '399': ['#;', '#;'],
    '41': ['#;', '#;'],
    '47': ['#;', '#;'],
    '5': ['#;', '#;'],
    '50': ['#;', '#;'],
    '52': ['#;', '#;'],
    '55': ['#;', '#;'],
    '57': ['#;', '#;'],
    '58': ['#;', '#;'],
    '59': ['#;', '#;'],
    '6': ['#;', '#;'],
    '61': ['#;', '#;'],
    '62': ['#;', '#;'],
    '66': ['#;', '#;'],
    '68': ['#;', '#;'],
    '70': ['#;', '#;'],
    '77': ['#;', '#;'],
    '79': ['#;', '#;'],
    '8': ['#;', '#;'],
    '84': ['#;', '#;'],
    '87': ['#;', '#;'],
    '9': ['#;', '#;'],
    '93': ['#;', '#;'],
    '96': ['#;', '#;'],
    '97': ['#;', '#;'],
    '98': ['#;', '#;'],
    '99': ['#;', '#;']
};