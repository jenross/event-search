(function () {

  var bv = new Bideo();
  bv.init({
    // Video element
    videoEl: document.querySelector('#background_video'),

    // Container element
    container: document.querySelector('body'),

    // Resize
    resize: true,

    // autoplay: false,

    isMobile: window.matchMedia('(max-width: 768px)').matches,

    playButton: document.querySelector('#play'),
    pauseButton: document.querySelector('#pause'),

    // Array of objects containing the src and type
    // of different video formats to add
    src: [
      {
        src: 'assets/images/Live-Music.mp4',
        type: 'video/mp4'
      },
      {
        src: 'night.webm',
        type: 'video/webm;codecs="vp8, vorbis"'
      }
    ],

    // What to do once video loads (initial frame)
    onLoad: function () {
      document.querySelector('#video_cover').style.display = 'none';
    }
  });
}());

let gZip;
let gLat;
let gLon;

var map;
function initMap(lat, lon, venues) {
  let location = {lat: lat, lng: lon};
  map = new google.maps.Map(document.getElementById('map'), {
    center: location,
    zoom: 13
  });
  venues.forEach(function(e, i) {
    makeMarker(venues[i]);
  })
}

function makeMarker(venues) {
  var marker = new google.maps.Marker({position: venues.coords, map: map});
  let infoWindow = new google.maps.InfoWindow({
    content:venues.content
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  })
}

function buildQueryURL() {
  let search = $('#search-term').val().trim(); 
  const APIKEY = 'MTUwOTcwMjd8MTU2MzQ2MzA4Ny42OQ';
  let initialQueryURL = `https://api.seatgeek.com/2/events?q=${search}&client_id=${APIKEY}`;

  console.log(initialQueryURL);
  return initialQueryURL;
};

function clear() {
  $("#event-section").empty();
};

// Start Page Search Button 
$("#run-search").on("click", function(event) {
  event.preventDefault();
  $('#search-bar').hide();
  clear();
  let queryURL = buildQueryURL();
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    $('#event-table').show();
    // console.log('the response', response);
      let events = response.events.length; 
      let title;
      for (let i = 0; i < events; i++) {
        var tr = $('<tr>');
          title = $(`<td class='event-data'>${response.events[i].title}</td>`);
          let initialDate = response.events[i].datetime_local;
          let m = moment(initialDate, 'YYYY-MM-DDThh:mm:ss');
          let convertedDate = $(`<td class='event-data'> ${m.format('ll')} </td>`);
          let location = $(`<td class='event-data local' id='${response.events[i].venue.postal_code}'>${response.events[i].venue.display_location}</td>`);
          let venue = $(`<td class='event-data'> ${response.events[i].venue.name} </td>`);
          let lat = parseFloat(response.events[i].venue.location.lat);
          let lon = parseFloat(response.events[i].venue.location.lon);
          let moreInfo = $(`<td><a class="btn btn-primary resultsBtn" type="button" href='#' role="button" id_zip='${response.events[i].venue.postal_code}' id_location='${response.events[i].venue.display_location}' id-lat='${lat}' id-lon='${lon}'>More info</a></td>`);
          console.log(lat + ' ' + lon);
          let results = $('<ul>').addClass('each-event d-flex flex-row justify-content-around'); 
          results.append(title, convertedDate, location, venue, moreInfo);
          $(tr).append(title);
          $(tr).append(convertedDate);
          $(tr).append(location);
          $(tr).append(venue);
          $(tr).append(moreInfo);
          $('#event-tbody').append(tr);
        }

      });
});

// Events Page More Info Button
$(document).on('click', '.resultsBtn', function() {
  $('#results-box').show();
  $('#search-bar').hide();
  $('#event-table').hide();
  gZip = $(this).attr('id_zip');
  gLat = parseFloat($(this).attr('id-lat'));
  gLon = parseFloat($(this).attr('id-lon'));
  gLocation = $(this).attr('id_location');
  aroundTown(gLat, gLon, gZip, gLocation);
});

