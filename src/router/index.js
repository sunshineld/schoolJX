import Vue from "vue";
import store from '../store/'
import Router from "vue-router";
import Main from "@/pages/Main/Main";
const Login = resolve => require(["@/pages/Login/"], resolve); //登录
import ForgetPassword from "@/pages/ForgetPassword/"; //登录
import Home from "@/pages/Home/";
import Test from "@/pages/Test/";

//驼峰转连接
let setString = function(s) {
  let n = s.indexOf(":");
  if (n !== -1) {
    --n;
    s = s.substring(0, n);
  }
  let sArr = s.split("-");
  for (let i = 0, size = sArr.length; i < size; ++i) {
    sArr[i] = sArr[i][0].toUpperCase() + sArr[i].substring(1);
  }
  return sArr.join("");
};

function setRouter(list) {
  let arr = [];
  for (let item of list) {
    const keys = Object.keys(item);
    let obj = {};
    for (let key of keys) {
      if (key !== "name") {
        obj[key] = item[key];
      }
    }
    if (item["path"]) {
      obj["name"] = item['name'] ? item['name'] : setString(item["path"]);
    }
    arr.push(obj);
  }
  return arr;
}

//NotFound
const NotFound = resolve => require(["@/pages/NotFound/"], resolve); //试卷管理
const White = resolve => require(["@/pages/NotFound/White"], resolve); //试卷管理
//财务管理
const MoneyManagerUseLog = resolve =>
  require(["@/pages/MoneyManager/UseLog"], resolve); // 消费记录
const MoneyManagerMoney = resolve =>
  require(["@/pages/MoneyManager/Money"], resolve); // 充值退款
const MoneyManagerChart = resolve =>
  require(["@/pages/MoneyManager/Chart"], resolve); // 财务报表
const MonitorData = resolve => require(["@/pages/MonitorData/"], resolve); //监控数据管理

//试卷管理
const Papers = resolve => require(["@/pages/Papers/"], resolve); //试卷管理
const PapersAdd = resolve => require(["@/pages/Papers/PapersAdd"], resolve); //添加试题
const PapersAdd2 = resolve => require(["@/pages/Papers/PapersAdd2"], resolve); //添加试题(语文，英语)
const PapersCreate = resolve =>
  require(["@/pages/Papers/PapersCreate"], resolve); //生成试卷
// 试题管理
const QuestionSystem = resolve => require(["@/pages/Question/System"], resolve); // 系统题库
const QuestionSchool = resolve => require(["@/pages/Question/School"], resolve); // 学校题库
const QuestionGrade = resolve => require(["@/pages/Question/Grade"], resolve); // 年级题库
const QuestionTeacher = resolve =>
  require(["@/pages/Question/Teacher"], resolve); // 教师题库
const QuestionCreate = resolve => require(["@/pages/Question/Create"], resolve); // 添加题库
const QuestionAlter = resolve => require(["@/pages/Question/Alter"], resolve); // 修改试题

//资产管理
const AssetManage = resolve => require(["@/pages/AssetManage/"], resolve); // 教师题库
// 考试管理
const ExamineTeacherWorkloadQuery = resolve =>
  require(["@/pages/Examine/TeacherWorkloadQuery"], resolve); // 教师工作量查询
const ExamineQueryChart = resolve =>
  require(["@/pages/Examine/QueryChart"], resolve); // 教师工作量查询图标
const ExamineRead = resolve => require(["@/pages/Examine/Read"], resolve); // 阅卷任务 全部
const ExamineReadDetail = resolve =>
  require(["@/pages/Examine/ReadDetail"], resolve); // 阅卷任务详情
const ExamineExamineList = resolve =>
  require(["@/pages/Examine/ExamineList/List"], resolve); // 考试列表
const ExamineListCreate = resolve =>
  require(["@/pages/Examine/ExamineList/CreateSubject"], resolve); // 考试列表-新建考试任务
const ExamineEditorSubject = resolve =>
  require(["@/pages/Examine/ExamineList/EditorSubject"], resolve); // 考试列表-修改
const ExamineReadSubject = resolve =>
  require(["@/pages/Examine/ExamineList/ReadSubject"], resolve); // 考试列表-查看
const ExamineSubjectList = resolve =>
  require(["@/pages/Examine/SubjectList/List"], resolve); // 科目列表
