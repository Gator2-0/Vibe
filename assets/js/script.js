//Link to the DOM
const clientID = 'bb72931649ec425d94a20764ae59cb49';
const clientSecret = 'c6153430dd1046aa81b29d8aceadc433';






// top 10 artist functionality










//unique artist functionality

var client_id = 'bb72931649ec425d94a20764ae59cb49';
var redirect_uri = 'http://127.0.0.1:5500/index.html';
var scope = 'user-read-private user-read-email';
//var state = 'abc';
//localStorage.setItem(stateKey);
var url = 'https://accounts.spotify.com/authorize';
url += '?response_type=token';
url += '&client_id=' + encodeURIComponent(client_id);
url += '&scope=' + encodeURIComponent(scope);
url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
//url += '&state=' + encodeURIComponent(state);



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
  return urlHash;
}

urlHash = getToken();
console.log(urlHash);
var authToken = urlHash.access_token;
console.log(authToken);



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


