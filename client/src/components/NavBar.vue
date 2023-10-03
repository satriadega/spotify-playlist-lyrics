<script>
import { mapState, mapActions } from "pinia";
import usePlaylistStore from "../stores/playlist";

export default {
  name: "NavBar",
  data() {
    return {
      toggleMenu: false,
    };
  },
  computed: {
    ...mapState(usePlaylistStore, ["login"]),
  },
  methods: {
    ...mapActions(usePlaylistStore, ["logout"]),
    toggle() {
      this.toggleMenu = !this.toggleMenu;
    },
    handleLogout() {
      this.logout();
      this.toggle();
    },
  },
  created() {
    this.toggleMenu = false;
  },
};
</script>

<template>
  <nav class="bg-black border-b-[2px] border-gray-500/[0.7] mb-8">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center">
          <!-- Mobile menu button-->
          <button
            v-if="this.login"
            type="button"
            class="relative inline-flex items-center justify-center rounded-md p-2 bg-yellow-900/[0.2] text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-controls="mobile-menu"
            aria-expanded="false"
            @click="toggle"
          >
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <!--
                Icon when menu is closed.
    
                Menu open: "hidden", Menu closed: "block"
              -->
            <svg
              class="block h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <!--
                Icon when menu is open.
    
                Menu open: "block", Menu closed: "hidden"
              -->
            <svg
              class="hidden h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div
            class="flex flex-shrink-0 items-center cursor-pointer"
            style="gap: 20px"
          >
            <h1 class="text-white/[0.7] font-extrabold text-lg">
              Spotify Playlist Lyrics
            </h1>
          </div>
        </div>
      </div>
      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="" id="mobile-menu">
        <!-- Toggle here -->
        <div
          class="space-y-1 px-2 pb-3 pt-2 text-gray-500/[0.8] bg-black"
          style="width: 100%"
          v-if="toggleMenu"
        >
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->

          <a
            @click="this.handleLogout()"
            href="#"
            class="hover:bg-yellow-950/[0.1] cursor-pointer block rounded-md px-3 py-2 text-base font-medium"
            >Sign out</a
          >
        </div>
      </div>
    </div>
  </nav>
</template>
