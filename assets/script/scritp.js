// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// API key for GeoCoding parameters  : q(required)-> city name,state code//// appid reuiqred API key get my own
var APIkey = 'd9bce79fe872e513ee7b58c79fd85200'


// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// one call api


// https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
// current weather data


// https://developers.google.com/maps/documentation/javascript/places#places_photos
// add background imaget based on city name



// var requestUrl = 'https://api.github.com/orgs/nodejs/repos?per_page=5';
// // var requestUrl = 'https://api.github.com/orgs/nodejs/repo?per_page=5';

// var responseText = document.getElementById('response-text');

function getApi(requestUrl) {
  fetch(requestUrl)
    .then(function (response) {
      console.log(response);
      // We check whether the response.status equals 200, as follows:
      if (response.status === 200) {
      	//If it does, we assign the status code from response.status to the textContent
        responseText.textContent = response.status;
      }
      // we return response.json()
      return response.json();
  }).then(function(data){
    console.log(data);
  });
}

getApi(requestUrl);
