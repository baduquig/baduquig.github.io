const jsonFileURL = 'https://raw.githubusercontent.com/baduquig/pickem-etl/main/pickem_data/all_schedule.json';
const weekSelect = document.getElementById('week-select');
const cfbCheckbox = document.getElementById('cfb-league-checkbox');
const nflCheckbox = document.getElementById('nfl-league-checkbox');
const mlbCheckbox = document.getElementById('mlb-league-checkbox');
const nbaCheckbox = document.getElementById('nba-league-checkbox');

let allData;
let filteredSchedule = [];
let leaguesChecked = [];
let allLocations = [];

seasonWeeks = {
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

async function fetchJSON() {
	console.log('Fetching data...');
	try {
		const response = await fetch(jsonFileURL);
		if (!response.ok) {
			throw new Error('Error occurred with network response');
		}
		const data = await response.json();
		console.log('Data fetched!');
		return data;
	} catch {
		console.error('Error occurred retrieved data from JSON file: ', error.message);
	}
}

async function fetchTravel(startLatitude, startLongitude, endLatitude, endLongitude) {
	let request = new XMLHttpRequest();
	let orsDirectionsEndpoint = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf624815b3b2ce7e0747dc90221abdc70363e5&start=' + startLatitude + ',' + startLongitude + '&end=' + endLatitude + ',' + endLongitude;
	console.log('Calling OpenRoute Service API...');
	
	request.open('GET', orsDirectionsEndpoint);
	request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
	request.onreadystatechange = function() {
		if (this.readyState === 4) {
			console.log(this.status);
			console.log(this.getAllResponseHeaders());
			console.log(this.responseText);
			let travelData = JSON.parse(this.responseText);
			console.log(travelData);
			let unformattedDistance = travelData.features[0].properties.segments[0].distance;
			let unformattedDuration = travelData.features[0].properties.segments[0].duration;
			let distance = Math.round(unformattedDistance * 0.00062137) + ' miles';
			let hours = Math.floor(unformattedDuration / 3600);
			let minutes = Math.floor((unformattedDuration % 3600) / 60);
			let duration = hours + ' hour(s), ' + minutes + ' minute(s)';

			document.getElementById('driveDistance').innerHTML = distance;
			document.getElementById('driveDuration').innerHTML = duration;
		}
	}
	request.send();
}

function setLocations() {
	console.log('Setting locations options...');
	let locationOptions = '';
	let distinctLocations = [];

	for (i = 0; i < allData.length; i++) {
		if (!distinctLocations.includes(allData[i].location_id)) {
			locationOptions += '<option value="' + allData[i].city + ', ' + allData[i].state + '">' + allData[i].location_id + '</option>';
			distinctLocations.push(allData[i].location_id)
			allLocations.push({
				'locationID': allData[i].location_id,
				'stadium': allData[i].stadium,
				'city': allData[i].city,
				'state': allData[i].state,
				'latitude': allData[i].latitude,
				'longitude': allData[i].longitude
			});
		}
	}

	document.getElementById('start-location-datalist').innerHTML = locationOptions;
	document.getElementById('end-location-datalist').innerHTML = locationOptions;
	console.log('Location options set!');
}

function updateLeaguesCheckedArray(league) {
	console.log('Updating leagesChecked array...');
	if (!leaguesChecked.includes(league)) {
		leaguesChecked.push(league);
	} else {
		leaguesChecked.splice(leaguesChecked.indexOf(league));
	}
	console.log('leaguesChecked array updated!');
	setFilteredSchedule();
}

function setFilteredSchedule() {
	let weekValue = weekSelect.value;
	console.log('Filtering schedule data...');
	if ((weekValue !== null || weekValue !== '') && (leaguesChecked.length > 0)) {
		filteredSchedule = [];

		for (i = 0; i < allData.length; i++) {
			let gameRow = allData[i]
			let nextWeekNumber = parseInt(weekValue) + 1;
			let weekStart = seasonWeeks[weekValue];
			let weekEnd = seasonWeeks[nextWeekNumber];
			let gameDate = new Date(gameRow.game_date);
			let copiedGameRow = {}

			if ((weekStart <= gameDate && gameDate < weekEnd) && leaguesChecked.includes(gameRow.league)) {
				let keys = Object.keys(gameRow);
				for (j = 0; j < keys.length; j++) {
					let key = keys[j];
					copiedGameRow[key] = gameRow[key];					
				}
				filteredSchedule.push(copiedGameRow);
			}
		}
		console.log('Schedule data filtered!');
	}
	renderScatterPlot();
}

function renderScatterPlot() {
	const fontSize = (document.getElementById('map').offsetWidth) * .05;
	const markerSize = (document.getElementById('map').offsetWidth) * .005;
	const leagueColors = {
		'CFB': '#000000',
		'NFL': '#e21c12',
		'MLB': '#1215e2',
		'NBA': '#15e212'
	}

	console.log('Rendering schedule plot...');

	var plotPoints = [{
		type:'scattergeo',
		locationmode: 'USA-states',
		lat: filteredSchedule.map(game => game.latitude),
		lon: filteredSchedule.map(game => game.longitude),
		text: filteredSchedule.map(game => [game.away_team_name + ' @ ' + game.home_team_name + '<br>' + game.game_date + '<br>' + game.game_time + '<br>' + game.stadium + ', ' + game.city + ', ' + game.state]),
		textfont: {
			size: fontSize
		},
		textposition: 'middle center',
		hovertemplate: '%{text}',
		mode: 'markers',
		marker: {
			color: filteredSchedule.map(game => leagueColors[game.league]), 
			size: markerSize, 
			opacity: 0.75
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
		},
		plot_bgcolor: '#ffffff',
		paper_bgcolor: 'rgba(0,0,0,0)'
	};

	document.getElementById('map-title').innerHTML = 'Week Starting Tuesday ' + (seasonWeeks[parseInt(weekSelect.value)].getMonth() + 1) + '/' + seasonWeeks[parseInt(weekSelect.value)].getDate() + '/' + seasonWeeks[parseInt(weekSelect.value)].getFullYear();
	Plotly.newPlot('map', plotPoints, layout, {showLink: false});
	generateGamesTable();
	console.log('Rendered schedule plot!');
}

function generateGamesTable() {
	console.log('Generating games table...');
	let tableHtml = '<table><tr><td>Date</td><td>Time</td><td>Location</td><td>Away</td><td>Home</td></tr>';
	for (i = 0; i < filteredSchedule.length; i++) {
		let gameDay = filteredSchedule[i].game_date;
		let gameTime = filteredSchedule[i].game_time;
		let gameLocation = filteredSchedule[i].city + ', ' + filteredSchedule[i].state;
		let awayLogoURL = filteredSchedule[i].away_team_logo;
		let homeLogoURL = filteredSchedule[i].home_team_logo;
		let awayTeam = filteredSchedule[i].away_team_name;
		let homeTeam = filteredSchedule[i].home_team_name;

		tableHtml += '<tr><td>' + gameDay + '</td><td> ' + gameTime + '</td><td> ' + gameLocation + '</td><td><span><img src="' + awayLogoURL + '" height="100%"> </span><span>&nbsp;&nbsp;' + awayTeam + '</span></td><td><span><img src="' + homeLogoURL + '" height="100%"> </span><span>&nbsp;&nbsp;' + homeTeam + '</span></td></td> </tr>';
	}
	tableHtml += '</table>';
	document.getElementById('table').innerHTML = tableHtml;
	console.log('Games table generated!');
}

function refilter(league) {
	console.log(league);
	if (weekSelect.value != '') {
		if (league !== 0) {
			updateLeaguesCheckedArray(league);
		} else {
			setFilteredSchedule();
		}
	}
}

function calculateTravel() {
	const startLocationValue = document.getElementById('start-location').value;
	const endLocationValue = document.getElementById('end-location').value;
	
	console.log('Calculating travel...');

	if ((startLocationValue !== '') && (endLocationValue !== '')) {
		let startCity = startLocationValue.substring(0, startLocationValue.indexOf(', '));
		let startState = startLocationValue.substring(startLocationValue.indexOf(', ') + 2);
		let endCity = endLocationValue.substring(0, endLocationValue.indexOf(', '));
		let endState = endLocationValue.substring(endLocationValue.indexOf(', ') + 2);
		let startLatitude;
		let startLongitude;
		let endLatitude;
		let endLongitude;
		
		for (i = 0; i < allLocations.length; i++) {
			if ((allLocations[i].city == startCity) && (allLocations[i].state == startState)) {
				startLatitude = allLocations[i].latitude;
				startLongitude = allLocations[i].longitude;
			}
			if ((allLocations[i].city == endCity) && (allLocations[i].state == endState)) {
				endLatitude = allLocations[i].latitude;
				endLongitude = allLocations[i].longitude;
			}
		}
		fetchTravel(startLatitude, startLongitude, endLatitude, endLongitude);
	}
	console.log('Travel Calculated!');
}

fetchJSON().then(data => {
	renderScatterPlot(filteredSchedule);
	allData = data;
	setLocations();
});