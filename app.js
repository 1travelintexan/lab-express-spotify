require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  let searchMusic = req.query.search;
  spotifyApi
    .searchArtists(searchMusic)
    .then((data) => {
      //console.log("The received data from the API: ", data.body);
      let items = data.body.artists.items;
      let artistName = items[0].name;
      let artistImg = items[0].images[0].url;
      let artistId = items[0].id;
      res.render("artist-search-results", { artistName, artistImg, artistId });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  let artistId = req.params.artistId;
  let albumArr = [];
  spotifyApi.getArtistAlbums(artistId).then((data) => {
    let items = data.body.items;
    let artistName = data.body.items[0].artists[0].name;
    items.forEach((elem) => {
      let albumObj = {};
      if (elem.images.length > 0) {
        albumObj.id = elem.id;
        albumObj.img = elem.images[0].url;
        albumObj.albumName = elem.name;
        albumArr.push(albumObj);
      }
    });
    res.render("albums", { artistName, albumArr });
  });
});

app.get("/albums/tracks/:albumId", (req, res) => {
  function convertMsToMins(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }
  let albumId = req.params.albumId;
  let tracksArr = [];

  spotifyApi.getAlbumTracks(albumId).then((data) => {
    let items = data.body.items;

    items.forEach((elem) => {
      let tracksObj = {};
      tracksObj.name = elem.name;
      tracksObj.trackNumber = elem.track_number;
      tracksObj.time = convertMsToMins(elem.duration_ms);
      tracksArr.push(tracksObj);
    });
    res.render("tracks-page", { tracksArr });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
