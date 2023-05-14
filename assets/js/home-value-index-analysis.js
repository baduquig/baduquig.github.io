async function readData(dataFile) {
    const csvFilePath = 'https://raw.githubusercontent.com/baduquig/real-estate-analysis/main/data/' + dataFile;
    const response = await fetch(csvFilePath);
    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, { header: true }).data;
    const dataList = [];

    for (let i = 0; i < parsedData.length; i++) {
        const rowData = parsedData[i];
        const dataObject = {};
        for (const key in rowData) {
            dataObject[key] = rowData[key];
        }
        dataObject['Country'] = 'US';
        dataList.push(dataObject);
    }
    console.log(dataFile + ' set...');
} // end async function readData()

function setDropdownOptions(data) {
    let states = [];
    let cities = [];
    let zipcodes = [];

    let stateOptions = '<option selected value></option>';
    let cityOptions = '<option selected value></option>';
    let zipOptions = '<option selected value></option>';
    console.log('Setting dropdown options...');
    for (let i = 0; i < data.length; i++) {
        const stateAbbr = data[i].state;
        const city = data[i].city;
        const zip = data[i].RegionID;

        if (!states.includes(stateAbbr)) {
            states.push(stateAbbr);
        }

        if (!cities.includes(city)) {
            cities.push(city);
        }

        if (!zipcodes.includes(zip)) {
            cities.push(zip);
        }
    } // end for (record in 3Bed file)

    states.forEach(state => {
        stateOptions += '<option value=' + state + '>' + state + '</option>';
    });
    cities.forEach(city => {
        cityOptions += '<option value=' + city + '>' + city + '</option>';
    });
    zipcodes.forEach(zip => {
        zipOptions += '<option value=' + zip + '>' + zip + '</option>';
    });

    document.getElementById('state').innerHTML = stateOptions;
    document.getElementById('city').innerHTML = cityOptions;
    document.getElementById('zip').innerHTML = zipOptions;
    console.log('Dropdown options set...');
}

const threeBed = await readData('zvhi_3bed.csv');
setDropdownOptions(threeBed);
const fourBed = readData('zvhi_4bed.csv');
const rent = readData('rent.csv');