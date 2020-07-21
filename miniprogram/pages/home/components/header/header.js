// pages/home/components/header/header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '我在海带与西兰花'
    },
    btnTxt: {
      type: String,
      value: '打卡日历'
    },
    backImage: {
      type: String,
      value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/index_header.jpg?sign=3e80640d8bda0190c64abf2d463892fa&t=1594609072'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToBtn() {
      this.triggerEvent('tapbtn');
    }
  }
})
