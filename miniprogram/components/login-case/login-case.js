// components/login-case/login-case.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Number,
      value: 0
    },
    title: {
      type: String,
      value: '微信授权'
    },
    logoUrl: {
      type: String,
      value: 'https://6272-broccoli-puuzo-1302613116.tcb.qcloud.la/broccoli.png?sign=0f88b906a4d2445e61e39f7dbd1c0db7&t=1595758429'
    },
    contTitle: {
      type: String,
      value: '海带与西兰花'
    },
    contDetails: {
      type: Array,
      value: ['获取您的公开信息（昵称、头像）']
    },
    closeBtnTxt: {
      type: String,
      value: '拒绝'
    },
    finishBtnTxt: {
      type: String,
      value: '允许'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    touch: ''
  },
  

  /**
   * 组件的方法列表
   */
  methods: {
    closeCompent() {
      this.setData({ isShow: 0 })
    },

    handleToGetuserinfo(e) {
      if (!e.detail.errMsg.includes('ok')) return;

      this.setData({ isShow: 0 });
      this.triggerEvent('getuserinfo', { userInfo: e.detail.userInfo });
    },

    handleStart(e) {
      const action = e.currentTarget.dataset.action;
      let touch = ''

      switch(action) {
        case 'close':
          touch = 'touchclose';
          break;
        case 'finish':
          touch = 'touchfinish';
          break;
      }
      this.setData({ touch });
    },
    handleEnd(e) {
      this.setData({ touch: 0 });
    },

    handleToFunt(e) {
      const action = e.target.dataset.action;
      
      switch(action) {
        case 'close':
          return this.closeCompent();
      }
    }
  }
})
