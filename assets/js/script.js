//Link to the DOM


//Get authentification Token from Spotify
const client_id = 'bb72931649ec425d94a20764ae59cb49';
const redirect_uri = 'http://127.0.0.1:5500/index.html';
const scope = 'user-read-private user-read-email';

var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

function getToken(){
  if(location.href == 'http://127.0.0.1:5500/index.html'){
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















//start
authToken = getToken();

console.log(authToken);


//fetch all genres from Spotify
fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
  headers: {
    'Authorization': 'Bearer '+authToken,
    'Content-Type': 'application/json'
  }
})
.then(function (response) {
  return response.json();
})
.then(function (json) {
  console.log(json);
})


