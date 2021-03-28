<template lang="pug">
div
  q-card.q-ma-md.q-pa-md
    h6.no-margin.text-weight-light.text-grey-9 Watchlist
    small Accounts in your watchlist receive automatic resources dynamically based on live usage. You can watch as many accounts as you would like.
    q-list
      div(v-for="wAcct of watchAccounts", :key="wAcct.account")
        .box.q-ma-sm.q-mb-lg.q-mb-log
          .row.items-center.justify-between.full-width.bg-grey-8.q-mt-md
            .col-auto.q-ml-md
              h6.text-weight-light.text-white.q-mt-xs.q-mb-xs.gt-sm {{ wAcct.account }}
              div.text-white.q-mt-xs.q-mb-xs.lt-md(style="font-size:17px;") {{ wAcct.account }}
            .col-auto
              .row.justify-end.full-width(style="vertical-align: middle;")
                q-btn(
                  style="padding-top:5px;"
                  padding="sm"
                  color="grey-1"
                  icon="edit",
                  size="sm",
                  flat,
                  label="edit",
                  stretch,
                  stack,
                  @click="editWatchAccount(wAcct)"
                )
                q-btn(
                  style="padding-top:5px;"
                  padding="sm"
                  color="grey-1"
                  v-if="wAcct.active",
                  icon="pause",
                  size="sm",
                  flat,
                  label="pause",
                  stretch,
                  stack,
                  @click="pauseWatchAccount(wAcct)"
                ) 
                q-btn(
                  style="padding-top:5px;"
                  padding="sm"
                  
                  color="grey-1"
                  v-if="!wAcct.active",
                  icon="visibility",
                  size="sm",
                  flat,
                  label="enable",
                  stretch,
                  stack,
                  @click="activateWatchAccount(wAcct)"
                ) 
                q-btn(
                  style="padding-top:5px;"
                  padding="sm"
                  icon="close",
                  size="sm",
                  flat,
                  label="delete",
                  color="grey-1"
                  stretch,
                  stack,
                  @click="deleteWatchAccount(wAcct.account)"
                )
          q-separator(size="1px", color="grey-9")
          .row.justify-center.full-width.q-pb-sm.q-mb-sm
            .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
              small min CPU (ms)
              div {{ wAcct.min_cpu_ms }}
            .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
              small PowerUp (ms)
              div {{ wAcct.powerup_quantity_ms }}
            .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
              small min RAM (Kb)
              div {{ wAcct.min_kb_ram }}
            .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
              small buy RAM (Kb)
              div {{ wAcct.buy_ram_quantity_kb }}

      q-btn.full-width.q-mt-lg(
        label="Add Watch Account",
        icon="add",
        color="teal",
        flat,
        @click="addWatchAccount()"
      )
</template>

<script>
import { state } from "../state/global";
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
import { Dialog } from "quasar";
import queries from "../lib/queries";
import watchConfig from "../components/watchConfig.vue";
import ax from "axios";
export default {
  name: "PageIndex",
  components: {},
  data() {
    return {
      auth: state.auth,
      watchAccounts: [],
      interval: null,
    };
  },
  methods: {
    async activateWatchAccount(watch_data) {
      watch_data.active = true;
      const action = {
        account: "eospowerupio",
        name: "watchaccount",
        data: { owner: this.auth.userData.actor, watch_data },
      };
      await this.auth.doActions([action]);
    },
    async pauseWatchAccount(watch_data) {
      watch_data.active = false;
      const action = {
        account: "eospowerupio",
        name: "watchaccount",
        data: { owner: this.auth.userData.actor, watch_data },
      };
      await this.auth.doActions([action]);
    },
    addWatchAccount() {
      const newAccountWindow = Dialog.create({
        setupData: {
          title: "Add new watch account",
          initialQuickSetting:1,
          watch_data: {
            min_cpu_ms: 5,
            powerup_quantity_ms: 10,
            min_kb_ram: 3,
            buy_ram_quantity_kb: 8,
          },
        },
        component: watchConfig,
      }).onOk(async (action) => {
        action.data.owner = this.auth.userData.actor;
        action.data.watch_data.active = true;
        console.log(action);
        await this.auth.doActions([action]);
        newAccountWindow.hide();
        await sleep(500);
        await this.getWatchlist();
      });
    },
    editWatchAccount(watch_data) {
      const newAccountWindow = Dialog.create({
        setupData: {
          title: "Edit Watch Account",
          initialQuickSetting:null,
          freezeName:true,
          watch_data
        },
        component: watchConfig,
      }).onOk(async (action) => {
        action.data.owner = this.auth.userData.actor;
        action.data.watch_data.active = true;
        console.log(action);
        await this.auth.doActions([action]);
        newAccountWindow.hide();
        await sleep(500);
        await this.getWatchlist();
      });
    },
    async deleteWatchAccount(target) {
      const action = {
        account: "eospowerupio",
        name: "rmwatchaccnt",
        data: {
          owner: this.auth.userData.actor,
          watch_account: target,
        },
      };
      await this.auth.doActions([action]);
      await this.getWatchlist();
    },
    async getWatchlist() {
      console.log("Getting watchlist");
      const list = await queries.getWatchlist(this.auth.userData.actor);
      this.watchAccounts = list;
    },
  },
  mounted() {
    this.getWatchlist();
    setInterval(() => {
      this.getWatchlist();
    }, 5000);
  },
  destroyed() {
    clearInterval(this.interval);
  },

  computed: {},
  watch: {
    "auth.userData.actor"(val) {
      console.log(val);
      this.getWatchlist();
    },
  },
};
</script>

<style>
.box {
  box-shadow:
  0 .8px 5.2px rgba(0, 0, 0, 0.134),
  0 3.7px 10.3px rgba(0, 0, 0, 0.148)
;background: white;
}
</style>