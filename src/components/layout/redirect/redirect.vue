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

      }
    },
    methods: {
      ...mapActions([
        'handleIsMidnight'
      ]),
      ...mapActions('company', [
        'getUserByToken',
        'saveCompanySettings',
        'saveCurrentUser',
        'getStationCodeByCityName',
        'getTravelStandard',
        'saveTravelStandard',
        'clearDataFromLocalStorage'
      ]),
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
          fromCity 出发城市
          toCity 到达城市
          token  用户的token
          callbackURL  创建完订单返回的地址
          returnURL 手动返回到出差申请单的地址
          orderId 原火车票的订单id
          data 时间，格式YYYY-MM-DD
          action 动作，1从云快报默认进入火车票；2从从出差申请单非重选的情况下跳到火车票；3从出差申请单重选跳到火车票；
                       endorse改签,rebooking再次预订（预订失败，再次预订）
          示例：
            1）其他 ---> 跳转 ---> 火车票
            云快报跳到火车票
            /#/redirect?token=Y2Q4ZGQ1ZWNjMDhkYjk0YTBiNDQ2YTU0YWU4ZGY0Mjc=&fromCity=上海&toCity=苏州&action=2&date=2017-11-28&callbackURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni9GZWVCZWxvbmcvQXBwbHk=&returnURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni8jL3JlZGlyZWN0&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0

            出差申请单跳到火车票(非重选)
            ..../#/redirect?token=ZWY4NjQ0OTBhZmI0MmFiZDViYTc0MzBlMGU2MmRlMjM=&action=2&date=2017-11-21&returnURL=www.baidu.com&callbackURL=www.baidu.com&fromCity=上海&toCity=苏州&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0
            出差申请单跳到火车票(重选)
            .../#/redirect?token=NGRiNGM1MmY4OWI5NTE3YjAzNzRjMDU4ZTNiMDVhN2M=&action=3&date=2017-09-11&returnURL=XXX&callbackURL=XXX&fromCity=上海&toCity=苏州&orderId=201709051341006251

            2）火车票 ---> 跳转 ---> 出差申请单
            火车票跳到出差申请单（手动返回）
            returnURL + 'applyType=6' + '&data=' + {火车票本地创建的订单json数据} + '&type=train'
            火车票跳到出差申请单（重选和非重选）
            returnURL + 'applyType=14' + '&data=' + {火车票本地创建的订单json数据} + '&type=train'
            三种情况：首页火车票下单完成进出差申请单applytype=15；出差申请单选/重选14，火车票返回操作跳到出差申请单6

            改签：
            token,action,callbackURL,returnURL,companyId,cooperatorId,orderId,userkeys
            /#/redirect?token=ZmVlNTk4NTUxMjRkZGJjYWJjMmE4NDliZGY5YWFiODM=&action=endorse&callbackURL=aHR0cDovL2VudHdlY2hhdG1vYi41MXlrYi5jb20vRmVlQmVsb25nL0FwcGx5=&returnURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni8jL3JlZGlyZWN0&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0&orderId=20180315103907444552&userkeys=966a2fc6-191e-c7e2-cd5b-08d46436d5f0
            重新预订
            /#/redirect?token=ZWY3ZTg5ZGI2NDg2ODhlZTU1OTg2OGEwOTFlNzI3Mzc=&action=rebooking&callbackURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni9GZWVCZWxvbmcvQXBwbHk=&returnURL=aHR0cDovL2xvY2FsaG9zdDo0NDE2Ni8jL3JlZGlyZWN0&companyId=f88d09e8-addb-c626-7820-08d3d16ab10c&cooperatorId=fd6f14fa-5c79-46e3-9094-98f1785c83b0&orderId=20171227155810762162&fromCity=上海&toCity=苏州&date=2017-12-29
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
        let { fromCity, toCity, action, date, userkeys, orderId } = this.$route.query
        if (moment(date).isBefore(moment())) {
          // 如果传过来的日期是在当前日期之前，则默认赋值为当前日期
          date = moment().format('YYYY-MM-DD')
        }
        this.requestUserByToken()
        .then(res => {
          // 删除之前用户切换过的乘客
          this.clearDataFromLocalStorage(['traveler'])
          return this.requestTravelStandard({user: res})
        })
        .then(res => {
          if (action === '1') {
            // 从云快报app直接进入火车票的时候，进入默认首页
            this.Indicator.close()
            this.$router.replace({name: 'Content'})
          } else if (action === 'endorse') {
            // 从我的订单发起改签操作，处理改签的逻辑
            this.Indicator.close()
            this.$router.replace({name: 'endorse', query: {userkeys, orderId}})
          } else {
            return this.getCityCode()
          }
        })
        .then(res => {
          if (action === '2') {
            this.Indicator.close()
            // 跳转到首页，并且加上参数
            this.$router.replace({name: 'Content', query: {fromCity, toCity, date, trainType: 0, fromStation: res.from_station.station_code, toStation: res.to_station.station_code}})
          } else if (action === '3') {
            // 跳转到列表页
            this.Indicator.close()
            this.$router.replace({name: 'TrainList', query: {fromCity, toCity, date, trainType: 0, fromStation: res.from_station.station_code, toStation: res.to_station.station_code}})
          } else if (action === 'rebooking') {
            // 再次预订(预订失败，再次预订)
            this.Indicator.close()
            this.$router.replace({name: 'TrainList', query: {fromCity, toCity, date, trainType: 0, fromStation: res.from_station.station_code, toStation: res.to_station.station_code}})
          }
        })
        .catch(err => {
          console && console.log(err)
          // 这个时候不管遇到什么错误我都会跳到首页
          this.Indicator.close()
          this.$router.replace({name: 'Content'})
        })
      }
    },
    created () {
      this.Indicator.open({
        text: '用户校验中...',
        spinnerType: 'fading-circle'
      })
      this.process()
    }
  }
</script>
