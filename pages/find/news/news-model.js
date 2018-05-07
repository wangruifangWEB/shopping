import { Base } from '../../../utils/base.js'

class News extends Base {
  constructor() {
    super()
  }

  getNews(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  }
}

export { News }