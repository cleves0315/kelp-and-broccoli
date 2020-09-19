// pages/plan-edit/components/funt-button/funt-button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    iconUrl: {            // 图标地址
      type: String,
      value: ''
    },
    iconLiveUrl: {        // 激活图标地址
      type: String,
      value: ''
    },
    isDivisionLine: {     // 是否要有分割线
      type: Boolean,
      value: false
    },
    isFuntLive: {          // 按钮是否被激活（显示激活样式）
      type: Boolean,
      value: false
    },
    txt: {
      type: String,
      value: '功能按钮'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isTouch: 0,             // 记录组件touchStart事件触发
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToStart() {
      this.setData({
        isTouch: 1
      })
    },
    handleToEnd() {
      this.setData({
        isTouch: 0
      })
    },

    handleToTap() {
      this.triggerEvent('changeState');
    },
  }
})
