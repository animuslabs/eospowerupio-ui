<template lang="pug">
div
  .q-pb-md.icon
    .col
      .flashy(style="font-size: 30px; max-width: 550px; min-height: 150px; width: 95vw")
        .col-auto
          a(:href="adURL" @click.prevent="clickAd()")
            div(id="stage")
              q-img.imgrotate.shadow-3(:src="adImage" style="border-radius: 10px")
</template>

<script>
import Vue from "vue"
import { Dialog, openURL } from "quasar"

export default Vue.extend({
  data: () => {
    return {
      adURL: "https://effect-network-hackathon.devpost.com",
      adImage: "/efx-hackathon.jpg"
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

.icon:after {
  animation: shine 5s ease-in-out infinite;
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
.imgrotate {
  animation: rotate 5s ease-in-out infinite;
  transform-style: preserve-3d;
  animation-fill-mode: forwards;
}
#stage {
  perspective: 1200px;
  padding:6px;
}

@keyframes rotate {
  1% {
    transform: rotateY(0deg);
  }
  20%{
    transform: rotateY(-10deg);
  }
  30%,100%{
    transform: rotateY(0deg);
  }
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

  20%{
    opacity: 0;
    top: 30%;
    left: 130%;
    transition-property: left, top, opacity;
    transform: rotateY(-360deg);
  }
  40%,100% {
    opacity: 1;
    top: -200%;
    left: -230%;
    transition-property: left, top, opacity;
    transition-duration: 0.7s, 0.7s, 0.15s;
    transition-timing-function: ease;
  }
}
</style>
