<template>
  <div class="add-passenger-content">
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div class="header-wraper">
        <mt-header class="header" :fixed="false" title="添加外部乘车人">
          <mt-button slot="left" icon="back" @click="onClose">
            <span></span>
          </mt-button>
        </mt-header>
      </div>
      <div class="form-field-content">
        <div class="form-field">
          <mt-field label="姓名*" placeholder="请输入真实姓名" v-model="username"></mt-field>
          <div @click="changeIdType">
            <mt-field label="证件类型" placeholder="请选择证件类型" :readonly="true" type="text" v-model="idtype"></mt-field>
          </div>
          <mt-field label="证件号码*" placeholder="请输入证件号码" type="text" v-model="idno"></mt-field>
        </div>
      </div>
      <div class="special-phone-number">
        <mt-field label="手机号码" placeholder="请输入手机号码（选填）" type="tel" v-model="phone"></mt-field>
        <p>
          <span>填写手机号码可以在成功出票后收到短信提醒</span>
        </p>
      </div>
      <mt-button class="confirm-add-button" type="primary" @click="confirmAddNewPassenger">确认添加</mt-button>
    </mt-popup>
    <mt-popup v-model="isPopupBottom" position="bottom" :closeOnClickModal="false" class="id-type-wrap">
      <section class="id-type-container">
        <div class="header">
          <span class="back-icon" @click="changeIdType">取消</span>
          <span>选择证件类型</span>
          <span class="confirm" @click="handleOnConfirm">确定</span>
        </div>
        <mt-picker :slots="idtypes" @change="onIdTypeChange" :defaultIndex="0" :visible-item-count="5"></mt-picker>
      </section>
    </mt-popup>
  </div>
</template>
<script>
  import './less/style2.less'
  const fun = require('@/lib/fun')
  import { mapActions } from 'vuex'
  export default {
    name: 'addPassenger',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        popupVisible: true,
        isPopupBottom: false,
        username: '',
        phone: '',
        idno: '',
        idtype: '二代身份证',
        idtypeValue: '',
        valueIds: [1, 'B', 'C', 'G'],
        values: ['二代身份证', '护照', '港澳通行证', '台湾通行证'],
        idtypes: [{
          flex: 1,
          values: ['二代身份证', '护照', '港澳通行证', '台湾通行证'],
          // 1:二代身份证，C:港澳通行证，G:台湾通行证，B:护照
          className: 'slot1'
        }]
      }
    },
    watch: {
      active: function (cV, oV) {
        this.handleRouter(cV)
      }
    },
    methods: {
      ...mapActions([
        'handleGlobalPopupLayer'
      ]),
      onClose () {
        this.$emit('close')
      },
      handleRouter (isActive) {
        let This = this
        this.handleGlobalPopupLayer({This, isActive})
      },
      onIdTypeChange (picker, values) {
        this.idtypeValue = values[0]
      },
      changeIdType () {
        this.isPopupBottom = !this.isPopupBottom
      },
      handleOnConfirm () {
        this.idtype = this.idtypeValue
        this.changeIdType()
      },
      confirmAddNewPassenger () {
        let { phone, username, idno, idtypeValue } = this
        let index = this.values.indexOf(idtypeValue)
        let id = this.valueIds[index]
        if (username === '') {
          this.Toast({
            message: '请输入真实姓名',
            during: 5000,
            position: 'bottom'
          })
          return false
        }
        if (idno === '') {
          this.Toast({
            message: '请输入证件号码',
            during: 5000,
            position: 'bottom'
          })
          return false
        }
        if (idtypeValue === '二代身份证') {
          if (!fun.checkID(this.idno)) {
            this.Toast({
              message: '身份证不合法',
              during: 5000,
              position: 'bottom'
            })
            return false
          }
        }
        if (this.phone !== '') {
          if (!fun.checkMobile(this.phone)) {
            this.Toast({
              message: '请输入正确的手机号码',
              during: 5000,
              position: 'bottom'
            })
            return false
          }
        }
        if (!fun.isChineseCharacters(username)) {
          // 如果输入的姓名为拼音或者英文则强制转换成大写
          username = username.toUpperCase()
        }
        this.$emit('addNewMember', {phone, username, idno, idtypeValue, id})
        // 输入完身份信息以后清除所填写的信息
        this.phone = ''
        this.username = ''
        this.idno = ''
        this.onClose()
      }
    }
  }
</script>
