//Link to the DOM
let searchBar = $("#genre-search");

//Get authentification Token from Spotify
const client_id = 'bb72931649ec425d94a20764ae59cb49';
const redirect_uri = 'http://127.0.0.1:5500/index.html';
const scope = 'user-read-private user-read-email';
let localUrl = location.href;

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

function getToken() {
  if (!localUrl.includes('#')) {
    console.log('The url does not contain a #');
    location.href = url;
  } else {
    console.log('The token is present')
  }
  var search = location.hash.substring(1);
  console.log(search);
  var urlHash = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                   function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
  return urlHash.access_token
}

async function checkToken(){
  let response = await fetch('https://api.spotify.com/v1/me',{
    headers: {
      'Authorization': 'Bearer '+ authToken,
      'Content-Type': 'application/json'
    }
  });
  let status = await response.status;

  if(status == 401){
    console.log('The token has expired. Getting new token now...')
    location.href = url
    var search = location.hash.substring(1);
    console.log(search);
    var urlHash = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                   function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
    return urlHash.access_token
  }else{
    console.log('Token is still valid.')
  }
}

// top 10 artist functionality

async function getTopArtist() {

  var baseGenreURL = 'https://api.spotify.com/v1/search/?q=genre:';
  var genrechoice = $('#genre-dropdown').val();
  var topQuery = '&type=artist&popularity=100';

  var genreRequestURL = baseGenreURL + genrechoice + topQuery;

  let response = await fetch(genreRequestURL, {
    headers: {
      'Authorization': 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    }
  });
  let data = await response.json();
  console.log(data);

  var topResultsEl = $('#genre-main-content');

  topResultsEl.html("");

  var topHeaderEl = $('<h2 class = "title">');
  topHeaderEl.text("Top Artists in " + genrechoice);
  topResultsEl.append(topHeaderEl);


  //get details from the artists and append 
  for (var i = 0; i < data.artists.items.length; i++) {
    let topArtist = data.artists.items[i].name;
    var topArtistgenres = data.artists.items[i].genres;
    var imgUrl = data.artists.items[i].images[0].url;
    var profileArtistURL = data.artists.items[i].external_urls.spotify;

    console.log(topArtist);

    // create artist card + append
    var artistCard = $('<div class = "content">');
    topResultsEl.append(artistCard);

    // create title + all elements & append to artist card
    var artistImgEl = $('<img>');
    artistImgEl.attr("src", imgUrl);
    artistCard.append(artistImgEl);

    var topArtistNameEl = $('<p class="title">');
    topArtistNameEl.text(topArtist);
    artistCard.append(topArtistNameEl);

    var topArtistgenreEl = $('<p class="subtitle">');
    topArtistgenreEl.text('Related Genres: '+ topArtistgenres);
    artistCard.append(topArtistgenreEl);

    var profileArtistEl = $('<a class="subtitle">');
    profileArtistEl.text('Artist profile: ' + profileArtistURL);
    profileArtistEl.attr('href', profileArtistURL);
    artistCard.append(profileArtistEl);

  }
}








//unique artist functionality

async function getUniqueArtist(genre) {
  
  $('#feature-artist-title').children().remove();
  $('#feature-artist-title').text('');
  $('#feature-artist-img').children().remove();
  $('#feature-artist-info').text('');
  let count = 0;
  let response;
  while(count <= 3){
    response = await fetch('https://api.spotify.com/v1/search/?q=genre:'+genre+'&type=track&offset=300', {
    headers: {
      'Authorization': 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    }
  });
  if(response.status == 200){
    console.log('fetch genre status is '+response.status)
    break;
  }
  checkToken();
  count ++;
  }

  console.log(response);
  
  let data = await response.json();
  let tracksArray = data.tracks.items
  let track = tracksArray[Math.floor(Math.random()*tracksArray.length)];
  console.log(track);
  //get details from the track


  let artist = $("<p>").text(track.album.artists[0].name);
  let album = $("<p>").text(track.album.name);
  let image = $("<img>").attr('src',track.album.images[1].url) ;
  let externalUrl = $("<a>").attr({href: track.external_urls.spotify, target: 'nw', title:'Opens in new windows'});
  externalUrl.text('Spotify page')
  console.log(externalUrl)
  $('#feature-artist-title').append(artist,album);
  $('#feature-artist-img').append(image);
  $('#feature-artist-info').append(externalUrl)

}














