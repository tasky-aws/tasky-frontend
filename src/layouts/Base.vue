<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated>
      <tool-bar/>

      <div class="q-pa-sm q-pl-md row">
        <q-toolbar>
          <logo/>
          <div class="q-gutter-sm row items-center no-wrap absolute-right" v-if="true">
            <role-manager/>
            <notifications/>
          </div>
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container style="height: 1000px">
      <drawer-layer-component/>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import FabComponent from 'components/FabComponent.vue'
import DrawerLayerComponent from 'components/DrawerLayerComponent.vue'
import Notifications from 'components/Notifications.vue'
import RoleManager from 'components/RoleManager.vue'
import WindowToolbar from 'components/WindowToolbar.vue'
import Logo from 'components/Logo.vue'

@Component({
  components: {
    Logo,
    ToolBar: WindowToolbar,
    RoleManager,
    Notifications,
    FabComponent: FabComponent,
    DrawerLayerComponent: DrawerLayerComponent
  }
})
export default class Base extends Vue {
}
</script>
