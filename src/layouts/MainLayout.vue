<template lang="pug">
q-layout(padding)
  q-header.bg-grey-9.shadow-0
    q-toolbar
      q-toolbar-title
        .row.items-center
          q-img.on-left(src="/icons/favicon-128x128.png" width="25px")
          small EOS PowerUp

      q-btn(:icon="'img:/' + auth.authMethod + '-logo.png'" :label="auth.userData.actor" :size="$q.platform.is.mobile ? 'sm' : 'md'" @click="auth.logout()" flat stretch v-if="auth.userData.actor")

      q-btn-dropdown(:icon="'img:/eos-logo-minimal-white.svg'" flat label="login" stretch v-if="!auth.userData.actor")
        q-list
          q-item(:key="authItem.title" @click="authItem.login()" clickable tabindex="0" v-close-popup v-for="(authItem,name) of auth.loginOptions" v-ripple)
            q-item-section(avatar)
              q-icon(:name="'img:/' + name + '-logo.png'")
            q-item-section
              div {{ authItem.title }}
              //- q-item-label(clickable) {{ auth.title }}
            q-item-section
    q-separator(color="cyan" size="4px")
  .bg-grey-3.shadow-1(style="padding-top: 53px")
    q-tabs.text-cyan-8(inline-label v-model="tab")
      q-tab(icon="query_stats" name="stats")
      q-tab(icon="bolt" label="Free" name="free")
      q-tab(icon="visibility" label="Auto" name="auto")

  router-view
  div(style="height: 300px")
  q-footer
    q-separator(color="cyan" size="5px")
    .row.q-pa-md.bg-grey-9
      .col
        .row.justify-center
          q-btn(color="cyan-8" flat href="https://stats.boid.com/d/X2YaUPRnk/eospowerup?orgId=1&from=now-7d&to=now" size="md" target="_blank" type="a") Resources stats
        q-separator(color="grey-9" size="20px")
        .row.justify-center
          q-btn.align-right(flat href="https://twitter.com/eospowerup" target="_blank" type="a")
            img(height="40x" src="../assets/twitter.svg")
          q-btn.align-left(flat href="https://t.me/eosresourcemodel" target="_blank" type="a")
            img(height="40px" src="../assets/telegram-app.svg")
      .col
        .row.justify-center
          p.text-cyan-8 POWERED BY:
        .row.justify-center
          q-btn.align-right(flat href="https://boid.com" target="_blank" type="a")
            img(height="55x" src="../assets/Boid_Logo.png")
          q-btn.align-right(flat href="https://edeneos.org" target="_blank" type="a")
            img(height="55x" src="../assets/edeneos.png")
          //- q-btn.align-left(
          //-   flat,
          //-   type="a",
          //-   href="https://blockbase.network",
          //-   target="_blank"
          //-   )
          //-   img(src="../assets/blockbase_b.svg", height="55px")
      .col
        //- .row.justify-center
        //-   p.text-cyan-8 Leave your e-mail for new feature announcements.
        //- .row.justify-center
        //-   q-form(@submit="submitEmail", v-if="!collectedEmail")
        //-     q-input(
        //-       :rules="[]",
        //-       dark,
        //-       v-model="useremail",
        //-       type="text",
        //-       label="e-mail",
        //-       input-style="text-align:center;",
        //-       color="cyan"
        //-     )
        //-     .row.justify-center
        //-       q-btn.q-ma-sm(
        //-         :loading="loadingEmail",
        //-         type="submit",
        //-         flat,
        //-         label="submit",
        //-         clearable,
        //-         :disable="collectedEmail",
        //-         color="cyan"
        //-       )

        .row.q-pa-sm.q-ma-lg.justify-center.bg-yellow(v-if="collectedEmail")
          div e-mail registered

</q-layout>
</template>

<script>
// import anchor from "../lib/anchor";
import Vue from "vue"
import { state } from "../state/global"
import ax from "axios"

const globalState = Vue.observable(state)

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      tab: this.$route.name,
      // global: state.global,
      loadingEmail: false,
      collectedEmail: false,
      useremail: "",
      auth: globalState.auth,
      userData: globalState.auth.userData
    }
  },
  mounted() {
    this.auth.init()
    console.log("Saved authMethod:", this.auth.authMethod)
    this.auth.login()
    if (this.$route.name == "index") {
      this.tab = "free"
      // this.$router.replace("/free")
    }
  },
  methods: {
    async submitEmail() {
      const valid = validateEmail(this.useremail)
      if (!valid) return
      console.log("submit email")
      this.loadingEmail = true
      await ax.post("https://api.eospowerup.io/registerEmail/" + this.useremail)
      this.collectedEmail = true
      this.loadingEmail = false
    }
  },
  watch: {
    tab(val) {
      if (this.$route.name == val) return
      this.$router.push("/" + val)
    },
    $route() {
      this.tab = this.$route.name
    }
  }
}
</script>
