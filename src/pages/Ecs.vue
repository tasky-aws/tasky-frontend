<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 100%">
      <clusters></clusters>
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import Clusters from 'components/Clusters.vue'

@Component({
  components: { Clusters }
})
export default class EcsPage extends Vue {
}
</script>
