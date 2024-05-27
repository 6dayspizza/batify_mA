/*
    IMPORTS
*/

const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const corsOptions = {
  origin: [
    "https://lit-everglades-39146-fd2b4b5a3c5f.herokuapp.com",
    "http://localhost:3000",
    "https://caddybuddy-1b6344ebc937.herokuapp.com/",
  ],
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

/*
    FILE READING
*/

const filePathGolf = "files/quotes_golf.csv";
const filePathBats = "files/quotes_bats.csv";

const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const lines = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => lines.push(data))
      .on("end", () => resolve(lines))
      .on("error", (error) => reject(error));
  });
};

const handleRandomQuoteRoute = (filePath) => {
  return async (req, res) => {
    try {
      const lines = await readCSVFile(filePath);
      const randomIndex = Math.floor(Math.random() * lines.length);
      const randomQuote = lines[randomIndex];
      res.json(randomQuote);
    } catch (error) {
      console.error("Error reading CSV file:", error);
      res.status(500).send("Internal Server Error");
    }
  };
};

/*
    GET REQUESTS
*/

app.get("/random-quote-golf", handleRandomQuoteRoute(filePathGolf));
app.get("/random-quote-bats", handleRandomQuoteRoute(filePathBats));
app.get("/", (req, res) => {
  res.send("hi microserviceA");
});

/*
    LISTENER
*/

app.listen(port, () => {
  console.log(`Microservice listening at http://localhost:${port}`);
});
