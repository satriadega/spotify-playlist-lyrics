require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const PORT = 80;
const app = express();
const cors = require("cors");
const axios = require("axios");

const User = require("./models/User");
const AuthRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/signin", async (req, res, next) => {
  const { name, email, id, imageUrl } = req.body;
  const condition = { idSpotify: id };
  const newDocument = {
    idSpotify: id,
    name,
    email,
    imageUrl,
  };
  try {
    let user = await User.find(condition).exec();
    if (user.length >= 1) {
      let result = user[0];
      res.status(200).json({ message: "Successfully login" });
    } else {
      let result = await User.create(newDocument);
      res.status(201).json({ message: "Successfully login" });
    }
  } catch (err) {
    if (err._message !== undefined) {
      res.status(400).json({ message: err._message });
    }
    next(err);
  }
});

app.use("/api/", cors(), AuthRoutes);
app.post("/search", async (req, res) => {
  const { data } = await axios({
    method: "GET",
    url: `http://api.musixmatch.com/ws/1.1/track.search`,
    params: {
      apikey: process.env.MUSIX_MATCH,
      q_lyrics: req.body.search,
      page_size: 20,
      f_has_lyrics: req.body.search,
      s_track_rating: "desc",
    },
  });
  res.json(data.message.body.track_list);

  // res.status(200).json(result);
});

app.post("/playlists", async (req, res) => {
  const { userId, items, name, token } = req.body;
  // console.log(items, name, token);
  const namePlaylist = JSON.stringify({ name });
  customConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  const result = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    namePlaylist,
    customConfig
  );
  console.log(result.data.id);

  items.forEach(async (el) => {
    try {
      const { data } = await axios({
        method: "GET",
        url: `https://api.spotify.com/v1/search`,
        params: {
          q: `track:${el.name} artist:${el.artist}`,
          type: "track",
          limit: 1,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const uri = "spotify:track:" + (await data.tracks.items[0]?.id);
      var bodyJSON = {
        uris: [],
        position: 0,
      };
      bodyJSON.uris.push(uri);
      await axios.post(
        `https://api.spotify.com/v1/playlists/${result.data.id}/tracks`,
        bodyJSON,
        customConfig
      );
      bodyJSON.uris = [];
    } catch (err) {
      console.log(err);
    }
  });

  res
    .status(200)
    .json({ message: "Playlist " + name + " successfuly created!" });
});

app.use(errorHandler);

const runReset = async () => {
  await Playlist.deleteMany({});
  await User.deleteMany({});
  console.log("All documents deleted.");
};
// mongoose.connection.db.dropDatabase();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // runReset();
    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
