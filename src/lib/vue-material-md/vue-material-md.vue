<template>
  <div class="vue-material-md">
    <!--eslint-disable-next-line-->
    <div class="content" v-html="md" />
  </div>
</template>

<script>
export default {
  name: 'VueMaterialMd',
  props: {
    md: {
      type: String,
      default: '<h1>vue material风格md风格</h1>'
    }
  },
  created() {
    window.mdSelectHandler = this.mdSelectHandler
  },
  methods: {
    mdSelectHandler(eventName, params) {
      console.log(eventName, params)
    }
  }
}
</script>

<style lang="scss">
  .vue-material-md{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .content{
      padding: 16px;
      h1 {
        font-size: 28px;
        margin: 0;
        padding: 8px 0;
      }
      p{
        font-size: 16px;
        &.select-p{
          cursor: pointer;
          color: #0076dc;
          user-select: none;
        }
      }
    }
  }
</style>
