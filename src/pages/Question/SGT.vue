<template>
    <div class="SGT">
        <I-table
        :title="title"
        @update="update"
        class="questionstable">
            <template slot="head">
                <div class="rightBtn">
                    <el-button size="medium" type="primary" @click="addFn">添加试题</el-button>
                    <el-button size="medium" type="success" class="addbtn" 
                     v-if="oldPosition !== void 0"
                    @click="showExport">导出试题</el-button>
                </div>
                <Question-query
                :pageNumber="page_number"
                @change="handleQuestionQueryChange"></Question-query>
            </template>
            <template slot="content" slot-scope="props">
                <div class="contentCover">
                    <div class="noData" v-if="tableData.length == 0">暂无数据</div>
                    <div class="itmes" v-for="(item,index) in tableData" :key="index">

                        <el-checkbox class="itmesChose" 
                        v-if="index === 0"
                        v-model="selectAllData"
                        @change="(changeVal) => {selectFn(changeVal, item, true)}"></el-checkbox>
                        <el-checkbox class="itmesChose" 
                        v-else
                        v-model="selectData[item.id]"
                        @change="(changeVal) => {selectFn(changeVal, item)}"></el-checkbox>

                        <!-- <span class="itmesId">{{item.id}}</span> -->
                        <div class="itmesContent">
                            <div v-html="computedImageHTML(item.content)"></div>
                            <div v-if="item.id != ''" class="itemsbtns">
                                <el-button size="small " type="primary" @click="showAnser(item)">查看答案</el-button>
                                <el-button size="small" style="padding:10px 16px;" type="primary" class="btns" @click="editFn(item)">编辑</el-button>
                                <el-button size="small " type="danger" @click="deteleShow(item.id)">删除</el-button>
                            </div>
                            <div v-if="item.isShow">
                                <div v-if="item.id != ''" class="itemsTittle">参考答案：</div>
                                <div class="result"  v-html="computedImageHTML(item.answer)"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 学校导出试题 -->
                <I-table-editor v-model="showOutQuestionBox1" 
                title="导出试题">
                    <template slot="content">
                        <el-row>选择导出位置：</el-row>
                        <el-row class="exportOptions">
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="2">年级题库</el-radio>
                            </el-radio-group>
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="3">教师题库</el-radio>
                            </el-radio-group>
                        </el-row>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showOutQuestionBox1 = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="handleOutQuestion">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 年级试题 -->
                <I-table-editor v-model="showOutQuestionBox2" 
                title="导出试题">
                    <template slot="content">
                        <el-row>选择导出位置：</el-row>
                        <el-row class="exportOptions">
                            <el-radio-group v-model="position" class="outportaddr-group">
                                <el-radio label="3">教师题库</el-radio>
                            </el-radio-group>
                        </el-row>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showOutQuestionBox2 = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="handleOutQuestion">确 定</el-button>
                    </template>
                </I-table-editor>
                <!-- 纠正 -->
                <I-table-editor v-model="showErrorEditorBox" 
                title="删除">
                    <template slot="content">
                        <div class="outportaddr-group">
                           是否确定删除该试题？
                        </div>
                    </template>
                    <template slot="foot">
                        <el-button 
                        @click="showErrorEditorBox = false">取 消</el-button>
                        <el-button type="success" class="confirm"
                        @click="deleteFn()">确 定</el-button>
                    </template>
                </I-table-editor>
                    
            </template>
            <template slot="foot">
                <I-table-page v-model="page_number"
                :total="total_page"
                @change="pageChange"></I-table-page>
            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import QuestionQuery from './QuestionQuery'
import config from '@/config'
import {validListReq} from './common.js';

