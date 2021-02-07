// pages/home/components/header/header.js
import { throttle } from '../../../../utils/util'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '我在海带与西兰花'
    },
    day: {
      type: Number,
      value: 1
    },
    btnTxt: {
      type: String,
      value: '打卡日历'
    },
    // backImage: {
    //   type: String,
    //   value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/index_header.jpg?sign=3e80640d8bda0190c64abf2d463892fa&t=1594609072'
    //   // value: 'https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/0210207220551.jpg?sign=d6e47af5c92a94489886088f8015a520&t=1612706850'
    // }
  },

  /**
   * 组件的初始数据
   */
  data: {
    touchLogo: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    logoTouchStart() {
      this.setData({
        touchLogo: 1
      })
    },
    logoTouchEnd() {
      this.setData({
        touchLogo: 2
      })
      setTimeout(() => {
        this.setData({
          touchLogo: 0
        })
      }, 180);
    },
    play() {
      // throttle()
      this.triggerEvent('play');
    }
  }
})
