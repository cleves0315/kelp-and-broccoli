// components/navigation-bar/navigation-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    lefSideTxt: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: '0px',       // 组件高度
    iconSize: '0px',     // 按钮大小
    leftIconPosition: '0px',    // 按钮位置
    rectHieght: '0px',          // 导航栏胶囊的高度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setHeight() {
      const rect = wx.getMenuButtonBoundingClientRect();
      const windowWidth = wx.getSystemInfoSync().windowWidth;
      const statusBarHeight = wx.getSystemInfoSync().statusBarHeight;

      const gap = rect.top - statusBarHeight;
      const height = statusBarHeight + gap * 2 + rect.height;
      const iconSize = rect.height - 10;
      const leftIconPosition = windowWidth - rect.right;

      this.setData({
        height: height + 'px',
        iconSize: iconSize + 'px',
        rectHieght: rect.height + 'px',
        leftIconPosition: leftIconPosition + 'px',
      })
    },

    handleTapLeftSide() {
      this.triggerEvent('tapleftside');
    }
  },

  lifetimes: {
    attached() {
      this.setHeight();
    },

    detached() {

    }
  }
})
