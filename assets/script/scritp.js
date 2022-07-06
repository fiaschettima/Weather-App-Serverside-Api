// Global Vars-----------------------------------------------------------------------
var cityInput = document.getElementById('citySelctor');
var enterSearch = document.getElementById('searchButton')
var searchValue = document.getElementById('citySelctor')
var APIkey = 'd9bce79fe872e513ee7b58c79fd85200'
var currentTimeUni = moment().format('X');
var currentTimeDate = moment().format('LLLL');
var currentCityCard = document.getElementById('currentCityInfo');
var savedCities = [];
// event listener for button and enter key for search input field-----------------------------------------------------------------------
enterSearch.addEventListener('click', function(event){
    event.preventDefault;
    var searchInformation = searchValue.value;
    runCitySearch(searchInformation);
    searchValue.value = "";
})
searchValue.addEventListener('keyup', function(event){
    if(event.code === 'Enter' && searchValue.value !== ''){
        event.preventDefault;
        var searchInformation = searchValue.value;
        runCitySearch(searchInformation);
        searchValue.value = "";
    }else{return}
})
var seachHistList = document.getElementById('searchHistory');
seachHistList.addEventListener('click', function(event){
    var pressed = event.target
    // console.log(pressed.textContent)
    runCitySearch(pressed.textContent);
})

