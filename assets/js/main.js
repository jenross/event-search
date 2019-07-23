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
        // console.log(response.events[0].title);
        // console.log(response.events[0].datetime_local);
        // console.log(response.events[0].url);
        // console.log(response.events[0].venue.display_location);
        // console.log(response.events[0].venue.name);
        // console.log(response.events.length);
        let events = response.events.length; 

        for (let i = 0; i < events; i++) {
            let title = $(`<li class='event-data'><a href='#'>${response.events[i].title}</a></li>`);
            let initialDate = response.events[i].datetime_local;
            let m = moment(initialDate, 'YYYY-MM-DDThh:mm:ss');
            let convertedDate = $(`<li class='event-data'> ${m.format('ll')} </li>`);
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

$(document).on('click', '.local', function() {
    let search = $(this).attr('id');
    let query = `https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=3768f4c0e12f6d0baae543410dcc2366`;
    $.ajax({
        url: query,
        method: 'GET'
    }).then(function(response) {
        console.log(response);
    });
    
});
