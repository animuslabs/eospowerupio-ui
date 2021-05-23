<template lang="pug">
q-dialog(:maximized="$q.platform.is.mobile" @hide="onDialogHide" ref="dialog")
  q-card.q-dialog-plugin(style="overflow: auto; width: 90vw; min-width: 300px")
    .bg-grey-8.q-pa-md
      h6.no-margin.text-weight-light.text-grey-1 {{ config.title }}
    .q-pa-md
      div
        .row
          .col-auto
            .row
              small Account Name
            .row
              q-input(:readonly="setupData.freezeName" outlined v-model="accountName")
            .q-lt-sm(style="height: 10px")
          .div.justify-center
            .row
              small Quick Preset
            .row.justify-center
              .row.justify-center(style="width: 300px")
                .row.justify-center.full-width
                  .col.text-green-9.q-ma-xs.q-pa-sm.text-center(style="text-transform: uppercase")
                    small.capitalize basic
                  q-separator(color="grey-5" inset size="2px" vertical)
                  .col.text-orange-7.q-ma-xs.q-pa-sm.text-center(style="text-transform: uppercase")
                    small power
                  q-separator(color="grey-5" inset size="2px" vertical)
                  .col.text-red.q-ma-xs.q-pa-sm.text-center(style="text-transform: uppercase")
                    small advanced
                .row.justify-center
                  .col(style="width: 200px")
                    q-slider(:color="sliderColor" :max="3" :min="1" markers snap style="height: 20px" v-model="quickSetting")
        .row.q-mt-md
          small Manual Config
        .row.q-ma-sm.justify-center
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small min CPU (ms)
              q-input(outlined style="width: 60px" v-model="config.watch_data.min_cpu_ms")
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small PowerUp (ms)
              q-input(outlined style="width: 60px" v-model="config.watch_data.powerup_quantity_ms")
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small min RAM (KB)
              q-input(outlined style="width: 60px" v-model="config.watch_data.min_kb_ram")
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small buy RAM (KB)
              q-input(outlined style="width: 60px" v-model="config.watch_data.buy_ram_quantity_kb")
    q-card-actions(align="right")
      q-btn(@click="onCancelClick" color="grey" flat label="Cancel")
      q-btn(:label="actionLabelName" @click="registerDevice" color="cyan" outline)
    div(style="height: 250px" v-if="$q.platform.is.mobile")
</template>

<script>
export default {
  data() {
    return {
      config: Object.assign({}, this.setupData),
      rawAccountName: "",
      quickSetting: this.setupData.initialQuickSetting,
      sliderColor: "green"
    }
  },
  props: ["setupData", "owner", "auth", "initialQuickSetting", "freezeName"],
  mounted() {
    // @ts-ignore
    this.accountName = this.config.watch_data.account
  },
  computed: {
    actionLabelName() {
      // @ts-ignore
      if (this.setupData.freezeName) return "edit"
      else return "add"
    },
    _accountName: {
      get(data) {
        if (!data) return ""
        return this.rawAccountName.toLowerCase()
      },
      set(data) {
        if (!data) data = ""
        this.rawAccountName = data.toLowerCase()
        this.config.watch_data.account = data.toLowerCase()
      }
    },
    get accountName() {
      return this._accountName
    },
    set accountName(value) {
      this._accountName = value
    }
  },
  watch: {
    quickSetting(val) {
      if (val == 1) {
        this.sliderColor = "green"
        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 5,
          powerup_quantity_ms: 15,
          min_kb_ram: 5,
          buy_ram_quantity_kb: 10,
          account: this.accountName
        }
      } else if (val == 2) {
        this.sliderColor = "orange"

        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 20,
          powerup_quantity_ms: 60,
          min_kb_ram: 15,
          buy_ram_quantity_kb: 25,
          account: this.accountName
        }
      } else {
        this.sliderColor = "red"
        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 50,
          powerup_quantity_ms: 200,
          min_kb_ram: 20,
          buy_ram_quantity_kb: 50,
          account: this.accountName
        }
      }
    }
  },
  methods: {
    async registerDevice() {
      const action = {
        account: "eospowerupio",
        name: "watchaccount",
        data: {
          // @ts-ignore
          watch_data: this.config.watch_data
        }
      }
      this.$emit("ok", action)
    },
    show() {
      // @ts-ignore
      this.$refs.dialog.show()
    },
    hide() {
      // @ts-ignore
      this.$refs.dialog.hide()
    },
    onDialogHide() {
      this.$emit("hide")
    },

    onOKClick() {
      this.$emit("ok")
      // @ts-ignore
      this.hide()
    },

    onCancelClick() {
      // @ts-ignore
      this.hide()
    }
  }
}
</script>