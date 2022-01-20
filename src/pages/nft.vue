<template lang="pug">
div
  .q-pa-sm
    .row.q-mt-md.justify-center
      .col-auto
        .row.justify-center
          h6.no-margin.text-weight-light.text-grey-9 Mint NFTs
        .row
          donateInput
        .row.items-align.justify-center
          .col-auto
            .text-h4(style="margin-top:11px") 🔥
          .col-auto
            .row.justify-center
              h6.no-margin.text-weight-light.text-grey-9 Higher Rarities
            .row.justify-center
              small burn NFTs to mint higher rarities
        .row.justify-center
          burnNFTs
      .col-auto.gt-xs
        div(style="height:100%; width:1px;").bg-grey-3
      .col-auto
        .row.q-lt-lg(style="height:20px;")
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

export default Vue.extend({
  components: { donateInput, donateLeaderboard, burnNFTs },
  data: () => {
    return {
      infoPanel: false,
      depositQuantity: 0
    }
  }
})
</script>
