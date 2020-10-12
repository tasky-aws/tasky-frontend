<template>
  <div>
    <q-img no-default-spinner v-if="!isInErrorState" src="statics/logo.svg" height="100px" width="100px"></q-img>
    <q-img no-default-spinner v-if="isInErrorState" src="statics/logo_flames.svg" height="100px" width="100px"></q-img>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Notification, NotificationType } from 'components/models'

@Component
export default class Logo extends Vue {
  errorTimestamp = new Date()

  get isInErrorState (): boolean {
    const alerts: Notification[] = this.$store.getters['central/getNotifications']
    return (alerts.filter(element => element.type === NotificationType.ERROR).length >= 1 || alerts.filter(element => element.type === NotificationType.TASK_STOPPAGE).length >= 1)
  }
}
</script>
