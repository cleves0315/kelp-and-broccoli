// pages/plan-edit/components/plan-list/plan-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mainTitle: {      // 计划标题
      type: String,
      value: '今日智投'
    },
    stepList: {       // 步骤列表 数据
      type: Array,
      value: []
    },
    addTxt: {         // 下一步输入框 placeholder值
      type: String,
      value: '下一步'
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
    stepBlur: { index: -1, id: -1 },    // 控制副标题输入框失焦，当id和index符合时
    isDelStepLine: -1,          // 要删除step的id，界面出现对应id响应消失动画
    addStepInputValue: '',      // '下一步输入框'的内容
    addStepInputFocus: false,   // 控制'下一步输入框'是否聚焦
    isAddStepInputFocus: false, // 查看'下一步输入框'当前是聚焦 or 失焦
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
     * @callback
     * 点击删除按钮
     */
    handleToDelStep(e) {
      console.log(e)
      const data = e.currentTarget.dataset.data;

      wx.showActionSheet({
        itemList: ['删除任务'],
        itemColor: '#EA3927',
        success: res => {
          this.setData({    // 界面删除效果
            isDelStepLine: data.id
          })
    
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
     * @callback
     * 键盘输入事件
     */
    handleToInput(e) {
      // console.log(e)
      const value = e.detail.value;
      const index = e.currentTarget.dataset.index;
      const data = e.currentTarget.dataset.data;
      
      // 当前输入回车
      // if (value.indexOf('\n') != -1) {
      //   this.setData({
      //     stepBlur: { id: data.id, index: index }
      //   })
      // }
    },
    
    /**
     * 主标题、副标题表单 失焦
     * @param {Object} e { type: main、sub }
     * @callback
     */
    handleToInputBlur(e) {
      console.log('blur')
      console.log(e)
      const value = e.detail.value;
      const type = e.currentTarget.dataset.type;
      const data = e.currentTarget.dataset.data;

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
      console.log(e)
      const value = e.detail.value.trim();

      // 生成一个步骤
      if (value.length > 0) {
        this.setData({ addStepInputValue: '' });   // 清空输入框内容
        this.triggerEvent('addStep', { title: value });
      }
    },
  },
})
