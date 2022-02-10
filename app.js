require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/search-results', (req,res)=>{
    console.log(req.query.artistSearch)
    spotifyApi
        .searchArtists(req.query.artistSearch)
        .then(data => {
            const resultList = data.body.artists.items
            console.log('The received data from the API: ', resultList);
            console.log('IMAGES: ', resultList[0].images[0])
            res.render('artist-search-results', {results: resultList});
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const id = req.params.artistId;
    spotifyApi.getArtistAlbums(id)
    .then(data => {
        console.log('SINGLE ALBUM: ', data.body);
        res.render('albums', {albums: data.body.items})
    })
    .catch(err => console.log(err))
  });

app.get('/tracks/:albumId', (req, res, next) => {
    const id = req.params.albumId;
    spotifyApi.getAlbumTracks(id)
    .then(data => {
        console.log('ALBUMS DATA: ', data.body);
        res.render('tracks', {tracks: data.body.items})
    })
    .catch(err => console.log(err))
});

/*app.route('/')
.get((req,res)=>{
    res.render('index');
})
.post((req,res)=>{
    const result = req.body.artistSearch;
    spotifyApi
        .searchArtists(result)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
    res.render('search-results');
});*/

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
