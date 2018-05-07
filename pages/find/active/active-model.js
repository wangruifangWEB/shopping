import { Base } from '../../../utils/base.js'

class Active extends Base {
  constructor() {
    super()
  }

  getActive(id, callback) {
    var param = {
      url: 'product/' + id,
      sCallback(res) {
        callback && callback(res)
      }
    }
    this.request(param)
  }
  ActiveList() {
    return [
      {
        'id': 1,
        'img': '/images/8.png',
        'title': '【报名开启】朋友圈本地推广分享会强势来袭',
        'content': '本地商户推广越来越找不到门道儿？获客越来越难？成本越来越高？面临的难题也越来越多…..'

      },
      {
        'id': 2,
        'img': '/images/8.png',
        'title': 'iPhone 8 plus 限量发售',
        'content': '本地商户推广越来越找不到门道儿？获客越来越难？成本越来越高？面临的难题也越来越多…..'
      },
      {
        'id': 3,
        'img': '/images/8.png',
        'title': '【报名开启】朋友圈本地推广分享会强势来袭',
        'content': '本地商户推广越来越找不到门道儿？获客越来越难？成本越来越高？面临的难题也越来越多…..'
      },
      {
        'id': 4,
        'img': '/images/8.png',
        'title': 'iPhone 8 plus 限量发售',
        'content': '本地商户推广越来越找不到门道儿？获客越来越难？成本越来越高？面临的难题也越来越多…..'
      },

    ]
  }

}

export { Active }