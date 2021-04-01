<template lang="pug">
  div
    .row.justify-center
      q-form(@submit="freePowerup()").q-ma-md
        q-input(
          v-model="accountInput",
          label="EOS Account Name",
          outlined,
          color="cyan"
          input-style="font-size:25px; text-align:center;"
          clearable
        )
        .row.justify-center.q-ma-md
          div(v-if="nameValid")
            q-btn(size="md", color="cyan-7" outline type="submit" :loading="loadingPowerup").bg-grey-1.shadow-2
              q-icon.powerupbtn(name="bolt")
              div PowerUp
          div(v-else)
            q-btn(size="md", color="grey" flat type="submit" :loading="loadingPowerup" :disable="!nameValid").bg-grey-4.shadow-0
              q-icon(name="bolt")
              div PowerUp
    .row.justify-center
      .text-grey-9(style="max-width:400px;")
        q-list
          q-item
            q-item-section(avatar)
              q-icon(color="cyan-7" name="bolt")
            q-item-section EOS accounts can claim one free PowerUp every 12 hours.
          q-separator
          q-item
            q-item-section(avatar)
              q-icon(color="cyan-7" name="bolt")
            q-item-section There were very important changes to the way EOS blockchain manages its resources. Learn more about #[a(href="https://eos.io/eos-public-blockchain/powerup-model/") PowerUp]
          q-separator
          q-item
            q-item-section(avatar)
              q-icon(color="cyan-7" name="bolt")
            q-item-section Want more power? Register accounts to receive automatic PowerUp (and RAM) based on usage. Check out #[a(href="/auto") Auto PowerUp]
          q-separator
          q-item
            q-item-section(avatar)
              q-icon(color="cyan-7" name="bolt")
            q-item-section Free PowerUp's are funded by community donations. To make a donation you can send any amount of EOS to "eospowerupio" account with the memo "donation"
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
import * as util from '../lib/util.js'
import { debounce } from 'quasar'
import query from '../lib/queries.js'


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
      nameValid:false
      // userData:Vue.observable(state.auth.userData)
      // userData:auth.userData
    };
  },
  mounted(){
      if(this.auth.userData.actor) this.accountInput = this.auth.userData.actor
      else this.accountInput = null
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
    async 'accountInput'(data){
      const valid = util.validateName(data)
      if(valid) {
        const exists = await query.getAccount(this.accountInput).catch(err => {return})
        console.log(exists);
        if(!exists) this.nameValid = false
        else this.nameValid = true
      } else this.nameValid = false
    },
    'auth.userData'(data){
      console.log('user data update',data)
      if(data.actor) this.accountInput = data.actor
      else this.accountInput = null
    }
  }
};
</script>
