<template>
  <md-dialog
    class="add-category-dialog"
    :md-active.sync="visible"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>添加一个分类</md-dialog-title>

    <md-card-content>
      <md-field :class="getValidationClass('name')">
        <label>英文分类名</label>
        <md-input v-model="form.name" :disabled="sending" />
        <span v-if="!$v.form.name.required" class="md-error">为分类添加一个英文名</span>
      </md-field>
      <md-field>
        <label>中文标题</label>
        <md-input v-model="form.title" :disabled="sending" />
      </md-field>
      <md-field>
        <label>项目描述</label>
        <md-input v-model="form.desc" :disabled="sending" />
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
import { validationMixin } from 'vuelidate'
import { addCategory } from '../api'
import {
  required
} from 'vuelidate/lib/validators'

export default {
  name: 'AddCateDialog',
  mixins: [validationMixin],
  data() {
    return {
      visible: false,
      sending: false,
      form: {
        name: '',
        title: '',
        desc: ''
      }
    }
  },
  validations: {
    form: {
      name: {
        required
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    activate() {
      this.visible = true
    },
    handleClose() {
      this.$v.$reset()
      this.visible = false
      this.form.name = ''
      this.form.title = ''
      this.form.desc = ''
    },
    async handleSubmit() {
      this.$v.$touch()
      this.sending = true

      const { data } = await addCategory(this.form)
      this.sending = false
      if (data.code === 200) {
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
      padding-top: 0px;
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
