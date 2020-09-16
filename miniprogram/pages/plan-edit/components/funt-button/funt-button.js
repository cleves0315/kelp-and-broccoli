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
      value: 'false'
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
    isFuntLive: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToTap() {
      let isFuntLive = this.data.isFuntLive;

      this.setData({
        isFuntLive: !isFuntLive
      })

      this.triggerEvent('changeState', { value: !isFuntLive });
    },
  }
})
