// pages/plan-edit/components/plan-list/plan-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    stepList: {       // 步骤列表 数据
      type: Array,
      value: []
    },
    addTxt: {         // 下一步输入框 placeholder值
      type: String,
      value: '添加步骤'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    stepBlur: { index: -1, id: -1 },    // 控制副标题输入框失焦，当id和index符合时
    isDelStepLine: -1,                  // 要删除step的id，界面出现对应id响应消失动画
    addStepInputValue: '',              // '下一步输入框'的内容
    addStepInputFocus: false,           // 控制'下一步输入框'是否聚焦
    isAddStepInputFocus: false,         // 查看'下一步输入框'当前是聚焦 or 失焦
    delSubItemHeight: '0',                // 准备删除副标题的高度 px
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @callback
     * 点击删除按钮
     */
    handleToDelStep(e) {
      const data = e.currentTarget.dataset.data;

      wx.showActionSheet({
        itemList: ['删除任务'],
        itemColor: '#EA3927',
        success: res => {
          const query = this.createSelectorQuery();
          const queryItem = '#item-' + data.id;

          // 获取点击副标题的高度 然后删除
          query.select(queryItem)
            .boundingClientRect((rect) => {
              this.setData({    // 界面删除效果
                isDelStepLine: data.id,
                delSubItemHeight: '-' + rect.height
              })
            }).exec();
    
          // 传递事件，删除数据
          setTimeout(() => {
            this.setData({ isDelStepLine: data.id })
            
            this.triggerEvent('delStep', { data: data });
          }, 800);
        }
      })
    },

    /**
     * @callback
     * '下一步输入框'包括旁边 '+' 按钮 
     */
    handleToAddStep() {
      this.setData({     // 使输入框聚焦
        addStepInputFocus: true
      })
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

    /**
     * @callback
     * 监听 '下一步输入框' 聚焦事件
     */
    handleToAddStepInputFocus() {
      this.setData({     // 保存输入框聚焦状态，响应前端样式
        isAddStepInputFocus: true
      })
    },

    /**
     * 监听 '下一步输入框' 失焦事件
     * @callback
     */
    handleToAddStepInputBlur(e) {
      this.setData({     // 保存失焦状态
        isAddStepInputFocus: false
      })
    },

    /**
     * 监听'下一步'表单 完成按钮
     * @callback
     */
    handleToAddConfirm(e) {
      const value = e.detail.value.trim();

      // 输入的内容是空的，表单失焦
      if (value.length == 0) {
        this.setData({
          addStepInputFocus: false
        })
      } else {
        // 生成一个步骤
        this.setData({ addStepInputValue: '' });   // 清空输入框内容
        this.triggerEvent('addStep', { title: value });
      }
    },
  },
})
