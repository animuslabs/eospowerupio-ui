<template lang="pug">
div
  .q-pa-sm
  .row.justify-center
    .q-pa-md(style="max-width:500px;").bg-grey-2
      .row
        .col-auto.q-mr-md
          .text-h4 🙏
        .col
          div You can help maintain free community PowerUps by sending any amount of EOS to #[strong eospowerupio] with the memo #[strong donation].
      .q-ma-md
      .row
        .col-auto.q-mr-md
          .text-h4 🚨
        .col
          strong Donate at least 1 EOS to be included in the PowerUp NFT appreciation drop.
      .q-ma-md
      .row.items-center
        .col-auto.q-mr-md
          .text-h4 🎄
        .col
          div Happy holidays from EOS PowerUp!
  //- .row.justify-center.bg-grey-3
  //-   .text-h6.text-weight-light.q-mt-xs(style="font-size: 18px") Free PowerUps sponsored by
  //- .row.justify-center.bg-grey-3
  //-   .col-auto
  //-     AdBanner
  .row.justify-center.q-mt-md
    div
      .row.justify-center
        .text-h6.text-weight-light(style="font-size: 18px") Claim your Free PowerUp
      q-form.q-ma-sm(@submit="freePowerup()")
        q-input(clearable color="cyan" input-style="font-size:25px; text-align:center;" label="EOS Account Name" outlined v-model="accountInput")
        .row.justify-center.q-ma-md
          div(v-if="nameValid")
            q-btn.bg-grey-1.shadow-2(:loading="loadingPowerup" color="cyan-7" outline size="md" type="submit")
              q-icon.powerupbtn(name="bolt")
              div PowerUp
          div(v-else)
            q-btn.bg-grey-4.shadow-0(:disable="!nameValid" :loading="loadingPowerup" color="grey" flat size="md" type="submit")
              q-icon(name="bolt")
              div PowerUp
  .row.justify-center
    .text-grey-9(style="max-width: 400px")
      q-list(separator)
        q-item.bg-amber
          q-item-section(avatar)
            q-icon(color="grey-1" name="info")
          .text-grey-10 Sponsor eospowerup and display your banner ad here. Email us powerup@boid.com for more information on advertising packages.
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="yellow-8" name="info")
        //-   .text-grey-10 Eden on EOS Trial Run 2 has completed. See the #[a(href="https://www.reddit.com/r/eos/comments/ombrxe/eden_trial_election_ii_results/" target="_blank") Results]. Join the Eden on EOS #[a(href="https://t.me/EdenOSinfo" target="_blank") Telegram Channel] to learn more.
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="yellow-8" name="info")
        //-   div EOS PowerUp Discord Bot is now available for testing.#[a(href="https://discord.com/api/oauth2/authorize?client_id=859243915054678067&permissions=2148006976&scope=bot" target="_blank") Add Bot to your server] or #[a(href="https://discord.gg/e6h3NCvcs5") try the bot] in the Boid server by using the "@eospowerupio help" command in any channel.
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="yellow-8" name="info")
        //-   div EOS PowerUp Telgram Bot is now available for testing. Try the #[a(href="https://t.me/eospowerupbot" target="_blank") Telegram Bot]
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="yellow-8" name="info")
        //-   div eospowerup.io has received funding through the Eden on EOS process. Read about the #[a(href="https://crypto.writer.io/p/edenos-alpha-test-results-and-experiences" target="_blank") Eden on EOS Trial #1]
        //- //- q-separator
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="cyan-7" name="bolt")
        //-   q-item-section EOS accounts can claim two PowerUps every 24 hours.
        //- //- q-separator
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="cyan-7" name="bolt")
        //-   div There were very important changes to the way EOS blockchain manages its resources. Learn more about #[a(href="https://eos.io/eos-public-blockchain/powerup-model/") PowerUp]
        //- //- q-separator
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="cyan-7" name="bolt")
        //-   div Want more power? Register accounts to receive automatic PowerUp (and RAM) based on usage. Check out #[a(href="/auto") Auto PowerUp]
        //- //- q-separator
        //- q-item
        //-   q-item-section(avatar)
        //-     q-icon(color="cyan-7" name="bolt")
        //-   div Free PowerUp's are funded by community donations. To make a donation you can send any amount of EOS to "eospowerupio" account with the memo "donation"
