<template lang="pug">
div
  .row.justify-center
    .col-sm-10.col-md-6.col-lg-5.col-xl-4
      .row.justify-center.q-ma-m.q-pa-md
        //- p eospowerup.io can monitor your accounts to perform auto-powerups automatically when your resources are low.
      div(v-if="auth.userData.actor")
        powerupBal
        powerupWatch
      div(v-else)
        div(style="height:100px;").relative-position.full-width.text-center
          h5.absolute-center Login to continue
        //- .row.justify-center.q-pa-xl
        //-   q-btn(label="login" @click="loginUser" color="cyan" flat size="lg")

</template>

<style>
ul ul {
  padding-left: 15px;
}
.powerupbtn {
  background: linear-gradient(
    to right,
    rgb(255, 217, 0) 20%,
    rgb(255, 234, 0) 40%,
    rgb(255, 225, 0) 60%,
    rgb(242, 255, 0) 80%
  );
  background-size: 200% auto;

  color: #000;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: powerupbtn 1s linear infinite;
}

@keyframes powerupbtn {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

<script>
import { state } from "../state/global";
import powerupBal from '../components/powerupBal.vue'
import powerupWatch from '../components/powerupWatch.vue'
import Vue from "vue"

export default Vue.extend( {
  name: "PageIndex",
  components:{powerupBal,powerupWatch},
  data() {
    return {
      auth: state.auth
    };
  },
  methods:{

  },
  mounted() {

  },
  destroyed() {
  },

  computed: {

  },
  watch: {

  },
})
</script>
