(document.getElementsByClassName('search__input')[0]
    .addEventListener('keyup', (event) => {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementsByClassName('search__button')[0].click();
        }
    })
);

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
    if (queryText==undefined || queryText==''){queryText = 'Reno, Nv';}
    queryText = queryText.replace(/,/, '%2C').replace(/ /, '%20');
    // Format url
    const startUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20location%2C%20item%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22';
    const endUrl = '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    let url = startUrl + queryText + endUrl;
    url = url.replace(/"/, '');
    return url;
}

/* exported getWeatherItem */
function getWeatherItem() {
    const url = createWeatherGetUrl();
    // Makes async GET request using parseWeatherItem() as a callback.
    httpGetAsync(url, parseWeatherItem);
}

/* exported parseWeatherItem */
function parseWeatherItem (o) {
    // Parses returned GET response, o, and extracts
    // the title, links, and text of each news story.
    const json = JSON.parse(o);
    const results = json.query.results.channel;
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
    location.innerHTML = city + ', ' + state;

    let condition = document.getElementsByClassName('weather__condition')[0];
    condition.innerHTML = 'It\'s ' + currentConditions.temp + ' &#8457 And Fucking ' + currentConditions.text;
}

function createWeatherForecast (forecasts) {
    // Takes parsed weather info and creates a div to be placed in the
    // .weather__forecast div. forecasts is an array of objects.
    const numForecasts = forecasts.length;
    let forecastHtml = '';
    for (let i = 0; i < numForecasts; i++) {
        const day = forecasts[i].day;
        const high = forecasts[i].high;
        const low = forecasts[i].low;
        const text = forecasts[i].text;
        const imgSrc = setImgSrc(forecasts[i].code);
        let forecastClass = '';
        let forecastClearfix = '';
        // Fixes Bug #1 | sets clearfixes
        if (i%2==1 && i!==3 && i!==7) {
            forecastClearfix = '<div class="clearfix visible-xs-block"></div>';
        } else if (i==3||i==7) {
            forecastClearfix = '<div class="clearfix visible-xs-block visible-sm-block"></div>';
        }
        // Set responsive classes
        if ((i == 0) || (i == 5)) {
            forecastClass = 'col-md-offset-1 ';
        } else if ((i == 4)) {
            forecastClearfix = '<div class="clearfix visible-md-block visible-lg-block"></div>';
        } else if ((i == 8)) {
            forecastClass = 'col-sm-offset-3 col-md-offset-0 col-lg-offset-0 ';
        }
        forecastHtml += '<div class="weather__forecast-item ' + forecastClass +
        'col-xs-6 col-sm-3 col-md-2"><div class="col-xs-12"><h3>' + day + '</h3></div><div class="col-xs-6"><p>'
        + high + ' &#8457</p><p>' + low + ' &#8457</p></div><div class="col-xs-6"><img class="img-responsive" src="assets/img/weather/'
        + imgSrc + '.png" /></div><div class="col-xs-12"><p>' + text + '</p></div></div>' + forecastClearfix;
    }
    // Remove visible class to hide weather__padding
    const weatherPadding = document.getElementsByClassName('weather__padding')[0].classList;
    if (weatherPadding.contains('visible-sm-block')) {
        weatherPadding.remove('visible-sm-block');
    }
    if (weatherPadding.contains('visible-md-block')) {
        weatherPadding.remove('visible-md-block');
    }
    if (weatherPadding.contains('visible-lg-block')) {
        weatherPadding.remove('visible-lg-block');
    }

    // Add hidden class to hide padding weather__forecast-title div
    const forecastTitle = document.getElementsByClassName('weather__forecast-title')[0];
    if (forecastTitle.classList.contains('hidden')) {
        forecastTitle.classList.remove('hidden');
    }

    // Insert forecastDiv into the html page
    let forecastDiv = document.getElementsByClassName('weather__forecast-boxes')[0];
    forecastDiv.innerHTML = forecastHtml;
}

function setImgSrc(code) {
    // Takes interger code from yahoo weather (0-47) and returns text to be used
    // for img src.  https://developer.yahoo.com/weather/documentation.html#codes
    const weatherCodes = ['Sunny', 'Cloudy', 'MostlyCloudy', 'CloudyNight', 'Thunderstorms', 'ThunderstormsNight', 'Drizzle', 'DrizzleNight', 'SlightDrizzle', 'Haze', 'Moon', 'Snow'];
    const yahooWeather =
        [
            weatherCodes[5],// 0
            weatherCodes[5],
            weatherCodes[5],
            weatherCodes[5],
            weatherCodes[5],
            weatherCodes[11],// 5
            weatherCodes[6],
            weatherCodes[11],
            weatherCodes[6],
            weatherCodes[6],
            weatherCodes[6],// 10
            weatherCodes[8],
            weatherCodes[6],
            weatherCodes[11],
            weatherCodes[11],
            weatherCodes[11],// 15
            weatherCodes[11],
            weatherCodes[7],
            weatherCodes[7],
            weatherCodes[0],
            weatherCodes[9],// 20
            weatherCodes[9],
            weatherCodes[9],
            weatherCodes[9],
            weatherCodes[9],
            weatherCodes[1],// 25
            weatherCodes[1],
            weatherCodes[3],
            weatherCodes[2],
            weatherCodes[3],
            weatherCodes[2],// 30
            weatherCodes[10],
            weatherCodes[0],
            weatherCodes[10],
            weatherCodes[2],
            weatherCodes[7],// 35
            weatherCodes[0],
            weatherCodes[4],
            weatherCodes[4],
            weatherCodes[8],
            weatherCodes[8],// 40
            weatherCodes[11],
            weatherCodes[11],
            weatherCodes[11],
            weatherCodes[11],
            weatherCodes[4],// 45
            weatherCodes[11],
            weatherCodes[4]
        ];
    return yahooWeather[code];

}