</template>

<style>
ul ul {
  padding-left: 15px;
}
.powerupbtn {
  background: linear-gradient(to right, rgb(255, 217, 0) 20%, rgb(255, 234, 0) 40%, rgb(255, 225, 0) 60%, rgb(242, 255, 0) 80%);
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
import { Dialog, openURL } from "quasar"
import { state } from "../state/global.js"
import Vue from "vue"
const globalState = Vue.observable(state)
import * as util from "../lib/util.js"
import { debounce } from "quasar"
import AdBanner from "components/adBanner.vue"
import query from "../lib/queries.js"
// @ts-ignore
import TimeAgo from "javascript-time-ago"
// @ts-ignore
import en from "javascript-time-ago/locale/en"
// @ts-ignore
// TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo("en-US")

// console.log(state.auth.userData)
import ax from "axios"
import mixpanel from "mixpanel-browser"
export default {
  components: { AdBanner },
  name: "PageIndex",
  data() {
    return {
      tab: "free",
      accountInput: " ",
      useremail: "",
      collectedEmail: false,
      loadingEmail: false,
      loadingPowerup: false,
      auth: globalState.auth,
      nameValid: false
      // userData:Vue.observable(state.auth.userData)
      // userData:auth.userData
    }
  },

  mounted() {
    if (this.auth.userData.actor) this.accountInput = this.auth.userData.actor
    else this.accountInput = null
  },
  methods: {
    async freePowerup() {
      this.loadingPowerup = true
      let message
      try {
        message = await ax.get("https://api.eospowerup.io/freePowerup/" + this.accountInput)
      } catch (error) {
        this.$q.dialog({
          title: "Error Claiming Powerup",
          message: `Try again later.`
        })
      }
      this.loadingPowerup = false
      if (message.data?.result) {
        const result = message.data.result
        const txid = message.data.result
        if (result.status == "success") {
          Dialog.create({
            title: "Claimed Free Powerup",
            message: `
              <div>Accounts can claim up to two free powerups per 24hr period.</div>
            `
              // <strong>Join now and build a dApp on Effect Network-the decentralized gateway to the world's talent. </strong>
              // </br>
              // <a href="https://effect-network-hackathon.devpost.com"> Join Hackathon </a>
              ,
            html: true
          })
        } else if (result.status == "reachedFreeQuota") {
          this.$q.dialog({
            title: "Free Quota Reached",
            // @ts-ignore
            message: `This account has already received two free PowerUps in the past 24 hours. Next free powerup can be claimed ${timeAgo.format(new Date(result.nextPowerup))}`
          })
        } else if (result.stats == "error") {
          this.$q.dialog({
            title: "Error Claiming Powerup",
            // @ts-ignore
            message: `${JSON.stringify(result.errors, null, 2)}`
          })
        } else {
          this.$q.dialog({
            title: "Error Claiming Powerup",
            message: "Try again later."
          })
        }
      } else {
        this.$q.dialog({
          title: "Error Claiming Powerup",
          message: "Try again later."
        })
      }

      // @ts-ignore
      window.mixpanel.track("Free Powerup", { account: this.accountInput })
    }
  },
  watch: {
    async accountInput(data) {
      if (!data) return
      const valid = util.validateName(data)
      if (valid) {
        const exists = await query.getAccount(this.accountInput.trim().toLowerCase()).catch(err => {
          return
        })
        console.log(exists)
        if (!exists) this.nameValid = false
        else this.nameValid = true
      } else this.nameValid = false
      this.accountInput = this.accountInput.trim().toLowerCase()
    },
    "auth.userData"(data) {
      console.log("user data update", data)
      if (data.actor) this.accountInput = data.actor
      else this.accountInput = null
    }
  }
}
</script>
