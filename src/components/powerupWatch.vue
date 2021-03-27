<template lang="pug">
div
  q-card.q-ma-md.q-pa-md
    h6.no-margin.text-weight-light.text-grey-9 Watchlist
    small Accounts in your watchlist receive automatic resources dynamically based on live usage. You can watch as many accounts as you would like.
    q-list
      div(v-for="wAcct of watchAccounts", :key="wAcct.account")
        .shadow-1.q-ma-md
          .row
            .col-auto.bg-white.q-ma-sm.q-ml-md
              small watch account
              div {{ wAcct.account }}
            .col.justify-end.q-pt-sm
              .row.justify-end
                q-btn(
                  icon="close",
                  size="sm",
                  flat,
                  label="delete",
                  color="red",
                  stretch,
                  stack,
                  @click="deleteWatchAccount(wAcct.account)"
                )
                q-btn(
                  icon="edit",
                  size="sm",
                  flat,
                  label="edit",
                  stretch,
                  stack,
                  @click="editWatchAccount(wAcct)"
                )
                q-btn(
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
                  v-if="!wAcct.active",
                  icon="visibility",
                  size="sm",
                  flat,
                  label="enable",
                  stretch,
                  stack,
                  @click="activateWatchAccount(wAcct)"
                ) 
          q-separator(size="1px", color="grey-9")
          .row
            .col.bg-grey-2.q-ma-sm.q-pa-sm
              small min CPU (ms)
              div {{ wAcct.min_cpu_ms }}
            .col.bg-grey-2.q-ma-sm.q-pa-sm
              small PowerUp (ms)
              div {{ wAcct.powerup_quantity_ms }}
            .col.bg-grey-2.q-ma-sm.q-pa-sm
              small min RAM (Kb)
              div {{ wAcct.min_kb_ram }}
            .col.bg-grey-2.q-ma-sm.q-pa-sm
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
          initialQuickSetting:0,
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
