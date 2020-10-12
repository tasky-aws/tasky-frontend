<template>
  <q-btn
    color="accent"
    flat
    round
    icon="notifications">
    <q-badge
      v-if="notifications.length !== 0"
      color="red"
      floating
      text-color="white"
    >
      {{notifications.length}}
    </q-badge>
    <q-popup-proxy>
      <q-list
        dark
        bordered
        padding
        class="bg-primary">
        <q-item
          v-for="notification in notifications"
          :key="notification.date.getUTCMilliseconds()"
        >
          <q-item-section avatar>
            <q-avatar flat rounded text-color="green" v-if="notification.type.valueOf() === 2" icon="sms" square></q-avatar>
            <q-avatar rounded text-color="red" v-if="notification.type.valueOf() === 4" icon="priority_high" square></q-avatar>
            <q-avatar rounded text-color="amber" v-if="notification.type.valueOf() === 5" icon="warning" square></q-avatar>
          </q-item-section>
          <q-item-section>{{notification.message}}</q-item-section>
          <q-item-section side>
            <q-btn flat icon="arrow_right_alt" v-if="notification.type.valueOf() === 5" :to="getLogRoute(notification.service) + sanitiseArn(notification.message)"></q-btn>
            <q-btn flat icon="delete" @click="clearNotification(notification.date.getUTCMilliseconds())"></q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </q-popup-proxy>
  </q-btn>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Notification, NotificationType } from 'components/models'

@Component
export default class Notifications extends Vue {
  private arnRegex = new RegExp('([^\\/]+$)')

  get notifications (): Notification[] {
    const notifications = this.$store.getters['central/getNotifications']
    console.log('not', notifications)
    if (notifications === undefined) {
      return []
    }
    return notifications
  }

  mounted () {
    this.subscribe()
  }

  subscribe () {
    const es = new EventSource('http://localhost:3030/notifications')
    es.addEventListener('INFO', (event: Record<string, any>) => {
      const data: Notification = {
        type: NotificationType.INFO,
        date: new Date(),
        message: event.data
      }
      this.$store.dispatch('central/addNotification', data)
    }, false)
    es.addEventListener('ERROR', (event: Record<string, any>) => {
      const data: Notification = {
        type: NotificationType.ERROR,
        date: new Date(),
        message: event.data
      }
      this.$store.dispatch('central/addNotification', data)
    }, false)
  }

  getLogRoute (serviceName: string): string {
    if (serviceName === undefined) {
      return ''
    }
    return '/logs/ecs/' + serviceName.replace('-ecs-service', '')
  }

  sanitiseArn (arn: string): string {
    const matchedArn = this.arnRegex.exec(arn)?.toString()
    if (matchedArn === undefined) {
      return ''
    }
    return '/' + matchedArn.split(',')[0]
  }

  clearNotification (dateMillis: number) {
    this.$store.dispatch('central/clearNotification', dateMillis)
  }
}
</script>

<style lang="sass">
.menu-link
  color: white
  background: #232f3e
</style>
