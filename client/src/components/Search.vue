<template>
  <p class="text-xl font-bold">Welcome, {{ user.display_name }}</p>
  <p class="text-white/[0.7] mt-4">Search your lyrics here!!</p>
  <form class="mt-2" @submit.prevent="handleSubmit">
    <input class="w-full text-black p-1 rounded-sm" v-model="search" />
    <button
      type="submit"
      class="w-full mt-4 bg-blue-400 text-black rounded-md px-3 py-1"
    >
      Search
    </button>
  </form>
  <div v-if="this.songs.length !== 0">
    <p class="mt-8 font-bold text-lg">Check the box and add a Playlist name!</p>
    <form @submit.prevent="handleCheck" class="mt-4">
      <label>Playlist Name: </label>
      <input
        type="text"
        v-model="playlistName"
        class="text-black p-1 rounded-sm mb-4 ml-4"
      />
      <div v-for="(item, index) in this.songs" :key="index + 1">
        <input
          type="checkbox"
          class="mr-8"
          v-model="selectedItems"
          :id="item.index + 1"
          :value="{
            name: item.track.track_name,
            artist: item.track.artist_name,
          }"
        />
        <a
          :href="item.track.track_share_url"
          target="_blank"
          style="text-decoration: underline"
        >
          {{ index + 1 }}. {{ item.track.track_name }} -
          {{ item.track.artist_name }}
        </a>
      </div>
      <button
        type="submit"
        class="mt-4 bg-blue-400 w-full text-black rounded-md px-3 py-3 font-bold text-xl mb-8"
      >
        Create Playlist to your Spotify Account!
      </button>
    </form>
  </div>
</template>
<script>
import { mapActions, mapState } from "pinia";
import usePlaylistStore from "../stores/playlist";

export default {
  async created() {
    let accessToken = localStorage.getItem("access_token");
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    let result = await response.json();
    console.log(result);
    this.user = result;
    // let form = {
    //   name: result.display_name,
    //   email: result.email,
    //   imageUrl: result.images[1].url,
    //   id: result.id,
    // };
    // await this.createAccessToken(form);
  },
  computed: {
    ...mapState(usePlaylistStore, ["songs"]),
  },

  methods: {
    ...mapActions(usePlaylistStore, [
      "createAccessToken",
      "getSongs",
      "addSpotify",
    ]),
    handleSubmit() {
      this.getSongs(this.search);
    },
    handleCheck() {
      console.log(this.selectedItems, this.playlistName);
      this.addSpotify(this.user.id, this.selectedItems, this.playlistName);
      this.selectedItems = [];
      this.playlistName = "";
      this.search = "";
    },
  },

  data() {
    return {
      user: false,
      search: "",
      selectedItems: [],
      playlistName: "",
    };
  },
};
</script>
