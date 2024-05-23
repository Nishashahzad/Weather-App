const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res) => {
    const query = req.body.cityName;
    const apiKey = 'b6c023419ca57def3b1a65905e7fa5fc';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;

            res.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Weather Result</title>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background: linear-gradient(to right, #74ebd5, #9face6);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            flex-direction: column;
                        }
                        .weather-container {
                            background: rgba(255, 255, 255, 0.8);
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            text-align: center;
                        }
                        h1 {
                            color: #333;
                        }
                        p {
                            font-size: 1.2em;
                            color: #666;
                        }
                        a {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 10px 20px;
                            background-color: #3498db;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            transition: background-color 0.3s ease;
                        }
                        a:hover {
                            background-color: #2980b9;
                        }
                    </style>
                </head>
                <body>
                    <div class="weather-container">
                        <h1>The temperature in ${query} is ${temp}°C</h1>
                        <p>The weather description is ${description}</p>
                        <a href="/">Go Back</a>
                    </div>
                </body>
                </html>
            `);
            res.end();
        });
    }).on('error', (error) => {
        console.error('Error fetching the weather data:', error);
        res.send('Error fetching the weather data');
    });
});

app.listen(3000, () => console.log("Our server is running on http://localhost:3000"));
