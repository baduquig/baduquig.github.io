// DOM Elements
const dataSourceRadioButtons = document.querySelectorAll('input[name="data-source"]');
const stateInput = document.getElementById('state');
const cityInput = document.getElementById('city');
const zipcodeInput = document.getElementById('zipcode');
const stateList = document.getElementById('state-list');
const cityList = document.getElementById('city-list');
const zipcodeList = document.getElementById('zipcode-list');
const clearState = document.getElementById('clear-state');
const clearCity = document.getElementById('clear-city');
const clearZipcode = document.getElementById('clear-zipcode');
const disclaimerDiv = document.getElementById('disclaimer-div');

let selectedRadioButton = 'three-bed';


//////////////////////////////
// Input Element Setters    //
//////////////////////////////
nullZipcode = () => {
    zipcodeInput.value = null;
}
nullCity = () => {
    nullZipcode();
    zipcodeInput.disabled = true;
    cityInput.value = null;
}
nullState = () => {
    nullCity();
    cityInput.disabled = true;
    stateInput.value = null;
}

setDropdownOptions = (dropdownElement, optionsObject) => {
    let optionsArray = optionsObject[0];
    let dropdownOptions = '';
    
    optionsArray.sort().forEach(option => {
        dropdownOptions += '<option value="' + option + '">' + option + '</option>';
    });

    dropdownElement.innerHTML = dropdownOptions;
    dropdownElement.disabled = false;
} // end setDropdownOptions()


//////////////////////////////
// Data Retrieval           //
//////////////////////////////
getData = (selectedDataset, selectedState, selectedCity, selectedZipcode, callback) => {
    let endpoint = 'https://gbaduqui.pythonanywhere.com/zhvi-data?';
    let qParams = ``;

    if (selectedZipcode.length > 0) {
        qParams = `dataset=${selectedDataset}&state=${selectedState}&city=${selectedCity}&zipcode=${selectedZipcode}`;
        console.log(selectedZipcode);
    } else if (selectedCity.length > 0) {
        qParams = `dataset=${selectedDataset}&state=${selectedState}&city=${selectedCity}`;
        console.log(selectedCity);
    } else if (selectedState.length > 0) {
        qParams = `dataset=${selectedDataset}&state=${selectedState}`;
        console.log(selectedState);
    } else {
        qParams = `dataset=${selectedDataset}`;
    }

    url = endpoint + qParams;
    console.log(url);
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
    console.log(xAxis);
    console.log(yAxis);
    if (selectedRadioButton === 'rent') {
        chartTitle = 'Typical Rental Rates in ' + regionName;
    } else {
        chartTitle = 'Typical Home Value for a ' + selectedRadioButton.charAt(0).toUpperCase() + selectedRadioButton.slice(1) + ' home in ' + regionName;
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

        getData(currentRadioButton.value, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
            dates = Object.keys(data[0]);
            values = Object.values(data[0]);

            renderChart(dates, values, 'the United States');
        });

        getDropdowns(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (dropdownOptions) => {
            setDropdownOptions(stateList, dropdownOptions);
            stateInput.disabled = false;
        });
    });
});

stateInput.addEventListener('change', () => {
    nullCity();

    getData(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
        dates = Object.keys(data[0]);
        values = Object.values(data[0]);

        renderChart(dates, values, stateInput.value);
    });

    getDropdowns(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (dropdownOptions) => {
        setDropdownOptions(cityList, dropdownOptions);
        cityInput.disabled = false;
    });
});

cityInput.addEventListener('change', () => {
    nullZipcode();

    getData(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
        dates = Object.keys(data[0]);
        values = Object.values(data[0]);

        renderChart(dates, values, cityInput.value);
    });

    getDropdowns(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (dropdownOptions) => {
        setDropdownOptions(zipcodeList, dropdownOptions);
        zipcodeInput.disabled = false;
    });
});

zipcodeInput.addEventListener('change', () => {
    getData(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
        dates = Object.keys(data[0]);
        values = Object.values(data[0]);

        renderChart(dates, values, zipcodeInput.value);
    });
});

clearState.addEventListener('click', () => {
    nullState();

    getData(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
        dates = Object.keys(data[0]);
        values = Object.values(data[0]);

        renderChart(dates, values, 'the United States');
    });

    getDropdowns(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (dropdownOptions) => {
        setDropdownOptions(stateInput, dropdownOptions);
    });
});

clearCity.addEventListener('click', () => {
    nullCity();

    getData(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
        dates = Object.keys(data[0]);
        values = Object.values(data[0]);

        renderChart(dates, values, stateInput.value);
    });

    getDropdowns(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (dropdownOptions) => {
        setDropdownOptions(cityInput, dropdownOptions);
    });
});

clearZipcode.addEventListener('click', () => {
    nullZipcode();

    getData(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (data) => {
        dates = Object.keys(data[0]);
        values = Object.values(data[0]);

        renderChart(dates, values, cityInput.value);
    });

    getDropdowns(selectedRadioButton, stateInput.value, cityInput.value, zipcodeInput.value, (dropdownOptions) => {
        setDropdownOptions(zipcodeInput, dropdownOptions);
    });
});


stateInput.disabled = true;
cityInput.disabled = true;
zipcodeInput.disabled = true;

document.getElementById('three-bed').click();