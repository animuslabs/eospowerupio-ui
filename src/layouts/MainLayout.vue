<template lang="pug">
q-layout(padding)
  q-header.bg-grey-8.shadow-0
    q-toolbar
      q-toolbar-title
        .row.items-center
          q-img.on-left(src="/icons/favicon-128x128.png", width="20px")
          div EOS PowerUp

      q-btn(
        stretch,
        flat,
        v-if="auth.userData.actor",
        :label="auth.userData.actor",
        @click="auth.logout()",
        :icon="'img:/anchor-logo.png'"
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
            v-for="authItem of auth.loginOptions",
            :key="authItem.title",
            @click="authItem.login()"
          )
            q-item-section(avatar)
              q-icon(name="img:/anchor-logo.png")
            q-item-section
              div {{ authItem.title }}
              //- q-item-label(clickable) {{ auth.title }}
            q-item-section
    q-separator(size="4px" color="cyan")
  div(style="padding-top:60px;").bg-grey-2
    q-tabs(v-model="tab" class="text-cyan" size="lg")
      q-tab(name="free" label="Free" )
      q-tab(name="auto" label="Auto" )

  router-view
  div(style="height:300px;")
  q-footer(color="grey")
    q-separator(size="3px" color="cyan")
    .row.q-pa-md.bg-grey-1
      .col
        .row.justify-center
          h6.no-margin.text-weight-light.text-grey-9 More Features...
        .row.justify-center
          p.text-grey-9 Leave your e-mail to be notified when new features are announced.
      .col
        .row.justify-center
          q-form(@submit="submitEmail" v-if="!collectedEmail")
            q-input(

              v-model="useremail",
              type="text",
              label="email",
              style="width: 200px",
              input-style="text-align:center;"
            )
            .row.justify-center
              q-btn.q-ma-sm(:loading="loadingEmail" type="submit", flat, label="submit", clearable :disable="collectedEmail" color="black")
        .row.q-pa-sm.q-ma-lg.justify-center(v-if="collectedEmail").bg-yellow
          div email registered

    

</q-layout>
</template>

<script>
// import anchor from "../lib/anchor";
import Vue from "vue";
import { state } from "../state/global";
import ax from "axios";

const globalState = Vue.observable(state);

export default {
  name: "MainLayout",
  components: {},
  data() {
    return {
      tab:this.$route.name,
      // global: state.global,
      loadingEmail:false,
      collectedEmail:false,
      useremail: "",
      auth: globalState.auth,
      userData: globalState.auth.userData,
    };
  },
  mounted() {
    this.auth.init();
    console.log("Saved authMethod:", this.auth.authMethod);
    this.auth.login(true);
  },
  methods:{
    async submitEmail() {
      console.log("submit email");
      this.loadingEmail = true;
      await ax.post('https://api.eospowerup.io/registerEmail/'+ this.useremail)
      this.collectedEmail = true
      this.loadingEmail = false;
    }
  },
  watch:{
    'tab'(val){
      this.$router.push('/'+val)
    },
    '$route'(){

    }
  }
};
</script>
