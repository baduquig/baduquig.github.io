
class HomeValueIndex {
    constructor() {
        this.getCSV('zvhi_3bed.csv', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.threeBed = this.readData(data, (err, obj) => {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        this.setDropdownOptions(obj);                        
                    }
                });
            }
        });
        this.getCSV('zvhi_4bed.csv', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.fourBed = data;
            }
        });
        this.getCSV('rent.csv', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.rent = data;
            }
        });
        /*this.readData('zvhi_3bed.csv')
            .then(threeBed => {
                setDropdownOptions(threeBed);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        this.fourBed = readData('zvhi_4bed.csv');
        this.rent = readData('rent.csv');*/
    }
    
    parseCSVLine(line) {
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
    }

    readData = (data, callback) => {
            /*
            .then(response => response.text())
            .then(csvData => {*/
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
            //console.log(result);
            callback(null, result);
            //return result;
    }
    
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
    
    setDropdownOptions(data) {
        let states = [];
        let cities = [];
        let zipcodes = [];
    
        let stateOptions = '<option selected value></option>';
        let cityOptions = '<option selected value></option>';
        let zipOptions = '<option selected value></option>';
        console.log('Setting dropdown options...');
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            const stateAbbr = data[i].State;
            //const city = data[i].city;
            //const zip = data[i].RegionID;
            console.log(data[i]);
            if (!states.includes(stateAbbr)) {
                states.push(stateAbbr);
            }
    
            /*if (!cities.includes(city)) {
                cities.push(city);
            }
    
            if (!zipcodes.includes(zip)) {
                cities.push(zip);
            }*/
        } // end for (record in 3Bed file)
    
        states.forEach(state => {
            stateOptions += '<option value=' + state + '>' + state + '</option>';
        });
        /*cities.forEach(city => {
            cityOptions += '<option value=' + city + '>' + city + '</option>';
        });
        zipcodes.forEach(zip => {
            zipOptions += '<option value=' + zip + '>' + zip + '</option>';
        });*/
    
        document.getElementById('state').innerHTML = stateOptions;
        //document.getElementById('city').innerHTML = cityOptions;
        //document.getElementById('zip').innerHTML = zipOptions;
        console.log('Dropdown options set...');
    }
    
}


const zhvi = new HomeValueIndex();