<template lang="pug">
.q-app.bg-grey-1
  router-view
</div>
</template>
<script>
// import anchor from "./lib/anchor";
import { state } from "./state/global"
import Vue from "vue"

// @ts-ignore
import TimeAgo from "javascript-time-ago"
// @ts-ignore
import en from "javascript-time-ago/locale/en"
// @ts-ignore
TimeAgo.addDefaultLocale(en)

// const anchor = require("./lib/anchor")
export default {
  name: "App",
  data() {
    return {
      global: state.global,
      auth: state.auth
    }
  },
  methods: {
    mounted() {
      // this.auth.anchor.do.init()
    },
    neato() {}
  }
}
</script>
