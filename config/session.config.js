// configs/session.config.js

// require session
const session = require("express-session");

// ADDED: require mongostore
const MongoStore = require("connect-mongo");

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/spotify-app";

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: "none",
        httpOnly: true,
        maxAge: 60000 * 60 * 24 * 7,
      },
      store: MongoStore.create({
        mongoUrl: MONGO_URI,
        // ttl => time to live
        ttl: 60 * 60 * 24, // 60sec * 60min * 24h => 1 day
      }),
    })
  );
};
