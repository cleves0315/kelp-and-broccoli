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
      value: [
        { title: '计划1' },
        { title: '计划2' },
        { title: '计划3' },
        { title: '计划4' },
        { title: '计划5' },
        { title: '计划6' },
        { title: '计划7' },
        { title: '计划8' },
        { title: '计划9' },
        { title: '计划10' },
        { title: '计划11' },
        { title: '计划12' },
        { title: '计划13' },
        { title: '计划14' },
      ]
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
    handleToIdentTap(e) {
      console.log(e)
      const dataset = e.detail;
      this.triggerEvent('btnchange', { value: dataset.value, id: dataset.id })
    },

    handleToTap(e) {
      this.triggerEvent('tapItem', e.currentTarget.dataset)
    }
  }
})
