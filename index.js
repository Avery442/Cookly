const express = require('express');
const helmet = require('helmet');

const RecipeReader = require("./src/recipes/RecipeReader");
const RecipeGeneration = require('./src/recipes/RecipeGeneration');
const TotalIndex = require('./src/recipes/TotalIndex');

const RecipeSearcher = require('./src/recipes/RecipeSearcher');

const data_ClientPacket = require('./src/data/ClientPacket');

const app = express();

// app.use(helmet());
app.use(express.json());

const multer = require('multer');

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/server/vision/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });




app.get("/api/client", (req, res) => {
    data_ClientPacket.ReadJsonPacket().then(response => {
        return res.status(200).send(response);
    }).catch(err => {
        return res.status(500).send(err);
    })
})


app.post("/api/followup", (req, res) => {
    require('./src/recipes/RecipeFollowUp').AskFollowUp(req.body.messages).then(result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(500).send(err);
    });
})

app.get("/api/recipe/read", (req, res) => {
    RecipeReader.ReadRecipe(req.query.id).then(msg => {
        return res.status(200).send(msg);
    }).catch(err => {
        return res.status(200).send(err);
    })
})

app.get("/api/recipe/search", (req, res) => {
    RecipeSearcher.Search(req.query.input).then(response => {
        return res.status(200).send(JSON.stringify({
            "searchResults" : response
        }));
    }).catch(err => {
        return res.status(500).send(err);
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


app.get("/agreement", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/agreement.html");
})

app.get("/api/tos", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/tos.json");
})

app.post("/api/recipe/edit_name", (req, res) => {
    RecipeGeneration.EditRecipeName(req.body.id, req.body.name).then(resp => {
        TotalIndex.EditTitleInList(req.body.id, req.body.name).then(resp => {
            return res.status(200).send(resp);
        }).catch(err => {
            return res.status(500).send(err);
        })
    }).catch(err => {
        return res.status(500).send(err);
    })
})



app.get("/recipe/approval", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/approval.html");
})

app.get("/status", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/status.html");
})

app.get("/pins", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/pinned.html");
})

app.get("/recipe", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/recipe.html");
})

app.get("/follow-ups", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/follow_up.html");
})
app.get("/", (req, res) => {
    return res.status(200).sendFile(__dirname + "/server/pages/index.html");
})

app.listen(8002, () => {
    console.log("Server listenoing on port 8080")
})