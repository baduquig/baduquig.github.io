let threeBed = [];
let fourBed = [];
let rent = [];
let filteredData = [];
let dataSet = [];

const states = ['NJ', 'TX', 'NY', 'CA', 'IL', 'GA', 'TN', 'WA', 'OK', 'NC', 'AZ', 'VA', 'NM', 'HI', 'FL', 'KS', 'MO', 
                    'IN', 'PA', 'CO', 'NV', 'UT', 'OH', 'MD', 'OR', 'DC', 'ID', 'MA', 'MI', 'SC', 'KY', 'CT', 'DE', 'LA', 
                    'MN', 'WI', 'MT', 'MS', 'AL', 'AR','ND', 'SD', 'RI', 'NE', 'ME', 'IA', 'WV', 'AK', 'NH', 'VT', 'WY'];

const dataSourceRadioButtons = document.querySelectorAll('input[name="data-source"]');
const stateDropdown = document.getElementById('state');
const cityDropdown = document.getElementById('city');
const zipcodeDropdown = document.getElementById('zipcode');
const clearState = document.getElementById('clear-state');
const clearCity = document.getElementById('clear-city');
const clearZipcode = document.getElementById('clear-zipcode');


////////////////////////////////////////////////////////
// Data Retrieval Methods
////////////////////////////////////////////////////////
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
            obj['Country'] = 'United States';
            result.push(obj);
        }
    }
    
    callback(null, result);
} // end readData()

getCSV = (dataFile, callback) => {
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
} // end async function readData()

setDataset = (radioButtonValue, callback) => {
    let selectedDataSet = [];
    switch (radioButtonValue) {
        case 'three-bed':
            //selectedDataSet = Array.from(threeBed);
            console.log('here three-bed');
            callback(null, threeBed);
            break;
        case 'four-bed':
            selectedDataSet = Array.from(fourBed);
            callback(null, selectedDataSet);
            break;
        case 'rent':
            selectedDataSet = Array.from(rent);
            callback(null, selectedDataSet);
            break;
        default:
            console.log('Error setting tempObject');
            break;
    }    
}



////////////////////////////////////////////////////////
// Dropdown Options Setters
////////////////////////////////////////////////////////
setStates = (statesArray) => {
    let stateOptions = '<option value="" disabled>Select a State...</option>';
    
    statesArray.sort().forEach(state => {
        stateOptions += '<option value="' + state + '">' + state + '</option>';
    });

    document.getElementById('state-list').innerHTML = stateOptions;
} // end setStates()

updateCities = (selectedDataSet, selectedState) => {
    let cities = [];
    let cityOptions = '<option selected value></option>';

    for (i = 0; i < selectedDataSet.length; i++) {
        const currentState = selectedDataSet[i].State;
        const currentCity = selectedDataSet[i].City;

        if ((currentState == selectedState) && (!cities.includes(currentCity))) {
            cities.push(currentCity);
            cityOptions += '<option value="' + currentCity + '">' + currentCity + '</option>';
        }
    }

    document.getElementById('city-list').innerHTML = cityOptions;
} // end setCities()

updateZipcodes = (selectedDataSet, selectedState, selectedCity) => {
    let zipcodes = [];
    let zipcodeOptions = '<option selected value></option>';

    for (i = 0; i < selectedDataSet.length; i++) {
        const currentState = selectedDataSet[i].State;
        const currentCity = selectedDataSet[i].City;
        const currentZipcode = selectedDataSet[i].RegionName;

        if ((currentState == selectedState) && (currentCity == selectedCity) && (!zipcodes.includes(currentZipcode))) {
            zipcodes.push(currentZipcode);
            zipcodeOptions += '<option value="' + currentZipcode + '">' + currentZipcode + '</option>';
        }
    }

    document.getElementById('zipcode-list').innerHTML = zipcodeOptions;
} // end updateZipcodes()



////////////////////////////////////////////////////////
// Render line graph
////////////////////////////////////////////////////////




////////////////////////////////////////////////////////
// Methods to filter data based on selected inputs
////////////////////////////////////////////////////////
applyFilters = (selectedDataSet, selectedState, selectedCity, selectedZipcode, callback) => {
    console.log(selectedDataSet);
    console.log('Applying filters');
    if (selectedZipcode.length > 0) {
        console.log('Here 1');
        const newDataObject = selectedDataSet.filter(hviRecord => {
            return ((hviRecord.State == selectedState) && (hviRecord.City == selectedCity))
        });
        console.log('filteredData set');
        callback(null, newDataObject);
    } else if (selectedCity.length > 0) {
        console.log('Here 2');
        const newDataObject = selectedDataSet.filter(hviRecord => {
            return ((hviRecord.State == selectedState) && (hviRecord.City == selectedCity))
        });
        console.log('filteredData set');
        callback(null, newDataObject);
    } else if (selectedState.length > 0) {
        console.log('Here 3');
        const newDataObject = selectedDataSet.filter(hviRecord => {
            return (hviRecord.State == selectedState)
        });
        console.log('filteredData set');
        callback(null, newDataObject);
    } else {
        console.log('Here 4');
        const newDataObject = selectedDataSet;
        console.log('filteredData set');
        callback(null, newDataObject);
    }

} // end applyFilters



////////////////////////////////////////////////////////
// Event Listeners
////////////////////////////////////////////////////////
dataSourceRadioButtons.forEach(function(currentRadioButton) {
    currentRadioButton.addEventListener('click', function() {
        stateDropdown.disabled = false;
        cityDropdown.disabled = false;
        zipcodeDropdown.disabled = false;

        stateDropdown.value = null;
        cityDropdown.value = null;
        zipcodeDropdown.value = null;

        setDataset(currentRadioButton.value, (err, data) => {
            if (err == null) {
                dataSet = data;
                console.log('dataSet = ' + dataSet);
            } else {
                console.log(err);
            }
        });
        
        applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (err, data) => {
            if (err === null) {
                filteredData = data;
                console.log('FILTERED DATA SET!!!');
            } else {
                console.log(err);
            }
        });
    });
});

stateDropdown.addEventListener('change', function() {
    console.log('State dropdown event listener called');
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    updateCities(dataSet, stateDropdown.value);
    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (err, data) => {
        if (err === null) {
            filteredData = data;
        } else {
            console.log(err);
        }
    });
});

cityDropdown.addEventListener('change', function() {
    console.log('City dropdown event listener called');
    zipcodeDropdown.value = null;

    updateZipcodes(dataSet, stateDropdown.value, cityDropdown.value);
    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (err, data) => {
        if (err === null) {
            filteredData = data;
        } else {
            console.log(err);
        }
    });
});

clearState.addEventListener('click', function() {
    stateDropdown.value = null;
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (err, data) => {
        if (err === null) {
            filteredData = data;
        } else {
            console.log(err);
        }
    });
});

clearCity.addEventListener('click', function() {
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (err, data) => {
        if (err === null) {
            filteredData = data;
        } else {
            console.log(err);
        }
    });
});

clearZipcode.addEventListener('click', function() {
    zipcodeDropdown.value = null;

    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (err, data) => {
        if (err === null) {
            filteredData = data;
        } else {
            console.log(err);
        }
    });
});



////////////////////////////////////////////////////////
// Initial values
////////////////////////////////////////////////////////
stateDropdown.value = null;
cityDropdown.value = null;
zipcodeDropdown.value = null;

stateDropdown.disabled = true;
cityDropdown.disabled = true;
zipcodeDropdown.disabled = true;

setStates(states);



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