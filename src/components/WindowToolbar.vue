<template>
  <q-bar class="q-electron-drag bg-secondary">
    <q-icon size="24px" name="img:statics/aws.svg"/>
    <div class="text-primary">{{ title }}</div>
    <q-space/>
    <q-btn class="text-primary" dense flat icon="minimize" @click="minimize"/>
    <q-btn class="text-primary" dense flat icon="crop_square" @click="maximize"/>
    <q-btn class="text-primary" dense flat icon="close" @click="close"/>
  </q-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class WindowToolbar extends Vue {
  title = 'Tasky';

  data () {
    return {
      addRoleName: '',
      addRoleArn: ''
    }
  }

  minimize () {
    if (process.env.MODE === 'electron') {
      this.$q.electron.remote.BrowserWindow.getFocusedWindow()!.minimize()
    }
  }

  maximize () {
    if (process.env.MODE === 'electron') {
      const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow()!

      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize()
      }
    }
  }

  close () {
    if (process.env.MODE === 'electron') {
      // eslint-disable-next-line no-unused-expressions
      this.$q.electron.remote.BrowserWindow.getFocusedWindow()?.close()
    }
  }
}
</script>

<style lang="sass">
.menu-link
  color: white
  background: #232f3e
</style>
