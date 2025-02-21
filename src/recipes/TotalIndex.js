const fs = require('fs');
const path = require('path');

const dirname = path.join(__dirname, "..", "..");

function FetchList() {
    return new Promise((resolve, reject) => {
        fs.readFile(dirname + "/server/total.json", (err, data) => {
            if (err) {
                console.error(err.message);
                reject(err.message);
            } else {
                resolve(data);
            }
        })
    })
}

function AppendToList(id, name, slogan) {
    fs.readFile(dirname + "/server/total.json", (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
            let jsonData = JSON.parse(data);

            jsonData.list.push({
                "id" : id,
                "name" : name,
                "slogan" : slogan
            })

            fs.writeFile(dirname + "/server/total.json", JSON.stringify(jsonData), (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Appended " + id + " to list.");
                }
            }) 
        }
    })
}

function EditTitleInList(id, newTitle) {
    return new Promise((resolve, reject) => {
        fs.readFile(dirname + "/server/total.json", (err, data) => {
            if (err) {
                console.error(err.message);
            } else {
                let jsonData = JSON.parse(data);
    
                // Find the item by ID
                const itemIndex = jsonData.list.findIndex(item => item.id === id);
                
                if (itemIndex !== -1) {
                    // Update the title (name) of the item
                    jsonData.list[itemIndex].name = newTitle;
    
                    // Write the updated data back to the file
                    fs.writeFile(dirname + "/server/total.json", JSON.stringify(jsonData), (err) => {
                        if (err) {
                            console.error(err.message);
                            reject(err.message);
                        } else {
                            console.log(`Updated title of item with ID ${id} to "${newTitle}".`);
                            resolve("Success")
                        }
                    });
                } else {
                    console.log("Item with the specified ID not found.");
                    reject("Not Found.");
                }
            }
        })
    })
}

module.exports = {
    AppendToList,
    FetchList,
    EditTitleInList
}
