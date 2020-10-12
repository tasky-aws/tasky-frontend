<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Tasky'
}
</script>
<style lang="scss">
  body {
    width: 100%;
  }
  .q-electron-drag {}
  .q-electron-drag--exception {}
</style>
