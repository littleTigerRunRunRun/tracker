<template>
  <div class="panel-status" />
</template>

<script>
export default {
  name: 'PanelStatus'
}
</script>

<style lang="postcss" scoped>
  .panel-status{
    width: calc(94% - 320px);
    height: 6%;
    box-shadow:
      0px 0px 3px rgba(255, 255, 255, 0.2),
      0px 1px 3px rgba(255, 255, 255, 0.2),
      0px 0px 7px 1px rgba(255, 255, 255, 0.25);
  }
</style>
