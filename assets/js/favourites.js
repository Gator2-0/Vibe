
function printFavourites() {


    var storedFavs = JSON.parse(localStorage.getItem('favouriteArtists'));

    var favslistEl = $('#genre-main-content');

    for (var i = 0; i < storedFavs.length; i++) {
        
        let favArtist = storedFavs[i].band;
        var favAlbum = storedFavs[i].album;
        var favGenre = storedFavs[i].genre;
        var imgUrl = storedFavs[i].image;
        var profileArtistURL = storedFavs[i].link;


        var favsCardEl = $('<div class = "content">');
        favslistEl.append(favsCardEl);

        var ImgURLEl = $('<img>');
        ImgURLEl.attr("src", imgUrl);
        favsCardEl.append(ImgURLEl);

        var favArtistEl = $('<p class = "title">');
        favArtistEl.text(favArtist);
        favsCardEl.append(favArtistEl);

        var favAlbumEl = $('<p class = "subtitle">');
        favAlbumEl.text(favAlbum);
        favsCardEl.append(favAlbumEl);

        var favgenreEl = $('<p class = "subtitle">');
        favgenreEl.text(favGenre);
        favsCardEl.append(favgenreEl);

        var profileArtistEl = $('<a class="subtitle id = artist-link">');
        profileArtistEl.text('Spotify Page');
        profileArtistEl.attr({ href: profileArtistURL, target: 'nw', title: 'Opens in a New Window' });
        favsCardEl.append(profileArtistEl);


    }
    console.log(storedFavs);
}



printFavourites();