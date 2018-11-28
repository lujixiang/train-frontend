<template>
  <div class="order-notice">
    <mt-popup class="order-notice-popup" position="bottom" v-model="active">
      <article v-if="rule === 'chineseName'">
        <h3>乘机人中文名填写规范</h3>
        <p>1. 乘客姓名必须与登机时所用证件上的名字一致;</p>
        <p>2. 您填写的姓名中包含有生僻字或繁体字，请从生僻字开始之后的中文都用拼音代替,如：王喆敏，请填写‘王zhemin’。</p>
        <p>3. 姓名过长时请使用缩写,例如“买买提不拉多娜萨日娜阿诺凡”简写为“买买提不拉多娜日娜阿”。</p>
      </article>
      <article v-if="rule === 'passport'">
        <h3>乘机人英文姓名填写规范</h3>
        <p>1. 乘客姓名必须与登机时所用证件上的名字一致;</p>
        <p>2. 若持护照登机，必须按照护照顺序区分姓与名。Middlename填写在Given name（中），不区分大小写。如potter（姓）/joe jerad,在Surname（姓）中填写potter,在Given name（名）中输入joe jerad。</p>
        <p>3. 姓与名总长度≤ 26 个字符,若过长请使用缩写;例如Shekin Khalifa bin Zayed Alyle Nahyan 简写为 Surname: Shekin; Given name: K b Z A Nahyan。</p>
        <p>
          <img src="./images/specifications.png">
        </p>
      </article>
      <div class="bottom-close">
        <ykb-icon :onclick="close" className="close-button" type="cancel" :width="30" :height="30"></ykb-icon>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import './less/style.less'
  export default {
    name: 'orderNotice',
    props: {
      active: {
        type: Boolean,
        default: false,
        require: false
      },
      rule: String
    },
    data () {
      return {
      }
    },
    methods: {
      close () {
        this.$emit('closeNotice')
      }
    }
  }
</script>
