(document.getElementsByClassName('search__input')[0]
    .addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementsByClassName('search__button')[0].click();
        }
    })
());

function httpGetAsync(theUrl, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200)
            callback(xhr.responseText);
    };
    xhr.open('GET', theUrl, true); // true for asynchronous
    xhr.send(null);
}

function createWeatherGetUrl() {
    let queryText = document.getElementsByClassName('search__input')[0].value;
    // queryText is value of search input box; Reno, Nv if undefined
    if (queryText == undefined){queryText = 'Reno, Nv';}
    queryText = queryText.replace(/,/, '%2C').replace(/ /, '%20');
    // Format url
    const startUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22';
    const endUrl = '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=parseWeatherItem';
    let url = startUrl + queryText + endUrl;
    url = url.replace(/"/, '');
    return url;
}


/* exported getWeatherItem */
function getWeatherItem() {
    const url = createWeatherGetUrl();
    httpGetAsync(url, parseWeatherItem());
    // Create the script element that makes the api call and uses
    // parseWeatherItem() as a callback.

}

// function createAsyncScript(srcUrl) {
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = srcUrl;
//     script.setAttribute('async','');
//     document.body.appendChild(script);
// }

/* exported parseWeatherItem */
function parseWeatherItem (o) {
    // Parses returned response, o, and extracts
    // the title, links, and text of each news story.
    const results = o.query.results.channel;
    const city = results.location.city;
    const state = results.location.region;
    const country = results.location.country;
    const current = results.item.condition;
    const forecasts = results.item.forecast;
    createWeatherCurrent(city, state, country, current);
    createWeatherForecast(forecasts);
}

function createWeatherCurrent (city, state, country, currentConditions) {
    // Takes parsed weather info and creates a div to be placed in the
    // .weatherCurrent div. All variables passed in should be strings.
    let location = document.getElementsByClassName('weather__location')[0];
    location.innerHTML = city + ', ' + state + '<br/>' + country;

    let condition = document.getElementsByClassName('weather__condition')[0];
    condition.innerHTML = 'It\'s ' + currentConditions.temp + ' &#8457 and Fucking ' + currentConditions.text;
}

function createWeatherForecast (forecasts) {
    // Takes parsed weather info and creates a div to be placed in the
    // .weather__forecast div. Forecasts is an array of objects.
    const noForecasts = forecasts.length;
    let forecastHtml = '';
    for (let i = 0; i < noForecasts; i++) {
        const day = forecasts[i].day;
        const high = forecasts[i].high;
        const low = forecasts[i].low;
        const text = forecasts[i].text;
        forecastHtml += '<div class="weather__forecast-item col-xs-6 col-sm-3 col-md-2"><h3>' + day + '</h3><p>' + high + '</p><p>' + low + '</p><p>' + text + '</p></div>';
    }
    // Remove hidden class to display weather__forecast-title div
    const forecastTitle = document.getElementsByClassName('weather__forecast-title')[0];
    if ( forecastTitle.classList.contains('hidden') ) {
        forecastTitle.classList.remove('hidden');
    }

    let forecastDiv = document.getElementsByClassName('weather__forecast-boxes')[0];
    forecastDiv.innerHTML = forecastHtml;
}
