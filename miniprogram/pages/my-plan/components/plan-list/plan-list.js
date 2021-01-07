// pages/my-plan/components/plan-list/plan-list.js
import { sortArrayMax } from '../../../../utils/util';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnChecked: {
      type: Boolean,
      value: false
    },
    list: {    // 列表数据
      type: Array,
      value: []
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    planList: [],   // 保存未完成的计划列表
    finishList: [],  // 已完成的计划列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 切换单个计划完成状态
     * @callback tap
     */
    handleChangeState(e) {
      const index = e.currentTarget.dataset.index;
      wx.vibrateShort({  // 震动
        type: 'heavy'
      });
      this.triggerEvent('change-state', { index });
    },

    /**
     * 点击单个计划
     * @todo 进入计划详情页
     */
    handleToTap(e) {
      this.triggerEvent('tapItem', e.currentTarget.dataset)
    },

    /**
     * 切换已完成按钮
     * @param {Boolean} e.detail.value
     * @todo 查看或隐藏已完成的计划
     */
    handleChangeFinishedBtn(e) {
      const value = e.detail.value;
      console.log(value);
    },
  },

  observers: {
    list(val) {
      // const planList = [];
      // const finishList = [];
      // const initial = planList.length === 0 && finishList.length === 0;

      // if (val.length === 0) return;

      // val = sortArrayMax(val, 'create_time_applets');
      
      // // 页面加载组件之间传递值
      // if (initial) {
      //   val.forEach(item => {
      //     if (item.is_finish) {
      //       finishList.push(item);
      //     } else {
      //       planList.push(item);
      //     }
      //   });
      // } else {
      //   // 新增计划给已存在的list新增记录

      // }
    },
  }
})
