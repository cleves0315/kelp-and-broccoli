// pages/plan-edit/components/calendar-box/calendar-box.js
import { judgeIphoneX } from '../../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {           // 展示组件
      type: Boolean,
      value: false
    },
    showChoiceDateColumn: {   // 展示底部选择日期栏
      type: Boolean,
      value: false
    },
    choiceColumnDate: {      // 时间选择栏的显示时间
      type: String,
      value: '00:00'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0,   // 容器高度 px
    iphoneX: false,
    bottom: 0,   // 绝对定位bottom值 px
    isChoiceLineTouch: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTapBlank() {
      this.triggerEvent('close');
    },
    handelTouchStart(e) {
      const pageY = e.changedTouches[0].pageY;

      this.data.startY = pageY;
    },
    handelTouchMove(e) {
      const moveY = e.changedTouches[0].pageY;
      let difY = moveY - this.data.startY;

      if (difY <= 0) difY = 0;

      this.setData({
        bottom: difY
      });
    },
    handelTouchEnd(e) {
      const endY = e.changedTouches[0].pageY;

      
      if (endY - this.data.startY > 30) {
        this.triggerEvent('close');
        setTimeout(() => {
          this.setData({
            bottom: 0
          });
        }, 500);
      } else {
        this.setData({
          bottom: 0
        });
      }
    },

    /**点击返回按钮 */
    handleTapBack() {
      this.triggerEvent('tapback');
    },
    /** 点击设置按钮 */
    handleTapSetup(e) {
      const value = e.detail.value;
      value.month = parseInt(value.month) < 10 ? `0${value.month}` : value.month;
      value.day = parseInt(value.day) < 10 ? `0${value.day}` : value.day;

      const date = `${value.year}-${value.month}-${value.day}`;

      this.triggerEvent('setup', { date });
    },

    /** 底部选择时间栏touch手势 */
    choiceLineTouchStart() {
      this.setData({
        isChoiceLineTouch: 1
      })
    },
    choiceLineTouchEnd() {
      this.setData({
        isChoiceLineTouch: 0
      })
    },

    /** 点击选择时间栏 */
    choiceColumnTap() {
      const selectDate = this.selectComponent('#calendar').data.selectDay
      this.triggerEvent('chioce-date', { selectDate });
    },
  },

  lifetimes: {
    attached() {
      this.setData({
        iphoneX: judgeIphoneX()
      });

      const query = this.createSelectorQuery();
      query.select('#container').boundingClientRect(rect => {
        this.data.height = rect.height;
      }).exec();
    },
  }
})
