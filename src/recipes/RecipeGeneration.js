const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { title } = require('process');
const ollama = require('ollama').default;

const dirname = path.join(__dirname, "..", "..");

const defaultRecipeJson = {
    "title" : "",
    "content" : "",
    "slogan" : "",
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
                "content" : "You will be given a prompt. Your job is to generate a title for the prompt ensure it can easily be linked to the prompt provided. For example: Egg Fried Rice - Your output should have Egg Fried Rice somewhere in the title. You do NOT use markdown and you do NOT place titles in quotes."
            },
            {
                "role" : "user",
                "content" : prompt
            }
        ]
    })

    recipeData.title = title_agent.message.content;
    recipeData.is_complete = true;

    const slogan_agent = await ollama.chat({
        "model" : "llama3.2",
        "messages" : [
            {
                "role" : "system",
                "content" : "Your job is to create a slogan such as 'A cookie to fix your hunger'. Use the provided text by the user to create this. DO THIS ONLY, CREATE ONE SLOGAN AND THATS IT."
            },
            {
                "role" : "user",
                "content" : title_agent.message.content
            }
        ]
    })

    recipeData.slogan = slogan_agent.message.content;
    

    require('./TotalIndex').AppendToList(id, recipeData.title, recipeData.slogan);

    fs.writeFile(dirname + "/server/recipes/" + id + ".json", JSON.stringify(recipeData), (err) => {
        if (err) {
            console.error("Error writing part to disk " + err.message);
        }
    })

}

async function DescribeImage(img) {
    return new Promise(async (resolve, reject) => {
        fs.exists(img, async (e) => {
            if (e) {
                const imageDescribeAgent = await ollama.chat({
                    "model" : "llama3.2",
                    "messages" : [
                        {
                            "role" : "system",
                            "content" : "Your job is to identify the meal that is in this image. For Example: A user uploads a picture of a carrot cake. You respond with 'Carrot Cake that has chunks of carrot spread around neatly across the top of the cake. The cake is incased in a vanilla icing'. Make sure descriptions are of that level. DO NOT IDENTIFY THE BACKGROUND OF THE IMAGE. You do nothing else. You keep your responses brief and containing only essential information. In the event that the image has no dish or cannot be identified simply respond with 'NONE' and nothing else."
                        },
                        {
                            "role" : "user",
                            "images" : [img]
                        }
                    ]
                })

                fs.rm(img, (err) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(imageDescribeAgent.message.content);
                    }
                });
                
            } else {
                reject("Image not found.");
            }
        })
    })
}

async function EditRecipeName(id, newName) {
    return new Promise(async (resolve, reject) => {
        const filePath = path.join(dirname, "server", "recipes", `${id}.json`);

        try {
            // Check if the file exists
            await fs.promises.access(filePath);
    
            // Read the existing file content
            let recipeData = await fs.promises.readFile(filePath, 'utf-8');
            recipeData = JSON.parse(recipeData);
    
            // Update the title
            recipeData.title = newName;
    
            // Save the updated content
            await fs.promises.writeFile(filePath, JSON.stringify(recipeData, null, 4));
            console.log(`Recipe title updated to: ${newName}`);
            resolve("Success");
        } catch (err) {
            console.error(`Error updating recipe title: ${err.message}`);
            reject(err);
        }
    })
}




module.exports = {
    CreateRecipe,
    EditRecipeName,
    DescribeImage
}