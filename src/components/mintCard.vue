<template lang='pug'>
q-card(bordered flat style="width:120px").q-ma-sm
  .row.justify-center.q-mt-sm.q-ml-sm.q-mb-sm.items-center
    .col
      small {{ label1 }} Balance
    q-separator(vertical)
    .col
      .row.justify-center
        .text-h6 {{ printBalance }}
  q-separator
  .row.justify-center
  .row.justify-center
    q-btn(:label="'Burn ' + burnQuantity" outline :ripple="false" flat @click="mint()" color="orange" :disable="!valid").full-width.no-border-radius
  q-separator
  .row.justify-center.q-pb-sm.q-pt-sm
    div Mint 1 {{ label2 }}
</template>
<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  props: ['printBalance', 'burnQuantity', 'valid', 'label1', 'label2'],
  data() {
    return {

    }
  }, methods: {
    mint() {
      this.$emit('mint')
    }
  }
})
</script>
<style lang="scss">
</style>
