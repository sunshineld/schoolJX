<template>
    <div>
        <I-table
        title="教学进度管理"
        :isUpdate="true"
        @update="update">
            <template slot="head">
                <el-select clearable v-model="subjectItem" placeholder="请选择科目" style="width: 150px;"
                @change="handleSelectSubject">
                    <el-option 
                    :label="item.subject_name" 
                    :value="item.subject_id"
                    :key="index"
                    v-for="(item, index) in subjectList"></el-option>
                </el-select>
                <el-select clearable v-model="grade" placeholder="请选择年级" style="width: 150px;"
                @change="handleSelectGrade">
                    <el-option 
                    :label="value.class" 
                    :value="value.id"
                    :key="key"
                    v-for="(value, key) in gradeList"></el-option>
                </el-select>
                <el-input v-model="name" size="smail" placeholder="教师姓名" style="width:150px;"></el-input>
                <el-button size="smail" type="primary" class="confirm"
                @click="search">查询</el-button>
            </template>
            <template slot="content" slot-scope="props">
                <el-table
                border
                style="width: 100%"
                row-class-name="table-row"
                :height="props.maxHeight"
                :data="tableData"
                @sort-change="sortChange">
                    <!-- <el-table-column
                    type="selection"
                    width="55">
                    </el-table-column> -->
                    <el-table-column
                    prop="name"
                    label="教师"></el-table-column>
                    <el-table-column
                    prop="subject_name"
                    label="科目">
                        <!-- <template slot-scope="scope">
                            {{subjectItem ? JSON.parse(subjectItem).subject_name : ''}}
                        </template> -->
                    </el-table-column>
                    <el-table-column
                    prop="class_name"
                    label="班级">
                        <template slot-scope="scope">
                            {{scope.row.grade_name + scope.row.class_name}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="teaching_process"
                    label="进度">
                        <template slot-scope="scope">
                            {{scope.row.teaching_process / 100}}%
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    width="200">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">修改教学进度</el-button>
                    </template>
                    </el-table-column>
                </el-table>
                <!-- 修改 -->
                <I-table-editor v-model="dialogFormVisibleEditor" 
                title="修改教学进度">
                    <template slot="content">
                        <div class="item">
                            <label class="titles">教师：</label>{{editorForm.name}}({{editorForm.phone}})
                        </div>
                        <div class="item">
                            <label class="titles">科目：</label>{{editorForm.subject}}
                        </div>
                        <div class="item">
                            <label class="titles">班级：</label>{{editorForm.grade}}{{editorForm.class}}
                        </div>
                        <div class="item">
                            <label class="titles">进度：</label>
                            <el-input v-model="editorForm.progress" placeholder="请输入进度"></el-input>
                            <span style="font-size:14pt;font-weight:blod;">%</span>
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button @click="handleTaskedClose">取 消</el-button>
                        <el-button class="confirm" type="success"
                        @click="handleTaskedSubmit">确 定</el-button>
                    </template>
                </I-table-editor>

            </template>
            <template slot="foot">
                <I-table-page
                :total="total"
                @change="handlePageChange"></I-table-page>
            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from "@/components/Table/";
export default {
  data() {
    return {
      current: 1,
      total: 0,
      dialogFormVisibleEditor: false,
      deleteDialogVisible: false,
      dialogFormVisibleTasking: false,
      formLabelWidth: "100px",
      addImg: "../static/imgs/addBtn.png",
      // form: {
      //     name: '',
      //     region: '',
      //     date1: '',
      //     date2: '',
      //     delivery: false,
      //     type: [],
      //     resource: '',
      //     desc: ''
      // },
      // 默认
      defaultForm: {
        name: null,
        phone: null,
        grade: null,
        class: null,
        subject: null
      },
      // 分配教学任务
      addForm: {
        name: null,
        phone: null,
        grade: null,
        class: null,
        subject: null
      },
      // 编辑教学进度
      editorForm: {
        name: null,
        phone: null,
        grade: null,
        class: null,
        subject: null,
        progress: null
      },
      tableData: [],
      row: {},
      grade: null,
      gradeList: [],
      // 修改和添加的年级 临时
      gradeListTmp: [],
      subject_id: null,
      subjectItem: null,
      subjectList: [],
      classList: [],
      // 教师名称
      name: null,
      teach: {}
    };
  },
  components: {
    ITable,
    ITablePage,
    ITableEditor
  },
  mounted() {
    this.getSubject();
    this.req();
  },
  methods: {
    req() {
      this.tableData = [];
      this.$nextTick(() => {
        this.$http
          .post("/Teaching/allocationLists", {
            token: this.$tools.getToken(),
            school_id: this.$tools.getSchoolID(),
            grade_id: this.grade,
            subject_id: this.subject_id,
            name: this.name,
            page_number: this.current
          })
          .then(res => {
            this.tableData = res.data.row;
            this.total = parseInt(res.data.page.total);
          });
      });
    },
    update() {
      this.subjectItem = "";
      this.grade = "";
      this.subject_id = "";
      this.name = "";
      this.req();
    },
    getGrade(subjectID, callback) {
      this.$http
        .post(
          "/Teaching/getGradeBySubject",
          {
            token: this.$tools.getToken(),
            school_id: this.$tools.getSchoolID(),
            teaching_subject_id: subjectID
          },
          { showLoading: false, showError: false }
        )
        .then(res => {
          callback(res);
        });
    },
    getSubject() {
      this.$http
        .post("/Teaching/lists", {
          token: this.$tools.getToken(),
          school_id: this.$tools.getSchoolID(),
          page_size: 9999
        })
        .then(res => {
          this.subjectList = res.data.row;
        });
    },
    handleSelectSubject(val) {
      if (!val) {
        this.gradeList = [];
        this.subject_id = null
        return;
      }
      // 重置
      this.grade = null;
      this.gradeList = [];
      this.name = null;

      this.subject_id = val;
      this.getGrade(this.subject_id, res => {
        this.gradeList = res.data;
        // if(this.gradeList.length>0){
        //     this.grade = this.gradeList[0].id;
        // }
        // this.search();
      });
    },
    handleSelectGrade(val) {
      if (!val) {
        return;
      }
      // this.search()
    },
    sortChange({ column, prop, order }) {
      console.log("sortChange", column, prop, order);
    },
    // //删除
    // deletefn (row) {
    //     this.row = row
    //     this.deleteDialogVisible = true
    // },
    // // 删除确认
    // handleDelete() {
    //     this.$http.post('/Teaching/deleteAllocation', {
    //         token: this.$tools.getToken(),
    //         school_id: this.$tools.getSchoolID(),
    //         id_str: this.row.id,
    //     })
    //     .then(res => {
    //         this.deleteDialogVisible = false
    //     })
    // },
    //编辑
    handleClick(row) {
      this.gradeListTmp = [];
      this.row = row;
      this.dialogFormVisibleEditor = true;
      this.handleClassList(this.row.grade_id);
      Object.assign(this.editorForm, {
        id: row.id,
        name: row.name,
        phone: row.modify_time,
        grade: row.grade_name,
        class: row.class_name,
        subject: row.subject_name,
        progress: row.teaching_process / 100
      });
    },
    // 根据年级id获取所有班级
    handleClassList(grade_id) {
      this.$http
        .post("/Teaching/getClassByGradeId", {
          token: this.$tools.getToken(),
          school_id: this.$tools.getSchoolID(),
          grade_id
        })
        .then(res => {
          this.classList = res.data;
        });
    },
    querySearchAsync(qs, callback) {
      if (qs === "" || qs === null) {
        return callback([]);
      }
      this.$http
        .post(
          "/Teaching/getPhoneByTeacherName",
          {
            token: this.$tools.getToken(),
            name: qs
          },
          {
            showLoading: false
          }
        )
        .then(res => {
          callback(
            res.data.map(item => {
              return {
                id: item.id,
                phone: item.phone,
                name: item.name,
                value: item.name
              };
            })
          );
        })
        .catch(res => {
          callback([]);
        });
    },
    handleClassSelect(item) {
      this.teach = item;
      this.$set(this.addForm, "phone", item.phone);
    },
    // 显示新建
    showTaskingBox() {
      // if (!this.subject_id) {
      //     this.$message.error('请选择科目')
      //     return
      // }

      this.dialogFormVisibleTasking = true;
    },
    handleTaskingClose() {
      Object.assign(this.addForm, this.defaultForm);
      this.teach = {};
      this.dialogFormVisibleTasking = false;
    },
    handleTaskingSubmit() {
      this.$http
        .post("/Teaching/saveAllocation", {
          token: this.$tools.getToken(),
          uid: this.$tools.getUserID(),
          school_id: this.$tools.getSchoolID(),
          staff_id: this.teach.id,
          teaching_subject_id: this.subject_id,
          grade_id: this.addForm.grade,
          class_id: this.addForm.class,
          id: ""
        })
        .then(res => {
          this.$message.success(res.info || "添加成功");
          Object.assign(this.addForm, this.defaultForm);
          this.teach = {};
          this.dialogFormVisibleTasking = false;
        });
    },
    handleTaskedClose() {
      Object.assign(this.editorForm, this.defaultForm);
      this.teach = {};
      this.dialogFormVisibleEditor = false;
    },
    handleTaskedSubmit() {
      // this.$http.post('/Teaching/saveAllocation', {
      //     token: this.$tools.getToken(),
      //     uid: this.$tools.getUserID(),
      //     school_id: this.$tools.getSchoolID(),
      //     // staff_id: this.row.id,
      //     staff_id: this.teach.id === void 0 ? this.row.staff_id : this.teach.id,
      //     // teaching_subject_id: this.subject_id,
      //     teaching_subject_id: this.row.teaching_subject_id,
      //     grade_id: this.editorForm.grade,
      //     class_id: this.editorForm.class,
      //     id: this.row.id,
      // })
      // .then(res => {
      //     this.$message.success(res.info || '添加成功')
      //     Object.assign(this.editorForm, this.defaultForm)
      //     this.teach = {}
      //     this.dialogFormVisibleEditor = false
      // })
      // ××××× add by xing.wei 2018.03.14 *********
      let progress = this.editorForm.progress;
      if (String(progress).trim() == "") {
        this.$message.error("请在教学进度一栏输入0-100的数字！");
        return;
      }
      if (isNaN(Number(progress))) {
        this.$message.error("请在教学进度一栏输入0-100的数字！");
        return;
      }
      if (progress < 0 || progress > 100) {
        this.$message.error("请在教学进度一栏输入0-100的数字！");
        return;
      }
      if (progress == this.row.teaching_process / 100) {
        this.$message.error("未做任何修改！");
        return;
      }
      this.$http
        .post("/Teaching/saveProgress", {
          token: this.$tools.getToken(),
          school_id: this.$tools.getSchoolID(),
          id: this.row.id,
          progress: progress * 100
        })
        .then(res => {
          this.$message.success(res.info || "修改教学进度成功");
          this.tableData.forEach(e => {
            if (e.id == this.editorForm.id) {
              e.teaching_process = progress * 100;
              return;
            }
          });
          Object.assign(this.editorForm, this.defaultForm);
          this.teach = {};
          this.dialogFormVisibleEditor = false;
        });
    },
    search() {
      this.tableData = [];
      this.$nextTick(() => {
        this.req();
      });
    },
    // 修改选择科目时的年级
    editorFormSubjectChange(subjectID) {
      this.getGrade(subjectID, res => {
        this.gradeListTmp = res.data;
      });
    },
    handlePageChange(current) {
      this.current = current;
      this.req();
    }
  }
};
</script>
<style scoped lang="less">
.el-button--text {
  padding: 5px;
  background: #409eff;
  color: #fff;
}
.el-button--text:focus,
.el-button--text:hover {
  background: #409eff;
  color: #fff;
}
.item {
  margin-bottom: 20px;
  .el-input,
  .el-select {
    width: 160px;
  }
  .titles {
    width: 70px;
    display: inline-block;
    text-align: right;
  }
}
</style>
