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

//ITERATION 3
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/artist-search', (req, res) => {
    const theArtist = req.query.theArtist;

    spotifyApi.searchArtists(theArtist)
        .then(data => {
            const artists = data.body.artists.items;
            res.render('artist-search-results', { artists });
        })
        .catch(error => {
            res.render('artist-search-results', { error: 'No artists found, error occurred' });
        });
});


//ITERATION 4

app.get('/albums/:artistId', (req, res, next) => {
    const artistId = req.params.artistId;
  
    spotifyApi.getArtistAlbums(artistId)
      .then(data => {
        const albums = data.body.items;
        res.render('albums', { albums });
      })
      .catch(error => {
        res.render('error', { error: 'Error retrieving artist albums' });
      });
  });
  
//ITERATION 5
  
app.get('/tracks/:albumId', (req, res, next) => {
    const albumId = req.params.albumId;
  
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        const tracks = data.body.items;
        res.render('tracks', { tracks });
      })
      .catch(error => {
        res.render('error', { error: 'Error retrieving album tracks' });
      });
  });
  


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
