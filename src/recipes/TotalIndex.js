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

function AppendToList(id, name) {
    fs.readFile(dirname + "/server/total.json", (err, data) => {
        if (err) {
            console.error(err.message);
        } else {
            let jsonData = JSON.parse(data);

            jsonData.list.push({
                "id" : id,
                "name" : name
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

module.exports = {
    AppendToList,
    FetchList
}