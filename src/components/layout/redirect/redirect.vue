<template>
  <div style="background: #fff; height: 100%;position: relative;"></div>
</template>

<script>
  import { mapActions } from 'vuex'
  const moment = require('moment')
  export default {
    name: 'redirect',
    data () {
      return {
        isStop: true
      }
    },
    methods: {
      ...mapActions(['handleIsMidnight']),
      ...mapActions('company', ['getUserByToken', 'saveCompanySettings', 'saveCurrentUser', 'getStationCodeByCityName', 'getTravelStandard', 'saveTravelStandard', 'clearDataFromLocalStorage', 'updateTraveler']),
      storeCompanySettings (args) {
        this.saveCompanySettings(args)
      },
      isMidnight (e) {
        if (e.nightOrderFlag) {
          this.handleIsMidnight({isActive: true})
        }
      },
      requestUserByToken () {
        /*
          fromCity 出发城市（非必传）
          toCity 到达城市（非必传）
          token  用户的token（必传）
          callbackURL  创建完订单返回的地址（必传参数）
          returnURL 手动返回到出差申请单的地址（必传参数，不然到首页点击返回无法返回）
          orderId 原火车票的订单id（改签的时候必传参数）
          date 时间，格式YYYY-MM-DD，出行时间（非必传）
          version 版本控制参数；v1,默认只是单程；v2支持往返（非必传，默认值只支持单程；对于不同的项目对接，有些支持单程，有些支持往返）
          userkeys 改签人员的userkey（改签的时候必传）
          action 动作，endorse改签,rebooking再次预订（预订失败，再次预订）,booking正常流程预订（出差申请单重选，云快报或第三方默认进入火车票）
          说明：
              改签走的是单程流程，所以改签的时候version不起作用
              退票直接在我的订单中心操作，火车票无需考虑
              出差申请单内火车票重选无论是单程还是往返双程都是直接跳转到首页；跟action为booking的时候一个效果
              预订失败以后在我的订单中的重新预订则是跳到火车票列表（version参数不起作用【按照默认值v1的情况走流程】，这个地方的重新预订是直接跳到列表页）

          示例：
            1）其他 ---> 跳转 ---> 火车票
            云快报跳到火车票
            /#/redirect?token=NWQzMDE5NmYzM2ExYmVmMjg4ZDY1YmYyOTJlMGQxZjI=&fromCity=武汉&toCity=苏州&action=booking&date=2018-4-20&callbackURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni9GZWVCZWxvbmcvQXBwbHk=&returnURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni8jL3JlZGlyZWN0&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0&version=v2

            出差申请单跳到火车票(非重选)
            ..../#/redirect?token=ZWY4NjQ0OTBhZmI0MmFiZDViYTc0MzBlMGU2MmRlMjM=&action=2&date=2017-11-21&returnURL=www.baidu.com&callbackURL=www.baidu.com&fromCity=上海&toCity=苏州&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0
            改签：
            token,action,callbackURL,returnURL,companyId,cooperatorId,orderId,userkeys
            /#/redirect?token=NWI4YjAzZjI4M2VmYjc2NDMyMDdmZjZmYzExMDkxYzc=&action=endorse&callbackURL=aHR0cDovL2VudHdlY2hhdG1vYi41MXlrYi5jb20vRmVlQmVsb25nL0FwcGx5=&returnURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni8jL3JlZGlyZWN0&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0&orderId=20180810134605351762&userkeys=05d3b45f-d243-c5af-f4fa-08d46436d5f7,d588aa8f-b360-4b47-a7c8-1f2d7d305afd
            重新预订
            /#/redirect?token=NWI4YjAzZjI4M2VmYjc2NDMyMDdmZjZmYzExMDkxYzc=&action=rebooking&callbackURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni9GZWVCZWxvbmcvQXBwbHk=&returnURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni8jL3JlZGlyZWN0&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0&orderId=20180810134605351762&fromCity=&toCity=&date=2018-08-15
        */
        let { token, callbackURL, returnURL, orderId, action, companyId, cooperatorId, userkeys } = this.$route.query

        return new Promise((resolve, reject) => {
          const callback = res => {
            // Indicator.close()
            let userInfo = res.user_info
            this.isMidnight(res)
            this.saveCurrentUser({token, ...userInfo})
            this.storeCompanySettings({callbackURL, returnURL, action, orderId, companyId, cooperatorId, userkeys})
            resolve(userInfo)
          }
          const errcallback = err => {
            this.isMidnight(err)
            this.Toast({
              message: err.flagmsg,
              position: 'bottom',
              duration: 5000
            })
            // Indicator.close()
            reject()
          }
          this.getUserByToken({token, callback, errcallback})
        })
      },
      getCityCode () {
        // from_station_name to_station_name
        let { fromCity, toCity } = this.$route.query
        return new Promise((resolve, reject) => {
          const callback = res => {
            resolve(res)
          }
          const errcallback = err => {
            reject(err)
          }
          this.getStationCodeByCityName({params: {from_station_name: fromCity, to_station_name: toCity}, callback, errcallback})
        })
      },
      requestTravelStandard (args = {}) {
        let { token, companyId, cooperatorId } = this.$route.query
        let { user } = args
        return new Promise((resolve, reject) => {
          const callback = res => {
            this.saveTravelStandard(res)
            resolve(res)
          }
          const errcallback = err => {
            reject(err)
          }
          this.getTravelStandard({params: {cooperator_id: cooperatorId, company_id: companyId, phone: user.user_phone, token: token}, callback, errcallback})
        })
      },
      process () {
        let { fromCity, toCity, action, date, userkeys, orderId, version } = this.$route.query
        if (!version || version === '') {
          version = 'v1'
        }
        if (moment(date).isBefore(moment())) {
          // 如果传过来的日期是在当前日期之前，则默认赋值为当前日期
          date = moment().format('YYYY-MM-DD')
        }
        this.updateTraveler({type: 'delete'})
        // if (this.isStop) {
        //   return false
        // }
        this.requestUserByToken()
        .then(res => {
          // 删除之前用户切换过的乘客
          this.clearDataFromLocalStorage(['traveler'])
          return this.requestTravelStandard({user: res})
        })
        .then(res => {
          // 如果是改签就直接不需要进行version判断了，直接进入改签页面
          if (action === 'endorse') {
            // 从我的订单发起改签操作，处理改签的逻辑
            this.Indicator.close()
            this.$router.replace({name: 'endorse', query: {userkeys, orderId}})
            return false
          }
          return this.getCityCode()
        })
        .then(res => {
          if (action === 'rebooking') {
            // 再次预订(预订失败，再次预订)
            this.Indicator.close()
            this.$router.replace({name: 'TrainList', query: {fromCity, toCity, date, trainType: 0, fromStation: res.from_station.station_code, toStation: res.to_station.station_code}})
            return false
          }
          if (version === 'v1') {
            if (action === 'booking' || action === '2') {
              this.Indicator.close()
              // 跳转到首页，并且加上参数
              this.$router.replace({name: 'Content', query: {fromCity, toCity, date, trainType: 0, fromStation: res.from_station.station_code, toStation: res.to_station.station_code}})
            }
          } else if (version === 'v2' || action === '2') {
            // action 为2的时候是为了兼容老系统
            if (action === 'booking') {
              this.Indicator.close()
              this.$router.replace({name: 'ContentRoundTrip', query: {fromCity, toCity, date, trainType: 0, fromStation: res.from_station.station_code, toStation: res.to_station.station_code}})
            }
          }
        })
        .catch(err => {
          console && console.log(err)
          // 这个时候不管遇到什么错误我都会跳到首页
          this.Indicator.close()
          if (version === 'v2') {
            this.$router.replace({name: 'ContentRoundTrip'})
          } else {
            this.$router.replace({name: 'Content'})
          }
        })
      }
    },
    created () {
      this.Indicator.open()
      this.process()
    }
  }
</script>
