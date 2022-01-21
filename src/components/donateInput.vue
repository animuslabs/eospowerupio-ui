<template lang="pug">
div(style="max-width:450px;")
  .row.justify-center
    small Donate EOS to mint from the weekly leaderboard.

  .row.q-mt-md
    q-input(
      outlined
      v-model="donateQuantity",
      suffix="EOS",
      type="number"
      style="font-size:20px; max-width:150px;"
    )
    q-btn(label="donate" flat color="teal" @click="donate()" :disable="!donateValid")
    q-tooltip(v-if="!auth.userData.actor" color="red")  Login first
  .row.q-mt-sm
    small receiving points: {{ userPoints(pointsEstimate) || 0 }}
  .row
    small minimum donation: {{ config.minimum_donation || 0 }}
  .row

    small current points rate: 1 EOS = {{ pointsRate }} points
  .row.q-mb-md
    small points rate decreases {{ pointsRateModifier }} % each day
  q-separator(spaced)
  .row.q-mt-md
    BonusTracker.full-width
</template>

<script lang="ts">
import Vue from "vue";
import { state } from "../state/global";
import infoPanel from './infoPanel.vue';
import BonusTracker from './bonusTracker.vue';
// import * as nfts from "../state/nfts";
export default Vue.extend({
  components: { infoPanel, BonusTracker },
  data() {
    // let donationData: any;
    return {
      auth: state.auth,
      donations: state.queries.donations,
      // donationData,
      donateQuantity: 0,
      infoPanel: false,
      pointsEstimate: 0,
      pointsRate: "0"
      // nfts
    };
  },
  async mounted() {
    await this.donations.get_data();
    console.log("donations data: ", this.donations.data);
    this.pointsRate = this.userPoints(this.convert_donation_to_score(1));
  },
  methods: {
    async donate() {
      const action = {
        account: "eosio.token",
        name: "transfer",
        data: {
          from: this.auth.userData.actor,
          to: this.donations.contractAccount,
          memo: "",
          quantity: Number(this.donateQuantity).toFixed(4) + " EOS",
        }
      };
      console.log(action);

      await this.auth.doActions([action]);
      this.donations.get_leaderboard(0); //pass in a zero to match function def (1 argument)... need to make donations.js typescript with optional arg ?: number
      setTimeout(() => {
        this.donations.get_leaderboard(0);
      }, 5000);
    },
    userPoints(score: number): string {
      return (score / 100).toFixed(2);
    },
    convert_donation_to_score(donation: string | number): number {
      if (typeof donation == "string") {
        donation = parseFloat(donation);
      }
      //donation is asset "1.0000 EOS"
      const config = this.donations.data.config;
      console.log(config);
      const now: number = Math.floor(Date.now() / 1000); //current time point in sec since epoch

      const first_round_start_sec: number =
        Date.parse(config.start_time.split(".")[0] + ".000+00:00") / 1000; //timestamp of when the first round will/is start(ed)
      const total_sec_elapsed: number = now - first_round_start_sec;
      const current_round_id: number =
        Math.floor(total_sec_elapsed / config.round_length_sec) + 1;
      const round_start_sec: number =
        first_round_start_sec +
        config.round_length_sec * (current_round_id - 1); //start time of the current round
      const round_sec_elapsed: number = now - round_start_sec; // seconds that elapsed in current round

      if (now < first_round_start_sec) {
        // first round didn't start yet.
        return 0;
      }

      let step: number = Math.floor(round_sec_elapsed / config.decay_step_sec);
      // console.log("now", now);
      // console.log("first_round_start_sec", first_round_start_sec);
      // console.log("total_sec_elapsed", total_sec_elapsed);
      // console.log("current_round_id", current_round_id);
      // console.log("round_start_sec", round_start_sec);
      // console.log("round_sec_elapsed", round_sec_elapsed);
      // console.log("step", step);

      if (step > config.start_decay_after_steps) {
        step -= config.start_decay_after_steps;
      } else {
        //no bonus decay so we stay at step 0
        step = 0;
      }
      //assuming donation asset with precission 4
      const pv = donation * 10000;
      const bonus: number = pv * Math.pow(1 - config.compound_decay_pct, step);
      let score = pv + bonus;
      return score;
    }
  },
  computed: {
    pointsRateModifier(): number {
      if (!this.donations.config) return 0;
      return parseInt(
        (this.donations.config.compound_decay_pct * 100).toFixed()
      );
    },
    config(): any {
      if (this.donations.data) return this.donations.data.config;
      else return {};
    },
    // async pointsEstimate():Promise<number>{
    //   const result = await this.donations.convert_donation_to_score(this.donateQuantity)
    //   return result
    // },
    donateValid() {
      if (this.donateQuantity > 0 && this.auth.userData.actor) return true;
      else return false;
    }
  },
  watch: {
    donateQuantity: function (newV: number, oldV: number): void {
      if (newV && newV != oldV) {
        this.pointsEstimate = this.convert_donation_to_score(newV);
      }
    }
  }
});
</script>

<style lang="scss"></style>
