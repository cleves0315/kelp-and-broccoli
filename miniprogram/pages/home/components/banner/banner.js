// pages/home/components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    photo: {
      type: String,
      value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/true.jpg?sign=a5a7f9fd322ac14a9fdd5847eda60449&t=1594617304'
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
    progressDetail: {
      type: String,
      value: '0'
    },
    progressQuantityActive: {
      type: String,
      value: '0'
    },
    progressQuantity: {
      type: String,
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
