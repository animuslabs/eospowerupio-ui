<template lang="pug">
div
  q-card.q-ma-md.q-pa-md
    h5.no-margin.text-weight-light.text-grey-9 PowerUp Balance
    q-separator.q-pa-sm.bg-white
    p.no-margin.text-weight-light.text-grey-9 Deposit EOS to pre-purchase the Auto-PowerUp service.
    p.no-margin.text-weight-light.text-grey-9 Auto-PowerUp costs will be deducted from your balance + 1% fee.
    q-separator.q-pa-sm.bg-white
    .row.q-ma-md
      .col-auto.q-mr-lg(style="width:160px")
        small Remaining Balance
        q-input(
          disable
          readonly,
          v-model="depositedBal",
          suffix="EOS",
          type="number"
        ).bg-white
      .col-auto(style="width:160px")
        small Pre-Pay EOS
        q-input(
          outlined
          v-model="depositQuantity",
          suffix="EOS",
          type="number"
        )
        q-btn.full-width(
          label="Add funds", 
          flat,
          color="teal",
          :disable="!depositValid",
          icon="add",
          @click="addFunds()"
        )
      q-btn(
        label="max",
        flat,
        color="teal",
        :disable="!depositValid",
        @click="setMaxDeposit()",
        style="margin-top: 22px; height: 55px; width:50px;"
      )
      .col-auto
    .row.q-ma-sm.justify-center
      q-btn(
          label="auto-powerup history",
          icon="list"
          flat,
          color="teal",
          type="a",
          :href="historyurl",
          target="__blank",
          ).full-width
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

import { Dialog } from "quasar";
import queries from "../lib/queries";
import ax from "axios";
export default {
  name: "PageIndex",
  data() {
    return {
      auth: state.auth,
      // userData: state.auth.userData,
      depositedBal: 0,
      accountInput: " ",
      useremail: "",
      collectedEmail: false,
      loadingEmail: false,
      loadingPowerup: false,
      depositQuantity: 0,
      interval: null,
    };
  },
  mounted() {
    this.getDeposited();
    this.interval = setInterval(() => {
      this.getDeposited();
    }, 5000);
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    async setMaxDeposit() {
      const result = await queries.getBalance(this.auth.userData.actor);
      console.log(result);
      this.depositQuantity = Math.min(100, parseFloat(result));
    },
    async addFunds() {
      console.log(Number(this.depositQuantity).toFixed(4));
      const action = {
        account: "eosio.token",
        name: "transfer",
        data: {
          from: this.auth.userData.actor,
          to: "eospowerupio",
          memo: "deposit",
          quantity: Number(this.depositQuantity).toFixed(4) + " EOS",
        },
      };
      await this.auth.doActions([action])
      // await this.auth.anchor.transact({action});
    },
    async getDeposited() {
      const result = await queries.getDeposited(this.auth.userData.actor);
      if (result) this.depositedBal = parseFloat(result);
    },
  },
  computed: {
    depositValid() {
      return true;
    },
    historyurl() {
      // @ts-ignore
      return "https://eos.eosq.eosnation.io/search?blockCount=30000000&cursor=&q=receiver%3Aeospowerupio%20data.payer%3A" + this.auth.userData.actor + "%20action%3Aautopowerup&sort=desc&startBlock=0&withReversible=true"
    }
  },
  watch: {
    "auth.userData.actor"(val) {
      console.log(val);
      this.getDeposited();
    },
  },
};
</script>