// add event listener to list that runs runcitysearch again based on textcontent of button 
// Get information from weather source -----------------------------------------------------------------------
function runCitySearch(searchInformation) {
    var openWeatherGeoCoding = 'https://api.openweathermap.org/geo/1.0/direct?q='+ searchInformation + '&appid=' + APIkey;
    fetch(openWeatherGeoCoding)
      .then(function (response) {
        return response.json();
    }).then(function(data){
        // clear content from previous search
        currentCityCard.textContent = '';
        if(!savedCities.includes(data[0].name)){
        var searchHistoryContainer = document.getElementById('searchHistory');
        var searchedCityItem = document.createElement('li');
        searchedCityItem.classList.add('list-group-item' , 'prevCityList');
        searchedCityItem.setAttribute('data-local', data[0].name)
        searchedCityItem.textContent = data[0].name;
        savedCities.push( data[0].name);
        localStorage.setItem('search', JSON.stringify(savedCities));
        searchHistoryContainer.appendChild(searchedCityItem)
        }
        var currentCityHeading = document.createElement('h4')
        currentCityHeading.textContent = data[0].name + ": " + currentTimeDate;
        currentCityCard.appendChild(currentCityHeading);
        console.log(savedCities)
        // }
        // console.log(data)
        var cityLat =data[0].lat;
        var cityLong = data[0].lon;
        var oneCallAPI = 'https://api.openweathermap.org/data/2.5/onecall/timemachine?lat='+ cityLat+ '&lon=' + cityLong +'&dt='+currentTimeUni + '&units=imperial&appid=' + APIkey;
    
        fetch(oneCallAPI)
            .then(function(response){
                return response.json();
            }).then(function(data){
                // console.log(data);
                // All data taken and now use to append to page
                var weatherIcon = document.createElement('img');
                weatherIcon.setAttribute('src', 'https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png');
                weatherIcon.setAttribute('alt', data.current.weather[0].description);
                currentCityCard.appendChild(weatherIcon);
                var UVIN = document.createElement('span')
                UVIN.setAttribute('class', 'UVINcontainer')
                UVIN.textContent = data.current.uvi;
                // add if to check value of UV and change spans class to change background color
                if(data.current.uvi < 5){
                    UVIN.classList.add('uv_low')
                }else if( data.current.uvi >= 5 && data.current.uvi < 10){
                    UVIN.classList.add('uv_middle')
                }else if(data.current.uvi >= 10){
                    UVIN.classList.add('uv_high')
                }else{
                    UVIN.setAttribute('style', '')
                }
                var currentTemp = document.createElement('p')
                currentTemp.textContent = 'Temp: ' + data.current.temp + ' \u2109';
                currentCityCard.appendChild(currentTemp);

                var currentWindS = document.createElement('p')
                currentWindS.textContent = 'Wind: ' + data.current.wind_speed + ' MPH';
                currentCityCard.appendChild(currentWindS);

                var currentHumidity = document.createElement('p')
                currentHumidity.textContent = 'Humidity: ' + data.current.humidity + '%';
                currentCityCard.appendChild(currentHumidity);

                var currentUV = document.createElement('p')
                currentUV.textContent = 'UV Index: ';
                currentUV.appendChild(UVIN);
                currentCityCard.appendChild(currentUV);
            })
            var fivedayAPI = 'https://api.openweathermap.org/data/2.5/onecall?lat='+cityLat+'&lon='+cityLong+'&exclude=current,minutely,hourly,alerts&units=imperial&appid='+ APIkey;
            // console.log(fivedayAPI)
            fetch(fivedayAPI).then(function(response){
                return response.json();
            }).then(function(data){
                // console.log(data);
                document.getElementById('cardContainer').innerHTML = '';
                // i set to 1 because 0 would be today and today is already shown in active card
                for(i=1; i < 6; i++){
                var dailyContainer = document.createElement('div');
                var dailyContHead = document.createElement('div');
                var dailyContBody = document.createElement('div');
                var futureDate = document.createElement('h5');
                var futureTemp = document.createElement('p');
                var futureWind = document.createElement('p');
                var futureHumid = document.createElement('p');
                var futureIcon = document.createElement('img');
                var dailyContBody = document.createElement('div');
                // var classes = ['card', 'text-bg-light', 'mb-3','col-12', 'col-md-3', 'col-lg-4'];
                // document.getElementById('fiveDay').classList.remove('hidden');
                dailyContainer.classList.add('card', 'mb-3', 'col-12', 'col-md-6', 'col-lg-4');
                dailyContHead.classList.add('card-header');
                dailyContBody.classList.add('card-body');
                futureDate.classList.add('card-title');
                // futureInfo.classList.add('card-text');
                var convertingUNIX = new Date(data.daily[i].dt * 1000);
                var humanFormat = convertingUNIX.toLocaleString();
                dailyContHead.textContent = humanFormat;
                futureTemp.textContent = 'High Temp: ' + data.daily[i].temp.max + '\u2109';
                futureWind.textContent = 'Wind: '+ data.daily[i].wind_speed + 'MPH';
                futureHumid.textContent = 'Humidity: ' + data.daily[i].humidity + "%";
                futureIcon.setAttribute('src',  'https://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png');
                futureIcon.setAttribute('alt',  'current weather icon');
                dailyContainer.appendChild(dailyContHead);
                dailyContBody.appendChild(futureIcon);
                dailyContBody.appendChild(futureTemp);
                dailyContBody.appendChild(futureWind);
                dailyContBody.appendChild(futureHumid);
                dailyContainer.appendChild(dailyContBody);
                document.getElementById('cardContainer').appendChild(dailyContainer);               
                }
            })
    });
  }
  function formList(data){
    // console.log(data);
    var searchHistoryContainer = document.getElementById('searchHistory');
    var searchedCityItem = document.createElement('li');
    searchedCityItem.classList.add('list-group-item' , 'prevCityList');
    searchedCityItem.textContent = data;
    searchHistoryContainer.appendChild(searchedCityItem)

}

  function reFreshPage(){
    // console.log(JSON.parse(localStorage.getItem('search')));
    var gotItem = JSON.parse(localStorage.getItem('search'));
    // console.log(gotItem);
    if(gotItem == null){
        return}
        else{
    for(i=0; i<gotItem.length; i++){
        savedCities.push( gotItem[i]);
        formList(gotItem[i]);
    }
}
}
reFreshPage()
// https://developers.google.com/maps/documentation/javascript/places#places_photos
// add background imaget based on city name

// tomorrow
// Get local storage to work and print to list