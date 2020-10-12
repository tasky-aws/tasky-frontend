<template>
  <q-drawer
    elevated
    persistent
    show-if-above
    :mini="miniStateComputed"
    @mouseover="setMiniState(false)"
    @mouseout="setMiniState(true)"

    :width="width"
    :breakpoint="breakPoint"
    :content-class="contentClass"
  >
    <q-scroll-area class="fit">
      <q-list padding class="rounded-borders">
        <q-item :to="button.link" clickable
                v-ripple
                v-for="button in getDrawerButtons"
                :active="changeLink(button.label)"
                :key="button.id"
                @click="changeLink(button.label)"
                active-class="menu-link">
          <q-item-section avatar>
            <q-icon :name="button.icon"/>
          </q-item-section>
          <q-item-section style="color: white">{{button.label}}</q-item-section>
        </q-item>

        <q-separator/>

      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script lang="ts">
import { Button } from 'components/models'
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  props: {
    height: {
      type: Number,
      default: () => 900
    },
    width: {
      type: Number,
      default: () => 200
    },
    breakPoint: {
      type: Number,
      default: () => 500
    },
    contentClass: {
      type: String,
      default: () => 'bg-grey-9'
    },
    link: {
      type: String
    }
  }
})
export default class DrawerLayerComponent extends Vue {
  miniState = false

  get baseLink (): string {
    return this.$props.link
  }

  setMiniState (bool: boolean): void {
    this.miniState = bool
  }

  get miniStateComputed (): boolean {
    return this.miniState
  }

  changeLink (link: string): void {
    this.$data.baseLink = link
  }

  get getDrawerButtons (): Button[] {
    return [
      {
        id: 1,
        colour: 'secondary',
        icon: 'img:statics/ecs.svg',
        label: 'ECS',
        link: '/ecs'
      },
      {
        id: 2,
        colour: 'accent',
        icon: 'img:statics/cloudwatch.svg',
        label: 'Logs',
        link: '/logs/nothing/none'
      }
    ]
  }
}
</script>

<style lang="sass">
.menu-link
  color: white
  background: #232f3e
</style>
