// pages/plan-edit/components/edit-case/edit-case.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleValue: {
      type: String,
      value: ''
    },
    detailValue: {
      type: String,
      value: ''
    },
    placeholderTitle: {
      type: String,
      value: '计划标题...'
    },
    placeholderContent: {
      type: String,
      value: '计划详情，可以写写该计划具体内容（选填）'
    },
    detailMaxlength: {
      type: Number,
      value: 200
    },
    conValLength: {
      type: Number,
      value: 0
    },
    conValMaxLength: {
      type: Number,
      value: 200
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    keyboardHeight: 0,         // 底部最大字数提示栏 bottom位置
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 监听标题、详情input事件
     * @param {String} e 
     */
    handleContentInput(e) {
      // console.log(e)
      const id = e.currentTarget.id;

      this.setData({
        conValLength: e.detail.value.length
      });

      this.triggerEvent('detail-input', { id, value: e.detail.value });
    },

    /**
     * 获取键盘高度
     */
    handleKeyboardheightchange(e) {
      this.setData({
        keyboardHeight: e.detail.height
      })
    }
  }
})
