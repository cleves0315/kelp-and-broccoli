// pages/plan-edit/components/title/title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mainTitle: {      // 计划标题
      type: String,
      value: '计划标题'
    },
    maxlength: {      // 输入框最大输入值
      type: Number,
      value: -1
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
    /**
     * @callback
     * 计划完成按钮切换事件
     */
    handleToChangeState(e) {
      console.log(e)
      const value = e.detail.value;   // true or false
    },

    /**
     * 输入完主标题
     * @callback input blur
     */
    handleToInputBlur(e) {
      const value = e.detail.value;

      if (value === this.data.mainTitle) return;

      this.triggerEvent('edited', { value })
    },
  }
})
