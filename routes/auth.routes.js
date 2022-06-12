const router = require("express").Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// const SpotifyWebApi = require("spotify-web-api-node");

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CLIENT_ID,
//   clientSecret: process.env.CLIENT_SECRET,
// });

// spotifyApi
//   .clientCredentialsGrant()
//   .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
//   .catch((error) =>
//     console.log("Something went wrong when retrieving an access token", error)
//   );

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const newUser = {
    username,
    email,
    password: hash,
  };
  let newUserDB = await UserModel.create(newUser);
  console.log("new user", newUserDB);
  res.redirect("/home");
});

router.post("/signin", (req, res) => {
  console.log("signin here", req.body);
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/artist-search", (req, res) => {
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

router.get("/albums/:artistId", (req, res) => {
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

router.get("/albums/tracks/:albumId", (req, res) => {
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
      if (elem.preview_url) {
        tracksObj.preview = elem.preview_url;
      }
      tracksArr.push(tracksObj);
    });
    res.render("tracks-page", { tracksArr });
  });
});

module.exports = router;
