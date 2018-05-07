import { Base } from '../../../../utils/base.js'

class PayGo extends Base {
  constructor() {
    super()
  }

  getOrders(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  };
  
}

export { PayGo }