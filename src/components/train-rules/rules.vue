<template>
  <div class="train-rules-v2-content">
    <mt-popup v-model="active" position="right" :closeOnClickModal="false">
      <div class="header-wraper">
        <mt-header class="header" :fixed="false" title="预订须知">
          <mt-button slot="left" icon="back" @click="close">
          </mt-button>
        </mt-header>
      </div>
      <div class="tab-bar">
        <span v-for="item in tabs" :class="item.checked ? 'active' : ''" @click="switchTab(item)">{{item.label}}</span>
      </div>
      <section class="tab-content" v-if="currentKey === 1">
        <div class="rules-text">
          <p class="title">购票说明</p>
          <p class="rule block">云快报合作商家通过铁路官方网站或授权代售点为您提供火车票代购服务。</p>
          <p class="rule block">因全国各铁路局规定与要求不同，无法承诺百分百代购成功，若代购失败，订单金额将全额退还至您的支付账户，1-7 个工作日到账。</p>
        </div>
        <div class="rules-text">
          <p class="title">取票说明</p>
          <p class="rule block">电子票：请持购票所使用有效身份证件原件在开车前到火车站售票窗口、铁路客票代售点或车站自动取票机办理换票手续。</p>
          <p class="rule block">纸质票：纸质票由快递员送票上门，不需要取票。</p>
          <p class="rule block">部分高铁动车组列车，可持二代身份证直接检票进站。</p>
        </div>
        <div class="rules-text">
          <p class="title">退票说明</p>
          <p class="rule block">线下退票，若居民身份证无法自动识读或使用居民身份证以外的其他有效身份证件购票时，请提供订单号码（E+9位数字）。</p>
          <p class="rule block">使用居民身份证购票且持居民身份证办理进站检票后，未乘车即出站的，请经车站确认后按规定办理。</p>
          <p class="rule block">因伤、病或者承运人责任中途下车的，请凭列车长出具的客运记录和购票时所使用的乘车人有效身份证件原件在下车站按规定办理。</p>
        </div>
        <div class="rules-text">
          <p class="title">退票手续费说明</p>
          <p class="rule">铁路局规定2019年春运，改签及变更到站后的车票乘车日期在1月21日-3月1日期间，退票时一律按照20%核收退票费。</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section">申请退票日期距发车时间</th>
                <th class="right-section">退票手续费</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15天（不含）及以上</td>
                <td>无</td>
              </tr>
              <tr>
                <td>48小时-15天</td>
                <td>票价<span class="price">5%</span></td>
              </tr>
              <tr>
                <td>24小时-48小时（不含）</td>
                <td>票价<span class="price">10%</span></td>
              </tr>
              <tr>
                <td>不足24小时</td>
                <td>票价<span class="price">20%</span></td>
              </tr>
              <tr>
                <td><span class="high-light">改签至春运期间（2019.1.21-2019.3.1）</span></td>
                <td>票价<span class="price">20%</span></td>
              </tr>
            </tbody>
          </table>
          <p class="rule">注：收取手续费时，手续费不足2元按2元收取。</p>
        </div>
        <div class="rules-text">
          <p class="title">改签说明</p>
          <p class="rule block">每张车票仅可改签一次。</p>
          <p class="rule block">每次改签云快报收取 5 元服务费。</p>
          <p class="rule block">在有运输能力的前提下，可在改签功能中变更“目的地”；对已改签车票、团体票及通票暂不提供“变更到站”服务。 </p>
        </div>
        <div class="rules-text">
          <p class="title">改签方式说明</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section">改签情况</th>
                <th class="right-section">改签方式</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6:00-23:00，未取纸质车票，距离发车时间>30分钟</td>
                <td>云快报-我的订单中改签</td>
              </tr>
              <tr>
                <td>23:00-次日6:00</td>
                <td>人工窗口改签</td>
              </tr>
              <tr>
                <td>已取纸质发票</td>
                <td>人工窗口改签</td>
              </tr>
              <tr>
                <td>距离发车时间小于等于30分钟</td>
                <td>人工窗口改签</td>
              </tr>
            </tbody>
          </table>
          <p class="rule">注：已过发车时间可前往票面始发站改签当日24点前有余票的列车出行。</p>
        </div>
        <div class="rules-text">
          <p class="title">改签支付与手续费</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section w30">改签方式</th>
                <th class="right-section">支付方式及手续费</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>原票价低于改签票价</td>
                <td>支付方式：支付改签后票款、退回原票款<br/>手续费：无</td>
              </tr>
              <tr>
                <td>原票价高于改签票价</td>
                <td>支付方式：无票补差价，退还差额（差额部分扣除手续费）<br/>手续费：按退票标准收取</td>
              </tr>
            </tbody>
          </table>
          <p class="rule">注：收取手续费时，手续费不足2元按2元收取。</p>
        </div>
        <div class="rules-text">
          <p class="title">改签后退票标准</p>
          <p class="rule">铁路局规定2019年春运，改签及变更到站后的车票乘车日期在1月21日-3月1日期间，退票时一律按照20%核收退票费。</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section">申请退票日期距发车时间</th>
                <th class="right-section">退票手续费</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15天（不含）及以上</td>
                <td>无</td>
              </tr>
              <tr>
                <td>48小时-15天</td>
                <td>票价<span class="price">5%</span></td>
              </tr>
              <tr>
                <td>24小时-48小时（不含）</td>
                <td>票价<span class="price">10%</span></td>
              </tr>
              <tr>
                <td>不足24小时</td>
                <td>票价<span class="price">20%</span></td>
              </tr>
              <tr>
                <td><span class="high-light">改签至春运期间（2019.1.21-2019.3.1）</span></td>
                <td>票价<span class="price">20%</span></td>
              </tr>
              <tr>
                <td>距离开车15天以内的车票改签至15天以上</td>
                <td>票价<span class="price">5%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rules-text">
          <p class="title">退票手续费说明</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section w50">申请改签距发车时间</th>
                <th class="right-section">可改签车次</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>48小时（不含）以上</td>
                <td>预售期内车次</td>
              </tr>
              <tr>
                <td>48小时-30分钟</td>
                <td>发车日期内有余票的车次</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rules-text">
          <p class="title">在线办理退票、改签或“变更到站”时，核收退票费的，如何获取报销凭证？</p>
          <p class="rule block">办理退票、改签或“变更到站”之日起 10 日内，凭购票时所使用的乘车人有效身份证件原件到车站售票窗口索取退票费报销凭证。依据国家发票管理有关规定，旅客可用来报销。</p>
        </div>
        <div class="rules-text">
          <p class="title">免责说明</p>
          <p class="rule block">云快报提供的是火车票代购服务，您接受本协议，意味着您同意云快报及合作商家使用您填写的乘客信息进行代购，包括但不限于授权我们使用您的乘客信息执行查询、代购、退票、改签、注册等操作，同时您必须遵守12306购票规定的服务条款(https://kyfw.12306.cn/otn/regist/rule)；</p>
          <p class="rule block">云快报不对因<br/>
（1）铁路部门调整车次、票价、坐席等信息；<br/>
（2）铁路部门调整退票规则、改签规则、售票时间；<br/>
（3）客户提供错误的订单信息（包括但不限于姓名、身份证号码、日期、车次、坐席）而造成的用户损失承担任何责任，因上述原因、客户自身原因或其他不可抗力发生的退款或差额以铁路部门实退或实收为准。
</p>
        </div>
      </section>
      <section class="tab-content" v-if="currentKey === 2">
        <div class="rules-text">
          <p class="title">乘车规则</p>
          <p class="rule block">旅客必须持有有效车票并按票面载明的日期、车次、席别乘车，<span class="high-light">同时携带有效的出入境证件及签注。</span></p>
          <p class="rule block">香港最迟取票时间为列车发车前45分钟，取票证件为内地身份证或港澳居民往来内地通行证。</p>
          <p class="rule block">大陆网站购买的车票如在香港西九龙站取票，将会收取一定的手续费。</p>
        </div>
        <div class="rules-text">
          <p class="title">香港西九龙站取票手续费</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section">乘车规则</th>
                <th class="right-section">收费标准</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>不足200RMB</td>
                <td><span class="price">10HKD</span>/张</td>
              </tr>
              <tr>
                <td>200-300RMB</td>
                <td><span class="price">20HKD</span>/张</td>
              </tr>
              <tr>
                <td>高于300RMB</td>
                <td><span class="price">30HKD</span>/张</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rules-text">
          <p class="title">退票方式说明</p>
          <p class="rule block">办理退票时间应不晚于票面指定的日期、车次开车前30分钟，始发站为香港西九龙站的车票应不晚于60分钟。</p>
          <p class="rule block">内地网站购买的车票，仅限内地办理退票。</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section">退票场景</th>
                <th class="right-section">退票方式</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6:00-23:00，未取纸质车票，距离发车时间>30分钟</td>
                <td>云快报-我的订单中改签</td>
              </tr>
              <tr>
                <td>23:00-次日6:00</td>
                <td>人工窗口改签</td>
              </tr>
              <tr>
                <td>已取纸质发票</td>
                <td>人工窗口改签</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rules-text">
          <p class="title">退票手续费说明</p>
          <table border="1" cellspacing="0" cellpadding="0">
            <thead>
              <tr>
                <th class="left-section w50">申请改签距发车时间</th>
                <th class="right-section">退票手续费</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>15天及以上</td>
                <td>票价<span class="price">5%</span></td>
              </tr>
              <tr>
                <td>48小时-14天</td>
                <td>票价<span class="price">30%</span></td>
              </tr>
              <tr>
                <td>48小时以内</td>
                <td>票价<span class="price">50%</span></td>
              </tr>
            </tbody>
          </table>
          <p class="rule">注：退票费按元计算，不足一元的部分舍去免收。</p>
        </div>
        <div class="rules-text">
          <p class="title">改签说明</p>
          <p class="rule block">办理改签时间应不晚于票面指定的日期、车次开车前30分钟，始发站为香港西九龙站的车票应不晚于60分钟。</p>
          <p class="rule block">所购车票发站为香港西九龙站的，也可在香港西九龙站售票窗口办理改签，但使用非现金支付方式且产生票价差额的仅限在内地办理。</p>
          <p class="rule block">在车票预售期内且有运输能力的前提下，每张票仅可办理一次改签操作，改签不得办理变更到站。</p>
          <p class="rule block">改签后的车票<span class="high-light">不得退票</span>。</p>
        </div>
        <div class="rules-text">
          <p class="title">在线办理退票、改签或“变更到站”时，核收退票费的，如何获取报销凭证？</p>
          <p class="rule block">办理退票、改签或“变更到站”之日起 10 日内，凭购票时所使用的乘车人有效身份证件原件到车站售票窗口索取退票费报销凭证。依据国家发票管理有关规定，旅客可用来报销。</p>
        </div>
        <div class="rules-text">
          <p class="title">免责说明</p>
          <p class="rule block">云快报提供的是火车票代购服务，您接受本协议，意味着您同意云快报及合作商家使用您填写的乘客信息进行代购，包括但不限于授权我们使用您的乘客信息执行查询、代购、退票、改签、注册等操作，同时您必须遵守12306购票规定的服务条款(https://kyfw.12306.cn/otn/regist/rule)；</p>
          <p class="rule block">云快报不对因<br/>
（1）铁路部门调整车次、票价、坐席等信息；<br/>
（2）铁路部门调整退票规则、改签规则、售票时间；<br/>
（3）客户提供错误的订单信息（包括但不限于姓名、身份证号码、日期、车次、坐席）而造成的用户损失承担任何责任，因上述原因、客户自身原因或其他不可抗力发生的退款或差额以铁路部门实退或实收为准。
</p>
        </div>
      </section>
    </mt-popup>
  </div> 
</template>

<script>
  import './less/style.less'
  import { mapActions } from 'vuex'
  export default {
    name: 'trainRules',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      }
    },
    data () {
      return {
        tabs: [{checked: true, label: '大陆境内列车', key: 1}, {checked: false, label: '广深港跨境列车', key: 2}],
        currentKey: 1
      }
    },
    watch: {
      active: function (c, o) {
        this.handleRouter(c)
      }
    },
    methods: {
      ...mapActions(['handleGlobalPopupLayer']),
      handleRouter (isActive) {
        let This = this
        this.handleGlobalPopupLayer({This, isActive})
      },
      switchTab (item) {
        this.tabs.forEach(e => {
          if (item.key === e.key) {
            this.currentKey = e.key
            e.checked = true
          } else {
            e.checked = false
          }
        })
      },
      close () {
        this.$emit('close')
      }
    }
  }
</script>
