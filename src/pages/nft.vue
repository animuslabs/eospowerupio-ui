<template lang="pug">
div
  .q-pt-sm
    .row.q-mt-md.justify-center
      .col-auto.q-pr-md
        .row.justify-center
          h6.no-margin.text-weight-light.text-grey-9 Mint NFTs
        .row
          donateInput
        q-separator(spaced)
        .row.q-mt-md
          div Burn to Mint
        .row
          small Burn NFTs to mint higher rarities
        .row
          burnNFTs
      .col-auto.gt-xs
        div(style="height:100%; width:1px;").bg-grey-4
      .col-auto
        .row.lt-sm(style="height:20px;")
        .row.justify-center
          h6.no-margin.text-weight-light.text-grey-9 Weekly Leaderboard
        .row.justify-center
          small NFTs are minted and leaderboard is reset each week
        .row.justify-center
          donateLeaderboard

</template>

<script lang="ts">
import Vue from 'vue'
import donateInput from 'src/components/donateInput.vue'
import donateLeaderboard from 'src/components/donateLeaderboard.vue'
import burnNFTs from 'src/components/burnNFTs.vue'
import { state } from '../state/global'
let interval: any
export default Vue.extend({
  components: { donateInput, donateLeaderboard, burnNFTs },
  data: () => {
    return {
      auth: state.auth,
      donations: state.queries.donations,
      infoPanel: false,
      depositQuantity: 0
    }
  },
  mounted() {
    this.donations.get_config(true)
    // interval = setInterval(() => {
    //   this.donations.get_config(true)
    // }, 120000)
  }
})
</script>
