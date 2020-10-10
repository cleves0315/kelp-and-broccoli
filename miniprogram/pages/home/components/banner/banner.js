// pages/home/components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    photo: {
      type: String,
      value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/true_2.jpg?sign=e73cf52b8aa79ab48b2a187b01b45ab9&t=1602308052'
      // 以下是原版地址
      // value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/true.jpg?sign=a5a7f9fd322ac14a9fdd5847eda60449&t=1594617304'
    },
    mode: {
      type: String,
      value: 'aspectFill'
    },
    bannerTitle: {
      type: String,
      value: '先登陆后查看'
    },
    rightTableTxt: {
      type: String,
      value: '当前计划'
    },
    percentage: {
      type: Number,
      value: '0'
    },
    curGreQuany: {
      type: Number,
      value: '0'
    },
    greQuany: {
      type: Number,
      value: '0'
    },
    progressActiveColor: {
      type: String,
      value: '#2fb38b'
    },
    progressBackgroundColor: {
      type: String,
      value: 'rgba(238, 238, 238, .4)'
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
    handleTapBanner() {
      this.triggerEvent('tapbanner')
    }
  }
})
