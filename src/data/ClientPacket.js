const fs = require('fs');
const path = require('path');

const dirname = path.join(__dirname, "..", "..");

function ReadJsonPacket() {
    return new Promise((resolve, reject) => {
        fs.readFile(dirname + "/server/data/client_packet.json", (err, data) => {
            if (err) {
                reject(err.message);      
            } else {
                resolve(data);
            }
        })
    })
}

module.exports = {
    ReadJsonPacket
}