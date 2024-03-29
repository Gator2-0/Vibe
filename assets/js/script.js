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

async function checkToken(status){
 
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

  var topHeaderEl = $('<h2 class = "title" id = card-header>');
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
    var artistCard = $('<div class = "content" id = main-artist-content>');
    topResultsEl.append(artistCard);

    // create title + all elements & append to artist card
    var artistImgEl = $('<img>');
    artistImgEl.attr("src", imgUrl);
    artistCard.append(artistImgEl);

    var topArtistNameEl = $('<p class="title" id = top-artist-header>');
    topArtistNameEl.text(topArtist);
    artistCard.append(topArtistNameEl);

    var topArtistgenreEl = $('<p class="subtitle">');
    topArtistgenreEl.text('Related Genres: '+ topArtistgenres);
    artistCard.append(topArtistgenreEl);

    var profileArtistEl = $('<a class="subtitle id = artist-link">');
    profileArtistEl.text('Spotify Page');
    profileArtistEl.attr({href: profileArtistURL, target: 'nw', title: 'Opens in a New Window'});
    artistCard.append(profileArtistEl);

    let saveButton = $("<button>").addClass('button is-primary is-size-5');
    saveButton.text('Save to my favourite');
    artistCard.append(saveButton);

  }
}


//unique artist functionality

async function getUniqueArtist() {
  
  $('#feature-artist-title').children().remove();
  console.log('title is '+ $('#feature-artist-title').text() )
  $('#feature-artist-title').text('');
  $('#feature-artist-img').children().remove();
  $('#feature-artist-info').text('');

  var genre = $('#genre-dropdown').val();
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
  checkToken(response.status);
  count ++;
  }

  console.log(response);
  
  let data = await response.json();
  let tracksArray = data.tracks.items
  let track = tracksArray[Math.floor(Math.random()*tracksArray.length)];
  console.log(track);
  //get details from the track

  let Header = $('<h2 class = "title">');
  Header.text("A growing artist in " + genre);
  $('#feature-artist-title').append(Header);

  let artist = $("<p class='title'>").text(track.album.artists[0].name);
  let album = $("<p>").text(track.album.name);
  let image = $("<img>").attr('src',track.album.images[0].url) ;
  let externalUrl = $("<a class='subtitle'>").attr({href: track.external_urls.spotify, target: 'nw', title:'Opens in new windows'});
  externalUrl.text('Spotify page')
  let saveButton = $("<button>").addClass('button is-primary is-size-5');
  saveButton.text('Save to my favourite');

  $('#feature-artist-title').append(artist,album);
  $('#feature-artist-img').append(image);
  $('#feature-artist-info').append(externalUrl,saveButton)

}

// Save the artist to local storage as favourite

function uniqueToFavourite(){
  let par = $($(event.target).parent()).parent();
  let children =  $(par.children()).children();
  console.log($(children[0]).text().split(' in ')[1]);
  let storage = JSON.parse(localStorage.getItem('favouriteArtists'));
  
  if(!storage){
    storage =[];
  }
  let card = {
    genre: $(children[0]).text().split(' in ')[1],
    band: $(children[1]).text(),
    album: $(children[2]).text(),
    link: $(children[3]).prop('href'),
    image: $(children[5]).prop('src')

  } 
  storage.push(card);
  console.log(storage);
  localStorage.setItem('favouriteArtists', JSON.stringify(storage))
  
}

function toFavourite(){
  let siblings = $(event.target).siblings()
  console.log(siblings)

  let storage = JSON.parse(localStorage.getItem('favouriteArtists'));
  
  if(!storage){
    storage =[];
  }
  let card = {
    genre: $(siblings[2]).text().split('Genres: ')[1],
    band: $(siblings[1]).text(),
    album: '',
    link: $(siblings[3]).prop('href'),
    image: $(siblings[0]).prop('src')

  } 
  storage.push(card);
  console.log(storage);
  localStorage.setItem('favouriteArtists', JSON.stringify(storage))
}




//start
authToken = getToken();
console.log(authToken);
checkToken();




// global array to push genres into from fetch
var genres = [];
getGenre();

// event listener
$('#genre-dropdown').change(getTopArtist);
$('#genre-dropdown').change(getUniqueArtist);
$("#feature-artist-info").on('click','button', uniqueToFavourite);
$("#genre-main-content").on('click', 'button',  toFavourite)
$("#random-btn").on('click', getRandomGenre);

//fetch all genres from Spotify

async function getGenre(){
  let count = 0;
  let response;

  while(count < 3){
    response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    headers: {
      'Authorization': 'Bearer ' + authToken,
      'Content-Type': 'application/json',
    }
    })
    if(response.status == 200){
      console.log('token does not need to be refreshed.');
      break;
    }
    checkToken(response.status);
    count++;
  }
  
  let data = await response.json();
  console.log(data);
  // we should be fetching the genre array each time 
  // what if they update their database and add/remove etc?

  // getting each genre element and pushing to the global array genres
  for (var i = 0; i < data.genres.length; i++) {
    var genredownload = data.genres[i].trim();

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
}

    //gets Random genre and runs render functions 
function getRandomGenre(){
  let randomGenres = genres[Math.floor(Math.random()*genres.length)]; 
  $('#genre-dropdown').val(randomGenres);
  getTopArtist();
  getUniqueArtist();
}



  


