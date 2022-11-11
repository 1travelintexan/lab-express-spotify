const router = require("express").Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const SpotifyWebApi = require("spotify-web-api-node");
const { isLoggedIn, isLoggedOut } = require("../middlewares/isLoggedIn");
const { route } = require("..");

//setup for the spotify api
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

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
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
  await UserModel.create(newUser);
  res.redirect("/login");
});
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let loggedInUser = await UserModel.findOne({ email });

  if (!loggedInUser) {
    res.render("auth/login", { message: "Incorrect email, please try again" });
  } else {
    let doesPasswordMatch = await bcrypt.compare(
      password,
      loggedInUser.password
    );
    if (!doesPasswordMatch) {
      res.render("auth/login", {
        message: "Incorrect password, please try again",
      });
    } else {
      req.session.user = loggedInUser.toObject();
      console.log("sees", req.session);
      res.redirect("/home");
    }
  }
});
router.get("/home", isLoggedIn, (req, res) => {
  res.render("home");
});
router.get("/artist-search", isLoggedIn, (req, res) => {
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

router.get("/albums/:artistId", isLoggedIn, (req, res) => {
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
router.get("/albums/tracks/:albumId", isLoggedIn, (req, res) => {
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

router.get("/logout", (req, res) => {
  req.session.destroy();
  console.log("logout", req.session);
  res.redirect("/");
});

module.exports = router;
