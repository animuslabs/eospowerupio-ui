<template lang="pug">
  q-layout
    q-header.bg-grey-9
      q-toolbar
        q-toolbar-title
          q-img(src="/public/icons/favicon-128x128.png")
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
