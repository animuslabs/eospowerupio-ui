<template lang="pug">
q-layout(padding)
  q-header.bg-grey-9.shadow-0
    q-toolbar
      q-toolbar-title
        .row.items-center
          q-img.on-left(src="/icons/favicon-128x128.png", width="20px")
          small EOS PowerUp

      q-btn(
        stretch,
        flat,
        :size="$q.platform.is.mobile ? 'sm' : 'md'",
        v-if="auth.userData.actor",
        :label="auth.userData.actor",
        @click="auth.logout()",
        :icon="'img:/' + auth.authMethod + '-logo.png'"
      )

      q-btn-dropdown(
        label="login",
        flat,
        stretch,
        v-if="!auth.userData.actor",
        :icon="'img:/eos-logo-minimal-white.svg'"
      )
        q-list
          q-item(
            clickable,
            v-close-popup,
            tabindex="0",
            v-ripple,
            v-for="(authItem,name) of auth.loginOptions",
            :key="authItem.title",
            @click="authItem.login()"
          )
            q-item-section(avatar)
              q-icon(:name="'img:/' + name + '-logo.png'")
            q-item-section
              div {{ authItem.title }}
              //- q-item-label(clickable) {{ auth.title }}
            q-item-section
    q-separator(size="4px", color="cyan")
  div.bg-grey-3(style="padding-top: 53px").shadow-1
    q-tabs.text-cyan-8(v-model="tab", inline-label)
      q-tab(name="free", label="Free", icon="bolt")
      q-tab(name="auto", label="Auto", icon="visibility")

  router-view
  div(style="height: 300px")
  q-footer
    q-separator(size="5px", color="cyan")
    .row.q-pa-md.bg-grey-9
      .col
        .row.justify-center
              q-btn(
                size="md",
                flat,
                color="cyan-8",
                type="a",
                href="https://stats.boid.com/d/U3aaAhwZz/eos-resources?orgId=1&from=now-1h&to=now",
                target="_blank"
                ) Resources stats
        q-separator(size="20px", color="grey-9")  
        .row.justify-center
            q-btn.align-right(
              flat,
              type="a",
              href="https://twitter.com/eospowerup",
              target="_blank"
              )
              img(src="../assets/twitter.svg", height="40x")
            q-btn.align-left(
              flat,
              type="a",
              href="https://t.me/eosresourcemodel",
              target="_blank"
              )
              img(src="../assets/telegram-app.svg", height="40px")
      .col
        .row.justify-center
          p.text-cyan-8 POWERED BY:
        .row.justify-center
            q-btn.align-right(
              flat,
              type="a",
              href="https://boid.com",
              target="_blank"
              )
              img(src="../assets/Boid_Logo.png", height="55x")
            q-btn.align-left(
              flat,
              type="a",
              href="https://blockbase.network",
              target="_blank"
              )
              img(src="../assets/blockbase_b.svg", height="55px")
      .col
        .row.justify-center
          p.text-cyan-8 Leave your e-mail for new feature announcements.
        .row.justify-center
          q-form(@submit="submitEmail", v-if="!collectedEmail")
            q-input(
              :rules="[]",
              dark,
              v-model="useremail",
              type="text",
              label="e-mail",
              input-style="text-align:center;",
              color="cyan"
            )
            .row.justify-center
              q-btn.q-ma-sm(
                :loading="loadingEmail",
                type="submit",
                flat,
                label="submit",
                clearable,
                :disable="collectedEmail",
                color="cyan"
              )

        .row.q-pa-sm.q-ma-lg.justify-center.bg-yellow(v-if="collectedEmail")
          div e-mail registered

</q-layout>
</template>

<script>
// import anchor from "../lib/anchor";
import Vue from "vue";
import { state } from "../state/global";
import ax from "axios";

const globalState = Vue.observable(state);

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
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
      userData: globalState.auth.userData,
    };
  },
  mounted() {
    this.auth.init();
    console.log("Saved authMethod:", this.auth.authMethod);
    this.auth.login();
    if (this.$route.name == "index") {
      this.tab = 'free'
    // this.$router.replace("/free")
    }
  },
  methods: {
    async submitEmail() {
      const valid = validateEmail(this.useremail);
      if (!valid) return;
      console.log("submit email");
      this.loadingEmail = true;
      await ax.post(
        "https://api.eospowerup.io/registerEmail/" + this.useremail
      );
      this.collectedEmail = true;
      this.loadingEmail = false;
    },
  },
  watch: {
    
    tab(val) {
      if (this.$route.name == val) return;
      this.$router.push("/" + val);
    },
    $route() {
      this.tab = this.$route.name;
    },
  },
};
</script>
