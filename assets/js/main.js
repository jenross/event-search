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
            title = $(`<td class='event-data'><a href='#'>${response.events[i].title}</a></td>`);
            let initialDate = response.events[i].datetime_local;
            let m = moment(initialDate, 'YYYY-MM-DDThh:mm:ss');
            let convertedDate = $(`<td class='event-data'> ${m.format('ll')} </td>`);
            let location = $(`<td class='event-data local' id='${response.events[i].venue.postal_code}'>${response.events[i].venue.display_location}</td>`);
            let venue = $(`<td class='event-data'> ${response.events[i].venue.name} </td>`);
            let seatgeekURL = $(`<td class='event-data'><a href='${response.events[i].url}' target='_blank'>Tickets</a></td>`);

            let results = $('<ul>').addClass('each-event d-flex flex-row justify-content-around'); 
            results.append(title, convertedDate, location, venue, seatgeekURL);
            $(tr).append(title);
            $(tr).append(convertedDate);
            $(tr).append(location);
            $(tr).append(venue);
            $(tr).append(seatgeekURL);
            $('tbody').append(tr);
          }

        });
        
});

$(document).on('click', '.local', function() {
  alert('here');
  let search = $(this).attr('id');
  let query = `https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=3768f4c0e12f6d0baae543410dcc2366`;
  console.log(query);
  $.ajax({
    url: query,
    method: 'GET',
  }).then(function(response) {
    console.log(response);
  });
});