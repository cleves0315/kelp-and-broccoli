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
