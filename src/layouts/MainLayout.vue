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
  div.bg-grey-2(style="padding-top: 53px")
    q-tabs.text-cyan(v-model="tab", inline-label)
      q-tab(name="free", label="Free", icon="bolt")
      q-tab(name="auto", label="Auto", icon="visibility")

  router-view
  div(style="height: 300px")
  q-footer
    q-separator(size="3px", color="cyan")
    .row.q-pa-md.bg-grey-9
      .col
        .row.justify-center
          h6.no-margin.text-weight-light.text-grey-1 More Features...
        .row.justify-center
          p.text-grey-1 Leave your e-mail to be notified when new features are announced.
      .col
        .row.justify-center
          q-form(@submit="submitEmail", v-if="!collectedEmail")
            q-input(
              :rules="[]",
              dark,
              v-model="useremail",
              type="text",
              label="email",
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
          div email registered

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
