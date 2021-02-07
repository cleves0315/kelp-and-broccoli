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
    undoList: {    // 未完成列表
      type: Array,
      value: []
    },
    finishList: {    // 完成列
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    planItemWidth: 0,       // plan宽度
    planItemHeight: 0,      // 单个plan高度
    planItemMagBottom: 2,   // 单个plan margin-bottom像素
    finishListHeight: 0,    // 完成列表的高度

    hidePlan: 0,      // 改变状态的pian（有过渡消失效果）

    // 图标
    sulightIcon: '/static/images/plan-edit/sunlight.svg',   // 我的一天
    overIcon: '/static/images/plan-edit/date_live.svg',  // 截止日期
    overIconExpired: '/static/images/plan-edit/date_over.svg',
    repeatIcon: '/static/images/plan-edit/repeat_live.svg',       // 重复
    repeatIconExpired: '/static/images/plan-edit/repeat_expired.svg',
    bookIcon: '/static/images/plan-edit/book.svg',
    remindIcon: '/static/images/plan-edit/bell.svg',

    // 触摸组
    notTrionId: null,        // 不做过渡动画的id
    translateId: null,       // 要进行移动的id
    translateX: 0,       // 手指滑动的距离translateX元素值
    startX: 0,      // touchStartX坐标
    startY: 0,      // touchStartY坐标
    moveX: 0,
    moveY: 0,
    moveDelay: false,      // 手势移动延迟
    moveDelaySwtich: false,
    moveStart: false,      // 开始移动 表示当前手指正在滑动单个计划
    moveType: '',          // move手势滑动类型（横向：horizontal、纵向：vertical）

    // 完成时音频
    finishAudio: 'https://6f6e-on-line-1gqban3ba49e3d35-1302613116.tcb.qcloud.la/finish.mp3?sign=b2d2326f81aa82aa618ef18d33c59206&t=1612715701',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    touchStart(e) {
      let x = e.changedTouches[0].clientX;
      let y = e.changedTouches[0].clientY;

      
      this.data.startX = x;
      this.data.startY = y;
      this.data.moveDelay = true;

      this.setData({
        translateX: 0   // 先初始化移动值
      })
    },
    touchMove(e) {
      const startX = this.data.startX;
      const startY = this.data.startY;
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;
      const moveDelay = this.data.moveDelay;

      // 保存本次移动的位置
      this.data.moveX = x;
      this.data.moveY = y;
      
      // 手指移动延迟
      if (moveDelay) {

        // 延迟区间不会做任何滚动操作↓

        const moveDelaySwtich = this.data.moveDelaySwtich;

        if (moveDelaySwtich) return;
        this.data.moveDelaySwtich = true;
        
        // 判断本次手指是 '横向滑动'还是'纵向滑动'
        setTimeout(() => {
          const moveX = this.data.moveX;
          const moveY = this.data.moveY;
          const curtDifX = Math.abs(moveX - startX);   // 本次延迟手指移动的距离
          const curtDifY = Math.abs(moveY - startY);

          if (curtDifX > curtDifY) {
            this.data.moveType = 'horizontal';   // 记录本次为横向移动
            this.data.startX = moveX;
            this.data.startY = moveY;
            // 获取本次移动元素的_id
            const data = e.currentTarget.dataset.data;

            // 关闭这个元素的过渡动画效果进行移动
            this.setData({
              notTrionId: data._id,
              translateId: data._id,
            })

          } else {
            this.data.moveType = 'vertical';
          }

          this.data.moveDelay = false;   // 延迟结束
          this.data.moveDelaySwtich = false;
        }, 40);

      } else {

        // 延迟结束开始做滑动操作↓

        let difX = x - startX;   // 本次移动的x距离
        const moveType = this.data.moveType;
        const planHeight = this.data.planItemHeight;
        const id = e.currentTarget.dataset.data._id;

        if (moveType === 'horizontal') {
          // 本次是横向滑动

          // 手势往右划 让他很难滑动
          if (difX > 0) difX *= .1;
          // 移动超过删除按钮的宽度 让他很难滑动
          if (-difX > (planHeight+15)) difX = -(planHeight+15) + difX*.1;

                  
          this.setData({
            translateX: difX
          });

          // 记录手指开始移动，如果开始移动就关闭外部scroll滚动
          if (!this.data.moveStart) {
            // 这个做个开关，不重复触发这个事件
            this.data.moveStart = true;
            this.triggerEvent('movePlanStart');  // 抛出停止事件冒泡，不滑动外部滚动列表
          }

        } else if (moveType === 'vertical') {
          // 本次是纵向滑动
          // console.log('本次是纵向滑动');
        }

      }
    },
    touchEnd(e) {
      let translateX = this.data.translateX;

      const moveType = this.data.moveType;
      const planHeight = this.data.planItemHeight;
      
      if (moveType === 'horizontal') {
        this.data.moveStart = false;  // 结束手指移动标识
        this.data.moveType = '';

        // 手指往右滑动
        if (translateX > 0) translateX = 0;

        // if (Math.abs(translateX) > (planWidth / 2)) {
        //   translateX = -planWidth;
        // } else
        if (Math.abs(translateX) > planHeight) {
          translateX = -planHeight - 15;
        } else {
          translateX = 0;
        }

        // 开启过渡动画效果，移动元素到上面规则指定的位置
        this.setData({
          notTrionId: null,
          // translateId: null,
          translateX,
        })
  
        this.triggerEvent('movePlanEnd');
      }
    },

    
    /**
     * 切换单个计划完成状态
     * @callback tap
     */
    handleChangeState(e) {
      let markHide, markShow = 0;
      const { data, index, type } = e.currentTarget.dataset;
      
      wx.vibrateShort({  // 震动
        type: 'heavy'
      });

      if (type === 'normal') {
        markHide = data.create_time_applets;
        console.log(this.innerAudioContext.paused)
        if (!this.innerAudioContext.paused) {
          this.innerAudioContext.stop();
        }
        this.innerAudioContext.play();
      } else if (type === 'finish') {
        markHide = data.finish_date;
      }
      markShow = data.create_time_applets;
      
      // 渐变消失
      this.setData({
        hidePlan: markHide
      });

      setTimeout(() => {
        // 效果结束后 抛出事件取消渐变效果
        this.triggerEvent('change-state', { index, data });
        this.setData({
          hidePlan: 0,
          showPlan: markShow
        });
      }, 210);
    },

    /**
     * 点击单个计划
     * @todo 进入计划详情页
     */
    handleToTap(e) {
      this.triggerEvent('tapItem', e.currentTarget.dataset)
    },

    /**
     * 切换已完成按钮  true: 显示完成计划
     * @param {Boolean} e.detail.value 切换后的值
     * @todo 查看或隐藏已完成的计划
     */
    handleChangeFinishedBtn(e) {
      let finishListHeight = 0;
      const value = e.detail.value;
      
      if (value) {
        finishListHeight = this.data.finishList.length * (this.data.planItemHeight + this.data.planItemMagBottom) + 100;
      } else {
        finishListHeight = 0;
      }

      this.setData({
        finishListHeight
      })
    },

    /** 删除按钮 */
    delPlan(e) {
      const { data } = e.currentTarget.dataset;

      // 滑动的元素回归原来位置
      this.setData({
        notTrionId: null,
        translateX: 0,
      })

      this.triggerEvent('delplan', {data });
    },
  },

  lifetimes: {
    attached() {
      // 获取planitem的高度
      this.createSelectorQuery()
        .select('#plan-item')
        .boundingClientRect(rect => {
          const { width, height } = rect;
          this.setData({
            planItemWidth: width,
            planItemHeight: height
          })
        }).exec();

      this.innerAudioContext = wx.createInnerAudioContext()
      this.innerAudioContext.src = this.data.finishAudio
    }
  }
})
