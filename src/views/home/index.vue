<template>
  <page-view>
    <md-app slot="main">
      <md-app-drawer class="navigator" md-permanent="full">
        <md-toolbar class="md-transparent" md-elevation="0">
          分类
        </md-toolbar>

        <md-list>
          <aside-title title="ThreeJS" />
          <aside-title title="Webgl" />
        </md-list>
      </md-app-drawer>
    </md-app>
  </page-view>
</template>

<script>
  import PageView from '../components/page-view'
  import AsideTitle from './components/aside-title'
  import { getCategoryList } from './api'

  export default {
    name: "Home",
    components: {
      PageView,
      AsideTitle
    },
    computed: {
      childName() {
        console.log(this.$route)
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      async getData() {
        let data = await getCategoryList()
        console.log('home category', data.data.data)
      }
    }
  }
</script>

<style lang="scss">
  
</style>
