<template lang="pug">
div.q-pa-md
  .row(style="width:350px; max-width:80vw;").gt-xs
    .row.full-width
      .col-auto
        small started
      .col-grow
      .col-auto.self-end
        small ending
    .row.full-width
      .col-auto
        div {{ roundData.start }}
      .col-grow
      .col-auto.self-end
        div {{ roundData.end }}
  .row(style="max-width:80vw;").lt-sm
    .row.full-width
      .col-auto
        small started: {{ roundData.start }}
      .col-grow
      .col-auto.self-end
        small ending: {{ roundData.end }}
  .row
    q-linear-progress.q-mt-sm(:value="leaderboardProgress", color='teal', track-color='grey', size="10px" )
  .row
    div(style="width:350px; max-width:80vw; height:400px;").bg-white
      //- div {{ donations.mintResults }}
      q-list
        q-item(v-for="(user,index) of donations.leaderboard" :key="user.account")
          q-item-section(top, avatar)
            q-avatar(text-color='white', icon='img:/icons/favicon-128x128.png',).shadow-1.bg-brown-6
              q-badge(color="teal" :label="donations.mintResults[index] || 0" floating)
          q-item-section
            q-item-label {{ user.donator }}
            q-item-label(caption, lines='2') {{ user.donated }}
          q-item-section
            q-item-label points: {{ userPoints(user.score) }}
            q-item-label minting: {{ donations.mintResults[index] || 0 }} bronze
            //- q-item-label {{user.score}}
            //- .col-grow
            //-   .text-h6 {{user.score}}
</template>
<script lang="ts">
import Vue from "vue";
import { state } from "../state/global";

/**
 * Convert value from one range to another
 * @param {Number} value value to convert
 * @param {Object} oldRange min, max of values range
 * @param {Object} newRange min, max of desired range
 * @return {Number} value converted to other range
 */
function convertRange(value, oldRange, newRange) {
  return (
    ((value - oldRange.min) * (newRange.max - newRange.min)) /
      (oldRange.max - oldRange.min) +
    newRange.min
  );
}

export default Vue.extend({
  data() {
    let leaderboard: any[] = [];
    let updateInterval: any;
    return {
      auth: state.auth,
      donations: state.queries.donations,
      leaderboard,
      updateInterval
    };
  },
  async mounted() {
    await this.donations.get_data();
    this.updateLeaderboard();
    this.updateInterval = setInterval(() => {
      this.updateLeaderboard();
      this.donations.get_data();
    }, 10000);
  },
  destroyed() {
    clearInterval(this.updateInterval);
  },
  methods: {
    userPoints(score: number): string {
      return (score / 100).toFixed(2);
    },
    async updateLeaderboard() {
      this.donations.get_leaderboard(0);
    }
  },
  computed: {
    leaderboardProgress(): number {
      if (!this.donations.data || !this.donations.config) return 0;
      const start = this.donations.data.calc.round_start_sec;
      const end = start + this.donations.config.round_length_sec;
      const current = Date.now() / 1000;
      const result = convertRange(
        current,
        { min: start, max: end },
        { min: 0, max: 1 }
      );
      console.log("progress:", result);
      return result;
    },
    roundData(): any {
      let data = {
        start: new Date().toDateString(),
        end: new Date().toDateString()
      };
      if (!this.donations.data || !this.donations.config) return data;
      let start = this.donations.data.calc.round_start_sec * 1000;
      data.start = new Date(start).toDateString();
      data.end = new Date(
        start + this.donations.config.round_length_sec * 1000
      ).toUTCString();
      return data;
    }
  }
});
</script>
<style lang="ts"></style>
