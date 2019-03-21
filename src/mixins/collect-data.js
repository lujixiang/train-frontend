import { mapActions } from 'vuex'
const moment = require('moment')
export const collectUserAction = {
  data () {
    return {}
  },
  methods: {
    ...mapActions('history', ['recordUserOpeartion']),
    collectUserData (args = {}, msg = {}) {
      let { action } = args
      return new Promise((resolve, reject) => {
        let user = this.$store.state.company.currentUser
        let params = {
          time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          bline: 'train',
          userid: JSON.stringify(user), // 用户系统库id
          action: '', // 用户操作方式，
          msg: JSON.stringify({...msg}),
          ...args
        }
        this.recordUserOpeartion({resolve, reject, params})
      })
      .then(res => {
        console.log(res, 'Successfully loged ', action)
      })
      .catch(err => {
        console.log(err, 'log failed ', action)
      })
    }
  }
}
