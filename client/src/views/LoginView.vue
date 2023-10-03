<script>
import { mapWritableState } from "pinia";
import usePlaylistStore from "../stores/playlist";
export default {
  computed: {
    ...mapWritableState(usePlaylistStore, ["login"]),
  },
  methods: {
    generateRandomString(length) {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    },
    async generateCodeChallenge(codeVerifier) {
      function base64encode(string) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);
      return base64encode(digest);
    },
  },
  created() {
    const clientId = "2bcec3b7d17c4485af26add9872f6860";
    // const redirectUri = "https://spotifyplaylistlyrics.web.app";
    const redirectUri = "http://localhost:5173/";

    let codeVerifier = this.generateRandomString(128);

    this.generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = this.generateRandomString(16);
      let scope = "user-read-private user-read-email playlist-modify-public ";

      localStorage.setItem("code_verifier", codeVerifier);

      let args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location = "https://accounts.spotify.com/authorize?" + args;
    });
  },
};
</script>

<template>
  <p>home</p>
</template>
