// pages/plan-edit/components/edit-case/edit-case.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholderTitle: {
      type: String,
      value: '计划标题...'
    },
    placeholderContent: {
      type: String,
      value: '计划详情，可以写写该计划具体内容（选填）'
    },
    contentMaxlength: {
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
    inputTitle: '',
    inputDetail: '',
    keyboardHeight: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleContentInput(e) {
      const id = e.currentTarget.id;

      switch(id) {
        case 'title':
          this.data.inputTitle = e.detail.value;
          break;

        case 'detail':
          this.data.inputDetail = e.detail.value;
          break;
      }

      this.setData({
        conValLength: e.detail.value.length
      });
    },

    handleToGetInput() {
      return {
        inputTitle: this.data.inputTitle,
        inputDetail: this.data.inputDetail
      }
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
