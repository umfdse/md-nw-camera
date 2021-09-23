import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default new Router({
  routes: [
    {
      path: '/update',
      name: 'Update',
      component: resolve => require(['@/components/update/Update'], resolve)
    },
    {
      path: '/',
      name: '登录',
      component: resolve => require(['@/views/login/Login'], resolve)
    },
    {
      path: '/AllIndex',
      name: '主页',
      component: resolve => require(['@/views/index.vue'], resolve),
      children: [
        {
          path: '/patient',
          name: '患者管理',
          component: resolve => require(['@/views/pages/patientManage/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/list',
          name: '患者列表',
          component: resolve => require(['@/views/pages/patientManage/patientList'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/nursingMeasures',
          name: '护理措施',
          component: resolve => require(['@/views/pages/patientManage/tab/tab6/nursingMeasures'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/nursingGradingDetail',
          name: '护理评分详情',
          component: resolve => require(['@/views/pages/patientManage/components/nursingGradingDetail'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/pathography/enter',
          name: '新增入院评估',
          component: resolve => require(['@/views/pages/patientManage/pathography/enter'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/pathography/enterEdit',
          name: '编辑入院评估',
          component: resolve => require(['@/views/pages/patientManage/pathography/enterEdit'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/pathography/out',
          name: '新增出院评估',
          component: resolve => require(['@/views/pages/patientManage/pathography/out'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/pathography/outEdit',
          name: '编辑出院评估',
          component: resolve => require(['@/views/pages/patientManage/pathography/outEdit'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/severityScoreDetail',
          name: '重症评分详情',
          component: resolve => require(['@/views/pages/patientManage/doctorPages/severityScoreDetail'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/patient/apacheIIDetail',
          name: 'apacheII重症评分详情',
          component: resolve => require(['@/views/pages/patientManage/doctorPages/apacheIIDetail'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/doctorAdvice',
          name: '医嘱管理',
          component: resolve => require(['@/views/pages/doctorAdviceManage/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/department',
          name: '科室管理',
          component: resolve => require(['@/views/pages/departmentManage/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/departmentDoctor',
          name: '科室管理',
          component: resolve => require(['@/views/pages/departmentManageDoctor/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/dataManage',
          name: '数据管理',
          component: resolve => require(['@/views/pages/dataManage/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/department/detail',
          name: 'departmentDetail',
          component: resolve => require(['@/views/pages/departmentManage/detail/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/departmentManageDoctor/detail',
          name: 'departmentDetailDoctor',
          component: resolve => require(['@/views/pages/departmentManageDoctor/detail/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/system',
          name: '系统管理',
          component: resolve => require(['@/views/pages/systemManage/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
        {
          path: '/system/message',
          name: '消息中心',
          component: resolve => require(['@/views/pages/systemManage/message/index'], resolve),
          meta: {
            keepAlive: false // 动态决定是否缓存
          }
        },
      ]
    }
  ]
});
