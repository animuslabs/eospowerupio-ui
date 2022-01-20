<template lang="pug">
div
  .row.justify-center.q-mt-md
    h5.no-margin.text-weight-light.text-grey-9 Global Stats
  .row.justify-center
    q-btn(color="teal" flat href="https://stats.boid.com/d/X2YaUPRnk/eospowerup?orgId=1&from=now-7d&to=now&kiosk=tv" icon="show_chart" label="charts" target="_blank" type="a")
  .row.justify-center
    .row.justify-center(style="max-width: 800px")
      .col-auto(style="max-width: 350px")
        q-card.q-ma-sm.q-pa-md(bordered flat)
          h6.no-margin.text-weight-light.text-grey-9 Owner Accounts: #[strong {{ stats.owners }}]
          q-separator(spaced="3px")
          p.no-margin.text-weight-light.text-grey-9(style="min-height: 45px") Accounts with funds deposited and monitoring accounts.
      .col-auto(style="max-width: 350px")
        q-card.q-ma-sm.q-pa-md(bordered flat)
          h6.no-margin.text-weight-light.text-grey-9 Watch Accounts: #[strong {{ stats.totalWatched }}]
          q-separator(spaced="3px")
          p.no-margin.text-weight-light.text-grey-9(style="min-height: 45px") Accounts being monitored by the system to receive automated resouces
  .row.justify-center
    .row.justify-center(style="max-width: 800px")
      .col-auto(style="max-width: 350px")
        q-card.q-ma-sm.q-pa-md(bordered flat)
          h6.no-margin.text-weight-light.text-grey-9 Free PowerUps: #[strong {{ stats.freePowerups24hr }}]
          q-separator(spaced="3px")
          p.no-margin.text-weight-light.text-grey-9(style="min-height: 45px") Free PowerUps issued in the past 24 hours.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          //- p.no-margin.text-weight-light.text-grey-9(style="min-height: 45px") {{ stats }}
      .col-auto(style="max-width: 350px")
        q-card.q-ma-sm.q-pa-md(bordered flat)
          h6.no-margin.text-weight-light.text-grey-9 Auto PowerUps: #[strong {{ stats.autopowerups24hr }}]
          q-separator(spaced="3px")
          p.no-margin.text-weight-light.text-grey-9(style="min-height: 45px") Auto PowerUps issued in the past 24 hours&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

  .row.justify-center
    .flex.justify-center.full-width.items-center
      h5.no-margin.text-weight-light.text-grey-9 Recent Actions

      q-spinner.on-right
    q-list.full-width(style="max-height: 90vh; overflow: scroll; max-width: 715px")
      transition-group(enter-active-class="animated slideInTop " name="list")
        q-card.q-ma-sm.q-pa-md.q-ma-md(:key="item.trace.id" bordered flat v-for="item of displayEvents")
          .row.items-center
            .col-auto
              div(v-for="[key,el] of Object.entries(item.trace.matchingActions[0].json)")
                div(v-if="key != 'message'")
                  .row.items-center
                    .col-auto.on-left.text-weight-light.text-grey-9 {{ key }}:
                    .col
                      p.no-margin(style="font-size: 14px") {{ el }}
            .col-grow
            .col-auto.on-left.on-right
              h6.text-weight-light.q-ma-md {{ printDate(item.trace.block.timestamp) }}
              q-btn(:href="showTx(item.trace.id)" color="teal" flat label="View Transaction" target="_blank" type="a")
</template>

<script>
import Vue from "vue"
import dfuse from "../lib/dfuse"
import queries from "../lib/queries.js"
// @ts-ignore
import TimeAgo from "javascript-time-ago"
// @ts-ignore
import en from "javascript-time-ago/locale/en"
// @ts-ignore
// TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo("en-US")

export default Vue.extend(  {
  data() {
    return {
      stream: null,
      interval: null,
      listInterval: null,
      events: [],
      displayEvents: [],
      stats: {
        owners: 0,
        totalWatched: 0
      }
    }
  },
  methods: {
    updateList() {
      if (this.events.length > 0) {
        console.log(this.events)
        const min = Math.min(...this.events.map(el => el.trace.block.num))
        let index
        const found = this.events.find((el, i) => {
          if (el.trace.block.num == min) {
            index = i
            return true
          }
        })
        this.displayEvents.unshift(found)
        this.events.splice(index, 1)
      }
    },
    showTx(id) {
      return "https://bloks.io/transaction/" + id
    },
    printDate(dateString) {
      // return dateString
      // @ts-ignore
      return timeAgo.format(new Date(dateString))
    },
    add() {
      this.events.unshift(this.events[4])
    }
  },
  async created() {
    this.stats = await queries.getStats()
    this.listInterval = setInterval(this.updateList, 10)
    this.interval = setInterval(async () => {
      this.stats = await queries.getStats()
    }, 300000)
    const { vars, streamQuery } = queries.getRecentActions()
    this.stream = await dfuse.graphql(
      streamQuery,
      (message, stream) => {
        if (message.type == "data") {
          const data = message.data.searchTransactionsForward
          this.events.unshift(data)
        }
      },
      { variables: vars }
    )
  },
  beforeDestroy() {
    clearInterval(this.interval)
    clearInterval(this.listInterval)
    if (this.stream) this.stream.close()
  }
})
</script>

<style>
.list-move {
  transition: transform 0.2s;
}
</style>
