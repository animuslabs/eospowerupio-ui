<template lang="pug">
  q-page.row.items.center.justify-center
    demo(:test="dope")
</template>

<script lang="ts">
import Vue from 'vue'
import { Meta } from 'src/models'
import demo from 'components/demo.vue'

const initial: Meta = <Meta>({ totalCount: 10 })

export default Vue.extend({
  components: { demo },
  data() {
    return {
      initial
    }
  }
})
</script>
