<template>
  <div class="edit-id-box animated" v-show="active">
    <div class="v-modal" style="z-index: 9990;"></div>
    <div class="mint-msgbox-wrapper">
      <div class="mint-msgbox">
        <div class="mint-msgbox-header">
          <div class="mint-msgbox-title">请输入身份证号码</div>
        </div>
        <div class="mint-msgbox-content">
          <div class="mint-msgbox-message"></div>
          <div class="mint-msgbox-input">
            <!-- <input placeholder="" type="text" id="edit-id-input" autofocus="autofocus"> -->
            <ul class="id-numbers-container">
              <template v-for="i in 18">
                <li v-if="IDNo.length && (IDNo[i-1] || IDNo[i-1] === 0)">{{IDNo[i-1]}}</li>
                <li v-else-if="i === IDNo.length + 1" class="vertical-line blink">|</li>
                <li v-else></li>
              </template>
              <li v-show="IDNo.length === 18" class="clearAll" @click="clearIDNumber">
                <img :src="clearAll">
              </li>
            </ul>
            <div class="mint-msgbox-errormsg" v-show="this.errmsg !== ''">{{this.errmsg}}</div>
          </div>
        </div>
        <div class="mint-msgbox-btns">
          <button class="mint-msgbox-btn mint-msgbox-cancel" @click="onCancel">取消</button>
          <button class="mint-msgbox-btn mint-msgbox-confirm" @click="onConfirm">确定</button>
        </div>
      </div>
    </div>
    <keyboard :reset="isReset" v-on:input="handleOnInput"></keyboard>
  </div>
</template>

<script>
  import './less/style.less'
  const fun = require('@/lib/fun')
  const clearAll = require('./images/delete-number.svg')
  export default {
    name: 'editId',
    props: {
      active: Boolean
    },
    data () {
      return {
        errmsg: '',
        clearAll,
        IDNo: [],
        isReset: false
      }
    },
    methods: {
      onCancel () {
        this.$emit('closeEditIdBox')
        this.clearIDNumber()
        this.errmsg = ''
      },
      onConfirm () {
        let value = this.IDNo.join('')
        if (!value || !fun.checkID(value)) {
          this.errmsg = '身份证验证失败'
        } else {
          this.$emit('confirmEdit', value)
          // 根据产品需求，不同人添加身份证应该清空之前人带入的
          this.clearIDNumber()
          this.errmsg = ''
        }
      },
      clearIDNumber () {
        this.isReset = !this.isReset
      },
      handleOnInput (e) {
        this.IDNo = e
        this.errmsg = ''
      }
    }
  }
</script>
