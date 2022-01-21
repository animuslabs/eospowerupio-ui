<template lang="pug">
div
  .row.justify-center.full-width.q-mt-xs
    .col-auto
      mintCard(label1="Bronze" label2="Silver" :printBalance="printBalances.bronze" :burnQuantity="bronzeToSilver" :valid="validBurnBronze" @mint="burnBronze()")
    .col-auto
      mintCard(label1="Silver" label2="Gold" :printBalance="printBalances.silver" :burnQuantity="silverToGold" :valid="validBurnSilver" @mint="burnSilver()")
  .row.full-width.q-ma-sm.justify-center
    q-card(bordered flat style="width:120px;").text-black.q-pa-sm
      .row.items-center.justify-center
        .col-auto
          small Gold Balance
        .col-2
        .col-auto
          div {{ printBalances.gold }}
    q-btn(label="atomic hub" target="_blank" style="width:120px; color:rgb(234, 146, 62);" type="a" :href="atomicLink" icon="visibility" size="xs" color="#1a203c" outline).q-ml-md


</template>
<script lang="ts">
import Vue from 'vue'
import mintCard from './mintCard.vue'
import { state } from '../state/global'
let interval: any = null
export default Vue.extend({
  components: { mintCard },
  data() {
    let balances: any = {}
    return {
      auth: state.auth,
      donations: state.queries.donations,
      balances,
    }
  }, methods: {
    async doBurnAction(asset_ids) {
      const data = {
        from: this.auth.userData.actor,
        to: this.donations.contractAccount,
        asset_ids,
        memo: ''
      }
      const action = {
        account: "atomicassets",
        name: "transfer",
        data
      }
      await this.auth.doActions([action])
      setTimeout(() => {
        this.getUserBalances()
      }, 3000)
    },
    async burnSilver() {
      const accountNFTs = await this.donations.get_account_nfts(this.auth.userData.actor)
      const conf = this.donations.config.nft
      const matching = accountNFTs.filter(el => el.template_id == conf.silver_template_id && el.collection_name == conf.collection_name).map(el => el.asset_id)
      this.doBurnAction(matching.slice(0, conf.deposit_silver_for_gold))
    },
    async burnBronze() {
      const accountNFTs = await this.donations.get_account_nfts(this.auth.userData.actor)
      const conf = this.donations.config.nft
      const matching = accountNFTs.filter(el => el.template_id == conf.bronze_template_id && el.collection_name == conf.collection_name).map(el => el.asset_id)
      this.doBurnAction(matching.slice(0, conf.deposit_bronze_for_silver))
    },
    async getUserBalances() {
      this.balances = await this.donations.get_nft_bal(this.auth.userData.actor)
    }
  },
  mounted() {
    this.getUserBalances()
    interval = setInterval(this.getUserBalances, 15000)
  },
  destroyed() {
    clearInterval(interval)
  },
  computed: {
    atomicLink(): string {
      if (!this.donations.config) return ''
      return `https://eos.atomichub.io/profile/${this.auth.userData.actor}?collection_name=${this.donations.config.nft.collection_name}&order=desc&sort=transferred`
    },
    validBurnBronze(): boolean {
      return this.bronzeToSilver <= this.printBalances.bronze
    },
    validBurnSilver(): boolean {
      return this.silverToGold <= this.printBalances.silver
    },
    printBalances(): any {
      let data = { bronze: 0, silver: 0, gold: 0 }
      if (!this.donations.config) return data
      const conf = this.donations.config
      data.bronze = this.balances[conf.nft.bronze_template_id] || 0
      data.silver = this.balances[conf.nft.silver_template_id] || 0
      data.gold = this.balances[conf.nft.gold_template_id] || 0
      return data
    },
    bronzeToSilver(): number {
      return this.donations?.config?.nft.deposit_bronze_for_silver || 0
    },
    silverToGold(): number {
      return this.donations?.config?.nft.deposit_silver_for_gold || 0
    }
  },
  watch: {
    'auth.userData'() {
      this.getUserBalances()
    }
  }
})
</script>
<style lang="">

</style>
