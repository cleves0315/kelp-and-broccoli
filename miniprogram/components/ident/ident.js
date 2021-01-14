// components/ident/ident.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {        // 设置组件宽高 -> rpx
      type: String,
      value: '50'
    },
    height: {
      type: String,
      value: '50'
    },
    checkedBackgroundColor: {     // 选中后的背景颜色
      type: String,
      value: '#07C160'
    },
    checked: {    // 当前是否选中  false->未选中
      type: Boolean,
      value: false
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
    handleToTap() {

      // wx.vibrateShort();  // 震动

      this.triggerEvent('identTap')
    }
  }
})
