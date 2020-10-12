<template>
  <div class="q-px-sm q-py-lg">
    <q-page-sticky position="top-right" :offset="[64, -16]">
      <q-fab square
             :vertical-actions-align="actionsAlignment"
             :color="firstButton.colour"
             push
             :icon="firstButton.icon"
             :direction="buttonDirection">
        <q-fab-action
          square
          v-for="button in buttons"
          :key="button.id"
          :color="button.colour"
          @click="clickButton(button)"
          :icon="button.icon"
          :label="button.label"
          :label-position="button.labelPosition"/>
      </q-fab>
    </q-page-sticky>
    <q-page-sticky :style="optionsDisplay" position="top-right" :offset="[128, -16]">
      <q-fab
        square
        hide-label
        :vertical-actions-align="actionsAlignment"
        color="accent"
        push
        icon="menu"
        :direction="buttonDirection">
        <q-fab-action
          square
          v-for="option in optionsForButton()"
          :key="option.id"
          color="primary"
          @click="updateQueryParam(option)"
          icon="settings"
          :label="option.label"
          label-position="right"/>
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/composition-api'
import { Button, ButtonOption, OptionType } from 'components/models'

export default defineComponent({
  name: 'FabComponent',
  props: {
    firstButton: {
      type: Object,
      required: true,
      icon: String,
      colour: String
    },
    actionsAlignment: {
      type: String,
      default: () => 'right'
    },
    buttonDirection: {
      type: String,
      required: true
    },
    buttons: {
      type: (Array as unknown) as PropType<Button[]>,
      default: () => []
    }
  },
  methods: {
    clickButton (button: Button) {
      const optionFabShown = this.$data.optionFabShown
      this.$data.selectedFilter = button.label
      if (optionFabShown) {
        this.$data.optionsDisplay = 'display: none'
        this.$data.optionFabShown = false
      } else {
        this.$data.optionsDisplay = 'display: block'
        this.$data.optionFabShown = true
      }
    },
    optionsForButton (): ButtonOption[] {
      const label = this.$data.selectedFilter
      const options: ButtonOption[] = []
      switch (label) {
        case 'Log Limit':
          options.push({
            label: '10',
            type: OptionType.LIMIT,
            id: '1'
          } as ButtonOption)
          options.push({
            label: '100',
            type: OptionType.LIMIT,
            id: '2'
          } as ButtonOption)
          options.push({
            label: '1000',
            type: OptionType.LIMIT,
            id: '3'
          } as ButtonOption)
          options.push({
            label: '10000',
            type: OptionType.LIMIT,
            id: '4'
          } as ButtonOption)
          break
        case 'Filter Pattern':
          options.push({
            label: 'TRACE',
            type: OptionType.FILTER,
            id: '1'
          } as ButtonOption)
          options.push({
            label: 'DEBUG',
            type: OptionType.FILTER,
            id: '2'
          } as ButtonOption)
          options.push({
            label: 'INFO',
            type: OptionType.FILTER,
            id: '3'
          } as ButtonOption)
          options.push({
            label: 'WARN',
            type: OptionType.FILTER,
            id: '4'
          } as ButtonOption)
          options.push({
            label: 'ERROR',
            type: OptionType.FILTER,
            id: '5'
          } as ButtonOption)
          options.push({
            label: 'Reset',
            type: OptionType.FILTER,
            id: '6'
          } as ButtonOption)
          break
        default:
          options.push({
            label: 'default',
            type: OptionType.FILTER,
            id: '1'
          } as ButtonOption)
          break
      }
      return options
    },
    updateQueryParam (option: ButtonOption) {
      switch (option.type) {
        case OptionType.FILTER:
          if (option.label === 'Reset') {
            this.$store.dispatch('central/updateFilterPatternAction', {
              pattern: ''
            })
          } else {
            this.$store.dispatch('central/updateFilterPatternAction', {
              pattern: option.label
            })
          }
          break
        case OptionType.LIMIT:
          this.$store.dispatch('central/updateLimitAction', {
            logLimit: option.label
          })
          break
        case OptionType.TIME_SERIES:
          break
      }
      this.$store.dispatch('central/updateLogs', [])
    }
  },
  data () {
    return {
      selectedFilter: '',
      optionFabShown: false,
      optionsDisplay: 'display: none'
    }
  }
})
</script>
