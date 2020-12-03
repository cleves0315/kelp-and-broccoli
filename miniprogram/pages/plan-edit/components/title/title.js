// pages/plan-edit/components/title/title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mainTitle: {      // 计划标题
      type: String,
      value: '今日智投'
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
     * 输入完主标题、副标题表单
     * @param {Object} e { type: main、sub }
     * @callback input blur
     */
    handleToInputBlur(e) {
      const value = e.detail.value;
      const type = e.currentTarget.dataset.type;
      const data = e.currentTarget.dataset.data;   // 副标题携带对象

      if (value == data.title) return;

      data.title = e.detail.value;

      this.triggerEvent('edited', { type, data })
    },
  }
})
