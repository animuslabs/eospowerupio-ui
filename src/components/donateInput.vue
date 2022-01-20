<template lang="pug">
div(style="max-width:350px;")
  .row.justify-center
    small Donate EOS to mint from the weekly leaderboard.

  .row.justify-center.q-mt-md
    q-input(
      outlined
      v-model="donateQuantity",
      suffix="EOS",
      type="number"
      style="font-size:20px; max-width:146px;"
    )
    q-btn(label="donate" flat color="teal" @click="donate()" :disable="!donateValid")
  .row
    .col-2
    .col
      small receiving points: {{ userPoints(pointsEstimate) || 0 }}
  .row
    .col-2
    small minimum donation: {{ config.minimum_donation || 0 }}
  .row
    .col-2
    small current points rate: 1 EOS = {{ pointsRate }} points
  .row
    .col-2
    small points rate decay per day {{ pointsRateModifier }} %
  .row.q-ma-md
    q-expansion-item.bg-white.q-mb-md(v-model="infoPanel" style="max-width:100vw; width:300px;")
      template(v-slot:header)
        .row.full-width.items-center
          .col-auto.q-mr-md
            q-icon(color="cyan" name="info" size="20px")
          .col-auto
            .row.full-width
              .text-weight-light Leaderboard Details
            //- .row.full-width.justify-center.q-mb-sm
            //-   small Important information
      .row.bg-white.q-pa-lg.q-mb-md
        p Up to 20 Bronze NFTs are minted each week as a reward for donators in the leaderboard.
        p Your rank in the leaderboard determines the cost you pay for the NFT.
        p #1st place cost: 1EOS per NFT. 2nd place cost: 1.1 EOS per NFT.
        p At the end of each week NFTs are minted for users based on the cost for that rank and their contribution.
        p The total number of minted NFTs and distribution among the leaderboard will vary based on contributions that week.
        p Your rank on the leaderboard is based on points instead of total donation.
        p Each week the points you receive per EOS donation decreases over time. This means users who donate early in the week have the advantage.
        p It's possible to donate less than another user but outrank them in the leaderboard based on the time donations were made.
</template>

<script lang="ts">
import Vue from 'vue'
import { state } from "../state/global";
// import * as nfts from "../state/nfts";
export default Vue.extend({
  data() {
    let donationData: any
    return {
      auth: state.auth,
      donations: state.queries.donations,
      donationData,
      donateQuantity: 0,
      infoPanel: false, pointsEstimate: 0, pointsRate: '0'
      // nfts
    }
  },
  async mounted() {
    await this.donations.get_data()
    console.log('donations data: ', this.donations.data);
    this.pointsRate = this.userPoints(await this.donations.convert_donation_to_score(1))
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
          pointsEstimate: 0
        },
      }
      await this.auth.doActions([action])
      this.donations.get_leaderboard()
      setTimeout(() => {
        this.donations.get_leaderboard()
      }, 5000)
    },
    userPoints(score: number): string {
      return (score / 100).toFixed(2)
    },
  }, computed: {
    pointsRateModifier(): number {
      if (!this.donations.config) return 0
      return parseInt((this.donations.config.compound_decay_pct * 100).toFixed())
    },
    config(): any {
      if (this.donations.data) return this.donations.data.config
      else return {}
    },
    // async pointsEstimate():Promise<number>{
    //   const result = await this.donations.convert_donation_to_score(this.donateQuantity)
    //   return result
    // },
    donateValid() {
      if (this.donateQuantity > 0) return true
      else return false
    },

  },
  watch: {
    async donateQuantity(val): Promise<any> {
      const result = await this.donations.convert_donation_to_score(this.donateQuantity)
      this.pointsEstimate = result
    }
  }
})
</script>

<style lang="scss">
</style>
