import { Base } from '../../utils/base.js'

class Goods extends Base {
  constructor() {
    super()
  }

  getGoods(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  }
}

export { Goods }