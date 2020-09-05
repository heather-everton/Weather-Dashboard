var weatherFormEl = document.querySelector("#weather-form");
var cityInputEl = document.querySelector("#city");
var weatherContainerEl = document.querySelector("#weather-container");
var zipSearchTerm = document.querySelector("#zip-search-term");



var getWeatherInfo = function(city) {
    // format the github api url
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=ceb07fd28e874e56f65ba9fc8499c396";
  
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, city);
            });
          } else {
            alert("Error: " + response.statusText);
          }
    })
    .catch(function(error) {
        // Notice this ".catch()" getting chained onto the end of the ".then()" method
        alert("Unable to connect to OpenWeather")
    })
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getWeatherInfo(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
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

    var cityName = response.name;

    // create contaiiner for the weather info
    var cityEl = document.createElement("h1");
    
    // cityEl.classList = "list-item flex-row justify-space-between align-center";

    //create a span element to hold city name
    var titleEl = document.createElement("span");
    titleEl.textContent = cityName;

    //append to container
    cityEl.appendChild(titleEl);
    
    // append container to the dom
    weatherContainerEl.appendChild(cityEl)

    for (property in response.main){
        var weatherInfo = property +" "+ response.main[property];

        // create contaiiner for the weather info
        var weatherEl = document.createElement("div");
            
        //create a span element to hold city name
        var tempEl = document.createElement("span");
        tempEl.textContent = weatherInfo;
    
        //append to container
        weatherEl.appendChild(tempEl);
        
        // append container to the dom
        weatherContainerEl.appendChild(weatherEl)
    }

};
  
weatherFormEl.addEventListener("submit", formSubmitHandler);