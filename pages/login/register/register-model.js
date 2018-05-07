import { Base } from '../../../utils/base.js'

class Register extends Base {
  constructor() {
    super()
  }

  getRegister(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  }
}

export { Register }