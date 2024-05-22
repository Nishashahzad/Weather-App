const express = require('express');
const https = require('https');
const bodyParser = require('body-parser'); // Correctly require body-parser

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // Correctly use body-parser

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
    const query = req.body.cityName;
    const apiKey = 'b6c023419ca57def3b1a65905e7fa5fc';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

    https.get(url, (response) => {
        let data = '';

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', () => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            res.write("<h1>The temperature in " + query + " is " + temp + " degree Celsius </h1>");
            res.write("<p>The weather description is " + description + "</p>");
            res.end(); // Ending the response after writing all data
        });
    }).on('error', (error) => {
        console.error('Error fetching the weather data:', error);
        res.send('Error fetching the weather data');
    });
});

app.listen(3000, () => console.log("Our server is running on http://localhost:3000"));
