

const jsonFileURL = 'https://raw.githubusercontent.com/baduquig/pickem-etl/main/pickem_data/all_schedule.json';
const weekSelect = document.getElementById('week-select');
const cfbCheckbox = document.getElementById('cfb-league-checkbox');
const nflCheckbox = document.getElementById('nfl-league-checkbox');
const mlbCheckbox = document.getElementById('mlb-league-checkbox');
const nbaCheckbox = document.getElementById('nba-league-checkbox');

let allData;
let leaguesChecked = [];

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

function updateLeaguesCheckedArray(checkbox, callback) {
	console.log('Updating leagesChecked array...');
	let league = checkbox.value;
	if (checkbox.checked) {
		leaguesChecked.push(league);
	} else {
		leaguesChecked.splice(leaguesChecked.indexOf(league));
	}
	console.log('leaguesChecked array updated!')
	callback();
}

function setFilteredSchedule(callback) {
	let weekValue = weekSelect.value;
	if ((weekValue !== null || weekValue !== '') && (leaguesChecked.length > 0)) {
		console.log('Filtering schedule data...');
		let filteredSchedule = [];

		for (i = 0; i < allData.length; i++) {
			let gameRow = allData[i]
			let nextWeekNumber = parseInt(weekValue) + 1;
			let weekStart = seasonWeeks[weekValue];
			let weekEnd = seasonWeeks[nextWeekNumber];
			let gameDate = new Date(gameRow.game_date);

			if ((weekStart <= gameDate && gameDate < weekEnd) && leaguesChecked.includes(gameRow.game_date)) {
				keys = Object.keys(gameRow);
				for (j = 0; j < gameRow.length; j++) {
					copiedGameRow[keys[j]] = gameRow[j];
				}
			}

			filteredSchedule.push(copiedGameRow);
		}
		
		/*filteredSchedule = allData.filter(gameRow => {
			let nextWeekNumber = parseInt(weekValue) + 1;
			let weekStart = seasonWeeks[weekValue];
			let weekEnd = seasonWeeks[nextWeekNumber];
			let gameDate = new Date(gameRow.game_date);

			return ( (weekStart <= gameDate && gameDate < weekEnd)
					&& leaguesChecked.includes(gameRow.league) )
		});*/

		console.log('Schedule data filtered!');
	}
	console.log(filteredSchedule);
	callback();
}

function renderScatterPlot() {
	const fontSize = (document.getElementById('map').offsetWidth) * .05;
	const markerSize = (document.getElementById('map').offsetWidth) * .005;

	console.log('Rendering schedule plot...');

	var plotPoints = [{
		type:'scattergeo',
		locationmode: 'USA-states',
		lat: filteredSchedule.map(game => game.latitude),
		lon: filteredSchedule.map(game => game.longitude),
		text: filteredSchedule.map(game => [game.away_team_name + ' @ ' + game.home_team_name + '<br>' + game.game_date + '<br>' + game.stadium + ', ' + game.city + ', ' + game.state]),
		textfont: {
			size: fontSize
		},
		textposition: 'middle center',
		hovertemplate: '%{text}',
		mode: 'markers',
		marker: {
			color: '#000000',
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
		}
	};

	Plotly.newPlot('map', plotPoints, layout, {showLink: false});
	console.log('Rendered schedule plot!');
}

function refilter(checkbox) {
	console.log('here');
	if (weekSelect.value != '') {
		if (checkbox !== 0) {
			updateLeaguesCheckedArray(checkbox, setFilteredSchedule(renderScatterPlot));
		} else {
			setFilteredSchedule(renderScatterPlot);
		}
	}
}
/*
weekSelect.addEventListener('change', refilter(0));
cfbCheckbox.addEventListener('change', refilter(cfbCheckbox));
nflCheckbox.addEventListener('change', refilter(nflCheckbox));
mlbCheckbox.addEventListener('change', refilter(mlbCheckbox));
nbaCheckbox.addEventListener('change', refilter(nbaCheckbox));
*/

fetchJSON().then(data => {
	allData = data;
});