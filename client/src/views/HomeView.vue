<script>
import { mapWritableState } from "pinia";
import usePlaylistStore from "../stores/playlist";
import { RouterLink } from "vue-router";
import Search from "../components/Search.vue";

export default {
  data() {
    return {
      test: "hi",
    };
  },
  computed: {
    ...mapWritableState(usePlaylistStore, ["login"]),
  },
  methods: {
    toLogin() {
      this.$router.push("/login");
    },
  },
  created() {
    let codeVerifier = localStorage.getItem("code_verifier");
    const clientId = "2bcec3b7d17c4485af26add9872f6860";
    // const redirectUri = "https://spotifyplaylistlyrics.web.app";
    const redirectUri = "http://localhost:5173/";
    if (window.location.search && this.login === false) {
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get("code");
      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });
      // console.log("jalan");
      const response = fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("HTTP status " + response.status);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("access_token", data.access_token);
          this.login = true;
          getProfile();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    async function getProfile() {
      let accessToken = localStorage.getItem("access_token");
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      if (data.error) {
        localStorage.clear();
        location.reload();
        // console.log("jalan");
      }
    }
    if (localStorage.accessToken || this.login) {
      getProfile();
    }
  },
  components: { RouterLink, Search },
};
</script>

<template>
  <div style="max-width: 600px; margin: 0 auto">
    <div v-if="!this.login">
      <div style="margin-left: 5%; margin-right: 5%">
        <p class="text-gray-400 text-4xl font-bold text-center">
          Welcome to Spotify Playlist Lyrics
        </p>
        <p class="text-gray-500 mt-6 text-2xl text-center">
          You can add Songs to your Spotify Playlist by searching similar Lyrics
          between songs!!
        </p>
      </div>

      <div
        class="flex justify-center mt-28"
        style="margin-left: 5%; margin-right: 5%"
      >
        <button
          class="rounded-md bg-indigo-600 px-12 py-4 text-xl font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          @click="toLogin()"
        >
          Login to your Spotify Account!
        </button>
      </div>
    </div>
    <div style="margin-left: 5%; margin-right: 5%" class="text-white">
      <Search v-if="this.login" />
    </div>
  </div>
</template>
