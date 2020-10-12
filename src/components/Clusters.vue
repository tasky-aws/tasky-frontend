<template>
  <q-list padding bordered class="rounded-borders">
    <q-expansion-item
      :content-inset-level="0.25"
      expand-separator
      icon="img:statics/ecs.svg"
      label="Clusters"
      caption="Clusters"
      default-opened>

      <div class="q-pa-md q-gutter-sm">
        <q-btn-group spread>
          <q-btn class="btn-fixed-width" color="primary">{{ ecsClusters.length }} Clusters</q-btn>
        </q-btn-group>
      </div>

      <q-expansion-item
        :content-inset-level="0.25"
        icon="img:statics/ecs-service.svg"
        :label="cluster.clusterName"
        caption="Services"
        v-for="cluster in ecsClusters"
        :key="cluster.clusterArn">

        <div class="q-pa-md q-gutter-sm">
          <q-btn-group spread>
            <q-btn color="secondary">{{ cluster.services.length }} Services</q-btn>
            <q-btn color="secondary">{{ cluster.activeServicesCount }} Active Services</q-btn>
            <q-btn color="secondary">{{ cluster.pendingTasksCount }} Pending Tasks</q-btn>
            <q-btn color="secondary">{{ cluster.runningTasksCount }} Running Tasks</q-btn>
          </q-btn-group>
        </div>

        <q-expansion-item
          icon="img:statics/ecs-task.svg"
          :label="service.serviceName"
          caption="Tasks"
          v-for="service in cluster.services"
          :key="service.serviceArn">

          <div class="q-pa-md q-gutter-sm">
            <q-btn-group spread>
              <q-btn color="accent">{{ service.tasks.length }} Tasks</q-btn>
              <q-btn color="accent">{{ service.pendingCount }} Pending Count</q-btn>
              <q-btn color="accent">{{ service.runningCount }} Running Count</q-btn>
              <q-btn color="accent">{{ service.desiredCount }} Desired Count</q-btn>
              <q-btn :to="getLogRoute(service.serviceName)" color="primary">View logs</q-btn>
            </q-btn-group>
          </div>

          <q-item
            clickable
            :content-inset-level="0.25"
            v-for="task in service.tasks"
            :to="getLogRoute(service.serviceName) + sanitiseArn(task)"
            :key="task">
            {{task}}
          </q-item>
        </q-expansion-item>
      </q-expansion-item>
    </q-expansion-item>
  </q-list>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Cluster } from 'components/models'
import { AxiosError, AxiosResponse } from 'axios'

@Component
export default class Clusters extends Vue {
  private clusters: Cluster[] = []
  private polling?: any = null
  private lastEcsTimestamp: Date = new Date()
  private arnRegex = new RegExp('([^\\/]+$)')
  get ecsClusters (): Cluster[] {
    const clusters = this.$store.getters['central/getClusters'].clusters
    if (clusters === undefined) {
      return []
    }
    return clusters
  }

  data () {
    return {
    }
  }

  getLogRoute (serviceName: string): string {
    return '/logs/ecs/' + serviceName.replace('-ecs-service', '')
  }

  created () {
    this.pollData()
  }

  private getClusters (): boolean {
    let updatedClusters
    this.$axios.post('http://127.0.0.1:3030/ecs', {
      role_arn: this.$store.getters['roles/getActiveRole']
    }).then((response: AxiosResponse) => {
      updatedClusters = response.data.clusters
      this.$store.dispatch('central/updateClusters', {
        clusters: updatedClusters
      })
      this.$q.notify({
        type: 'positive',
        message: 'Received ECS cluster info'
      })
      return true
    }).catch((err: AxiosError) => {
      console.log(err)
      this.$q.notify({
        type: 'negative',
        progress: true,
        message: 'Failed to get ECS cluster info: ' + err
      })
      return false
    })
    return false
  }

  pollData () {
    this.getClusters()
    this.polling = setInterval(() => {
      const now: Date = new Date()
      now.setMinutes(now.getMinutes() - 5)
      if (now.getTime() > this.lastEcsTimestamp.getTime()) {
        const shouldUpdateTime = this.getClusters()
        if (shouldUpdateTime) {
          this.lastEcsTimestamp = now
        }
      }
    }, 10000)
  }

  sanitiseArn (arn: string): string {
    const matchedArn = this.arnRegex.exec(arn)?.toString()
    if (matchedArn === undefined) {
      return ''
    }
    return '/' + matchedArn.split(',')[0]
  }

  beforeDestroy () {
    clearInterval(this.polling)
  }
}
</script>

<style lang="sass">
.menu-link
  color: white
  background: #232f3e
</style>
