//Link to the DOM


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
  var urlHash = search?JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                   function(key, value) { return key===""?value:decodeURIComponent(value) }):{}
  return urlHash.access_token
}


// top 10 artist functionality










//unique artist functionality
async function getUniqueArtist() {
  
  let response = await fetch('https://api.spotify.com/v1/search/?q=genre:country&type=track&offset=300', {
    headers: {
      'Authorization': 'Bearer '+ authToken,
      'Content-Type': 'application/json'
    }
  });
  let data = await response.json();
  let tracks = data.tracks.items
  
  
  console.log(tracks);
}














//start
authToken = getToken();
console.log(authToken);

getUniqueArtist();

//fetch all genres from Spotify
fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
  
  headers: {
    'Authorization': 'Bearer '+authToken,
    'Content-Type': 'application/json'
  }
})
.then(function (response) {
  console.log(response)
  return response.json();
})
.then(function (json) {
  console.log(json);
})


