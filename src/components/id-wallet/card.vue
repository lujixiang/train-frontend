<template>
  <div class="id-card-content" id="idcard">
    <span class="close-icon" @click="deleteIDcard"></span>
    <div class="form-group">
      <div class="input-item" @click="chooseIDtype">
        <label>
          <span>证件类型</span>
        </label>
        <input type="text" name="idtype" readonly="readonly" v-model="userInfo.idType">
        <span class="right-icon">
          <img width="14" :src="upDownIcon">
        </span>
      </div>
      <div class="select-item" v-show="isUp">
        <!-- //筛选顺序 身份证 7 护照 1 港澳4 台湾3 其他6 -->
        <ul>
          <li v-for="id in idTypes" :key="id.key" @click="pickIDType(id)">
            <span>{{id.label}}</span>
            <span>
              <img v-if="id.selected" :src="chekcedIcon">
              <img v-if="!id.selected" :src="uncheckedIcon">
            </span>
          </li>
        </ul>
      </div>
      <template v-if="userInfo.idType === '护照'">
        <div class="input-item">
          <label>
            <b>姓(拼音)*</b>
            <small>Surname</small>
          </label>
          <input type="text" name="name" placeholder="例如：ZHANG" v-model="userInfo.lastName">
          <span class="right-icon" @click="onOff">
            <img :src="exclamatoryIcon">
          </span>
        </div>
        <div class="input-item">
          <label>
            <b>名(拼音)*</b>
            <small>Given name</small>
          </label>
          <input type="text" name="name" placeholder="例如：SAN" v-model="userInfo.firstName">
          <span class="right-icon">
            <!-- <img :src="exclamatoryIcon"> -->
          </span>
        </div>
      </template>
      <div class="input-item">
        <label>证件号码*</label>
        <input type="text" name="name" placeholder="请输入证件号码" v-model="userInfo.idNo">
        <span class="right-icon">
        </span>
      </div>
      <div class="input-item">
        <label>出生日期*</label>
        <input type="text" name="name" placeholder="例如：19900418" v-model="userInfo.birthday">
        <span class="right-icon">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import './less/style.less'
  const exclamatoryIcon = require('./images/gantanhao.svg')
  const chekcedIcon = require('./images/circle-checked.svg')
  const uncheckedIcon = require('./images/circle-unchecked.svg')
  const _ = require('lodash')
  export default {
    name: 'idCard',
    props: {
      guid: {
        type: Number,
        default: 1,
        require: true
      },
      card: {
        type: Object,
        default: _ => {
          return {}
        },
        require: false
      }
    },
    computed: {
      upDownIcon () {
        let upordown = this.isUp ? 'up' : 'down'
        return require(`./images/icon-${upordown}.png`)
      }
    },
    data () {
      return {
        exclamatoryIcon,
        chekcedIcon,
        uncheckedIcon,
        isUp: false,
        isShowNotice: false,
        idTypes: [{label: '身份证', selected: true, key: 7}, {label: '护照', selected: false, key: 1}, {label: '港澳居民来往内地通行证', selected: false, key: 5}, {label: '台湾居民来往内地通行证', selected: false, key: 3}],
        userInfo: {
          idType: '身份证', // 证件类型
          key: 7,
          lastName: '', // 姓
          firstName: '', // 名
          idNo: '', // 证件号码
          birthday: '' // 出生日期
        }
      }
    },
    methods: {
      deleteIDcard () {
        let { guid } = this.$props
        this.$emit('delete', {key: guid})
      },
      chooseIDtype () {
        this.isUp = !this.isUp
      },
      onOff () {
        this.$emit('viewpassport', {rule: 'passport'})
      },
      pickIDType (id) {
        _.forEach(this.idTypes, item => {
          if (item.key === id.key) {
            item['selected'] = true
            this.userInfo.idType = item.label
            this.userInfo.key = item.key
          } else {
            item['selected'] = false
          }
        })
        this.chooseIDtype()
      }
    },
    mounted () {
      let card = _.cloneDeep(this.$props.card)
      if (!_.isEmpty(card) && _.has(card, 'documentType')) {
        let { documentType, documentNO, birthday, givenName, surName } = card
        _.forEach(this.idTypes, item => {
          if (item.key === documentType) {
            item['selected'] = true
            this.userInfo = {
              key: item.key,
              idType: item.label,
              birthday: birthday,
              lastName: surName,
              firstName: givenName,
              idNo: documentNO
            }
          } else {
            item['selected'] = false
          }
        })
      }
    }
  }
</script>
