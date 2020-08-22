// pages/my-plan/components/plan-list/plan-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnChecked: {
      type: Boolean,
      value: false
    },
    list: {
      type: Array,
      value: []
    }
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
    handleBtnChange(e) {
      console.log(e)
      const dataset = e.currentTarget.dataset;
      this.triggerEvent('btnchange', { value: dataset.value, id: dataset.id })
    }
  }
})