const ExamineSubjectCreate = resolve =>
  require(["@/pages/Examine/SubjectList/Create"], resolve); // 科目列表-创建
const ExamineSupply = resolve =>
  require(["@/pages/Examine/SubjectList/Supply"], resolve); // 科目列表-成绩补录
const ExamineSubjectDetail = resolve =>
  require(["@/pages/Examine/SubjectList/Detail"], resolve); // 科目列表-查看
const ExamineSubjectEditor = resolve =>
  require(["@/pages/Examine/SubjectList/Editor"], resolve); // 科目列表-修改
const ExamineSubjectReadTask = resolve =>
  require(["@/pages/Examine/SubjectList/ReadTask"], resolve); // 科目列表-查看分配任务
const ExamineReadScoreList = resolve =>
  require(["@/pages/Examine/SubjectList/ReadScoreList"], resolve); // 科目列表-查看成绩
const ExamineErrorList = resolve =>
  require(["@/pages/Examine/SubjectList/ErrorList"], resolve); // 科目列表-查看错题
const ExamineErrorChart = resolve =>
  require(["@/pages/Examine/SubjectList/ErrorChart"], resolve); // 科目列表-查看错题图表
const ExamineTeacherTask = resolve =>
  require(["@/pages/Examine/SubjectList/TeacherTask"], resolve); // 科目列表-分配任务
  const ExamineSticker = resolve =>
  require(["@/pages/Examine/SubjectList/Sticker"], resolve); // 科目列表-打印贴纸
//教务管理
const TeachingManageItem = resolve =>
  require(["@/pages/TeachingManage/TeachingManageItem"], resolve); // 考试列表
const TeachingManageLists = resolve =>
  require(["@/pages/TeachingManage/TeachingManageLists"], resolve); // 教学科目列表
const TeachingManageTasking = resolve =>
  require(["@/pages/TeachingManage/TeachingManageTasking"], resolve); // 教学任务分配
const TeachingManageProgress = resolve =>
  require(["@/pages/TeachingManage/TeachingManageProgress"], resolve); // 教学进度管理
const TeachingManageCourseware = resolve =>
  require(["@/pages/TeachingManage/TeachingManageCourseware"], resolve); // 课件

//排课管理
const CourseManageRecord = resolve =>
  require(["@/pages/CourseManage/CourseManageRecord"], resolve); // 排课列表
const CourseManageRecordAdd = resolve =>
  require(["@/pages/CourseManage/CourseManageRecordAdd"], resolve); // 排课列表-新增
const CourseManageRecordDetail = resolve =>
  require(["@/pages/CourseManage/CourseManageRecordDetail"], resolve); // 排课列表-详情
const CourseManageTimeRecord = resolve =>
  require(["@/pages/CourseManage/CourseManageTimeRecord"], resolve); // 排课列表-详情
//课表
const Schedule = resolve => require(["@/pages/Schedule/Schedule"], resolve); // 考试列表
//终端管理
const TerminalManageConsumption = resolve =>
  require(["@/pages/TerminalManage/TerminalManageConsumption"], resolve); // 消费终端
const TerminalManageAttendance = resolve =>
  require(["@/pages/TerminalManage/TerminalManageAttendance"], resolve); // 考勤终端

//校园信息管理
const TeachingStaffManage = resolve =>
  require(["@/pages/CampusInforManage/TeachingStaffManage"], resolve); //教职工管理
const GradeManage = resolve =>
  require(["@/pages/CampusInforManage/GradeManage"], resolve); //年级管理
const ClassManage = resolve =>
  require(["@/pages/CampusInforManage/ClassManage"], resolve); //班级管理
const StudentManage = resolve =>
  require(["@/pages/CampusInforManage/StudentManage"], resolve); //学生管理
const DepartmentManage = resolve =>
  require(["@/pages/CampusInforManage/DepartmentManage"], resolve); //科室管理
const ClasstimeManage = resolve =>
  require(["@/pages/CampusInforManage/ClasstimeManage"], resolve); //上课时间管理

//宿舍管理
const LogisticsManageDormitory = resolve =>
  require(["@/pages/LogisticsManage/LogisticsManageDormitory"], resolve); //宿舍管理
