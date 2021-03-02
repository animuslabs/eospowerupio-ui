<template lang="pug">
  .q-app
    router-view
    //- q-btn(color='primary', icon='check', label='OK', @click='onClick') 

  </div>
</template>
<script>
export default {
  name: 'App',
  data(){
    return {
      tab:"mails",
      hello:"whore"
    }
  },
  methods:{
    neato(){
      console.log(this.hello)
    }
  }
}
</script>
