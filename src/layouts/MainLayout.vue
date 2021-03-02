<template lang="pug">
  q-layout
    q-header.bg-grey-9
      q-toolbar
        q-toolbar-title
          .row.items-center
            q-img(src="/icons/favicon-128x128.png" width="20px").on-left
            div EOS PowerUp
    q-page-container 
      router-view
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  components: { },
  data () {
    return {
    }
  }
}
</script>
