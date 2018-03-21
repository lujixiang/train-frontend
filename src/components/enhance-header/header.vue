<template>
  <mt-header v-show="!show" class="ykb-header" :fixed="true" :title="headerTitle">
    <mt-button slot="left" icon="back" @click="onClickBack">返回</mt-button>
    <mt-button class="right-button-text" slot="right" @click="onRightButtonClick">{{rightButtonText}}</mt-button>
  </mt-header>
</template>

<script>
import './less/style.less'
const G = require('@/definition/g')
const fun = require('@/lib/fun')
const wechat = require('weixin-js-sdk')
import { mapActions } from 'vuex'
import wx from 'wechatwork'
export default {
  name: 'header',
  data () {
    return {
      headerTitle: '火车票',
      isBackIconVisiable: true // 返回按钮是否显示
    }
  },
  props: {
    onRightButtonClick: {
      type: Function,
      default: _ => {},
      require: false
    },
    rightButtonText: {
      type: String,
      default: '',
      require: false
    },
    show: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  watch: {
    '$route': 'onRouterChange'
  },
  methods: {
    ...mapActions('history', [
      'getWechatJSSign'
    ]),
    onRouterChange () {
      this.headerTitle = this.$route.meta.title || '火车票 - 云快报'
      document.title = this.$route.meta.title || '火车票 - 云快报'
      // 只有企业微信下面才执行这段代码
      if (fun.isWechatWork()) {
        this.getWeChatJSSign()
      }
    },
    onClickBack () {
      if (this._leftOoptions && this._leftOoptions.preventGoBack) {
        this.$emit('clickBack')
      } else {
        if (this.$route.path === '/') {
          // 返回之前首先要判断是不是在微信里面如果是的话需要关闭微信。。。
          if (fun.isWechat()) {
            if (this.$store.state.company && this.$store.state.company.companySettings) {
              let returnUrl = G.Base64.decode(this.$store.state.company.companySettings.returnURL)
              if (returnUrl.lastIndexOf('NativePage=index') > -1) {
                wechat.closeWindow()
              } else {
                window.location.href = returnUrl
              }
            } else {
              wechat.closeWindow()
            }
            return false
          }
          // 比较恶心的处理方式
          // 当前页在火车票首页,如果第三方有传returnURL的时候则不去执行历史进退,而直接返回传的returnURL地址
          if (this.$store.state.company && this.$store.state.company.companySettings) {
            window.location.href = G.Base64.decode(this.$store.state.company.companySettings.returnURL)
          } else {
            this.$router ? this.$router.back() : window.history.back()
          }
        } else {
          this.$router ? this.$router.back() : window.history.back()
        }
      }
    },
    getWeChatJSSign () {
      let This = this
      let callback = (res) => {
        res = JSON.parse(res)
        wx.config({
          beta: true,
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['onHistoryBack', 'hideOptionMenu', 'hideAllNonBaseMenuItem']
        })
        wx.ready(function () {
          wx.onHistoryBack(function () {
            // 监听到企业微信的返回事件调用自己的内部返回事件
            This.IOSonBack()
            return false
            // return confirm('确定要放弃当前页面的修改？')
          })
          wx.hideAllNonBaseMenuItem()
          wx.hideOptionMenu()
        })
      }
      let errcallback = (err) => {
        console.log(err)
      }
      let params = {url: decodeURIComponent(window.location.href)}
      this.getWechatJSSign({params, callback, errcallback})
    }
  },
  beforeUpdate () {
    this.headerTitle = this.$route.meta.title || '火车票 - 云快报'
    // 修改页面的title
    // console.log(this.$route.meta.title)
    document.title = this.$route.meta.title || '火车票 - 云快报'
  },
  mounted () {
    this.headerTitle = this.$route.meta.title || '火车票 - 云快报'
    document.title = this.$route.meta.title || '火车票 - 云快报'
  },
  created () {
    // this.getWeChatJSSign()
  }
}
</script>
