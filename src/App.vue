<template lang="pug">
.q-app
  router-view
</div>
</template>
<script>
// import anchor from "./lib/anchor";
import {state} from "./state/global"
import Vue from 'vue'
ethereum.autoRefreshOnNetworkChange = false


// const anchor = require("./lib/anchor")
export default {
  name: "App",
  data() {
    return {
      global: state.global,
      auth: state.auth
    };
  },
  methods: {
    mounted() {
      // this.auth.anchor.do.init()
    },
    neato() {},
  },
};
</script>
