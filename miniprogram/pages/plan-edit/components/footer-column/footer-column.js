// pages/plan-edit/components/footer-column/footer-column.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isIphoneX: {        // 适配iphoneX
      type: Number,
      value: 0
    },
    txt: {                        // 文本内容
      type: String, 
      value: '创建于 8月25日 周二'
    },
    txtColor: {                   // 文本颜色
      type: String,
      value: '#767678'
    },
    btnUrl: {                     // 按钮路径
      type: String,
      value: '/static/images/del.svg'
    },
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
    // 点击按钮
    handleToBtn() {
      this.triggerEvent('del');
    },
  }
})
