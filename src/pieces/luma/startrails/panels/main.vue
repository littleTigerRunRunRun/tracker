<template>
  <div class="panel-main" />
</template>

<script>
export default {
  name: 'PanelMain'
}
</script>

<style lang="postcss" scoped>
  .panel-main{
    width: calc(92% - 560px);
    height: 70%;
    box-shadow:
      0px 0px 3px rgba(255, 255, 255, 0.2),
      0px 1px 3px rgba(255, 255, 255, 0.2),
      0px 0px 7px 1px rgba(255, 255, 255, 0.25);
  }
</style>
