// pages/plan-edit/plan-edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepList: [
      { id: 1, title: '第一步' },
      { id: 2, title: '第二步' },
      { id: 3, title: '第三步' },
      { id: 4, title: '第四步' },
      { id: 5, title: '第五步' },
    ]
  },


  /**
   * 按照id，更改step 标题
   */
  handleToEditStep(data) {
    const stepList = this.data.stepList;

    stepList.forEach((item, index) => {
      if (item.id == data.id) {
        stepList[index].title = data.title;
      }
    })

    this.setData({
      stepList
    })
  },

  /**
   * 输入完内容
   * @callback
   */
  handleToEdited(e) {
    const type = e.detail.type;
    const data = e.detail.data;

    switch (type) {
      case 'sub':
        this.handleToEditStep(data);
        break;
    }
  },

  /**
   * @callback
   * 点击删除步骤按钮
   */
  handleToDelStep(e) {
    const data = e.detail.data;
    const stepList = this.data.stepList;

    stepList.forEach((item, index) => {
      if (item.id == data.id) {
        stepList.splice(index, 1);
      }
    })

    this.setData({
      stepList
    })
  },

  /**
   * 监听 '下一步输入框' 字符数量>0不包括空格时 失焦事件回调
   */
  handleToAddStep(e) {
    const title = e.detail.title;
    const stepList = this.data.stepList;

    stepList.push({ title })

    this.setData({
      stepList: stepList
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
  }
})