const LogisticsManageAttend = resolve =>
  require(["@/pages/LogisticsManage/LogisticsManageAttend"], resolve); //学生宿舍考勤配置
const LogisticsManageRecordS = resolve =>
  require(["@/pages/LogisticsManage/LogisticsManageRecordS"], resolve); //学生考勤记录
const LogisticsManageRecordT = resolve =>
  require(["@/pages/LogisticsManage/LogisticsManageRecordT"], resolve); //教师考勤记录
const LogisticsManageAttendT = resolve =>
  require(["@/pages/LogisticsManage/LogisticsManageAttendT"], resolve); //教师考勤规则

Vue.use(Router);

const vueRouter = new Router({
  routes: [
    {
      path: "/",
      name: "Main",
      component: Main,
      children: setRouter([
        { path: "", redirect: { name: "Home" } },
        { name: "Home", path: "home", component: Home },
        { name: "Test", path: "test", component: Test },
        // 财务管理
        { path: "moneymanager-uselog", component: MoneyManagerUseLog, meta: {menu: true} }, // 消费记录
        { path: "moneymanager-money", component: MoneyManagerMoney, meta: {menu: true} }, // 充值退款
        { path: "moneymanager-chart", component: MoneyManagerChart, meta: {menu: true} }, // 财务表报
        // 监控管理
        { path: "monitor-data", component: MonitorData, meta: {menu: true} }, //监控数据管理

        //试卷管理
        { path: "papers/:type", component: Papers, meta: {menu: true} }, //试卷管理
        { path: "papers-add", component: PapersAdd }, //添加试题
        { path: "papers-add2", component: PapersAdd2 }, //添加试题（语文，英语）
        { path: "papers-create", component: PapersCreate }, //添加试题
        //试题管理
        { path: "questions-system", component: QuestionSystem, meta: {menu: true} },
        { path: "questions-school", component: QuestionSchool, meta: {menu: true, cache: true} },
        { path: "questions-grade", component: QuestionGrade, meta: {menu: true, cache: true} },
        { path: "questions-teacher", component: QuestionTeacher, meta: {menu: true, cache: true} },
        { path: "questions-create/:type", component: QuestionCreate },
        { path: "questions-alter/:type/:id", component: QuestionAlter },
        //资产管理
        { path: "asset-manage", component: AssetManage, meta: {menu: true} },
        // 考试管理
        {
          path: "examine-teacher-workload-query",
          component: ExamineTeacherWorkloadQuery, 
          meta: {menu: true, cache: true}
        },
        {
          path: "examine-query-chart/:subject_id",
          component: ExamineQueryChart
        },
        { path: "examine-read", component: ExamineRead, meta: {menu: true} }, // 全部
        { path: "examine-read-item/:id", component: ExamineRead }, // 单个
        { path: "examine-read-detail/:id/:type", component: ExamineReadDetail },
        { path: "examine-examine-list", component: ExamineExamineList, meta: {menu: true, cache: true} },
        { path: "examine-list-create", component: ExamineListCreate },
        { path: "examine-editorsubject/:id", component: ExamineEditorSubject },
        { path: "examine-readsubject/:id", component: ExamineReadSubject },
        { path: "examine-subject-list/:id", component: ExamineSubjectList },
        {
          path: "examine-subject-create/:project_id/:subject_id",
          component: ExamineSubjectCreate
        },
        { path: "examine-supply/:subject_id", component: ExamineSupply },
        {
          path: "examine-subject-detail/:project_id/:subject_id",
          component: ExamineSubjectDetail
        },
        {
          path: "examine-subject-editor/:project_id/:subject_id",
          component: ExamineSubjectEditor
        },
        {
          path: "examine-subject-read-task/:project_id/:subject_id",
          component: ExamineSubjectReadTask
        },
        {
          path: "examine-read-score-list/:subject_id/:title",
          component: ExamineReadScoreList
        },
        {
          path: "examine-error-list/:subject_id/:title",
          component: ExamineErrorList
        },
        {
          path: "examine-error-chart/:subject_id/:title",
          component: ExamineErrorChart
        },
        {
          path: "examine-teacher-task/:project_id/:subject_id",
          component: ExamineTeacherTask
        },
        {
          path: "examine-sticker/:exam_id",
          component: ExamineSticker
        },
        //教务管理
        { path: "teaching-manage-item", component: TeachingManageItem, meta: {menu: true} },
        { path: "teaching-manage-lists", component: TeachingManageLists, meta: {menu: true} },
        { path: "teaching-manage-tasking", component: TeachingManageTasking, meta: {menu: true} },
        { path: "teaching-manage-progress", component: TeachingManageProgress, meta: {menu: true} },
        {
          path: "teaching-manage-courseware",
          component: TeachingManageCourseware, 
          meta: {menu: true}
        },
        //排课管理
        { path: "course-manage-record", component: CourseManageRecord, meta: {menu: true} },
        { path: "course-manage-record-add", component: CourseManageRecordAdd },
        {
          path: "course-manage-record-detail",
          component: CourseManageRecordDetail
        },
        {
          path: "course-manage-time-record",
          component: CourseManageTimeRecord, 
          meta: {menu: true}
        },

        //课表
        { path: "schedule", component: Schedule, meta: {menu: true} },
        //终端管理
        {
          path: "terminal-manage-consumption",
          component: TerminalManageConsumption, 
          meta: {menu: true}
        },
        {
          path: "terminal-manage-attendance",
          component: TerminalManageAttendance, 
          meta: {menu: true}
        },

        //校园信息管理
        { path: "teaching-staff-manage", component: TeachingStaffManage, meta: {menu: true} },
        { path: "grade-manage", component: GradeManage, meta: {menu: true} },
        { path: "class-manage", component: ClassManage, meta: {menu: true} },
        { path: "student-manage", component: StudentManage, meta: {menu: true} },
        { path: "department-manage", component: DepartmentManage, meta: {menu: true} },
        { path: "classtime-manage", component: ClasstimeManage, meta: {menu: true} },

        //宿舍管理
        {
          path: "logistics-manage-dormitory",
          component: LogisticsManageDormitory,
          meta: {menu: true}
        },
        { path: "logistics-manage-attend", component: LogisticsManageAttend, meta: {menu: true} },
        {
          path: "logistics-manage-record-s",
          component: LogisticsManageRecordS, 
          meta: {menu: true}
        },
        {
          path: "logistics-manage-record-t",
          component: LogisticsManageRecordT, 
          meta: {menu: true}
        },
        {
          path: "logistics-manage-attend-t",
          component: LogisticsManageAttendT, 
          meta: {menu: true}
        },

        { path: "white", component: White }
      ])
    },
    //登录页面
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    //忘记密码
    {
      path: "/forget-password",
      name: "ForgetPassword",
      component: ForgetPassword
    },
    //NotFound
    { path: "*", component: NotFound }
  ]
});

