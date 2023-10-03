import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

// const API_URL = "https://satriadegaserver.click";
const API_URL = "http://localhost:80";

const usePlaylistStore = defineStore("playlist", {
  state() {
    return {
      login: localStorage.getItem("access_token") ? true : false,
      songs: [],
    };
  },
  actions: {
    logout() {
      localStorage.clear();
      this.login = false;
    },
    async createAccessToken(form) {
      try {
        const { data } = await axios({
          method: "POST",
          url: `${API_URL}/signin`,
          data: form,
        });
      } catch (err) {
        console.log(err);
      }
    },

    async getSongs(search) {
      try {
        const { data } = await axios({
          method: "POST",
          url: `${API_URL}/search`,
          data: {
            search: search,
          },
        });
        this.songs = data;
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    },

    async addSpotify(userId, selectedItems, playlistName) {
      if (playlistName === "") playlistName = "New Playlist by SPL";
      try {
        await axios({
          method: "POST",
          url: `${API_URL}/playlists`,
          data: {
            items: selectedItems,
            name: playlistName,
            token: localStorage.access_token,
            userId: userId,
          },
        });
        console.log("test");
        this.songs = [];
      } catch (err) {
        console.log(err);
        localStorage.clear();
        location.reload();
      }
    },
  },
});

export default usePlaylistStore;
