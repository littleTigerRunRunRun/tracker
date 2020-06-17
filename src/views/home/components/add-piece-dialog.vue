<template>
  <md-dialog class="add-piece-dialog" :md-active.sync="visible">
    <md-dialog-title><em>{{ categoryTitle }}</em><br>添加作品</md-dialog-title>

    <md-card-content>
      <md-field>
        <label>名字</label>
        <md-input v-model="form.name" />
      </md-field>
      <md-field>
        <label>描述</label>
        <md-input v-model="form.desc" />
      </md-field>
      <md-chips v-model="form.label" :md-limit="4" md-placeholder="添加描述性标签">
        <template slot="md-chip" slot-scope="{ chip }">
          {{ chip }}
        </template>

        <div class="md-helper-text">
          至多四个
        </div>
      </md-chips>
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
import { addPiece } from '../api'

export default {
  name: 'AddCateDialog',
  props: {
    categoryId: {
      type: [String, Number],
      default: ''
    },
    categoryTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false,
      form: {
        name: '',
        desc: '',
        label: []
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
      this.form.label.splice(0, this.form.label.length - 1)
    },
    async handleSubmit() {
      const { data } = await addPiece(Object.assign({ categoryId: this.categoryId }, this.form))
      if (data.code === 200) {
        console.log(data.message)
        this.$emit('pieceAdded')
        this.handleClose()
      } else {
        console.error(data.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-piece-dialog{
    width: 540px;
    .md-dialog-title{
      margin-bottom: 0px;
      em{
        font-size: 14px;
        font-style: normal;
      }
    }
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
