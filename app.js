/*
    IMPORTS
*/
const express = require('express');
const { engine } = require("express-handlebars");
const exphbs = require("express-handlebars");
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const corsOptions = {
    origin: 'https://lit-everglades-39146-fd2b4b5a3c5f.herokuapp.com',//(https://your-client-app.com)
    optionsSuccessStatus: 200,
  };

/*
    SETUP
*/
const app = express();
const port = process.env.PORT || 3001;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views/public"));
app.use(cors(corsOptions));

const hbs = exphbs.create({
  partialsDir: "views/partials",
  extname: ".hbs",
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

const filePathGolf = 'files/quotes_golf.csv';
const filePathBats = 'files/quotes_bats.csv';

const readCSVFileGolf = (filePathGolf) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        fs.createReadStream(filePathGolf)
            .pipe(csv())
            .on('data', (data) => lines.push(data))
            .on('end', () => resolve(lines))
            .on('error', (error) => reject(error));
    });
};

app.get('/', (req, res) => {
    res.send('hi microserviceA');
});

app.get('/random-quote-golf', async (req, res) => {
    try {
        const lines = await readCSVFileGolf(filePathGolf);
        const randomIndex = Math.floor(Math.random() * lines.length);
        const randomQuote = lines[randomIndex];
        res.json(randomQuote);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});

const readCSVFileBats = (filePathBats) => {
    return new Promise((resolve, reject) => {
        const lines = [];
        fs.createReadStream(filePathBats)
            .pipe(csv())
            .on('data', (data) => lines.push(data))
            .on('end', () => resolve(lines))
            .on('error', (error) => reject(error));
    });
};

app.get('/random-quote-bats', async (req, res) => {
    try {
        const lines = await readCSVFileBats(filePathBats);
        const randomIndex = Math.floor(Math.random() * lines.length);
        const randomQuote = lines[randomIndex];
        res.json(randomQuote);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(port, () => {
    console.log(`Microservice listening at http://localhost:${port}`);
});
