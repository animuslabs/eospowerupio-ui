<template lang="pug">
q-dialog(ref="dialog", @hide="onDialogHide" :maximized="$q.platform.is.mobile")
  q-card.q-dialog-plugin(style="overflow:auto; width:90vw; min-width:300px;")
    .q-pa-md
      h6.no-margin.text-weight-light.text-grey-9 {{ config.title }}
      div
        .row
          .col-auto
            .row.q-pt-md
              small account name
            .row
              q-input(v-model="accountName" :readonly="setupData.freezeName")
          
        .row.q-pt-md
          small Quick Preset 
        .row.justify-center
          .row.justify-center(style="width:300px")
            .row.justify-center.full-width
              .col.text-green-9.q-ma-xs.q-pa-sm.text-center(style="text-transform: uppercase;")
                small.capitalize basic
              q-separator(vertical inset color="grey-5" size="2px")
              .col.text-orange-7.q-ma-xs.q-pa-sm.text-center(style="text-transform: uppercase;")
                small power 
              q-separator(vertical inset color="grey-5" size="2px")
              .col.text-red.q-ma-xs.q-pa-sm.text-center(style="text-transform: uppercase;")
                small advanced
            .row.justify-center
              .col(style="width:200px;")
                q-slider( v-model="quickSetting", :min="1", :max="3", markers, snap :color="sliderColor")
        .row
          small Manual Config
        .row.q-ma-sm.justify-center

          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small min CPU (ms)
              q-input(
                v-model="config.watch_data.min_cpu_ms",
                style="width: 80px",
                filled
              )
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small PowerUp (ms)
              q-input(
                v-model="config.watch_data.powerup_quantity_ms",
                style="width: 80px",
                filled
              )
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small min RAM (Kb)
              q-input(
                v-model="config.watch_data.min_kb_ram",
                style="width: 80px",
                filled
              )
          .col-sm-6.col-md-3.q-pr-md.q-pt-sm.q-pl-md
            small buy RAM (Kb)
              q-input(
                v-model="config.watch_data.buy_ram_quantity_kb",
                style="width: 80px",
                filled
              )
    q-card-actions(align="right")
      q-btn(color="grey", label="Cancel", @click="onCancelClick", flat)
      q-btn(color="cyan", :label="actionLabelName", @click="registerDevice", outline)
    div(style="height:200px;" v-if="$q.platform.is.mobile")
</template>

<script>
export default {
  data() {
    return {
      config: Object.assign({}, this.setupData),
      rawAccountName: "",
      quickSetting: this.setupData.initialQuickSetting,
      sliderColor:'cyan'
    };
  },
  props: ["setupData", "owner","auth","initialQuickSetting","freezeName"],
  mounted() {
    // @ts-ignore
    this.accountName = this.config.watch_data.account
  },
  computed: {
    actionLabelName(){
      // @ts-ignore
      if (this.setupData.freezeName) return 'edit'
      else return 'add'
    },
    accountName: {
      // @ts-ignore
      get(data) {
        if(!data) return ""
        return this.rawAccountName.toLowerCase();
      },
      set(data) {
        if(!data) data = ""
        // @ts-ignore
        this.rawAccountName = data.toLowerCase();
        // @ts-ignore
        this.config.watch_data.account = data.toLowerCase();
      },
    },
  },
  watch: {

    quickSetting(val) {
      if (val == 1) {
        this.sliderColor="green"
        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 5,
          powerup_quantity_ms: 15,
          min_kb_ram: 5,
          buy_ram_quantity_kb: 10,
          account:this.accountName
        };
      } else if (val == 2) {
        this.sliderColor="orange"

        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 20,
          powerup_quantity_ms: 60,
          min_kb_ram: 15,
          buy_ram_quantity_kb: 25,
          account:this.accountName

        };
      } else {
        this.sliderColor="red"
        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 50,
          powerup_quantity_ms: 200,
          min_kb_ram: 20,
          buy_ram_quantity_kb: 50,
          account:this.accountName
        };
      }
    },
  },
  methods: {
    async registerDevice() {
      const action = {
        account: "eospowerupio",
        name: "watchaccount",
        data: {
          // @ts-ignore
          watch_data: this.config.watch_data,
        },
      };
      this.$emit("ok",action);
    },
    show() {
      // @ts-ignore
      this.$refs.dialog.show();
    },
    hide() {
      // @ts-ignore
      this.$refs.dialog.hide();
    },
    onDialogHide() {
      this.$emit("hide");
    },

    onOKClick() {
      this.$emit("ok");
      // @ts-ignore
      this.hide();
    },

    onCancelClick() {
      // @ts-ignore
      this.hide();
    },
  },
};
</script>