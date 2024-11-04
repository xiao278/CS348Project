import { LoginPayload, BookQuery } from "./request_type";
import { verify_login } from "./auth";
import { sequelize } from "./tables";
import { count_matching_books, find_matching_books, send_tables } from "./query_books";

// test db connection
sequelize.authenticate().then(() => {
    console.log('Database Connection has been established successfully.');
}).catch((error:Error) => {
    console.error('Unable to connect to the database: ', error.message);
});

// create application/json parser
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const cors = require('cors');
 
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

// setup server
const express = require('express');
const app = express();

// server configure
app.use(bodyParser.json());
app.use(cors());    

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
  
app.post("/login", jsonParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    try {
        let loginFields:LoginPayload = req.body;
        let result = await verify_login(loginFields.username, loginFields.password);
        console.log("Login Attempt: " + JSON.stringify({username: loginFields.username, password: loginFields.password}) + ", result: " + result);
        // let responseBody = JSON.stringify({username: loginFields.username, password: loginFields.password})
        // console.log(loginFields);
        // console.log(responseBody);
        if (result === "staff" || result === "reader"){
            res.status(200).send(JSON.stringify({role: result}));
        }
        else {
            res.status(401).send(JSON.stringify({role: "unauthorized"}));
        }
    }
    catch (e) {
        console.log(e)
        res.status(404).send(e);
    }
});

app.get("/fetchBrowseTables", async (req, res) => {
    let tables = await send_tables();
    res.status(200).send(JSON.stringify(tables));
    // console.log(JSON.stringify(tables))
})

app.post("/findBooks", jsonParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    //TODO add login verification
    try {
        const filters = req.body.query;
        const page = req.body.page;
        // console.log(filters);
        let books = await find_matching_books(filters, page);
        res.status(200).send(books);
    }
    catch (e) {
        console.log("reqbody: ")
        console.log(req.body)
        console.log(e)
        res.status(404).send({message: e.message});
    }
});

app.post("/countBooks", jsonParser, async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    //TODO add login verification
    try {
        let filters:BookQuery = req.body;
        let counts = await count_matching_books(filters);
        res.status(200).send(counts);
    }
    catch (e) {
        console.log(e)
        res.status(404).send({message: e.message});
    }
})

