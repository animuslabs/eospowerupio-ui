<template lang='pug'>
div.q-mb-md
  div(style="max-width:290px")
    div Bonus Tracker
    small Earn bonus Silver and Gold when you mint via donations
  //- div {{ claimed }}
  .row.items-center.bg-white.q-pa-xs.q-mt-md.q-mb-md
    .col-auto.relative-position.q-mr-md
      q-img(src='/icons/favicon-128x128.png' spinner-color='primary', spinner-size='82px' width="40px")
      q-badge(v-if="donations.config" :label="donations.config.nft.bonus_silver_per_bronze_claimed - pendingSilver" floating color="teal").absolute-position
    .col
      .row.items-center
        .col
          small Total Bronze Minted: {{ claimed.bronze_claimed }}
          q-linear-progress(:value="silverBronzeRange", color='teal', track-color='grey', size="5px").relative-position
          .row
            small.text-weight-medium.q-mr-xs Next Silver:
            small  {{ pendingSilver }} Bronze
        .col-auto.relative-position
          q-badge(v-if="donations.config" :label="donations.config.nft.bonus_silver_per_bronze_claimed" floating color="teal" style="top:-6px;").absolute-position
    .col-auto.q-ml-sm.relative-position
      q-img(src='/icons/favicon-128x128.png' spinner-color='primary', spinner-size='82px' width="40px")
      //- q-badge(label="+1" floating color="grey-8" style="right:-13px").absolute-position
  .row.items-center.bg-white.q-pa-xs
    .col-auto.relative-position.q-mr-md
      q-img(src='/icons/favicon-128x128.png' spinner-color='primary', spinner-size='82px' width="40px")
      q-badge(v-if="donations.config" :label="donations.config.nft.bonus_silver_per_bronze_claimed - pendingGold" floating color="teal").absolute-position
    .col
      .row.items-center
        .col
          small Total Silver Minted: {{ claimed.silver_claimed }}
          q-linear-progress(:value="goldSilverRange", color='teal', track-color='grey', size="5px").relative-position
          .row
            small.text-weight-medium.q-mr-xs Next Gold:
            small  {{ pendingGold }} Silver
        .col-auto.relative-position
          q-badge(v-if="donations.config" :label="donations.config.nft.bonus_gold_per_silver_claimed" floating color="teal" style="top:-6px;").absolute-position
    .col-auto.q-ml-sm.relative-position
      q-img(src='/icons/favicon-128x128.png' spinner-color='primary', spinner-size='82px' width="40px")

</template>
<script lang="ts">
import Vue from "vue"
import { state } from "../state/global";

/**
  * Convert value from one range to another
  * @param {Number} value value to convert
  * @param {Object} oldRange min, max of values range
  * @param {Object} newRange min, max of desired range
  * @return {Number} value converted to other range
  */
function convertRange(value, oldRange, newRange) {
  return ((value - oldRange.min) * (newRange.max - newRange.min)) / (oldRange.max - oldRange.min) + newRange.min;
}

interface MintedType {
  bronze_unclaimed: number
  bronze_claimed: number
  silver_claimed: number
  gold_claimed: number
}
let interval: any

export default Vue.extend({
  data() {
    let claimed: MintedType = {
      bronze_unclaimed: 0,
      bronze_claimed: 0,
      silver_claimed: 0,
      gold_claimed: 0
    }
    return {
      auth: state.auth,
      donations: state.queries.donations,
      claimed
    }
  },
  mounted() {
    this.getMinted()
    interval = setInterval(this.getMinted, 30000)
  },
  destroyed() {
    clearInterval(interval)
  },
  methods: {
    async getMinted() {
      if (!this.auth.userData.actor) return
      this.claimed = await this.donations.get_account_minted(this.auth.userData.actor)
    }
  },
  computed: {
    silverBronzeRange(): number {
      if (!this.donations.config) return 0
      const conf = this.donations.config.nft
      return convertRange(conf.bonus_silver_per_bronze_claimed - this.pendingSilver, { min: 0, max: conf.bonus_silver_per_bronze_claimed }, { min: 0, max: 1 })
    },
    goldSilverRange(): number {
      if (!this.donations.config) return 0
      const conf = this.donations.config.nft
      return convertRange(conf.bonus_gold_per_silver_claimed - this.pendingGold, { min: 0, max: conf.bonus_gold_per_silver_claimed }, { min: 0, max: 1 })
    },
    pendingSilver(): number {
      if (!this.donations.config) return 0
      const conf = this.donations.config.nft
      const totalMintSilver = conf.bonus_silver_per_bronze_claimed - (this.claimed.bronze_claimed % conf.bonus_silver_per_bronze_claimed)
      return totalMintSilver
    },
    pendingGold(): number {
      if (!this.donations.config) return 0
      const conf = this.donations.config.nft
      const totalMint = conf.bonus_gold_per_silver_claimed - (this.claimed.silver_claimed % conf.bonus_gold_per_silver_claimed)
      return totalMint
    }
  },
  watch: {
    'auth.userData.actor'() {
      this.getMinted()
    }
  }
})
</script>
<style lang="scss">
</style>
