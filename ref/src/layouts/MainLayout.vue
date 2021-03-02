<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-header
      q-toolbar
        q-toolbar-title Quasar template
    q-page-container
      router-view
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: { },
  data: function() {
    return {

    }
  }

})
</script>
