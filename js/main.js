// function main() {

    var coordinates;
    var forecast;
    var weatherIcons;// = getJSON("https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json");

    function get(url) {

        return new Promise(function(resolve, reject) {
            
            var req = new XMLHttpRequest();
            
            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        resolve(req.responseText);
                    } else {
                        reject(Error(req.statusText));
                    }
                }
            };
            
            // Handle network errors
            req.addEventListener("error", function() {
                reject(Error("Network Error"));
            });

            req.open('GET', url);
            req.send();
        });
    }

    function getWeather() {

        // wait for coordinates
        if (coordinates === undefined) { 
            setTimeout(getWeather, 1000); 
            return; 
        }

        //get Open Weather JSON once coordinates are ready
        get("http://api.openweathermap.org/data/2.5/weather?lat=" + coordinates.lat + "&lon=" + coordinates.lon + "&units=metric&appid=3ee018281bf1fd7192d1cc78e0e3e24e").then(function(data) {

            forecast = JSON.parse(data);
            document.querySelector(".location").textContent  = forecast.name;
            document.querySelector(".description").textContent  = forecast.weather[0].description;
            document.querySelector(".wind").innerHTML = forecast.wind.speed + " km/h; <br> direction: " + forecast.wind.deg + " degrees";
            document.querySelector("#temp").textContent  = forecast.main.temp + " °C";
            
        }).then(function() {
            
            // get weather icon 
            get("https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json").then(function(data) {
                weatherIcons = JSON.parse(data);
                showWeatherIcon();
            });
        });
    }

    function showWeatherIcon() {
        
        //https://gist.github.com/tbranyen/62d974681dea8ee0caa1

        var prefix = 'wi wi-',
            code = forecast.weather[0].id,
            icon = weatherIcons[code].icon;

        // If we are not in the ranges mentioned above, add a day/night prefix.
        if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
        }

        // Finally tack on the prefix.
        icon = prefix + icon;
        console.log(icon);
        document.querySelector("#weather_icon").className = icon;
    }

    window.addEventListener("load", function() {
        
        var latAndLon = {lat: "", lon: ""},
            geoOptions = {enableHighAccuracy: true};

        function writeCoord() { coordinates = latAndLon; }

        function success(pos) {
            
            var crd = pos.coords;

            latAndLon.lat = crd.latitude;
            latAndLon.lon = crd.longitude;

            writeCoord();
        }

        function error(err) {
            console.warn("ERROR(" + err.code + "): " + err.message);
            latAndLon = {};
        };

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        
        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    });

    getWeather();
    //  showWeatherIcon();

// }

// main();