// components/floot-input-box/floot-input-box.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isIphoneX: {        // 适配iphoneX
      type: Number,
      value: 0
    },
    background: {        // 背景颜色
      type: String,
      value: '#fff'
    },
    inputPlaceTxt: {    // 添加计划input标签提示文本
      type: String,
      value: '添加任务'
    },
    adjustPosition: {   // 键盘弹起时，是否自动上推页面
      type: Boolean,
      value: false
    },
    inputPlaceIcon: {    // 添加计划input标签提示icon
      type: String,
      value: '/static/images/add.svg'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    cursorSpacing: 0,   // 获取键盘高度值
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 监听键盘高度变化
     */
    handleKeyboardheightchange(e) {
      console.log(e)
      this.setData({
        cursorSpacing: e.detail.height
      })
    },
  }
})