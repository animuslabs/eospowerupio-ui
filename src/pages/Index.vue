<template lang="pug">
  q-page(padding)
    div
      .row.justify-center
        h5 PowerUp Your Account
      .row.justify-center
        div(style="height:40px;" class="powerupbtn").powerupbtn
        q-input(v-model='accountInput' label="EOS Account Name" text="hello", outlined input-style="font-size:40px; text-align:center;") 
      .row.justify-center.q-ma-md
        q-btn(size="lg" color="grey" @click='initPowerUp()')
          q-icon(name="bolt").powerupbtn
          div PowerUp
      .row.justify-center.q-ma-md(style="width:100%")
        .col-auto(style="width:400px;")
          ul.text-grey-9 
            li Accounts can claim one free PowerUp every 12 hours.
            li Learn more about #[a(href="https://eos.io/eos-public-blockchain/powerup-model/") PowerUp]
      .row.justify-center
        h6.no-margin.text-weight-light.text-grey-9 More Features...
      .row.justify-center
        small Leave your e-mail to be notified when new features are announced.
      .row.justify-center
        q-form(@submit='submitEmail')
          q-input(v-model='useremail', type='text', label='email' style="width:200px;" input-style="text-align:center;")
          .row.justify-center
            q-btn(type="submit" flat label="submit" clearable).q-ma-sm
      .row.justify-center.q-ma-lg.absolute-bottom
        q-btn(size="sm" flat color="grey-8" type="a" href="https://twitter.com/eospowerup" target="_blank") twitter
        q-btn(size="sm" flat color="grey-8" type="a" href="https://t.me/eosresourcemodel" target="_blank") telegram



          
</template>

<style>
ul ul{
  padding-left:15px;
}
.powerupbtn {     

  background: linear-gradient(to right, rgb(255, 217, 0) 20%, rgb(255, 234, 0) 40%, rgb(255, 225, 0) 60%, rgb(242, 255, 0) 80%);
  background-size: 200% auto;
  
  color: #000;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: powerupbtn 1s linear infinite;
}

@keyframes powerupbtn {
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
}
</style>

<script>
export default {
  name: 'PageIndex',
  data(){
    return {
      accountInput:" ",
      useremail:""
    }
  },
  methods:{
  submitEmail(){
    console.log('submit email')
  },
  initPowerUp(){
    console.log(' init PwrUp')
  }
  }
}
</script>