//start
authToken = getToken();
console.log(authToken);
checkToken();




// global array to push genres into from fetch
var genres = [];

// event listener for top artists
$('#genre-dropdown').on("change", getTopArtist);



//fetch all genres from Spotify
fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {

  headers: {
    'Authorization': 'Bearer ' + authToken,
    'Content-Type': 'application/json',
  }
})
  .then(function (response) {
    console.log(response)
    return response.json();
  })
  .then(function (json) {
    console.log(json);


    // we should be fetching the genre array each time 
    // what if they update their database and add/remove etc?

    // getting each genre element and pushing to the global array genres
    for (var i = 0; i < json.genres.length; i++) {
      var genredownload = json.genres[i].trim();

      genres.push(genredownload);
    }

    console.log(genres);

    // clearing dropdown
    $('#genre-dropdown').html('');
    // adding a placeholder
    var placeholderEl = $("<option>");
    placeholderEl.text("Select");
    $('#genre-dropdown').append(placeholderEl);

    // printing and appending each genre to the dropdown menu
    for (var i = 0; i < genres.length; i++) {
      var optionsEl = $("<option>");
      optionsEl.text(genres[i]);
      $('#genre-dropdown').append(optionsEl);
    }

    return genres;
  })


$(function () {
  var genres = [
    "acoustic",
    'afrobeat',
    'alt-rock',
    'alternative',
    'ambient',
    'anime',
    'black-metal',
    'bluegrass',
    'blues',
    'bossanova',
    'brazil',
    'breakbeat',
    'british',
    'cantopop',
    'chicago-house',
    'children',
    'chill',
    'classical',
    'club',
    'comedy',
    'country',
    'dance',
    'dancehall',
    'death-metal',
    'deep-house',
    'detroit-techno',
    'disco',
    'drum-and-bass',
    'dub',
    'dubstep',
    'edm',
    'electro',
    'electronic',
    'emo',
    'folk',
    'forro',
    'french',
    'funk',
    'garage',
    'german',
    'gospel',
    'goth',
    'grindcore',
    'groove',
    'grunge',
    'guitar',
    'happy',
    'hard-rock',
    'hardcore',
    'hardstyle',
    'heavy-metal',
    'hip-hop',
    'holidays',
    'honky-tonk',
    'house',
    'idm',
    'indian',
    'indie',
    'indie-pop',
    'industrial',
    'iranian',
    'j-dance',
    'j-idol',
    'j-pop',
    'j-rock',
    'jazz',
    'kids',
    'latin',
    'latino',
    'malay',
    'mandopop',
    'metal',
    'metal-misc',
    'metalcore',
    'minimal-techno',
    'movies',
    'mpb',
    'new-age',
    'new-release',
    'opera',
    'pagode',
    'philippines-opm',
    'piano',
    'pop',
    'pop-film',
    'post-dubstep',
    'power-pop',
    'progressive-house',
    'psych-rock',
    'punk',
    'punk-rock',
    'r-n-b',
    'rainy-day',
    'reggae',
    'reggaeton',
    'road-trip',
    'rock',
    'rock-n-roll',
    'rockabilly',
    'romance',
    'sad',
    'salsa',
    'samba',
    'sertanejo',
    'show-tunes',
    'singer-songwriter',
    'ska',
    'sleep',
    'songwriter',
    'soul',
    'soundtracks',
    'spanish',
    'study',
    'summer',
    'swedish',
    'synth-pop',
    'tango',
    'techno',
    'trance',
    'trip-hop',
    'turkish',
    'work-out',
    'world-music',
  ];
  $('#genre-search').autocomplete({
    source: genres, 
  });
});


searchBar.on('keypress',function(event){
  console.log(event.which)
  if(event.which == 13){
    console.log(searchBar.val());
    getUniqueArtist(searchBar.val());
  }
})

