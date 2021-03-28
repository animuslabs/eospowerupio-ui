<template lang="pug">
q-dialog(ref="dialog", @hide="onDialogHide")
  q-card.q-dialog-plugin
    .q-pa-md
      h6.no-margin.text-weight-light.text-grey-9 {{ config.title }}
      .row.q-pt-md
        small account name
      .row
        q-input(v-model="accountName" :readonly="setupData.freezeName")
      .row.q-pt-md
        small Quick Preset
      .row.justify-center.q-mr-md.q-ml-md
        .col 
          small basic
        .col-3
        .col 
          small power user
        .col-3
        .col 
          small heavy duty

        q-slider.q-mr-sm.q-ml-xm(v-model="quickSetting", :min="1", :max="3", markers, snap)
      .row.q-ma-sm.justify-center
        .col.q-pl-xs
          small min CPU (ms)
            q-input(
              v-model="config.watch_data.min_cpu_ms",
              style="width: 80px",
              filled
            )
        .col
          small PowerUp (ms)
            q-input(
              v-model="config.watch_data.powerup_quantity_ms",
              style="width: 80px",
              filled
            )
        .col
          small min RAM (Kb)
            q-input(
              v-model="config.watch_data.min_kb_ram",
              style="width: 80px",
              filled
            )
        .col
          small buy RAM (Kb)
            q-input(
              v-model="config.watch_data.buy_ram_quantity_kb",
              style="width: 80px",
              filled
            )
    q-card-actions(align="right")
      q-btn(color="grey", label="Cancel", @click="onCancelClick", flat)
      q-btn(color="cyan", label="Add", @click="registerDevice", outline)
</template>

<script>
export default {
  data() {
    return {
      config: Object.assign({}, this.setupData),
      rawAccountName: "",
      quickSetting: this.setupData.initialQuickSetting,
    };
  },
  props: ["setupData", "owner","auth","initialQuickSetting","freezeName"],
  mounted() {
    // @ts-ignore
    this.accountName = this.config.watch_data.account
  },
  computed: {
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
        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 5,
          powerup_quantity_ms: 15,
          min_kb_ram: 5,
          buy_ram_quantity_kb: 10,
          account:this.accountName
        };
      } else if (val == 2) {
        // @ts-ignore
        this.config.watch_data = {
          min_cpu_ms: 20,
          powerup_quantity_ms: 60,
          min_kb_ram: 15,
          buy_ram_quantity_kb: 25,
          account:this.accountName

        };
      } else {
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