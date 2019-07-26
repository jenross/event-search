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

function buildQueryURL() {
  let search = $('#search-term').val().trim(); 
  const APIKEY = 'MTUwOTcwMjd8MTU2MzQ2MzA4Ny42OQ';
  let initialQueryURL = `https://api.seatgeek.com/2/events?q=${search}&client_id=${APIKEY}`;

  console.log(initialQueryURL);
  return initialQueryURL;
}


function clear() {
  $("#event-section").empty();
}

$("#run-search").on("click", function(event) {
  event.preventDefault();
  $('#search-bar').hide();
  clear();
  let queryURL = buildQueryURL();
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    $('#event-table').show();
    console.log('the response', response);
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
          let moreInfo = $(`<td><a class="btn btn-primary" id='resultsBtn' type="button" href='#' role="button" id_zip='${response.events[i].venue.postal_code}' id_location='${response.events[i].venue.display_location}'>More info</a></td>`);

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

$(document).on('click', '#resultsBtn', function() {
  $('#results-box').show();
  $('#search-bar').hide();
  $('#event-table').hide();
});

$(document).on('click', '#townBtn', function() {
  $('#townBtn').attr('class', 'nav-link active');
  $('#weatherBtn').attr('class', 'nav-link');
});

// Weather API
$(document).on('click', '#weatherBtn', function() {
  
  let location = $('#resultsBtn').attr('id_zip');

  
  $('#results').empty();
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

// $(document).on('click', '.btn-primary', function() {
//   alert('heyyo');

//   const clientID = "LMTVE3CNXEET1N3OERSA0SYN0WK0WVXIAWKKB4R4FZ5APF1A";
//   const clientSecret = "1GDFGDPYK3BYDW4OJJIN12UHHHIR3Y4HHHN3GXOG5RREK4LN";
//   let zip = $(this).attr('id_zip');
//   let location = $(this).attr('id_location');
//   let queryURL = `https://api.foursquare.com/v2/venues/explore?client_id=${clientID}&client_secret=${clientSecret}&v=20190701&near=${location}&zip=${zip}&radius=1000&section=food&section=drinks&section=nightlife&limit=25`;
  
//   console.log(queryURL);
//   $.ajax({
//       url: queryURL,
//       method: "GET"
//   }).then(function(results) {
//     let response = results.response.groups.length;
//     let venueName = results.response.groups[i].items[i].venue.name;
//     let venueLat = results.response.groups[i].items[i].venue.location.lat;
//     let venueLng = results.response.groups[i].items[i].venue.location.lng;
//   //  console.log(results.response.groups[0].items[0].venue.name);
//   //  console.log(results.response.groups[0].items[0].venue.location.lat);
//   //  console.log(results.response.groups[0].items[0].venue.location.lng);

//     // for (let i = 0; i < response; i++) {
//     //   ${venueName};
//     //   ${venueLat};
//     //   ${venueLng};
//     // }
//  })

// });

// var map;
//       function initMap() {
//         map = new google.maps.Map(document.getElementById('map'), {
//           center: {lat: -34.397, lng: 150.644},
//           zoom: 8
//         });
//       }