const express = require('express');
const helmet = require('helmet');

const RecipeReader = require("./src/recipes/RecipeReader");
const RecipeGeneration = require('./src/recipes/RecipeGeneration');
const TotalIndex = require('./src/recipes/TotalIndex');

const app = express();

// app.use(helmet());
app.use(express.json());

app.get("/api/recipe/read", (req, res) => {
    RecipeReader.ReadRecipe(req.query.id).then(msg => {
        return res.status(200).send(msg);
    }).catch(err => {
        return res.status(200).send(err);
    })
})

app.post("/api/recipe/create", (req, res) => {
    RecipeGeneration.CreateRecipe(req.body.prompt).then(msg => {
        return res.status(200).send(msg);
    }).catch(err => {
        return res.status(500).send(err);
    });
})

app.get("/api/recipe/list", (req, res) => {
    TotalIndex.FetchList().then(response => {
        return res.status(200).send(response);
    }).catch(err => {
        return res.status(500).send(err);
    })
})

app.get("/pins", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/pinned.html");
})

app.get("/recipe", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/recipe.html");
})

app.get("/", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/index.html");
})

app.listen(8080, () => {
    console.log("Server listenoing on port 8080")
})