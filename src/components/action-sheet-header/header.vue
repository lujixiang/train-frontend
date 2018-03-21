<template>
  <div class="action-sheet-header">
    <div class="header-left" @click.stop="handleCancel">{{cancelText}}</div>
    <div class="header-title">{{title}}</div>
    <div class="header-right" @click.stop="handleConfirm">{{confirmText}}</div>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'actionSheetHeader',
    props: {
      title: String,
      cancelText: {
        type: String,
        default: '取消',
        require: false
      },
      confirmText: {
        type: String,
        default: '确定',
        require: false
      }
    },
    methods: {
      handleConfirm () {
        this.$emit('confirm')
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
