
class HomeValueIndex {
    constructor() {
        this.setStates(['NJ', 'TX', 'NY', 'CA', 'IL', 'GA', 'TN', 'WA', 'OK', 'NC', 
                        'AZ', 'VA', 'NM', 'HI', 'FL', 'KS', 'MO', 'IN', 'PA', 'CO', 
                        'NV', 'UT', 'OH', 'MD', 'OR', 'DC', 'ID', 'MA', 'MI', 'SC', 
                        'KY', 'CT', 'DE', 'LA', 'MN', 'WI', 'MT', 'MS', 'AL', 'AR', 
                        'ND', 'SD', 'RI', 'NE', 'ME', 'IA', 'WV', 'AK', 'NH', 'VT', 'WY']);
        
        this.getCSV('zvhi_3bed.csv', (err, data) => {
            if (err !== null) {
                console.log(err);
            } else {
                this.threeBed = this.readData(data, (err, obj) => {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        this.threeBed = data;                        
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
    } // end constructor()
    
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
    
    setStates(statesArray) {
        let stateOptions = '<option selected value></option>';
        
        statesArray.sort().forEach(state => {
            stateOptions += '<option value=' + state + '>' + state + '</option>';
        });
        document.getElementById('state-list').innerHTML = stateOptions;
        console.log('State Dropdown options set...');
    } // end setStates()
    
}


const zhvi = new HomeValueIndex();