function getWeatherItem() {
    let queryText = document.getElementsByClassName('weather__query-item--start')[0].value;
    queryText = queryText.replace(/,/, '%2C').replace(/ /, '%20');
    const startUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22';
    const endUrl = '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=parseWeatherItem';
  // Format the url
    let url = startUrl + queryText + endUrl;
    url = url.replace(/"/, '');
    console.log(url);
  // Create the script element that makes the api call and uses
  // parseWeatherItem() as a callback.
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
}

function parseWeatherItem (o) {
  // Parses returned response, o, and extracts
  // the title, links, and text of each news story.
    const results = o.query.results.channel;
    console.log(results);
    const city = results.location.city;
    console.log(city);
    const state = results.location.region;
    const country = results.location.country;
    const current = results.item.condition;
    console.log(current);
    const forecasts = results.item.forecast;
    console.log(forecasts);
    let output = '';
    createWeatherCurrent(city, state, country, current);
    createWeatherForecast(forecasts);
}

function createWeatherCurrent (city, state, country, currentConditions) {
  // Takes parsed weather info and creates a div to be placed in the
  // #weatherCurrent div. All variables passed in should be strings.
    return console.log(document.getElementsByClassName('weather__current')[0].innerHTML);
}

function createWeatherForecast (forecasts) {
    const noForecasts = forecasts.length;
    for (let i = 0; i < noForecasts; i++) {
        const day = forecasts[i].day;
        const high = forecasts[i].high;
        const low = forecasts[i].low;
        const text = forecasts[i].text;
        output += '<div class='+ '"row"' + '><h3><a href=\'' + link + '\'>'+title+'</a></h3>' + desc + '</div><hr/>';
    }
}
