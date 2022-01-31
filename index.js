const http = require('http');
const fs = require('fs');
const requests = require('requests');
let htmlFile = fs.readFileSync("index.html", 'utf-8');

var replaceAll = (serverData) => {
    htmlFile = htmlFile.replace("{%temp%}", (serverData.main.temp - 273.15).toFixed(2));
    htmlFile = htmlFile.replace("{%name%}", serverData.name);
    htmlFile = htmlFile.replace("{%feel-temp%}",Math.floor( serverData.main.feels_like - 273.15));
    htmlFile = htmlFile.replace("{%humidity%}", serverData.main.humidity);
    htmlFile = htmlFile.replace("{%icon%}",serverData.weather[0].main);
    return htmlFile;
}
var server = http.createServer((req, res) => {
    let api = "https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&appid=7a1425de55b4ac8c902465cf06db734b";
    if (req.url == '/') {
        requests(api)
            .on('data', function (chunk) {
                let data = JSON.parse(chunk);
                let orignalData = [data];
                orignalData.map(val => {
                    const file = replaceAll(val);
                    res.write(file);
                    res.end();
                })
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
            })
    } else {
        res.writeHead(400);
        res.end("404 Error");
    }

});

server.listen(8000, () => {
    console.log("server listen at port 8000");
});