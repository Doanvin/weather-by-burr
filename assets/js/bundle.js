'use strict';

function getJson(url, callback) {
    // Makes requests to an api that returns json
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        xhr.readyState == 4 && xhr.status == 200 ? callback(xhr.responseText) : callback({});
    };
    xhr.open('GET', url, true); // true for asynchronous
    xhr.send(null);
}

function setWeatherUrl(queryText) {
    // queryText is value of search input box; Reno, Nv if undefined
    queryText === undefined || queryText == '' ? queryText = 'Reno, Nv' : queryText = queryText.replace(/,/, '%2C').replace(/ /, '%20');

    // Format url
    var startUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20location%2C%20item%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22';
    var endUrl = '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    var url = startUrl + queryText + endUrl;
    url = url.replace(/"/, '');
    return url;
}

/* exported getWeatherItem */
function getWeatherItem(search_query) {
    var url = setWeatherUrl(search_query);
    // Makes async GET request using parseWeatherItem() as a callback.
    getJson(url, parseWeatherItem);
}

/* exported parseWeatherItem */
function parseWeatherItem(o) {
    // Parses returned GET response, o, and extracts
    // the title, links, and text of each news story.
    var json = JSON.parse(o);
    var results = json.query.results.channel;
    var city = results.location.city;
    var state = results.location.region;
    var country = results.location.country;
    var current = results.item.condition;
    var forecasts = results.item.forecast;
    setWeatherCurrent(city, state, country, current);
    setWeatherForecast(forecasts);
}

function setWeatherCurrent(city, state, country, current) {
    // Takes parsed weather info and creates a div to be placed in the
    // .weatherCurrent div. All variables passed in should be strings.
    var location = document.getElementsByClassName('weather__location')[0];
    location.innerHTML = city + ', ' + state;

    var imgSrc = setImgSrc(current.code);

    var condition = document.getElementsByClassName('weather__condition')[0];
    condition.innerHTML = '<img height="150px" width="150px" src="assets/img/weather/' + imgSrc + '.png" /><br/>' + 'It\'s ' + current.temp + ' &#8457 And ' + current.text;
}

function setWeatherForecast(forecasts) {
    // Takes parsed weather info and creates a div to be placed in the
    // .weather__forecast div. forecasts is an array of objects.
    var numForecasts = forecasts.length;
    var forecastHtml = '';
    for (var i = 0; i < numForecasts; i++) {
        var day = forecasts[i].day;
        var high = forecasts[i].high;
        var low = forecasts[i].low;
        var text = forecasts[i].text;
        var imgSrc = setImgSrc(forecasts[i].code);
        var forecastClass = '';
        var forecastClearfix = '';
        // Fixes Bug #1 | sets clearfixes
        if (i % 2 == 1 && i !== 3 && i !== 7) {
            forecastClearfix = '<div class="clearfix visible-xs-block"></div>';
        } else if (i == 3 || i == 7) {
            forecastClearfix = '<div class="clearfix visible-xs-block visible-sm-block"></div>';
        }
        // Set responsive classes
        if (i == 0 || i == 5) {
            forecastClass = 'col-md-offset-1 ';
        } else if (i == 4) {
            forecastClearfix = '<div class="clearfix visible-md-block visible-lg-block"></div>';
        } else if (i == 8) {
            forecastClass = 'col-sm-offset-3 col-md-offset-0 col-lg-offset-0 ';
        }
        forecastHtml += '<div class="weather__forecast-item ' + forecastClass + 'col-xs-6 col-sm-3 col-md-2"><div class="col-xs-12"><h3>' + day + '</h3></div><div class="col-xs-6"><p>' + high + ' &#8457</p><p>' + low + ' &#8457</p></div><div class="col-xs-6"><img class="img-responsive" src="assets/img/weather/' + imgSrc + '.png" /></div><div class="col-xs-12"><p>' + text + '</p></div></div>' + forecastClearfix;
    }

    // Add hidden class to hide padding weather__forecast-title div
    var forecastTitle = document.getElementsByClassName('weather__forecast-title')[0];
    if (forecastTitle.classList.contains('hidden')) {
        forecastTitle.classList.remove('hidden');
    }

    // Insert forecastDiv into the html page
    var forecastDiv = document.getElementsByClassName('weather__forecast-boxes')[0];
    forecastDiv.innerHTML = forecastHtml;
}

function setImgSrc(code) {
    // Takes interger code from yahoo weather (0-47) and returns text to be used
    // for img src.  https://developer.yahoo.com/weather/documentation.html#codes
    var weatherCodes = ['Sunny', 'Cloudy', 'MostlyCloudy', 'CloudyNight', 'Thunderstorms', 'ThunderstormsNight', 'Drizzle', 'DrizzleNight', 'SlightDrizzle', 'Haze', 'Moon', 'Snow'];
    var yahooWeather = [weatherCodes[5], // 0
    weatherCodes[5], weatherCodes[5], weatherCodes[5], weatherCodes[5], weatherCodes[11], // 5
    weatherCodes[6], weatherCodes[11], weatherCodes[6], weatherCodes[6], weatherCodes[6], // 10
    weatherCodes[8], weatherCodes[6], weatherCodes[11], weatherCodes[11], weatherCodes[11], // 15
    weatherCodes[11], weatherCodes[7], weatherCodes[7], weatherCodes[0], weatherCodes[9], // 20
    weatherCodes[9], weatherCodes[9], weatherCodes[9], weatherCodes[9], weatherCodes[1], // 25
    weatherCodes[1], weatherCodes[3], weatherCodes[2], weatherCodes[3], weatherCodes[2], // 30
    weatherCodes[10], weatherCodes[0], weatherCodes[10], weatherCodes[2], weatherCodes[7], // 35
    weatherCodes[0], weatherCodes[4], weatherCodes[4], weatherCodes[8], weatherCodes[8], // 40
    weatherCodes[11], weatherCodes[11], weatherCodes[11], weatherCodes[11], weatherCodes[4], // 45
    weatherCodes[11], weatherCodes[4]];
    return yahooWeather[code];
}

function getZipCode(json) {
    // Parses response from request and returns zip code

    try {
        var o = JSON.parse(json);
        getWeatherItem(o.zip_code);
    } catch (e) {
        getWeatherItem('89503');
    }
}

/* exported getWeatherByIp */
function getWeatherByIp() {
    var url = 'https://freegeoip.net/json/';
    // Makes async GET request using getCityState() as a callback.
    getJson(url, getZipCode);
}

function setIframeSrc() {
    // Sets the src attribute of YouTube iframes after the page has loaded
    var iframeSrcs = ['https://www.youtube.com/embed/S9ZSzuj1UpA', 'https://www.youtube.com/embed/FR7YnNM6IXA?list=RDFR7YnNM6IXA', 'https://www.youtube.com/embed/8fo4STfDlZk?list=PLJMuYl1_E0hehY29rF1_p1UAOaxo_1S49', 'https://www.youtube.com/embed/x9iYvyffAh4?list=RDGAlU9nVnFx8'];
    var iframes = document.getElementsByTagName('iframe');

    for (var i = 0; i < iframes.length; i += 1) {
        iframes[i].src = iframeSrcs[i];
    }
}
/* exported windowLoad */
function windowLoad() {
    getWeatherByIp();

    // Creates event listener on search input. Pressing enter clicks search.
    document.getElementsByClassName('search__input')[0].addEventListener('keyup', function (event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            document.getElementsByClassName('search__button')[0].click();
        }
    });

    window.setTimeout(setIframeSrc, 1000);
}
//# sourceMappingURL=bundle.js.map
