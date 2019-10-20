<template>
  <page-view>
  {{ childName }}
    <md-app slot="main">
      <md-app-drawer class="navigator" md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          分类
        </md-toolbar>

        <md-list>
          <md-list-item>
            <span class="md-list-item-text">
              <md-button class="md-primary">ThreeJS</md-button>
            </span>  
          </md-list-item>

          <md-list-item>
            <span class="md-list-item-text">
              <md-button class="md-primary">Webgl</md-button>
            </span>
          </md-list-item>
        </md-list>
      </md-app-drawer>
    </md-app>
  </page-view>
</template>

<script>
  import PageView from '../components/page/page-view'

  export default {
    name: "Home",
    components: {
      PageView
    },
    computed: {
      childName() {
        console.log(this.$route)
      }
    }
  }
</script>

<style lang="scss">
  
</style>
