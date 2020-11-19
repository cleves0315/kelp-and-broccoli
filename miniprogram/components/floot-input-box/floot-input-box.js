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
    maxlength: {
      type: Number,
      value: -1
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
    inputValue: '',     // 设置输入框的值
    cursorSpacing: 0,   // 获取键盘高度值
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 设置输入框的值
     * @param  value 
     */
    handleSetValue(value) {
      this.setData({
        inputValue: value
      });
    },

    /**
     * 失焦
     */
    handleBlur() {
      if (this.data.cursorSpacing !== 0) {
        this.setData({
          cursorSpacing: 0
        });
      }
    },

    /**
     * 监听提交
     */
    handleConfim(e) {
      const value = e.detail.value;

      this.triggerEvent('confim', { value });
    },

    /**
     * 监听键盘高度变化
     */
    handleKeyboardheightchange(e) {
      // console.log(e)
      const height = e.detail.height;
      if (height > 0) {
        this.setData({
          cursorSpacing: e.detail.height
        })
      }
    },
  }
})
