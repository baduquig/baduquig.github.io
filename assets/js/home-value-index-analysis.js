let threeBed = [];
let fourBed = [];
let rent = [];
let filteredData = [];
let currentDataSource = '';

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
            console.log('Set data from ' + dataFile + ' to array variable');
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
    if (radioButtonValue == 'three-bed') {
        callback(threeBed);
    } else if (radioButtonValue == 'four-bed') {
        callback(fourBed);
    } else if (radioButtonValue == 'rent') {
        callback(rent);
    } else {
        console.log('Error setting tempObject');
        callback([]);
    }
} // end setDataset()

applyFilters = (currentDataSource, selectedState, selectedCity, selectedZipcode, callback) => {
    let newDataList = [];
    
    setDataset(currentDataSource, (baseDataSet) => {
        if (selectedZipcode.length > 0) {
            for (let i = 0; i < baseDataSet.length; i++) {
                if (baseDataSet[i].RegionName == selectedZipcode) {
                    let newObject = JSON.parse(JSON.stringify(baseDataSet[i]));

                    delete newObject.Country;
                    delete newObject.RegionID;
                    delete newObject.SizeRank;
                    delete newObject.RegionType;
                    delete newObject.StateName;
                    delete newObject.State;
                    delete newObject.City;
                    delete newObject.Metro;
                    delete newObject.CountyName;
    
                    newDataList.push(newObject);
                }
            }
        } else if (selectedCity.length > 0) {
            for (let i = 0; i < baseDataSet.length; i++) {
                if ((baseDataSet[i].State == selectedState) && (baseDataSet[i].City == selectedCity)) {
                    let newObject = JSON.parse(JSON.stringify(baseDataSet[i]));
                    
                    delete newObject.Country;
                    delete newObject.RegionID;
                    delete newObject.SizeRank;
                    delete newObject.RegionName;
                    delete newObject.RegionType;
                    delete newObject.StateName;
                    delete newObject.State;
                    delete newObject.Metro;
                    delete newObject.CountyName;
    
                    newDataList.push(newObject);
                }
            }
        } else if (selectedState.length > 0) {
            for (let i = 0; i < baseDataSet.length; i++) {
                if (baseDataSet[i].State == selectedState) {
                    let newObject = JSON.parse(JSON.stringify(baseDataSet[i]));

                    delete newObject.Country;
                    delete newObject.RegionID;
                    delete newObject.SizeRank;
                    delete newObject.RegionName;
                    delete newObject.RegionType;
                    delete newObject.StateName;
                    delete newObject.City;
                    delete newObject.Metro;
                    delete newObject.CountyName;
    
                    newDataList.push(newObject);
                } 
            }
        } else {
            for (let i = 0; i < baseDataSet.length; i++) {
                let newObject = JSON.parse(JSON.stringify(baseDataSet[i]));

                delete newObject.RegionID;
                delete newObject.SizeRank;
                delete newObject.RegionName;
                delete newObject.RegionType;
                delete newObject.StateName;
                delete newObject.State;
                delete newObject.City;
                delete newObject.Metro;
                delete newObject.CountyName;
    
                newDataList.push(newObject);
            }
        }
    });    

    callback(newDataList);
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

        currentDataSource = currentRadioButton.value;

        applyFilters(currentRadioButton.value, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
            filteredData = data;
        });
    });
});

stateDropdown.addEventListener('change', function() {
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    
    applyFilters(currentDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        updateCities(data, stateDropdown.value);
        filteredData = data;
    });
});

cityDropdown.addEventListener('change', function() {
    zipcodeDropdown.value = null;

    applyFilters(currentDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        updateZipcodes(data, stateDropdown.value, cityDropdown.value);
        filteredData = data;
    });
});

clearState.addEventListener('click', function() {
    stateDropdown.value = null;
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(currentDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
    });
});

clearCity.addEventListener('click', function() {
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(currentDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        filteredData = data;
    });
});

clearZipcode.addEventListener('click', function() {
    zipcodeDropdown.value = null;

    applyFilters(currentDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
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
