function buildQueryURL() {
    let queryURL = 'https://api.seatgeek.com/2/events?';
    let queryParams = { 'client_id': 'MTUwOTcwMjd8MTU2MzQ2MzA4Ny42OQ' };

    queryParams.q = $('#search-term').val().trim(); 

    let startDate = $('#start-date').val().trim(); 
    if (parseInt(startDate)) {
        queryParams.datetime_local = startDate;
    }

    // let endDate = $('#end-date').val().trim(); 
    // if (parseInt(endDate)) {
    //     queryParams.
    // }

    let city = $('#city-search').val().trim(); 
    if (city) {
        queryParams.venue = ".city='city'";
    }
    console.log("---------------\nURL: " + queryURL + "\n---------------");
    console.log(queryURL + $.param(queryParams));
    return queryURL + $.param(queryParams);
}

function dispResults() {

}
$(".search-btn").on("click", function(event) {
    // This line allows us to take advantage of the HTML "submit" property
    // This way we can hit enter on the keyboard and it registers the search
    // (in addition to clicks). Prevents the page from reloading on form submit.
    event.preventDefault();
  
    // Empty the region associated with the events
    clear();
  
    // Build the query URL for the ajax request to the SeatGeek API
    var queryURL = buildQueryURL();
  
    // Make the AJAX request to the API - GETs the JSON data at the queryURL.
    // The data then gets passed as an argument to the updatePage function
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(dispResults);
  });
  
  //  .on("click") function associated with the clear button
  $(".clear-btn").on("click", clear);