// DOM Elements
const dataSourceRadioButtons = document.querySelectorAll('input[name="data-source"]');
const stateDropdown = document.getElementById('state');
const cityDropdown = document.getElementById('city');
const zipcodeDropdown = document.getElementById('zipcode');
const clearState = document.getElementById('clear-state');
const clearCity = document.getElementById('clear-city');
const clearZipcode = document.getElementById('clear-zipcode');
const disclaimerDiv = document.getElementById('disclaimer-div');

let selectedRadioButton = 'three-bed';


//////////////////////////////
// Input Element Setters    //
//////////////////////////////
nullZipcode = () => {
    zipcodeDropdown.value = null;
}
nullCity = () => {
    nullZipcode();
    zipcodeDropdown.disabled = true;
    cityDropdown.value = null;
}
nullState = () => {
    nullCity();
    cityDropdown.disabled = true;
    stateDropdown.value = null;
}

setDropdownOptions = (dropdownElement, optionsArray) => {
    let dropdownOptions = '';
    
    optionsArray.sort().forEach(option => {
        dropdownOptions += '<option value="' + option + '">' + option + '</option>';
    });

    dropdownElement.innerHTML = dropdownOptions;
} // end setDropdownOptions()


//////////////////////////////
// Data Retrieval           //
//////////////////////////////
getData = (selectedDataset, selectedState, selectedCity, selectedZipcode, callback) => {
    let xhr = new XMLHttpRequest();
    let endpoint = 'https://gbaduqui.pythonanywhere.com/zhvi-data?';
    let qParams = 'dataset=' + selectedDataset;

    if (selectedZipcode.length > 0) {
        qParams.concat('&state=' + selectedState + '&city=' + selectedCity + '&zipcode=' + selectedZipcode);
    } else if (selectedCity.length > 0) {        
        qParams.concat('&state=' + selectedState + '&city=' + selectedCity);
    } else if (selectedState.length > 0) {
        qParams.concat('&state=' + selectedState);
    } else {
        //
    }
    url = endpoint + qParams;

    fetch(url)
        .then(response => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

getDropdowns = (selectedDataset, selectedState, selectedCity, selectedZipcode, callback) => {
    // let xhr = new XMLHttpRequest();
    let endpoint = 'https://gbaduqui.pythonanywhere.com/zhvi-dropdowns?';
    let qParams = ``;

    if (selectedZipcode.length > 0) {
        qParams = `dataset=${selectedDataset}&state=${selectedState}&city=${selectedCity}&zipcode=${selectedZipcode}`;
    } else if (selectedCity.length > 0) {        
        qParams = `dataset=${selectedDataset}&state=${selectedState}&city=${selectedCity}`;
    } else if (selectedState.length > 0) {
        qParams = `dataset=${selectedDataset}&state=${selectedState}`;
    } else {
        qParams = `dataset=${selectedDataset}`;
    }

    url = endpoint + qParams;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            optionsArray = Object.values(data);
            callback(optionsArray);
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
}

//////////////////////////////
// Render Chart             //
//////////////////////////////
renderChart = (xAxis, yAxis, regionName) => {
    let chartTitle = '';

    if (selectedRadioButton === 'rent') {
        chartTitle = 'Typical Rental Rates in ' + regionName;
    } else {
        chartTitle = 'Typical Home Value for a ' + selectedRadioButton.charAt(0).toUpperCase() + selectedRadioButton.slice(1) + ' Home in ' + regionName;
    }

    const trace = {
        x: xAxis,
        y: yAxis,
        mode: 'lines',
        name: regionName,
        textposition: 'top left'
    };

    const data = [ trace ];

    const layout = {
        title: chartTitle
    };

    Plotly.newPlot('zhvi-chart', data, layout);
}


//////////////////////////////
// Event Listeners          //
//////////////////////////////
dataSourceRadioButtons.forEach(currentRadioButton => {
    currentRadioButton.addEventListener('click', () => {
        nullState();
        selectedRadioButton = currentRadioButton.value;

        getData(currentRadioButton.value, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
            dates = Object.keys(data);
            values = Object.values(data);

            renderChart(dates, values, ' the United States');
        });

        getDropdowns(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (dropdownOptions) => {
            setDropdownOptions(stateDropdown, dropdownOptions);
        });
    });
});

stateDropdown.addEventListener('click', () => {
    nullCity();

    getData(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        dates = Object.keys(data);
        values = Object.values(data);

        renderChart(dates, values, stateDropdown.value);
    });

    getDropdowns(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (dropdownOptions) => {
        setDropdownOptions(cityDropdown, dropdownOptions);
    });
});

cityDropdown.addEventListener('click', () => {
    nullZipcode();

    getData(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        dates = Object.keys(data);
        values = Object.values(data);

        renderChart(dates, values, cityDropdown.value);
    });

    getDropdowns(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (dropdownOptions) => {
        setDropdownOptions(zipcodeDropdown, dropdownOptions);
    });
});

