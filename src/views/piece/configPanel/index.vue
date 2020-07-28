<template>
  <div class="config-panel">
    <md-button
      class="md-icon-button rect-button"
      @click.native="$emit('close')"
    >
      <md-icon style="transform=origin: 50% 50%; transform: rotate(-90deg);">
        arrow_back
      </md-icon>
    </md-button>
    <md-field
      v-for="(column, key) in form"
      :key="`column${key}`"
    >
      <label for="first-name">{{ column.des }}</label>
      <md-input v-if="column.type === 'input'" :id="key" v-model="values[key]" :name="key" />
      <md-input v-if="column.type === 'number'" :id="key" v-model="values[key]" :min="column.min" :max="column.max" :step="column.step" type="number" :name="key" />
      <md-select v-if="column.type === 'select'" :id="key" v-model="values[key]" :name="key" md-dense md-class="tracker-select">
        <md-option v-for="(option, oindex) in column.options" :key="`attr${oindex}`" :value="option.value">
          {{ option.name }}
        </md-option>
      </md-select>
    </md-field>
  </div>
</template>

<script>
export default {
  name: 'ConfigPanel',
  props: {
    form: {
      type: Object,
      default: () => { return {} }
    },
    values: {
      type: Object,
      default: () => { return {} }
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
  .config-panel{
    position: relative;
    color: #fff;
    padding: 32px 16px 16px 16px;
    .md-icon-button{
      position: absolute;
      left: 4px;
      top: 0px;
      &:hover{
        background-color: transparent;
        &:before{
          background-color: transparent !important;
        }
      }
    }
  }
  .tracker-select.md-menu-content.md-select-menu{
    .md-list {
      background-color: rgba(240, 240, 240, 0.87);
      .md-list-item{
        height: 32px;
        line-height: 32px;
        .md-list-item-button, .md-list-item-content{
          height: 32px;
          line-height: 32px;
          min-height: 0;
        }
      }
    }
  }
</style>
