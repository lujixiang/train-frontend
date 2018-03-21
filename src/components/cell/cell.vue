<template>
  <div class="ykb-cell">
    <template v-if="this.$props.split">
      <div class="left">
        <span class="title">{{title[0]}}</span>
        <label for="title">{{label[0]}}</label>
      </div>
      <div class="right">
        <span class="title">{{title[1]}}</span>
        <label for="title">{{label[1]}}</label>
      </div>
    </template>
    <template v-else>
      <div class="gather">
        <span class="title">{{title[0]}}</span>
        <label for="title">{{label[0]}}</label>
      </div>
    </template>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'ykb-cell',
    data () {
      return {

      }
    },
    props: {
      title: {
        type: Array,
        default: _ => {
          return ['', '']
        },
        require: false
      },
      label: {
        type: Array,
        default: _ => {
          return ['', '']
        },
        require: false
      },
      split: {
        type: Boolean,
        default: false,
        require: false
      }
    }
  }
</script>
