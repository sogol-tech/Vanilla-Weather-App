function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let dateElement = date.getDate();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day}, ${month} ${dateElement} ${hours}:${minutes}`;
}

function getForecast(coordinates) {
  let apiKey = "f22ac1427987190f2bc60c389965004c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${Math.round(response.data.main.temp)}°`;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let minElement = document.querySelector("#minTemp");
  minElement.innerHTML = Math.round(response.data.main.temp_min);

  let maxElement = document.querySelector("#maxTemp");
  maxElement.innerHTML = Math.round(response.data.main.temp_max);

  dateElement = document.querySelector("#dt");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  celsiusTemperature = response.data.main.temp;

  let imageElemenet = document.getElementById("img");
  let icon = `src/images/${response.data.weather[0].icon}.png`;
  imageElemenet.setAttribute("src", icon);

  let nightIconNumber = [
    "01n",
    "02n",
    "03n",
    "04n",
    "09n",
    "10n",
    "13n",
    "50n",
  ];
  if (nightIconNumber.includes(response.data.weather[0].icon)) {
    temperatureElement.classList.add("font-colour");
  } else {
    temperatureElement.classList.remove("font-colour");
  }
  getForecast(response.data.coord);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastday, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="forecast-days">${formatDay(forecastday.dt)}</div>
                <img
                  src="https://openweathermap.org/img/wn/${
                    forecastday.weather[0].icon
                  }@2x.png"
                  alt=""
                  width="36"
                />
                <div class="forecast-temperature">
                  <span class="forecast-temperature-max">${Math.round(
                    forecastday.temp.max
                  )}°</span>
                  <span class="forecast-temperature-min">${Math.round(
                    forecastday.temp.min
                  )}°</span>
                </div>
              </div>`;
    }
  });

  forecastHTML = forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function search(city) {
  let apiKey = "f22ac1427987190f2bc60c389965004c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let celsiusTemperature = null;

let form = document.querySelector("#searchCity");
form.addEventListener("submit", handleSubmit);

function showPosition(position) {
  apiKey = "f22ac1427987190f2bc60c389965004c";
  apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
function retrievePosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let currentLocationElement = document.querySelector("#currentLocationButton");
currentLocationElement.addEventListener("click", retrievePosition);

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemp = Math.round((celsiusTemperature * 9) / 5 + 32);
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${fahrenheitTemp}°`;
}
let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

function displaycelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
}
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displaycelsiusTemperature);

search("London");
