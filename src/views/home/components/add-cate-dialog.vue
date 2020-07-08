<template>
  <md-dialog
    class="add-category-dialog"
    :md-active.sync="visible"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>{{ title }}</md-dialog-title>

    <md-card-content>
      <md-field :class="getValidationClass('name')">
        <label>英文分类名</label>
        <md-input v-model="form.name" :disabled="sending || nameDisabled" />
        <span v-if="!$v.form.name.required" class="md-error">为分类添加一个英文名</span>
        <span v-if="$v.form.name.required && !$v.form.name.correctEnglishName" class="md-error">作品的英文名由大小写英文字母、数字、下划线组成</span>
      </md-field>
      <md-field>
        <label>中文标题</label>
        <md-input v-model="form.title" :disabled="sending" />
      </md-field>
      <md-field>
        <label>项目描述</label>
        <md-input v-model="form.desc" :disabled="sending" />
      </md-field>
      <transition name="moveIn">
        <div v-if="errorMessage" class="api-error-text">
          {{ errorMessage }}
        </div>
      </transition>
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
import { updataCategory } from '../api'
import {
  required
} from 'vuelidate/lib/validators'
const correctEnglishName = (str) => {
  return /^[0-9a-zA-Z_]{1,}$/.test(str)
}

export default {
  name: 'AddCateDialog',
  mixins: [validationMixin],
  data() {
    return {
      visible: false,
      sending: false,
      title: '',
      id: '',
      form: {
        name: '',
        title: '',
        desc: ''
      },
      nameDisabled: false,
      errorMessage: ''
    }
  },
  validations: {
    form: {
      name: {
        required,
        correctEnglishName
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
    activate(dialogTitle, { name, title, desc, id }) {
      this.title = dialogTitle
      this.form.name = name
      this.form.title = title
      this.form.desc = desc
      if (this.form.name) this.nameDisabled = true
      else this.nameDisabled = false
      this.id = id || ''
      this.visible = true
      this.errorMessage = ''
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

      try {
        const { data } = await updataCategory(Object.assign({ id: this.id }, this.form))
        this.sending = false
        if (data.code === 200) {
          this.$emit('categoryAdded')
          this.handleClose()
          this.errorMessage = ''
        } else {
          this.errorMessage = data.message
        }
      } catch (e) {
        this.errorMessage = JSON.stringify(e)
        this.sending = false
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
    .md-field.md-disabled, .md-field.md-disabled *{
      opacity: 0.6;
      cursor: not-allowed;
    }
    .api-error-text{
      position: absolute;
      width: 320px;
      line-height: 18px;
      bottom: 38px;
      transform: translate(0%, 50%);
      color: #ff1744;
    }
  }
  .move-in-enter-active, .move-in-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  .move-in-enter, .move-in-leave-to {
    opacity: 0;
    transform: translate(-10px, 0);
  }
</style>
