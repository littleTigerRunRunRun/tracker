<template>
  <md-app>
    <md-app-drawer class="navigator" md-permanent="full">
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="label">分类</span>
        <md-button class="md-icon-button" @click.native="addCategory">
          <md-icon>add</md-icon>
        </md-button>
      </md-toolbar>

      <md-list>
        <aside-title v-for="(title, index) in titleList" :activate="activateOne === index" :key="`title${index}`" :title-data="title" :index="index" @clickItem="handleCateChange" />
      </md-list>
      <add-cate-dialog ref="addCate" :visible="addVisible" @categoryAdded="getData" />
    </md-app-drawer>

    <md-app-content class="content-container">
      main-content
    </md-app-content>
  </md-app>
</template>

<script>
import AsideTitle from './components/aside-title'
import AddCateDialog from './components/add-cate-dialog'
import { getCategoryList, getPieceList } from './api'

export default {
  name: "Home",
  components: {
    AsideTitle,
    AddCateDialog
  },
  data() {
    return {
      titleList: [],
      activateOne: 0,
      addVisible: false
    }
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
      this.titleList.splice(0, this.titleList.length, {
        title: '最新推介'
      }, ...data.data.data)
    },
    addCategory() {
      this.$refs.addCate.activate()
    },
    handleCateChange(i) {
      this.activateOne = i
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-transparent{
    .label{
      font-size: 16px;
    }
  }
  .content-container{
    border-left: none;
  }
</style>
