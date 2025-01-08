const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { title } = require('process');
const ollama = require('ollama').default;

const dirname = path.join(__dirname, "..", "..");

const defaultRecipeJson = {
    "title" : "",
    "content" : "",
    "is_complete" : false
}

function CreateRecipe(prompt) {
    return new Promise((resolve, reject) => {
        srv_HuntForId(prompt).then(foundId => {
            resolve(foundId);
        });
    })
}

async function srv_HuntForId(promptPre) {
    while (true) {
        const foundId = crypto.randomBytes(26).toString("hex");
        const filePath = path.join(dirname, "server", "recipes", `${foundId}.json`);

        try {
            // Check if the file exists
            await fs.promises.access(filePath);
            // If the file exists, continue the loop to generate a new ID
        } catch (err) {
            // If the file doesn't exist, we've found a valid ID
            srv_BeginGeneration(foundId, promptPre); // Start generation
            return foundId; // Return the ID
        }
    }
}


async function srv_BeginGeneration(id, prompt) {

    let recipeData = defaultRecipeJson;
    
    recipeData.content = "";
    recipeData.title = "";
    recipeData.is_complete = false;

    fs.writeFile(dirname + "/server/recipes/" + id + ".json", JSON.stringify(recipeData), (err) => {
        if (err) {
            console.error("Error creating recipe inital folder: " + err.message);
        } 
    });



    let cook_agent = await ollama.chat({
        "model" : "llama3.2",
        "messages" : [
            {
                "role" : "system",
                "content" : "You are a cookbook. When prompted with something you generate a recipe and a step by step tutorial how to prepare this dish. You will provide and ingredients list and an allergy notice. On the event that the user provides a prompt that makes no sense as a recipe feel free to attempt to correct them by adding 'Did you mean ...' to the top. If a user says surprise me feel free to surprise the user but ENSURE you add a allergy notice too."
            },
            {
                "role" : "user",
                "content" : prompt
            }
        ],
        "stream" : true
    });

    for await (const part of cook_agent) {
        recipeData.content += part.message.content;

        fs.writeFile(dirname + "/server/recipes/" + id + ".json", JSON.stringify(recipeData), (err) => {
            if (err) {
                console.error("Error writing part to disk " + err.message);
            }
        })
    }

    const title_agent = await ollama.chat({
        "model" : "llama3.2",
        "messages" : [
            {
                "role" : "system",
                "content" : "You will be given a cooking recipe. Your job is to create a title for it. Some rules to follow: DO NOT USE MARKDOWN, DO NOT PLACE TITLE IN QUOTES. You do this and NOTHING else."
            },
            {
                "role" : "user",
                "content" : recipeData.content
            }
        ]
    })

    recipeData.title = title_agent.message.content;
    recipeData.is_complete = true;

    require('./TotalIndex').AppendToList(id, recipeData.title);

    fs.writeFile(dirname + "/server/recipes/" + id + ".json", JSON.stringify(recipeData), (err) => {
        if (err) {
            console.error("Error writing part to disk " + err.message);
        }
    })

}

module.exports = {
    CreateRecipe
}