export default {
    props: {
        title: String,
        // 导出之前的题库 1默认，2学校，3年级
        oldPosition: Number,
        // 当前题库 1、学校题库2、年级题库3、教师题库，4默认题库
        positionType: Number,
    },
    data() {
        return {
            //弹框
            showOutQuestionBox1: false,
            showOutQuestionBox2: false,
            showErrorEditorBox:false,
            showErrorEditorBoxTitle: '',
            //删除
            deleteId:'',
            //导出
            // 全选按钮
            selectAllData: false,
            // 单选
            selectData: {},
            // 导出到的题库
            position: '',

            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            ids:[],//删除
            //搜索参数
            number:"",
            page_number:1,
            page_size:10,
            total_page:0,

            //获取的数据
            tableData: [],

            structure_type: null,
            versions_id: null,
            grade_id: null,
            subject_id: null,
            chapter_id: null,
            type_id: null,
            node_id: null,
            difficult_id: null,

            level_1_id: null,
            level_2_id: null,
            level_3_id: null,

            // 在一个req中该值都是一样的, 在选择导出项时操作
            clid: 0,
        };
    },
    computed: {
        selectAllDataComputed () {
            if (this.tableData.length <= 1) {
                return false
            }
            for (let i = 1, max = this.tableData.length; i < max; ++i) {
                let item = this.tableData[i]

                if (this.selectData[item.id] === void 0 || this.selectData[item.id] === false) {
                    return false
                }
            }
            return true
        }
    },
    activated () {
        this.req(void 0, () => {}, {
            showError: false
        }) 
    },
    methods: {
        getReqOptions () {
            var obj = {
                uid:localStorage.jxid,
                school_id:localStorage.jxschool_id,
                token:localStorage.jxtoken,
                question_type:this.positionType,
                structure_type: this.structure_type,
                page_number:this.page_number,
                page_size: 10,
                vid:this.versions_id,
                classes:this.grade_id,
                subject:this.subject_id,
                unitid:this.node_id,
                q_type:this.type_id,
                easy_type:this.difficult_id,
                is_type: this.is_type,
            };
            if (this.structure_type === 1) {
                Object.assign(obj, {
                    chid:this.chapter_id,
                });
            } else if (this.structure_type === 2) {
                Object.assign(obj, {
                    level_1_id: this.level_1_id,
                    level_2_id: this.level_2_id,
                    level_3_id: this.level_3_id,
                });
            } else {
                console.error('错误结构id');
            }
            return obj;
        },
        //一进来就请求
        req(pageNumber=void 0, callback=() => {}, options={}) {
            let params
            if (pageNumber === void 0) {
                params = this.getReqOptions()
            } else {
                params = Object.assign({}, this.getReqOptions(), {page_number: pageNumber})
            }
            this.$http.post("/Question/lists", params, options)
            .then(res => {
                callback()
                this.selectAllData = false                
                this.tableData = []
                this.$nextTick(() => {
                    this.initRes(res.data)                  
                    this.selectAllData = this.selectAllDataComputed                    
                })             
            })            
        },
        // 初始化返回数据
        initRes (data) {
            this.total_page = parseInt(data.page.total)
            this.tableData = data.rows.map(item => {
                return Object.assign({}, item, {
                    // content: this.$tools.transformHTML(item.content),
                    content: item.content,
                    answer: this.$tools.transformHTML(item.answer),
                })
            })
            //添加全选
            this.tableData.unshift({
                id: "",
                content: '全选',
                result: '',
                isShow:false,
                checked:false
            })
            //添加属性
            for(let i=0;i<this.tableData.length;i++) {
                this.tableData[i].isShow = false;
            }

            //选哪个 哪个变色
            // this.$nextTick(function(){
            //     for(let i=0;i<document.querySelectorAll('.difficultLi').length;i++) {
            //         document.querySelectorAll('.difficultLi')[i].className = 'difficultLi';
            //     }
            //     document.querySelectorAll('.difficultLi')[this.easy_type-1].className = 'difficultLi on'
            // });
        },
        //显示答案
        showAnser(item) {
            item.isShow = !item.isShow;
            let temp = this.tableData
            this.tableData = []
            this.tableData = temp
            
        },

        pageChange(current) {
            this.page_number = current
            this.req()
        },
        changeFun(val) {
            this.multipleSelection = val;
            // console.log(this.multipleSelection)
        },
        //新增
        addbtn() {
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
        },
        //选择导出项
        selectFn(changeVal, item, isAll=false) {
            const id = parseInt(item.id)
            const clid = parseInt(item.clid)

            if (changeVal) {
                this.editorClid('alter', clid)
            } else {
                this.editorClid('clear')
            }
            if (!isAll) {
                this.selectAllData = this.selectAllDataComputed
            } else {
                for(let i=1;i<this.tableData.length;i++) {
                    let aId = parseInt(this.tableData[i].id)
                    // this.selectData[aId] = changeVal
                    this.$set(this.selectData, aId, changeVal)
                }
            }
        },
        //导出
        showExport() {
            if(this.positionType == 1) {
                this.showOutQuestionBox1 = true
                // this.position = '2'
            }else if(this.positionType == 2) {
                this.showOutQuestionBox2 = true
                // this.position = '3'
            }
        },
        questionExport () {
            let t = []
            for (let key of Object.keys(this.selectData)) {
                let value = this.selectData[key]
                if (value === true) {
                    t.push(parseInt(key))
                }
            } 
            return t
        },
        //清空导出项
        closeSelectStore () {
            this.selectData = {};
            this.req();
        },
        //确定导出
        handleOutQuestion() {
            // this.selectData = []
            // for(let i=1;i<this.tableData.length;i++) {
            //     if(this.tableData[i].checked) {
            //         this.selectData.push(this.tableData[i].id)
            //     }
            // }
            let t = this.questionExport()
            let reqData;
            // console.log(this.selectData.join(','))
            if(t.length == 0) {
                this.$message.error("您未选择任何试题")
                this.showOutQuestionBox1 = false
                this.showOutQuestionBox2 = false
                return;
            }
            if (this.position === '') {
                this.$message.error('请选择导出项')
                return
            }
            reqData = {
                token:localStorage.jxtoken,
                uid:localStorage.jxid,
                school_id:localStorage.jxschool_id,
                position:this.position,
                old_position:this.oldPosition,
                qids:t.join(','),
                structure_type: this.structure_type,
                clid: this.clid,
                subject: this.subject_id,
            };
            // 只有在按章节时添加年级
            if (this.structure_type === 1) {
                reqData['grade_id'] = this.grade_id
            }
            this.$http.post('/Question/export',reqData)
            .then(res => {
                this.closeSelectStore();                
                this.$message.success(res.info);
                this.showOutQuestionBox1 = false
                this.showOutQuestionBox2 = false
            })
            .catch(res=>{
                this.$message.error(res.info);
                this.showOutQuestionBox1 = false
                this.showOutQuestionBox2 = false
            })
        },
        //显示错误弹框
        deteleShow(val) {
            this.deleteId = val
            this.showErrorEditorBox = true
        },
        //确认提交错误
        deleteFn() {
            this.$http.post('/Question/delete',{
                token: this.$tools.getToken(),
                qid:this.deleteId,
                uid: this.$tools.getUID()
            })
            .then(res => {
                this.$message.success(res.info);
                this.showErrorEditorBox = false
                this.req()
            })
            .catch(res=>{
                this.$message.error(res.info);
                this.showErrorEditorBox = false
            })
        },
        //添加试题 
        addFn() {
            this.$router.push({ name: 'QuestionsCreate', params: { type: this.positionType }});
        },
        //编辑试题
        editFn(val) {
            localStorage.jxquestion = JSON.stringify(val)
            this.$router.push({ 
                name: 'QuestionsAlter',
                params: { 
                    type: this.positionType,
                    id: val.id,
                }
            });
        },

        // 查询项变化
        handleQuestionQueryChange (obj) {
            // console.log(123, obj);
            // alert(JSON.stringify(obj))
        // 1 按章节 2 按知识点
            if (obj.structure_type === 1) {
                this.chapter_id = obj.chapter_id
            } else if (obj.structure_type === 2) {
                this.level_1_id = obj.level_1_id
                this.level_2_id = obj.level_2_id
                this.level_3_id = obj.level_3_id
            } else {
                console.error('错误的structure_type值')
                return
            }
            this.structure_type = parseInt(obj.structure_type)
            this.versions_id = obj.versions_id
            this.node_id = obj.node_id
            this.grade_id = obj.grade_id
            this.subject_id = obj.subject_id
            this.type_id = obj.type_id
            this.difficult_id = obj.difficult_id
            this.is_type = obj.is_type
            
            // this.page_number = obj.pageNumber
            this.total_page = 0
            this.tableData = []
            if (validListReq(this.getReqOptions())) {
                this.req(obj.pageNumber, () => {
                    this.page_number = obj.pageNumber
                })
            }
        },
        computedImageHTML (HTML) {
            return this.$tools.completeImageHTML(HTML)
        },
        clearQuestionExport () {
            this.selectData = {}
        },
        update () {
            this.clearQuestionExport()
            this.req()
        },
        editorClid (type, clid) {
            if (type === 'alter') {
                this.clid = clid
            } else if (type === 'clear') {
                this.clid = 0
            } else {
                console.warn('type is error')
            }
        },
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
        QuestionQuery,
    }
}
</script>
<style lang="less">
@import url('./SGT.less');
</style>
