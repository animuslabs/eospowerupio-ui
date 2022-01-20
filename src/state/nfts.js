import Vue from 'vue'
import { state } from './global'
import donations from '../lib/donations'

const nftState = Vue.observable({
  contract: 'eospwrupnfts',
  init() {

  },
  data: { ok: this.contract },
  query: {}
})
module.exports = nftState
