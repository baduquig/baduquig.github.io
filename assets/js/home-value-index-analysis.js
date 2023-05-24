let threeBed = {};
let fourBed = {};
let rent = {};
const states = ['NJ', 'TX', 'NY', 'CA', 'IL', 'GA', 'TN', 'WA', 'OK', 'NC', 'AZ', 'VA', 'NM', 'HI', 'FL', 'KS', 'MO', 
                    'IN', 'PA', 'CO', 'NV', 'UT', 'OH', 'MD', 'OR', 'DC', 'ID', 'MA', 'MI', 'SC', 'KY', 'CT', 'DE', 'LA', 
                    'MN', 'WI', 'MT', 'MS', 'AL', 'AR','ND', 'SD', 'RI', 'NE', 'ME', 'IA', 'WV', 'AK', 'NH', 'VT', 'WY'];

const stateDropdown = document.getElementById('state');
const cityDropdown = document.getElementById('city');
const zipcodeDropdown = document.getElementById('zipcode');
const clearState = document.getElementById('clear-state');
const clearCity = document.getElementById('clear-city');
const clearZipcode = document.getElementById('clear-zipcode');

parseCSVLine = (line) => {
    const values = [];
    let currentValue = '';
    let withinQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            withinQuotes = !withinQuotes;
        } else if (char === ',' && !withinQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue.trim());
    return values;
} // end parseCSVLine

readData = (data, callback) => {
        const lines = data.split('\n'); 
        const headers = lines[0].split(',');
        let result = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);

            if (values.length === headers.length) {
                const obj = {};

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = values[j];
                }
                result.push(obj);
            }
        }
        
        callback(null, result);
} // end readData()

getCSV = (dataFile, callback) => {
    console.log('Retrieving ' + dataFile);
    let xhr = new XMLHttpRequest();
    const url = 'https://raw.githubusercontent.com/baduquig/real-estate-analysis/main/data/' + dataFile;
    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = () => {
        if (xhr.status === 200) {
            callback(null, xhr.response);
        } else {
            callback(xhr.status, xhr.response);
        }
    }
    xhr.send();
    console.log('Finished Retrieving ' + dataFile);
} // end async function readData()

setStates = (statesArray) => {
    let stateOptions = '<option value="" disabled>Select a State...</option>';
    
    statesArray.sort().forEach(state => {
        stateOptions += '<option value="' + state + '">' + state + '</option>';
    });
    document.getElementById('state-list').innerHTML = stateOptions;
    console.log('State Dropdown options set...');
} // end setStates()

updateCities = (selectedState) => {
    console.log('updateCities started...');
    let cities = [];
    let cityOptions = '<option selected value></option>';

    for (i=0; i < threeBed.length; i++) {
        const currentState = threeBed[i].State;
        const currentCity = threeBed[i].City;

        if ((currentState == selectedState) && (!cities.includes(currentCity))) {
            cities.push(currentCity);
            cityOptions += '<option value="' + currentCity + '">' + currentCity + '</option>';
        }
    }
    document.getElementById('city-list').innerHTML = cityOptions;
    console.log('updateCities completed...');
} // end setCities()

updateZipcodes = (selectedState, selectedCity) => {
    console.log('updateZipcodes started...');
    let zipcodes = [];
    let zipcodeOptions = '<option selected value></option>';

    for (i=0; i < threeBed.length; i++) {
        const currentState = threeBed[i].State;
        const currentCity = threeBed[i].City;
        const currentZipcode = threeBed[i].RegionName;

        if ((currentState == selectedState) && (currentCity == selectedCity) && (!zipcodes.includes(currentZipcode))) {
            zipcodes.push(currentZipcode);
            zipcodeOptions += '<option value="' + currentZipcode + '">' + currentZipcode + '</option>';
        }
    }
    document.getElementById('zipcode-list').innerHTML = zipcodeOptions;
    console.log('updateZipcodes completed...');
} // end updateZipcodes()


// Instantiate threeBed object
getCSV('zvhi_3bed.csv', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        readData(data, (err, obj) => {
            if (err !== null) {
                console.log(err);
            } else {
                threeBed = obj;                        
            }
        });
    }
});

// Instantiate fourBed object
getCSV('zvhi_4bed.csv', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        readData(data, (err, obj) => {
            if (err !== null) {
                console.log(err);
            } else {
                fourBed = obj;                        
            }
        });
    }
});

// Instantiate rent object
getCSV('rent.csv', (err, data) => {
    if (err !== null) {
        console.log(err);
    } else {
        readData(data, (err, obj) => {
            if (err !== null) {
                console.log(err);
            } else {
                rent = obj;                        
            }
        });
    }
});


// onchange event listeners
stateDropdown.addEventListener('change', function() {
    console.log('State dropdown event listener called');
    cityDropdown.value = null;
    zipcodeDropdown.value = null;
    updateCities(stateDropdown.value);
});

cityDropdown.addEventListener('change', function() {
    console.log('City dropdown event listener called');
    zipcodeDropdown.value = null;
    updateZipcodes(stateDropdown.value, cityDropdown.value);
});

clearState.addEventListener('click', function() {
    stateDropdown.value = null;
    cityDropdown.value = null;
    zipcodeDropdown.value = null;
});

clearCity.addEventListener('click', function() {
    cityDropdown.value = null;
    zipcodeDropdown.value = null;
});

clearZipcode.addEventListener('click', function() {
    zipcodeDropdown.value = null;
});


setStates(states);