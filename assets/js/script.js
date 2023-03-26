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

function getToken(){
  if(!localUrl.includes('#')){
  console.log('The url does not contain a #');
  location.href = url;
  }else{
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

  if(status !== 200){
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
      'Authorization': 'Bearer '+ authToken,
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



//fetch all genres from Spotify
fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
  
  headers: {
    'Authorization': 'Bearer '+authToken,
    'Content-Type': 'application/json',
  }
})
.then(function (response) {
  console.log(response)
  return response.json();
})
.then(function (json) {
  console.log(json);
})


// Search autocomplete function:
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