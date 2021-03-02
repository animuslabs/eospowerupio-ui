<template lang="pug">
  div
    h5 demo demo demo
    div {{countNum}}
    q-btn(@click="add" label="add" icon="add" padding="10px" flat)
</template>

<script lang="ts">

import Vue from 'vue'
import { Meta } from 'src/models'

export default Vue.extend({
  name: 'Demo',
  data: function() {
    return {
      counter: <number>0
    };
  },
  methods: {
    add():void{
      this.counter++
    }
  },
  props: {
    test: {
      type: Object as ()=> Meta,
      default: <Meta>{ totalCount: 0 }
    },
    testArr: {
      type: Array as ()=> Meta[],
      default: null
    }
  },
  computed: {
    countNum: {
      set(data:number) {
        console.log(data)
        this.counter += data
      },
      get():number {
        return this.counter + this.test.totalCount
      }
    },
    okthen():number {
      return this.test.totalCount
    }
  }
})
</script>
