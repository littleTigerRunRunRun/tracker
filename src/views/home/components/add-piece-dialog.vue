<template>
  <md-dialog
    class="add-piece-dialog"
    :md-active.sync="visible"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title><em>{{ categoryTitle }}</em><br>添加作品</md-dialog-title>

    <md-card-content>
      <md-field :class="getValidationClass('name')">
        <label>英文名称</label>
        <md-input v-model="form.name" :disabled="sending" />
        <span v-if="!$v.form.name.required" class="md-error">请填写作品的英文名称</span>
        <span v-if="!$v.form.name.correctEnglishName" class="md-error">作品的英文名由大小写英文字母、数字、下划线组成</span>
      </md-field>
      <md-field :class="getValidationClass('title')">
        <label>名字</label>
        <md-input v-model="form.title" :disabled="sending" />
        <span v-if="!$v.form.title.required" class="md-error">请填写作品的标题</span>
      </md-field>
      <md-field>
        <label>描述</label>
        <md-input v-model="form.desc" :disabled="sending" />
      </md-field>
      <md-chips v-model="form.label" class="md-primary" :disabled="sending" :md-limit="3" md-placeholder="添加描述性标签">
        <template slot="md-chip" slot-scope="{ chip }">
          {{ chip }}
        </template>
        <div class="md-helper-text">
          至多三个
        </div>
      </md-chips>
    </md-card-content>

    <md-dialog-actions>
      <md-button class="md-primary md-accent" :disabled="sending" @click="handleClose">
        关闭
      </md-button>
      <md-button class="md-primary" :disabled="sending" @click="handleSubmit">
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
import { addPiece } from '../api'
const correctEnglishName = (str) => {
  return /^[0-9a-zA-Z_]{1,}$/.test(str)
}

export default {
  name: 'AddCateDialog',
  mixins: [validationMixin],
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
      sending: false,
      form: {
        name: '',
        title: '',
        desc: '',
        label: []
      }
    }
  },
  validations: {
    form: {
      name: {
        required,
        correctEnglishName
      },
      title: {
        required
      }
    }
  },
  mounted() {
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
      this.visible = false
      this.form.name = ''
      this.form.title = ''
      this.form.desc = ''
      this.form.label.splice(0, this.form.label.length - 1)
    },
    async handleSubmit() {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.sending = true
        try {
          const { data } = await addPiece(Object.assign({ categoryId: this.categoryId }, this.form))
          this.sending = false
          if (data.code === 200) {
            this.$emit('pieceAdded')
            this.handleClose()
          } else {
            console.error(data.message)
          }
        } catch (e) {
          console.error(e)
          this.sending = false
        }
      } else console.log(this.$v)
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
      padding-bottom: 16px;
      padding-top: 8px;
      .md-field{
        margin-bottom: 20px;
      }
    }
    .md-dialog-actions{
      padding-top: 0px;
      padding-bottom: 16px;
      padding-right: 24px;
    }
  }
</style>
