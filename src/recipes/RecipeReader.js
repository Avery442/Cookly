const fs = require('fs');
const path = require('path');

// Fix dirname to point to the correct folder
const dirname = path.join(__dirname, "..", "..");

function ReadRecipe(id) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(dirname, "server", "recipes", `${id}.json`);

        // Use fs.access instead of fs.exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                reject({
                    success: false,
                    data: {},
                    message: "Recipe not found."
                });
            } else {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        reject({
                            success: false,
                            data: {},
                            message: err.message
                        });
                    } else {
                        try {
                            // Parse the JSON data
                            const jsonData = JSON.parse(data);
                            resolve({
                                success: true,
                                data: jsonData,
                                message: "Got Recipe Data."
                            });
                        } catch (parseErr) {
                            reject({
                                success: false,
                                data: {},
                                message: "Error parsing JSON data."
                            });
                        }
                    }
                });
            }
        });
    });
}

module.exports = {
    ReadRecipe
};
