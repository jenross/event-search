hideSkyScanner(); 

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

function hideSkyScanner() {
    $('.skyscanner').hide(); 
}

function showSkyScanner() {
    $('.skyscanner').show();  
}

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
    clear();
    let queryURL = buildQueryURL();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        let events = response.events.length; 

        for (let i = 0; i < events; i++) {
            let title = $(`<li class='event-data'><a href='#'>${response.events[i].title}</a></li>`);
            let initialDate = response.events[i].datetime_local;
            let m = moment(initialDate, 'YYYY-MM-DDThh:mm:ss');
            // let convertedDate = $(`<li class='event-data'>${m.format('ll')}</li>`);
            // let location = $(`<li class='event-data'>${response.events[i].venue.display_location}</li>`);
            // let venue = $(`<li class='event-data'>${response.events[i].venue.name}</li>`);
            let convertedDate = $(`<li class='event-data time' lon='${response.events[i].venue.location.lon}' lat='${response.events[i].venue.location.lat}' data='${m.unix()}'> ${m.format('ll')} </li>`);
            let location = $(`<li class='event-data local' id='${response.events[i].venue.postal_code}'>${response.events[i].venue.display_location}</li>`);
            let venue = $(`<li class='event-data'> ${response.events[i].venue.name} </li>`);
            let seatgeekURL = $(`<li class='event-data'><a href='${response.events[i].url}' target='_blank'>Tickets</a></li>`);
            let results = $('<ul>').addClass('each-event d-flex flex-row justify-content-around'); 
            results.append(title, convertedDate, location, venue, seatgeekURL);
            $('#event-section').append(results);
        }
    });
});
  
$("#clear-all").on("click", clear);


$(document).on('click', '.event-data', function() {
    showSkyScanner(); 

});

$(document).on('click', '#testing', function() {
  alert('here');
    // let search = $(this).attr('id');
    let key = '12724b927d4f4953cb2ccec4a297225c';
    let lat = $(this).attr('lat');
    let lon = $(this).attr('lon');
    let time = $(this).attr('data');
    // let query = `https://api.darksky.net/forecast/${key}/${lat},${lon},${time}`
    let query = 'https://api.darksky.net/forecast/12724b927d4f4953cb2ccec4a297225c/28.3541,-80.7242,1563867000';
    console.log(query);
    // let query = `https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=3768f4c0e12f6d0baae543410dcc2366`;
    $.ajax({
        url: query,
        method: 'GET',
        headers: {
          'Access-Control-Request-Headers': '*'

      },
    }).then(function(response) {
        console.log(response);
    });
});

