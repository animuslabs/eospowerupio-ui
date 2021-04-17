<template lang="pug">
div
  .row.justify-center.q-mt-md
      h5.no-margin.text-weight-light.text-grey-9 Global Stats
  .row.justify-center
    .row.justify-center(style="max-width:800px;")
      .col
        q-card.q-ma-md.q-pa-md
          h5.no-margin.text-weight-light.text-grey-9 Owner Accounts
          q-separator(spaced="3px")
          p.no-margin.text-weight-light.text-grey-9(style="min-height:45px;") Accounts with funds deposited and monitoring accounts.
          .flex.justify-center.q-ma-md
            h3.no-margin.text-weight-light.text-grey-9 {{stats.owners}}
      .col
        q-card.q-ma-md.q-pa-md
          h5.no-margin.text-weight-light.text-grey-9 Watch Accounts
          q-separator(spaced="3px")
          p.no-margin.text-weight-light.text-grey-9(style="min-height:45px;") Accounts being monitored by the system to receive automated resouces
          .flex.justify-center.q-ma-md
            h3.no-margin.text-weight-light.text-grey-9 {{stats.totalWatched}}
  .row.justify-center
    .flex.justify-center.full-width.items-center
      h5.no-margin.text-weight-light.text-grey-9 Recent Actions

      q-spinner.on-right
    q-list(style="max-height:50vh; overflow: scroll; max-width:800px; ").full-width
      transition-group(enter-active-class="animated slideInTop " name="list")
        q-card.q-ma-md.q-pa-md(v-for="item of events" :key="item.trace.id").q-ma-md
          .row.items-center
            .col-auto
              div(v-for="(el,key) of item.trace.matchingActions[0].json")
                div(v-if="key !='message'")
                  .row.items-center
                    .col-auto.on-left.text-weight-light.text-grey-9 {{key}}:
                    .col
                      p(style="font-size:14px;").no-margin {{el}}
            .col-grow
            .col-auto.on-left.on-right
              h6.text-weight-light.q-ma-md {{printDate(item.trace.block.timestamp)}}
              q-btn( target="_blank" label="View Transaction" flat color="teal" type="a" :href="showTx(item.trace.id)")



</template>

<script>
import dfuse from '../lib/dfuse'
import queries from '../lib/queries.js'
// @ts-ignore
import TimeAgo from 'javascript-time-ago'
// @ts-ignore
import en from 'javascript-time-ago/locale/en'
// @ts-ignore
TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')




export default {
  data(){
    return {
      stream:null,
      interval:null,
      events:[],
      stats:{
        owners:0,
        totalWatched:0
      }
    }
  },
  methods:{
    showTx(id){
      return 'https://bloks.io/transaction/'+id
    },
    printDate(dateString) {
      // return dateString
      // @ts-ignore
      return timeAgo.format(new Date(dateString))
    },
    add(){
      this.events.unshift(this.events[4])
    }
  },
  async created(){
    this.stats = await queries.getStats()
    // this.interval = setInterval(async()=>{
    //       this.stats = await queries.getStats()
    // },300000)
    // const {stream,emitter} = await queries.getRecentActions()
    // this.stream = stream
    // emitter.on('data',data=>this.events.unshift(data))
    const {vars,streamQuery} = queries.getRecentActions()
    dfuse.graphql(streamQuery,(message,stream)=>{
      if(message.type == 'data') {
        const data = message.data.searchTransactionsForward
        this.events.unshift(data)
      }
      this.stream=stream
    },{variables:vars})

  },
  beforeDestroy(){
    clearInterval(this.interval)
    this.stream.close()
  }
}
</script>

<style>
.list-move {
  transition: transform .5s;
}
</style>