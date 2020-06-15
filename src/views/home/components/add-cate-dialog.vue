<template>
  <md-dialog class="add-category-dialog" :md-active.sync="visible">
    <md-dialog-title>添加一个分类</md-dialog-title>

    <md-card-content>
      <md-field>
        <label>英文分类名</label>
        <md-input v-model="form.name" />
      </md-field>
      <md-field>
        <label>中文标题</label>
        <md-input v-model="form.title" />
      </md-field>
      <md-field>
        <label>项目描述</label>
        <md-input v-model="form.desc" />
      </md-field>
    </md-card-content>

    <md-dialog-actions>
      <md-button class="md-primary md-accent" @click="handleClose">
        关闭
      </md-button>
      <md-button class="md-primary" @click="handleSubmit">
        提交
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { addCategory } from '../api'

export default {
  name: 'AddCateDialog',
  data() {
    return {
      visible: false,
      form: {
        name: '',
        title: '',
        desc: ''
      }
    }
  },
  methods: {
    activate() {
      this.visible = true
    },
    handleClose() {
      this.visible = false
      this.form.name = ''
      this.form.title = ''
      this.form.desc = ''
    },
    async handleSubmit() {
      const { data } = await addCategory(this.form)
      if (data.code === 200) {
        console.log(data.message)
        this.$emit('categoryAdded')
        this.handleClose()
      } else {
        console.error(data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-category-dialog{
    width: 540px;
    .md-card-content{
      padding-left: 30px;
      padding-right: 30px;
      padding-bottom: 0px;
    }
    .md-dialog-actions{
      padding-top: 0px;
      padding-bottom: 16px;
      padding-right: 24px;
    }
  }
</style>
