<template lang="pug">
  div
    .row.justify-center
      q-form(@submit="freePowerup()").q-ma-md
        q-input(
          v-model="accountInput",
          label="EOS Account Name",
          outlined,
          input-style="font-size:30px; text-align:center;"
          clearable
        ) 
        .row.justify-center.q-ma-md
          q-btn(size="lg", color="cyan" outline type="submit" :loading="loadingPowerup").bg-grey-1.shadow-2
            q-icon.powerupbtn(name="bolt")
            div PowerUp
    .row.justify-center
      ul.text-grey-9(style="max-width:400px;")
        li Accounts can claim one free PowerUp every 12 hours.
        li Learn more about #[a(href="https://eos.io/eos-public-blockchain/powerup-model/") PowerUp]
        li Want more power? Register accounts to receive automatic PowerUps (and RAM) based on usage. Check out #[a(href="/auto") Auto PowerUp]

      
    .q-pa-lg
    .row.justify-center.q-ma-lg.absolute-bottom(style="bottom:40px;")
      q-btn(
        size="md",
        flat,
        color="cyan-8",
        type="a",
        href="https://twitter.com/eospowerup",
        target="_blank"
      ) twitter
      q-btn(
        size="md",
        flat,
        color="cyan-8",
        type="a",
        href="https://t.me/eosresourcemodel",
        target="_blank"
      ) telegram
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
import { Dialog } from "quasar";
import {state} from '../state/global.js'
import Vue from 'vue'
const globalState = Vue.observable(state);

// console.log(state.auth.userData)
import ax from "axios";
export default {
  name: "PageIndex",
  data() {
    return {
      tab:'free',
      accountInput: " ",
      useremail: "",
      collectedEmail:false,
      loadingEmail:false,
      loadingPowerup:false,
      auth: globalState.auth,
      // userData:Vue.observable(state.auth.userData)
      // userData:auth.userData
    };
  },
  methods: {
    async freePowerup() {
      this.loadingPowerup = true
      let message
      try {
        message = await ax.get(
        "https://api.eospowerup.io/freePowerup/" + this.accountInput.trim()
      )
      } catch (error) {
        this.$q.dialog({
          title: "Error Claiming Powerup",
          message: `Try again later.`,
        });
      }

      this.loadingPowerup = false
      if (message.data.result) {
        const txid = message.data.result;
        this.$q.dialog({
          title: "Claimed Free Powerup",
          message: `You can claim again in 12 hours. `,
        });
      }
    },
  },
  watch:{
    'auth.userData'(data){
      console.log('user data update',data)
      if(data.actor) this.accountInput = data.actor
      else this.accountInput = null
    }
  }
};
</script>