vueRouter.beforeEach((to, from, next) => {
  console.log('vueRouter', from, to)
  
  /*
    11 = 目录(同)
    12 = 目录(异)
    2 = 目录子级

    12 -> 11 缓存11清空12
    2 -> 12 缓存12清空11
    11 -> 2 空
    2 -> 11 缓存11清空12
  */
 const cacheList = store.state.cacheList
 if (cacheList.length > 1) {
  console.log('0')
   // 清除
   store.commit('clearCacheList')
 } else {
  if (from.meta.menu && to.meta.menu) {
    console.log(1)
    store.commit('clearCacheList')    
    setTimeout(() => {
      if (to.meta.cache) {
        store.commit('pushCacheList', to.name)
      }
      next()
    }, 100)
    return
    // store.commit('removeCacheList', from.name)
  } else if (!from.meta.menu && to.meta.menu && cacheList.indexOf(to.name) === -1) {
    console.log(2)
    if (to.meta.cache) {
      store.commit('pushCacheList', to.name)      
    }
    store.commit('removeCacheList', from.name)
  } else if (!from.meta.menu && to.meta.menu && cacheList.indexOf(to.name) !== -1) {
    console.log(3)
    if (to.meta.cache) {
      store.commit('pushCacheList', to.name)      
    }
    store.commit('removeCacheList', from.name)
  }
 }

  // if (to.meta.menu) {
  //   // 清除
  // } else if (from.meta.cache) {
  //   // 添加
  // }
  // if (from.meta.menu) {
  //   store.commit('clearCacheList')
  // store.commit('pushCacheList', to.name)
  // }
  next()
})

export default vueRouter
