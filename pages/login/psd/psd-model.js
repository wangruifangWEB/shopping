import { Base } from '../../../utils/base.js'

class Psd extends Base {
  constructor() {
    super()
  }

  getPsd(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  }
}

export { Psd }