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
        <aside-title v-for="(title, index) in titleList" :key="`title${index}`" :activate="activateOne === index" :title-data="title" :index="index" @clickItem="handleCateChange" />
      </md-list>
      <add-cate-dialog ref="addCate" @categoryAdded="getData" />
    </md-app-drawer>

    <md-app-content class="content-container">
      <piece-block-list
        :category-id="categoryId"
        :category-title="categoryTitle"
        :list="pieceList"
        @pieceAdded="handlePieceAdded"
      />
    </md-app-content>
  </md-app>
</template>

<script>
import PieceBlockList from './components/piece-block-list'
import AsideTitle from './components/aside-title'
import AddCateDialog from './components/add-cate-dialog'
import { getCategoryList, getPieceList } from './api'

export default {
  name: 'Home',
  components: {
    AsideTitle,
    AddCateDialog,
    PieceBlockList
  },
  data() {
    return {
      titleList: [],
      pieceList: [],
      activateOne: 0
    }
  },
  computed: {
    categoryId() {
      if (this.titleList.length === 0 || !this.titleList[this.activateOne]) return ''
      return this.titleList[this.activateOne].id
    },
    categoryTitle() {
      if (this.titleList.length === 0 || !this.titleList[this.activateOne]) return ''
      return this.titleList[this.activateOne].title
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const data = await getCategoryList()
      this.titleList.splice(0, this.titleList.length, ...data.data.data)

      if (this.titleList.length > 0) {
        const pieces = await getPieceList(this.categoryId)
        this.pieceList.splice(0, this.pieceList.length, ...pieces.data.data)
      }
    },
    addCategory() {
      this.$refs.addCate.activate()
    },
    handleCateChange(i) {
      this.activateOne = i
    },
    handlePieceAdded() {

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
    padding-right: 30px;
    * {
      box-sizing: border-box;
    }
    border-left: none;
    .md-layout-item:not(:first-of-type) {
      margin-left: 20px;
    }
  }
</style>
