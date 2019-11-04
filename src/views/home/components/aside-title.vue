<template>
  <md-list-item class="category-list">
    <span class="md-list-item-text">
      <md-button class="md-accent category-button" :class="{ 'md-button-activate': activate }" @click="$emit('clickItem', index)">
        {{ titleData.title }}
        <md-icon v-if="titleData.edit" class="edit-button" @click.native.stop="editCategory">edit</md-icon>
      </md-button>
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
      console.log('edit')
    }
  }
}
</script>

<style lang="scss">
  .category-list{
    pointer-events: none;
    .md-list-item-text{
      position: relative;
      pointer-events: auto;
    }
    .edit-button{
      display: inline;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .category-button:hover .edit-button, .edit-button:hover{
      opacity: 1;
    }
    .md-button-activate:before {
      background-color: currentColor;
      opacity: .12;
    }
  }
</style>