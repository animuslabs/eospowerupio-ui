<template lang='pug'>
q-expansion-item.bg-white.q-mb-md(v-model="infoPanel" style="max-width:80vw; width:260px;")
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
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      infoPanel: false
    }
  }
})
</script>
<style lang="scss">
</style>
