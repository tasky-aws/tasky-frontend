<template>
  <q-page padding>
    <div class="q-pa-md">
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Index extends Vue {
  data () {
    return {
      drawer: false,
      miniState: true
    }
  }
}
</script>