// Results Page Town Tab
let aroundTown = function(lat, lon, zip, location) {
  $('#map').show();
  $('#weather-table').hide();
  $('#townBtn').attr('class', 'nav-link active');
  $('#weatherBtn').attr('class', 'nav-link');
  // $('#weather-table').empty();

  const clientID = "LMTVE3CNXEET1N3OERSA0SYN0WK0WVXIAWKKB4R4FZ5APF1A";
  const clientSecret = "1GDFGDPYK3BYDW4OJJIN12UHHHIR3Y4HHHN3GXOG5RREK4LN";
  // let lat = parseFloat($('.resultsBtn').attr('id-lat'));
  // let lon = parseFloat($('.resultsBtn').attr('id-lon'));
  // let zip = $('.resultsBtn').attr('id_zip');
  // let location = $('.resultsBtn').attr('id_location');
  let queryURL = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientSecret}&v=20190701&near=${location}&zip=${zip}&radius=1000&section=food&section=drinks&section=nightlife&limit=25`;
  
  console.log(queryURL);
  $.ajax({
      url: queryURL,
      method: "GET"
  }).then(function(results) {
    console.log(results);
    let response = results.response.groups[0].items;
    console.log(response);
  
    let venues = [];

    response.forEach(function(e, i) {
      let venueName = results.response.groups[0].items[i].venue.name;
      let venueLat = parseFloat(results.response.groups[0].items[i].venue.location.lat);
      let venueLng = parseFloat(results.response.groups[0].items[i].venue.location.lng);
      console.log(venueLat);

      let venObject = {
        coords:{lat:venueLat, lng:venueLng},
        content:`<h1>${venueName}</h1>`
      }

      venues.push(venObject);
    });
    console.log('gMaps: ' + lat + ' ' + lon);
    initMap(lat, lon, venues);    
 });
}

$(document).on('click', '#townBtn', function() {
  aroundTown(gLat, gLon);
});

// Results Page Weather Tab
$(document).on('click', '#weatherBtn', function() {
  
  let location = gZip;
  console.log('location: ' + location);

  $('#weather-table').show();
  $('#results').empty();
  $('#map').hide();
  $('#insert-table').html('');
  $('#goBtn').hide();

  // Change active tab
  $('#weatherBtn').attr('class', 'nav-link active');
  $('#townBtn').attr('class', 'nav-link');

  let locationQuery = `https://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=JmVIFm5N5S9A6D5BnIBp0ah5tVJIg9GA&q=${location}`;
  
  $.ajax({
    url: locationQuery,
    method: 'GET',
  }).then(function(response) {
    let locationCode = response[0].Key;
    let local = response[0].EnglishName + ' ' + response[0].AdministrativeArea.LocalizedName;
    $('#result-title').text('Local Weather for ' + local);
    console.log(locationCode);
    let query = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationCode}?apikey=JmVIFm5N5S9A6D5BnIBp0ah5tVJIg9GA&details=true`;
    console.log(query);
    $.ajax({
      url: query,
      method: 'GET',
    }).then(function(response) {
      console.log(response);
      let results = response.DailyForecasts;
      $('#weather-table').show();
      $('#extraBtn').hide();
      results.forEach(element => {
        let forecast = element.Day.Icon;
        let day = moment(element.Date, 'YYYY-MM-DDThh:mm:ss').format('ll');
        let temp = element.Temperature.Minimum.Value + '/' + element.Temperature.Maximum.Value;
        let rain = element.Day.RainProbability + '%';
        let sun = moment(element.Sun.Rise, 'YYYY-MM-DDThh:mm:ss').format('h:mm') + ' AM/' +  moment(element.Sun.Set, 'YYYY-MM-DDThh:mm:ss').format('h:mm') + ' PM';

        let table = `
          <tr>
            <td>${day}</td>
            <td><img src='assets/images/${forecast}-s.png'></td>
            <td>${temp} °F</td>
            <td>${rain}</td>
            <td>${sun}</td>
          </tr>
        `
        $('#insert-table').append(table);
      });
    });
  });
});


 