zipcodeDropdown.addEventListener('click', () => {
    getData(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        dates = Object.keys(data);
        values = Object.values(data);

        renderChart(dates, values, zipcodeDropdown.value);
    });
});

clearState.addEventListener('click', () => {
    nullState();

    getData(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        dates = Object.keys(data);
        values = Object.values(data);

        renderChart(dates, values, ' the United States');
    });

    getDropdowns(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (dropdownOptions) => {
        setDropdownOptions(stateDropdown, dropdownOptions);
    });
});

clearCity.addEventListener('click', () => {
    nullCity();

    getData(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        dates = Object.keys(data);
        values = Object.values(data);

        renderChart(dates, values, stateDropdown.value);
    });

    getDropdowns(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (dropdownOptions) => {
        setDropdownOptions(cityDropdown, dropdownOptions);
    });
});

clearZipcode.addEventListener('click', () => {
    nullZipcode();

    getData(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        dates = Object.keys(data);
        values = Object.values(data);

        renderChart(dates, values, cityDropdown.value);
    });

    getDropdowns(selectedRadioButton, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (dropdownOptions) => {
        setDropdownOptions(zipcodeDropdown, dropdownOptions);
    });
});

/*

let threeBed = [];
let fourBed = [];
let rent = [];
let selectedDataSource = [];
let filteredData = [];
let selectedRadioButton = '';

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
const disclaimerDiv = document.getElementById('disclaimer-div');

////////////////////////////////////////////////////////
// Data Retrieval/parsing Methods
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

    for (let i = 0; i < selectedDataSet.length; i++) {
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

    for (let i = 0; i < selectedDataSet.length; i++) {
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

nullZipcode = () => {
    zipcodeDropdown.value = null;
}
nullCity = () => {
    nullZipcode();
    zipcodeDropdown.disabled = true;
    cityDropdown.value = null;
}
nullState = () => {
    nullCity();
    cityDropdown.disabled = true;
    stateDropdown.value = null;
}



////////////////////////////////////////////////////////
// Render line graph
////////////////////////////////////////////////////////
renderLineGraph = (xAxis, yAxis, propertyType, regionName) => {
    let chartTitle = '';

    if (propertyType === 'rent') {
        chartTitle = 'Typical Rental Rates in ' + regionName;
    } else {
        chartTitle = 'Typical Home Value for a ' + propertyType.charAt(0).toUpperCase() + propertyType.slice(1) + ' Home in ' + regionName;
    }

    const trace = {
        x: xAxis,
        y: yAxis,
        mode: 'lines',
        name: regionName,
        textposition: 'top left'
    };

    const data = [ trace ];

    const layout = {
        title: chartTitle
    };

    Plotly.newPlot('zhvi-chart', data, layout);
}



////////////////////////////////////////////////////////
// Group Data by Region
////////////////////////////////////////////////////////
groupDataByRegion = (data, callback) => {
    let dates = [];
    let valuesSum = [];
    let notNullDateCount = [];
    let averageHomeValues = [];

    for (let i = 0; i < data.length; i++) {
        // Iterate through each key/value pair of data object
        let j = 0;
        Object.entries(data[i]).forEach(([currentKey, currentValue]) => {
            
            // Do not include region name in grouping
            if (currentKey.substring(0, 2) == '20') {

                // Instantiate initial values of `valuesSum` and `notNullDateCount` for first object in data list
                if (i === 0) {
                    dates.push(currentKey);

                    // Verify that data was captured for region on this date
                    if (currentValue.length > 0) {
                        valuesSum.push(Number(currentValue));
                        notNullDateCount.push(1);
                    } else {
                        valuesSum.push(0);
                        notNullDateCount.push(0);
                    }
                } else {
                    // Verify that data was captured for region on this date
                    if (currentValue.length > 0) {
                        valuesSum[j] += Number(currentValue);
                        notNullDateCount[j] += 1;
                    }
                }
            }
            
            // Increment iterater for `valuesSum`, `notNullDateCount`
            j++;
        }); // end forEach
    } // end iteration through `data` 

    // Calculate averageHomeValues values
    for (let k = 0; k < dates.length; k++) {
        averageHomeValues[k] = valuesSum[k] / notNullDateCount[k];
    }
    
    callback(dates, averageHomeValues);
}



////////////////////////////////////////////////////////
// Methods to filter data based on selected inputs
////////////////////////////////////////////////////////
setDataset = (radioButtonValue, callback) => {
    let newDeepCopy = [];
    
    if (radioButtonValue == 'three-bed') {
        newDeepCopy = JSON.parse(JSON.stringify(threeBed));
    } else if (radioButtonValue == 'four-bed') {
        newDeepCopy = JSON.parse(JSON.stringify(fourBed));
    } else if (radioButtonValue == 'rent') {
        newDeepCopy = JSON.parse(JSON.stringify(rent));
    } else {
        console.log('Error setting tempObject');
    }

    callback(newDeepCopy);
} // end setDataset()

applyFilters = (baseDataSet, selectedState, selectedCity, selectedZipcode, callback) => {
    let newDataList = [];
    
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

        selectedRadioButton = currentRadioButton.value;

        setDataset(currentRadioButton.value, (newData) => {
            applyFilters(newData, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
                groupDataByRegion(data, (xAxis, yAxis) => {
                    console.log(xAxis, yAxis);
                    renderLineGraph(xAxis, yAxis, selectedRadioButton, 'the United States');
                });
            });
            
            selectedDataSource = newData;
        });
    });
});

stateDropdown.addEventListener('change', function() {
    cityDropdown.disabled = false;
    
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    
    applyFilters(selectedDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        updateCities(selectedDataSource, stateDropdown.value);
        groupDataByRegion(data, (xAxis, yAxis) => {
            console.log(xAxis, yAxis);
            renderLineGraph(xAxis, yAxis, selectedRadioButton, stateDropdown.value);
        });
    });
});

cityDropdown.addEventListener('change', function() {
    zipcodeDropdown.disabled = false;
    zipcodeDropdown.value = null;

    applyFilters(selectedDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        updateZipcodes(selectedDataSource, stateDropdown.value, cityDropdown.value);
        groupDataByRegion(data, (xAxis, yAxis) => {
            console.log(xAxis, yAxis);
            renderLineGraph(xAxis, yAxis, selectedRadioButton, cityDropdown.value);
        });
    });
});

zipcodeDropdown.addEventListener('change', function() {
    applyFilters(selectedDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        groupDataByRegion(data, (xAxis, yAxis) => {
            console.log(xAxis, yAxis);
            renderLineGraph(xAxis, yAxis, selectedRadioButton, zipcodeDropdown.value);
        })
    });
});

clearState.addEventListener('click', function() {
    cityDropdown.disabled = true;
    zipcodeDropdown.disabled = true;

    stateDropdown.value = null;
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(selectedDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        groupDataByRegion(data, (xAxis, yAxis) => {
            console.log(xAxis, yAxis);
            renderLineGraph(xAxis, yAxis, selectedRadioButton, 'the United States');
        });
    });
});

clearCity.addEventListener('click', function() {
    zipcodeDropdown.disabled = true;
    
    cityDropdown.value = null;
    zipcodeDropdown.value = null;

    applyFilters(selectedDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        groupDataByRegion(data, (xAxis, yAxis) => {
            console.log(xAxis, yAxis);
            renderLineGraph(xAxis, yAxis, selectedRadioButton, stateDropdown.value);
        });
    });
});

clearZipcode.addEventListener('click', function() {
    nullZipcode();

    applyFilters(selectedDataSource, stateDropdown.value, cityDropdown.value, zipcodeDropdown.value, (data) => {
        groupDataByRegion(data, (xAxis, yAxis) => {
            console.log(xAxis, yAxis);
            renderLineGraph(xAxis, yAxis, selectedRadioButton, cityDropdown.value);
        });
    });
});



////////////////////////////////////////////////////////
// Initial values
////////////////////////////////////////////////////////
dataSourceRadioButtons.forEach((currentRadioButton) => {
    currentRadioButton.disabled = true;
});

stateDropdown.value = null;
cityDropdown.value = null;
zipcodeDropdown.value = null;

stateDropdown.disabled = true;
cityDropdown.disabled = true;
zipcodeDropdown.disabled = true;

setStates(states);


// Instantiate threeBed object
getCSV('rent.csv', (err, data) => {
    if (err === null) {
        rent = data;
        dataSourceRadioButtons.forEach((currentRadioButton) => {
            if (currentRadioButton.value === 'rent') {
                currentRadioButton.disabled = false;
                currentRadioButton.click();
            } 
        });
        disclaimerDiv.innerHTML = '<p>Data available at and retrieved from <a href="https://www.zillow.com/research/data/">Zillow Research</a></p>';
    } else {
        console.log(err);
    }
});

getCSV('4bed.csv', (err, data) => {
    if (err === null) {
        fourBed = data;
        dataSourceRadioButtons.forEach((currentRadioButton) => {
            if (currentRadioButton.value === 'four-bed') {
                currentRadioButton.disabled = false;
            } 
        });
    } else {
        console.log(err);
    }
});

getCSV('3bed.csv', (err, data) => {
    if (err === null) {
        threeBed = data;
        dataSourceRadioButtons.forEach((currentRadioButton) => {
            if (currentRadioButton.value === 'three-bed') {
                currentRadioButton.disabled = false;
            } 
        });
    } else {
        console.log(err);
    }
});

*/