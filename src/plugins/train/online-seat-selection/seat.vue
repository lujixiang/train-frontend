<template>
  <span @click="handleOnClick(type)">
    <img :src="seatIcon" alt="seat icon">
  </span>
</template>

<script>
  export default {
    name: 'onlineSeat',
    props: {
      type: {
        type: String,
        require: true,
        validator: (e) => {
          return e === 'A' || e === 'B' || e === 'C' || e === 'D' || e === 'F'
        }
      },
      isOverflow: {
        type: Boolean,
        default: false,
        require: false
      },
      row: {
        type: Number,
        default: 1,
        require: false,
        validator: (e) => {
          return e === 1 || e === 2
        }
      },
      count: {
        type: Number,
        default: 0,
        require: false
      },
      mark: {
        type: String
      }
    },
    data () {
      return {
        isClicked: false
      }
    },
    watch: {
      // 观察count的变化，count对应乘客的数量；如果乘客数量发生变化则需要重新更新席位的激活选中状态；
      count () {
        this.isClicked = false
      }
    },
    computed: {
      seatIcon () {
        let active = this.isClicked ? '-active' : ''
        let type = this.$props.type
        if (!type) {
          throw new Error('缺少props')
        }
        return require(`./images/${type}${active}.svg`)
      }
    },
    methods: {
      handleOnClick (e) {
        let { row, mark } = this.$props
        if (this.isOverflow) {
          if (this.isClicked) {
            this.isClicked = !this.isClicked
            this.$emit('seatClick', { row, value: e, action: 'delete', mark })
          }
          return false
        }
        this.isClicked = !this.isClicked
        let action = this.isClicked ? 'add' : 'delete'
        this.$emit('seatClick', { row, value: e, action, mark })
      }
    }
  }
</script>
