<template>
  <div class="timeline-buttons">
    <div class="timeline-ui-button" @click="$emit('control', 'prev')">
      <md-icon>
        fast_rewind
      </md-icon>
    </div>
    <div class="timeline-ui-button" @click="$emit('control', 'stop')">
      <md-icon>
        stop
      </md-icon>
    </div>
    <div class="timeline-ui-button" :class="{ toggling: toggle }" @click="handleClickPlay">
      <md-icon>
        {{ toggle ? toggleName : name }}
      </md-icon>
    </div>
    <div class="timeline-ui-button" @click="$emit('control', 'next')">
      <md-icon>
        fast_forward
      </md-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimelineUiButton',
  props: {
  },
  data() {
    return {
      name: 'play_arrow',
      toggleName: 'pause',
      toggle: false
    }
  },
  methods: {
    handleClickPlay() {
      this.toggle = !this.toggle
      this.$emit('control', this.toggle ? 'play' : 'pause')
    }
  }
}
</script>

<style lang="scss">
  .timeline-buttons{
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    font-size: 0px;
    .timeline-ui-button{
      width: 30px;
      height: 30px;
      line-height: 30px;
      display: inline-block;
      margin: 0 2px;
      cursor: pointer;
      vertical-align: middle;
      border-radius: 2px;
      &:hover {
        i{
          color: rgba(0, 0, 0, 0.8) !important;
        }
      }
      &.toggling{
        i{
          color: #B50012 !important;
        }
        &:hover {
          i{
            color: #B50012 !important;
          }
        }
      }
      i{
        font-size: 28px !important;
        vertical-align: middle;
        transition: color 0.2s;
      }
    }
  }
</style>
