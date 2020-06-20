<template>
  <md-list-item class="category-list">
    <span class="md-list-item-text">
      <md-button class="md-accent category-button" :class="{ 'md-button-activate': activate }" @click="$emit('view', index)">
        {{ titleData.title }}
      </md-button>
      <div class="edit-button-group">
        <md-button class="md-icon-button" @click.native="editCategory">
          <md-icon>edit</md-icon>
        </md-button>
        <md-button class="md-icon-button" :disabled="true" @click.native="deleteCategory">
          <md-icon>delete</md-icon>
        </md-button>
      </div>
    </span>
  </md-list-item>
</template>

<script>
export default {
  name: 'AsideTitle',
  props: {
    activate: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: 0
    },
    titleData: {
      type: Object,
      default() {
        return {
          title: '', // 中文标题
          name: '', // 英文标识
          desc: '' // 描述
        }
      }
    }
  },
  methods: {
    editCategory() {
      this.$emit('changeCate')
    }
  }
}
</script>

<style lang="scss">
  .category-list{
    height: 36px !important;
    pointer-events: none;
    overflow: hidden;
    transition: height 0.2s;
    &:hover {
      height: 76px !important;
      .edit-button-group{
        opacity: 1;
      }
      .category-button:before{
      background-color: currentColor;
      opacity: .12;
      }
    }
    .md-button-activate:before {
      background-color: currentColor;
      opacity: .12;
    }
    .md-list-item-text{
      position: relative;
      pointer-events: auto;
      font-size: 0px;
    }
    .edit-button-group{
      height: 28px;
      line-height: 28px;
      margin-top: 6px;
      text-align: center;
      opacity: 0;
      transition: opacity 0.5s;
      .md-button{
        width: 28px;
        height: 28px;
        min-width: 0;
        .md-ripple{
          padding: 0;
        }
        .md-button-content{
          height: 100%;
        }
        i{
          vertical-align: middle;
          font-size: 18px !important;
        }
      }
    }
  }
</style>
