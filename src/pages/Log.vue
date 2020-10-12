<template>
  <q-layout view="hHh lpR fFf" container style="height: inherit" class="shadow-3">
    <q-header elevated class="bg-primary">
      <q-bar style="height: 50px">
        <div class="col-1" style="padding: 10px 25px">Index</div>
        <div class="col-2" style="width: 200px; padding: 10px 15px">Timestamp</div>
        <div class="col-1">Level</div>
        <div class="col items-start" style="offset-start: 10px">Message</div>
        <fab-component :actions-alignment="actionsAlignment"
                       :button-direction="buttonDirection"
                       :buttons="buttons"
                       :first-button="firstButton"/>
      </q-bar>
    </q-header>
    <q-page-container>
      <q-page padding>

        <div class="q-pa-md full-height" style="min-height: inherit">
          <q-infinite-scroll @load="updateData" :offset="300">
            <div v-for="(item, index) in getItems" :key="index" class="caption">
              <div class="row items-center">
                <div class="col-1 items-start">#{{ index }}</div>
                <div class="col-2 items-start" style="width: 200px; padding: 10px 0">
                  {{ new Date(item.timestamp).toLocaleString() }}
                </div>
                <div class="col-1 items-start">{{item.level}}</div>
                <div class="col items-start">{{item.message}}</div>
              </div>
            </div>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots color="primary" size="40px"/>
              </div>
            </template>
          </q-infinite-scroll>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import FabComponent from 'components/FabComponent.vue'
import { AxiosResponse } from 'axios'
import { EventType, LogEvent } from 'components/models'

@Component({
  components: {
    FabComponent: FabComponent
  }
})
export default class Log extends Vue {
  previousToken = ''
  isScrollDisabled = true

  buttonDirection = 'down';
  firstButton: Record<string, any> = {
    icon: 'filter_list',
    colour: 'secondary'
  };

  actionsAlignment = 'right';
  buttons = Log.getButtons();

  private static getButtons () {
    return [
      {
        id: 1,
        colour: 'primary',
        icon: 'settings',
        label: 'Log Limit',
        labelPosition: 'right'
      },
      {
        id: 2,
        colour: 'primary',
        icon: 'settings',
        label: 'Filter Pattern',
        labelPosition: 'right'
      },
      {
        id: 3,
        colour: 'primary',
        icon: 'settings',
        label: 'Time Series',
        labelPosition: 'right'
      }
    ]
  }

  startDateEpoch (): number {
    const d: Date = new Date()
    d.setUTCDate(d.getDate() - 7)
    return d.valueOf()
  }

  get getItems (): LogEvent[] {
    const logs = this.$store.getters['central/getLogs']
    if (logs === undefined) {
      return []
    }
    return logs
  }

  get getNextToken (): string {
    return this.previousToken
  }

  mounted () {
    const service: string | undefined = this.$route.params.service
    const logGroup: string | undefined = this.$route.params.logGroup
    const streamPrefix: string | undefined = this.$route.params.streamPrefix
    this.queryForlogs(logGroup, service, streamPrefix)

    this.$store.dispatch('central/updateTimeSeriesStart', {
      start: this.startDateEpoch()
    })

    this.$store.dispatch('central/updateTimeSeriesEnd', {
      end: Date.now().valueOf()
    })

    this.$store.dispatch('central/updateLogs', [])
  }

  updateData (index: number, done: () => void) {
    setTimeout(() => {
      const service: string | undefined = this.$route.params.service
      const logGroup: string | undefined = this.$route.params.logGroup
      const streamPrefix: string | undefined = this.$route.params.streamPrefix

      this.queryForlogs(logGroup, service, streamPrefix)
      done()
    }, 10000)
  }

  private queryForlogs (logGroup: string | undefined, service: string, streamPrefix: string | undefined) {
    if (logGroup !== undefined && logGroup !== 'none') {
      this.$axios.get('http://127.0.0.1:3030/logs', {
        params: this.getParams(service, logGroup, streamPrefix)
      }).then((response: AxiosResponse) => {
        const data: LogEvent[] = response.data
        const shouldUpdateLogs = this.updatedToken(data)
        if (shouldUpdateLogs) {
          this.$store.dispatch('central/updateLogs', data)
          this.$q.notify({
            type: 'positive',
            badgeStyle: 'display: none',
            progress: true,
            message: 'Received logs'
          })
        } else {
          this.$q.notify({
            type: 'neutral',
            badgeStyle: 'display: none',
            message: 'No more log events'
          })
        }
        this.isScrollDisabled = false
      })
        .catch((err) => {
          this.$q.notify({
            type: 'negative',
            progress: true,
            message: 'Failed to get logs, error: ' + err
          })
        })
    }
  }

  private updatedToken (events: LogEvent[]): boolean {
    const tokenEvents: LogEvent[] = events.filter(event => event.eventType === EventType.TOKEN)
    const tokenEvent = tokenEvents.shift()
    const hasToken = tokenEvent?.token !== undefined
    const hasPreviousToken = this.previousToken !== ''

    const storeLogs = this.$store.getters['central/getLogs']
    if (storeLogs !== undefined && (events.length - 1) === storeLogs.length && !hasToken) {
      return false
    // if we have no new token but also no previous token and some logs then update
    } else if (!hasPreviousToken && !hasToken) {
      console.log('1')
      return true
    // if we have a next token then true
    } else if (hasToken && tokenEvent?.token !== undefined) {
      this.previousToken = tokenEvent?.token
      return true
    // if we have a previous token and the next token is undefined, don't do anything
    } else if (hasPreviousToken && !hasToken) {
      return false
    } else {
      return false
    }
  }

  private getParams (service: string, logGroup: string, streamPrefix: string | undefined) {
    const object: Record<string, any> = {
      role_arn: this.$store.getters['roles/getActiveRole'],
      log_group: '/' + service + '/' + logGroup,
      limit: this.$store.getters['central/getLimit'].logLimit,
      start_time_utc_millis: this.$store.getters['central/getTimeSeriesStart'].start,
      end_time_utc_millis: this.$store.getters['central/getTimeSeriesEnd'].end
    }
    this.updateTokenParam(object)

    const filterPattern: string | undefined = this.$store.getters['central/getFilterPattern'].pattern
    if (filterPattern !== undefined && filterPattern.length > 1) {
      object.filter_pattern = filterPattern
    }

    console.log('service logGroup streamPrefix')
    console.log(service, logGroup, streamPrefix)
    if (streamPrefix !== undefined) {
      object.log_stream_name_prefix = 'ecs/app/' + streamPrefix
    }

    return object
  }

  private updateTokenParam (object: Record<string, any>) {
    if (this.previousToken !== undefined && this.previousToken.length >= 1) {
      object.next_token = this.getNextToken
    }
  }
}
</script>
<style lang="sass" scoped>
.caption-custom
  color: #232f3e
.row-custom > div
  padding: 10px 15px
  border: 1px solid rgba(86, 61, 124, .2)

.col-custom
  padding: 10px 10px
</style>
