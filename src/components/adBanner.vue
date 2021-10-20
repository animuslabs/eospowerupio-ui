<template lang="pug">
div
  .q-pb-lg.icon
    .col
      .flashy(style="font-size: 30px; max-width: 550px; min-height: 150px; width: 95vw")
        .col-auto
          a(:href="adURL" @click.prevent="clickAd()")
            q-img.shadow-3(src="/powerpools2.jpg" style="border-radius: 10px")
</template>

<script lang="ts">
import Vue from "vue"
import { Dialog, openURL } from "quasar"

export default Vue.extend({
  data: () => {
    return {
      adURL: "https://powerpools.io",
      adImage: ""
    }
  },
  methods: {
    async clickAd() {
      console.log("Ad Clicked")
      // @ts-ignore
      window.mixpanel.track("clickAd", { site: this.adURL })
      openURL(this.adURL)
    }
  }
})
</script>

<style >
.icon {
  position: relative;
  overflow: hidden;
  pointer-events: all;
}

/**
 * The "shine" element
 */

.icon:after {
  animation: shine 6s ease-in-out infinite;
  animation-fill-mode: forwards;
  content: "";
  position: absolute;
  top: -140%;
  left: -210%;
  width: 100%;
  height: 200%;
  opacity: 0;
  transform: rotate(30deg);
  pointer-events: none;
  background: rgb(255, 255, 255);
  background: linear-gradient(to right, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.73) 77%, rgba(255, 255, 255, 0.03) 92%, rgba(255, 255, 255, 0) 100%);
}

/* Hover state - trigger effect */

/* Active state */

.icon:active:after {
  opacity: 0;
}
.icon:hover {
  opacity: 100;
  animation-name: shine;
  animation-timing-function: ease;
}

@keyframes shine {
  1% {
    opacity: 1;
    top: -200%;
    left: -230%;
    transition-property: left, top, opacity;
    transition-duration: 0.7s, 0.7s, 0.15s;
    transition-timing-function: ease;
  }

  20%,
  100% {
    opacity: 0;
    top: 30%;
    left: 130%;
    transition-property: left, top, opacity;
  }
}
</style>
