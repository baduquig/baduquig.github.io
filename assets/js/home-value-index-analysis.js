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
    let values = [];
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
} // end parseCSVLine()

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
    callback(result);
} // end readData()

getCSV = (dataFile, callback) => {
    console.log('Making HTTP request for ' + dataFile);
    let xhr = new XMLHttpRequest();
    let data = [];
    const url = 'https://raw.githubusercontent.com/baduquig/real-estate-analysis/main/data/' + dataFile;

    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(dataFile + ' HTTP Request successful');
            console.log('Reading data from ' + dataFile);
            readData(xhr.response, (result) => {
                callback(null, result);
            });
            console.log('Setting data from ' + dataFile + ' to array variable');
        } else {
            callback(xhr.status, xhr.response);
        }
    }
    xhr.send();
} // end getCSV()



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
calculateRegionAverageZVHI = (data, callback) => {
    let averageZVHI = {};    
} // end calculateRegionAverageZVHI()



////////////////////////////////////////////////////////
// Methods to filter data based on selected inputs
////////////////////////////////////////////////////////
setDataset = (radioButtonValue, callback) => {    
    switch (radioButtonValue) {
        case 'three-bed':
            dataSet = threeBed;
            callback(threeBed);
            break;
        case 'four-bed':
            dataSet = fourBed;
            callback(fourBed);
            break;
        case 'rent':
            dataSet = rent;
            callback(rent);
            break;
        default:
            console.log('Error setting tempObject');
            break;
    }
} // end setDataset()

applyFilters = (selectedDataSet, selectedState, selectedCity, selectedZipcode, callback) => {
    let newDataObject = [];
    
    if (selectedZipcode.length > 0) {
        for (let i = 0; i < selectedDataSet.length; i++) {
            if (selectedDataSet[i].RegionName == selectedZipcode) {
                delete hviRecord.Country;
                delete hviRecord.RegionID;
                delete hviRecord.SizeRank;
                delete hviRecord.RegionType;
                delete hviRecord.StateName;
                delete hviRecord.State;
                delete hviRecord.City;
                delete hviRecord.Metro;
                delete hviRecord.CountyName;

                newDataObject.push(selectedDataSet[i]);
            }
        }
    } else if (selectedCity.length > 0) {
        for (let i = 0; i < selectedDataSet.length; i++) {
            if ((selectedDataSet[i].State == selectedState) && (selectedDataSet[i].City == selectedCity)) {
                delete hviRecord.Country;
                delete hviRecord.RegionID;
                delete hviRecord.SizeRank;
                delete hviRecord.RegionName;
                delete hviRecord.RegionType;
                delete hviRecord.StateName;
                delete hviRecord.State;
                delete hviRecord.Metro;
                delete hviRecord.CountyName;

                newDataObject.push(selectedDataSet[i]);
            }
        }
    } else if (selectedState.length > 0) {
        for (let i = 0; i < selectedDataSet.length; i++) {
            console.log(selectedDataSet[i]['State']);
            if (selectedDataSet[i]['State'] == selectedState) {
                delete selectedDataSet[i].Country;
                delete selectedDataSet[i].RegionID;
                delete selectedDataSet[i].SizeRank;
                delete selectedDataSet[i].RegionName;
                delete selectedDataSet[i].RegionType;
                delete selectedDataSet[i].StateName;
                delete selectedDataSet[i].City;
                delete selectedDataSet[i].Metro;
                delete selectedDataSet[i].CountyName;

                newDataObject.push(selectedDataSet[i]);
            } 
        }
    } else {
        for (let i = 0; i < selectedDataSet.length; i++) {
            delete selectedDataSet[i].RegionID;
            delete selectedDataSet[i].SizeRank;
            delete selectedDataSet[i].RegionName;
            delete selectedDataSet[i].RegionType;
            delete selectedDataSet[i].StateName;
            delete selectedDataSet[i].State;
            delete selectedDataSet[i].City;
            delete selectedDataSet[i].Metro;
            delete selectedDataSet[i].CountyName;
        }
        
        newDataObject = selectedDataSet;
    }

    callback(newDataObject);
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

        setDataset(currentRadioButton.value, (newDataSet) => {
            applyFilters(newDataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
                filteredData = data;
            });
        });
    });
});

stateDropdown.addEventListener('change', function() {
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    updateCities(dataSet, stateDropdown.value);
    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
    });
});

cityDropdown.addEventListener('change', function() {
    zipcodeDropdown.value = null;

    updateZipcodes(dataSet, stateDropdown.value, cityDropdown.value);
    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
    });
});

clearState.addEventListener('click', function() {
    stateDropdown.value = null;
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
    });
});

clearCity.addEventListener('click', function() {
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
    });
});

clearZipcode.addEventListener('click', function() {
    zipcodeDropdown.value = null;

    applyFilters(dataSet, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
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
    if (err === null) {
        threeBed = data;
    } else {
        console.log(err);
    }
});

getCSV('zvhi_4bed.csv', (err, data) => {
    if (err === null) {
        fourBed = data;
    } else {
        console.log(err);
    }
});

getCSV('rent.csv', (err, data) => {
    if (err === null) {
        rent = data;
    } else {
        console.log(err);
    }
});
