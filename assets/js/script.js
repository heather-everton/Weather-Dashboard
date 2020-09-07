$(document).ready(function(){

    var weatherFormEl = document.querySelector("#weather-form");
    var cityInputEl = document.querySelector("#city");
    var weatherContainerEl = document.querySelector("#weather-container");
    var zipSearchTerm = document.querySelector("#zip-search-term");
    var cities = JSON.parse(localStorage.getItem ("cities")) || [];
    var lat;
    var lon;
    var savedWeatherElement = document.querySelector('.search-hist')
    var forecastInfo = $("#forecast")

        
    
    var getWeatherInfo = function(city) {
        // format the github api url
        var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ceb07fd28e874e56f65ba9fc8499c396";
      
        // make a request to the url
        fetch(apiUrl)
            .then(function(response) {
                if (response.ok) {
                    response.json()
                    .then(function(data) {
                        displayWeather(data, city)
                        return data
                    })
                    .then(function(data){
                        var lat = data.coord.lat 
                        var lon = data.coord.lon
                        return fetch(
                            "https://api.openweathermap.org/data/2.5/uvi?appid=ceb07fd28e874e56f65ba9fc8499c396&lat=" + lat + "&lon=" + lon 
                        )
                    })
    
                    .then (function(response) {
                        // console.log (response.json())
                        return response.json()
                    })
                    .then(function(data){
                        var uvIndex = data.value;
                        // create contaiiner for the weather info
                        var uvEl = document.createElement("div");
                 
                        //create a span element to hold city name
                        var weatherEl = document.createElement("span");
                        weatherEl.textContent = "UV Index: " + uvIndex;
                    
                        //append to container
                        uvEl.appendChild(weatherEl);
                        
                        // append container to the dom
                        weatherContainerEl.appendChild(uvEl)

                        if (uvIndex <= 2) {
                            uvEl.setAttribute("class", "rounded-pill w-25 shadow p-3 mb-2 bg-info text-dark info-text")
                       } if ( uvIndex > 2 && uvIndex < 8) {
                            uvEl.setAttribute("class", "rounded-pill w-25 shadow p-3 mb-2 bg-warning text-dark info-text")
                       } else if (uvIndex >= 8){
                            uvEl.setAttribute("class", " rounded-pill w-25 shadow p-3 mb-2 bg-danger text-dark info-text")
                       }
                    })
                    
                } else {
                    alert("Error: " + response.statusText);
                }
            })
            .catch(function(error) {
                // Notice this ".catch()" getting chained onto the end of the ".then()" method
                alert("Unable to connect to OpenWeather")
            })
    
            getForecast(city);
    };
    
    var formSubmitHandler = function(event) {
        forecastInfo.textContent = "";

        event.preventDefault();
        var cityName = cityInputEl.value.trim();
    
        if (cityName) {
            getWeatherInfo(cityName);
            displayHistory(cityName)
            cityInputEl.value = "";
        } else {
            alert("Please enter a city");
        }
        saveHistory(cityName);
    };
    
    var displayWeather = function(response) {
        // check if api returned any repos
        if (response.length === 0) {
            weatherContainerEl.textContent = "No city found.";
            return;
        }
      
        // clear old content
        weatherContainerEl.textContent = "";

        // zipSearchTerm.textContent = searchTerm;
    
        var cityName = response.name + " " + moment().format("(MM[/]DD[/]YYYY)");
            // create contaiiner for the weather info
            var cityEl = document.createElement("h1");
        
            //create a span element to hold city name
            var titleEl = document.createElement("span");
            titleEl.textContent = cityName;
        
            //append to container
            cityEl.appendChild(titleEl);
            
            // append container to the dom
            weatherContainerEl.appendChild(cityEl)
    
        var temp = response.main.temp
            // create contaiiner for the weather info
            var tempEl = document.createElement("div");
        
            //create a span element to hold city name
            var weatherEl = document.createElement("span");
            weatherEl.textContent = "Current Temp: " + temp + "F";
        
            //append to container
            tempEl.appendChild(weatherEl);
            
            // append container to the dom
            weatherContainerEl.appendChild(tempEl)
        
        var humidity = response.main.humidity
            // create contaiiner for the weather info
            var humidityEl = document.createElement("div");
        
            //create a span element to hold city name
            var weatherEl = document.createElement("span");
            weatherEl.textContent = "Humidity: " + humidity + "%";
            
            //append to container
            humidityEl.appendChild(weatherEl);
                
            // append container to the dom
            weatherContainerEl.appendChild(humidityEl)
    
        var wind = response.wind.speed
        var windEl = document.createElement("div");
        var windCont = document.createElement("span");
        windCont.textContent = "Wind speed: " + wind + "MPH";
        windEl.appendChild(windCont);
        weatherContainerEl.appendChild(windEl)
        weatherContainerEl.appendChild(windEl, humidityEl, tempEl)
    
    };
    
    var saveHistory = function (cityName) {
        cities.push(cityName);
        localStorage.setItem ("cities", JSON.stringify(cities))
    };
    
    // var displayHistory = function (cityName) {
    //     for (i = 0; i < cities.length; i++) {
    //         // var citiesArr = cities[i]
    //         var cityButton = $("button").text(cities[i])
    //         var historyEl = $("#search-history");
    //         historyEl.append(cityButton);
    //     };
    // }
    
    var getForecast = function(city){  
        // make a request to the url
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=ceb07fd28e874e56f65ba9fc8499c396")
        .then(function(response) {
            response.json() 
            .then(function(data) {
                for (i = 0; i < data.list.length; i++) {
                    if (data.list[i].dt_txt.indexOf("15:00:00") !== -1){
                        //create cards for weather info
                        var dailyCol = $("<div>").addClass("col-md-2")
                        var dailyCard = $("<div>").addClass("card")
                        var cardBody = $("<div>").addClass("card-body")
    
                        //create data to go on the cards
                        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                        var cardTemp = $("<p>").text("Temp: " + data.list[i].main.temp_max)
                        var cardHumidity = $("<p>").text("Humidity: " + data.list[i].main.humidity)
                        
                        //put the data in the cardBody
                        cardBody.append(img);
                        cardBody.append(cardTemp);
                        cardBody.append(cardHumidity);
    
                        //put the card body in the columns
                        dailyCard.append(cardBody);
                        dailyCol.append(dailyCard);
                        forecastInfo.append(dailyCol);
                        
                    }
    
                }
            })
        });
    }

var displayHistory = function(cityName){   
    var counter = 0
    // loops through cities array to create search buttons
    savedWeatherElement.innerHTML = ' '
    for (i=0; i<cities.length; i++) {
        var savedCities = document.createElement('button')
        savedCities.setAttribute("class", "btn-light m-1 btn btn-lg btn-block")
        savedCities.setAttribute("id", counter++)
        // savedCities.innerHTML = `onclick="currentWeather()"`
        var savedDiv = document.createElement('div')
        savedCities.innerHTML =cities[i]
        savedDiv.appendChild(savedCities)
        savedWeatherElement.appendChild(savedDiv)
        // searchHistoryCall(savedCities)
        var firstButton = document.getElementById("0")
        var x = document.getElementById("0").textContent;
        firstButton.addEventListener("click",function(){
            document.getElementById(inputValue).setAttribute('value', x)
            location.reload(true);
        })
    }
}
    
    weatherFormEl.addEventListener("submit", formSubmitHandler);
    displayHistory();
})