function getWeatherItem() {
	var queryText = document.getElementById("weatherQuery").value;
  console.log(queryText);
  queryText = queryText.replace(/,/, '%2C').replace(/ /, '%20');
  console.log(queryText);
  var startUrl = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22';
  var endUrl = '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=parseWeatherItem';
  // Format the url
  var url = startUrl + queryText + endUrl;
  url = url.replace(/"/, '')
  console.log(url);
  // Create the script element that makes the api call and uses
  // parseWeatherItem() as a callback.
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
}

function parseWeatherItem (o) {
  // Parses returned response, o, and extracts
  // the title, links, and text of each news story.
  var items = o.query.results.item;
  var output = '';
  var no_items=items.length;
  for(var i=0;i<no_items;i++){
    var title = items[i].title;
    var link = items[i].link;
    var desc = items[i].description;
    output += "<div class="+ '"row"' + "><h3><a href='" + link + "'>"+title+"</a></h3>" + desc + "</div><hr/>";
  }
  // Place news stories in div tag
  document.getElementById('weatherResults').innerHTML = output;
}
