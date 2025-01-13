const fs = require('fs');
const path = require('path');

const dirname = path.join(__dirname, "..", "..");

function Search(basedInput) {
    return new Promise((resolve, reject) => {
        if (basedInput == "") {
            reject("Invalid Input Parameters");
            return;
        }

        if (basedInput == undefined) {
            reject("Invalid Input Parameters");
            return;
        }

        fs.readFile(dirname + "/server/total.json", (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                const jsonData = JSON.parse(data);

                CalculateResults(jsonData.list, basedInput.toLowerCase()).then(response => {
                    resolve(response);
                }).catch(err => {
                    reject(err);
                })
            }
        })
    })
}

function CalculateResults(list, basedInput) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(list) || typeof basedInput !== 'string') {
            reject(new Error("Invalid input: 'list' must be an array and 'basedInput' must be a string."));
            return;
        }

        let normalizedInput = basedInput.toLowerCase().trim();
        let inputTokens = normalizedInput.split(/\s+/); // Split input into words

        const searchResults = list.filter(element => {
            if (element.name && typeof element.name === 'string') {
                let normalizedName = element.name.toLowerCase().trim();
                // Check if any input token is included in the element's name
                return inputTokens.some(token => normalizedName.includes(token));
            }
            return false;
        });

        resolve(searchResults);
    });
}


module.exports = {
    Search
};