import { Base } from '../../../utils/base.js'

class Shop extends Base {
  constructor() {
    super()
  }

  getShop(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  }
 

}

export { Shop }