<template lang='pug'>
q-expansion-item.bg-white.q-mb-md(v-model="infoPanel" style="max-width:80vw; width:260px;")
  template(v-slot:header)
    .row.full-width.items-center
      .col-auto.q-mr-md
        q-icon(color="cyan" name="info" size="20px")
      .col-auto
        .row.full-width
          .text-weight-light Leaderboard Mechanics
  .row.bg-white.q-pr-lg.q-mb-md
    ul
      li Up to {{ nftsPerRound }} Bronze NFTs are minted each week as a reward for donators in the leaderboard.
      li Your rank in the leaderboard determines the cost you pay for the NFT.
      li 1st place receives NFTs at a rate of {{ mintPriceMin }} per NFT.
      li The NFT cost increases by {{ mintPriceInc }} for each rank.
      li For example: 2nd place pays a rate of {{ (parseFloat(mintPriceMin) + parseFloat(mintPriceInc)).toFixed(4) }} EOS to mint Bronze NFTs
      li This means the higher your rank the more NFTs that you could earn with your donated EOS.
      li At the end of each week NFTs are minted for users based on the cost for that rank and their contribution vs the available NFTs to be minted that week.
      li The total number of minted NFTs and distribution among the leaderboard will vary based on contributions each week. It's possible for a single contributor to earn them all or spread mints across many ranks.
      li Your rank on the leaderboard is based on points instead of total donation.
      li When you donate, you receive some points based on the day of the week.
      li Each day later in the week returns less points per EOS. The points rate decays by {{ pointsRate.toFixed(2) }}% each day.
      li Users who donate early in the week have the advantage because they receive points at a higher rate.
      li It's possible to donate less than another user but outrank them in the leaderboard based on the time donations were made and points allocated.
</template>
<script lang="ts">
import Vue from "vue"
import { state } from "../state/global";
export default Vue.extend({
  data() {
    return {
      infoPanel: false,
      auth: state.auth,
      donations: state.queries.donations,
    }
  },
  computed: {
    nftsPerRound(): number {
      if (!this.donations.config) return 0
      return this.donations.config.nft.max_bronze_mint_per_round
    },
    mintPriceMin(): string {
      if (!this.donations.config) return '0 EOS'
      return this.donations.config.nft.mint_price_min
    },
    mintPriceInc(): string {
      if (!this.donations.config) return '0 EOS'
      return this.donations.config.nft.mint_price_increase_by_rank
    },
    pointsRate(): number {
      if (!this.donations.config) return 0
      return this.donations.config.compound_decay_pct * 100
    }
  }
})
</script>
<style lang="scss">
</style>
