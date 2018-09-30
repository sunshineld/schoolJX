<template>
    <Base-right class="supply"
    title="成绩补录"
    :isUpdate="false"
    isBack>
        <template slot-scope="props">
            <div
            :style="`position: relative;padding-left: 180px;overflow: auto; height: ${props.maxHeight}px;`">
                <div style="position: absolute;left: 90px;line-height: 38px;">请选择学生：</div>
                <el-select v-model="userinfo" placeholder="请选取学生" class="select-userinfo"
                @change="handleUserInfo">
                    <el-option
                    v-for="(item, index) in userinfoOptions"
                    :key="index"
                    :label="`${item.name}   ${item.grade}${item.class}   ${item.exam_no}号`"
                    :value="item.students_id">
                        <el-col
                        :span="8">{{item.name}}</el-col>
                        <el-col
                        :span="8">{{item.grade + item.class}}</el-col>
                        <el-col
                        :span="8">{{item.exam_no}}号</el-col>
                    </el-option>
                </el-select>

                <div class="score-detail-group">
                    <div class="score-detail">
                        <el-row class="score-detail-title">分数详情</el-row>
                        <el-row>
                            <el-form ref="form"
                            label-width="75px"
                            v-if="Object.keys(formData).length > 0"
                            :model="formData"
                            :rules="rules">
                                <el-form-item 
                                :prop="item.prop"
                                :label="item.label"
                                :key="index"
                                v-for="(item, index) in options">
                                    <template slot-scope="scope">
                                        <img class="score-detail-icon" src="/static/imgs/paper.png" 
                                        v-if="!showGroup">
                                        <img class="score-detail-icon" src="/static/imgs/paper.png" style="cursor: pointer;"
                                        @click="clickInput(item.detail)"
                                        v-else>
                                        <el-input-number v-model="formData[item.prop]" placeholder="请输入分数" style="width: 100%;"
                                        :disabled="!showGroup"
                                        :min="0"></el-input-number>
                                    </template>
                                </el-form-item>
                                <!-- <el-form-item label="第2题">
                                    <img class="score-detail-icon" src="/static/imgs/paper.png">
                                    <div class="score-detail-input">{{data.score1 ? data.score1 : '请输入分数'}}</div>
                                </el-form-item>
                                <el-form-item label="第3题">
                                    <img class="score-detail-icon" src="/static/imgs/paper.png">
                                    <div class="score-detail-input">{{data.score1 ? data.score1 : '请输入分数'}}</div>
                                </el-form-item>
                                <el-form-item label="第4题">
                                    <img class="score-detail-icon" src="/static/imgs/paper.png">
                                    <div class="score-detail-input">{{data.score1 ? data.score1 : '请输入分数'}}</div>
                                </el-form-item> -->
                            </el-form>
                        </el-row>
                    </div>
                    <el-row type="flex" class="row-bg" justify="center" style="padding: 20px 0 30px 0;">
                        <el-button type="primary" class="confirm"
                        @click="showSave = true">保存</el-button>
                        <el-button type="primary" style="margin-left: 20px;"
                        @click="formDataToZero">全打0分</el-button>
                    </el-row>
                </div>
            </div>

            <I-table-editor v-model="showBox" 
            :title="`第${row.number}题答案`"
            width="498px">
                <template slot="content">
                    <el-row class="supply-box-item">
                        <el-col class="supply-box-item-label"
                        :span="4">
                            <span>分</span>
                            <span>数：</span>
                        </el-col>
                        <el-col
                        :span="20">
                            <el-input v-model="row.point" disabled></el-input>
                            <!-- <div class="el-textarea__inner">{{row.point}}</div> -->
                        </el-col>
                    </el-row>
                    <el-row class="supply-box-item">
                        <el-col class="supply-box-item-label"
                        :span="4">
                            <span>答</span>
                            <span>案：</span>
                        </el-col>
                        <el-col
                        :span="20">
                            <el-input v-model="row.answer" placeholder="请输入内容" disabled
                            :rows="8"
                            type="textarea"></el-input>
                            <!-- <div class="el-textarea__inner" style="min-height: 100px;"
                            v-html="row.answer"></div> -->
                        </el-col>
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button type="success"
                    @click="showBox = false">确 定</el-button>
                </template>
            </I-table-editor>

            <!-- 保存 -->
            <I-table-editor v-model="showSave" 
            title="保存"
            width="300px">
                <template slot="content">
                    <el-row>
                        是否确认保存?
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showSave = false">取 消</el-button>
                    <el-button type="success"
                    @click="submit">确 定</el-button>
                </template>
            </I-table-editor>

        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import { ITableEditor,} from '@/components/Table/'

export default {
    data () {
        return {
            userinfo: null,
            userinfoOptions: [],
            formData: {},
            data: [], // 试卷信息
            options: [], // table col
            showBox: false,
            row: {}, // data 行数据
            tableColVar: 'col',
            showGroup: false,
            rules: {},
            showSave: false,
        }
    },
    components: {
        BaseRight,
        ITableEditor,
    },
    mounted () {
        this.req()
        this.getPaper()
    },
    methods: {
        // 获取未识别的学生
        req () {
            this.$http.post('/ExamMakeup/unidenStudent', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                this.userinfoOptions = res.data
    //             this.userinfoOptions = [{
 	// 	"students_id": "1",//考试学生id
 	// 	"exam_no": "1001",//考号
 	// 	"name": "谢一",//姓名
 	// 	"class": "1",//班级序号
 	// 	"grade": "初一"//年级
 	// }, {
 	// 	"students_id": "2",
 	// 	"exam_no": "1002",
 	// 	"name": "谢二",
 	// 	"class": "1",
 	// 	"grade": "初一"
 	// }, {
 	// 	"students_id": "3",
 	// 	"exam_no": "1003",
 	// 	"name": "谢三",
 	// 	"class": "1",
 	// 	"grade": "初一"
    //  }];
     
                if (res.data.length === 0) {
                    this.$message.success('已经没有需要补录的学生了')
                    this.$router.go(-1)
                }

                this.userinfo = this.userinfoOptions[0]['students_id']
                this.handleUserInfo()
            })
        },
        // 获取试卷信息
        getPaper () {
            this.$http.post('/ExamMakeup/paper', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id
            })
            .then(res => {
                this.data = res.data
                this.setData()                
            })
        },
        clickInput (detail) {
            let t = document.createElement('div')
            t.innerHTML = detail.answer
            this.row = Object.assign({}, detail, {
                answer: t.innerText
            })
            this.showBox = true
        },
        // 根据试卷消息生成form
        setData () {
            this.formData = {}
            this.rules = {}
            this.data.forEach((item, index) => {
                let prop = this.tableColVar + item.number
                this.formData[prop] = 0
                this.options.push({
                    prop,
                    label: `第${item.number}题`,
                    detail: item,
                })
                // 设置验证规则
                this.rules[prop] = [
                    { 
                        type: 'number', 
                        min: 0, 
                        max: parseInt(item.point), 
                        message: `该题最大分数为${item.point}分`, 
                        trigger: 'change' 
                    }
                ]
            })
        },
        submit () {
            if (this.userinfo === null) {
                this.$message.error('请选择学生')
                return
            }
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.showSave = false
                    let numberObj = {}
                    for (let key of Object.keys(this.formData)) {
                        let s = this.formData[key]
                        numberObj[key.replace('col', '')] = s
                    }
                    this.$http.post('/ExamMakeup/makeup', {
                        token: this.$tools.getToken(),
                        exam_id: this.$route.params.subject_id,
                        students_id: this.userinfo,
                        number_point: JSON.stringify(numberObj)
                    })
                    .then(res => {
                        this.$message.success(res.info)
                        this.userinfo = null
                        this.$nextTick(() => {
                            this.req()
                            this.formDataToZero()
                        })
                    })
                } else {
                    this.$message.error('请填写正确的值')
                }
            });
        },
        // 设置到零分
        formDataToZero () {
            let formDataKeys = Object.keys(this.formData)
            this.formData = {}
            this.$nextTick(() => {
                let obj = {}
                for (let key of formDataKeys) {
                    obj[key] = 0
                }
                this.formData = obj
            })
        },
        handleUserInfo () {
            this.showGroup = true
            this.formDataToZero()
        },
        // handleInputChange (index, point) {
        //     this.$nextTick(() => {
        //         let value = this.formData[index]
        //         if (value >= point) {
        //             this.$message.warning(`该题最大分数为${point}分`)
        //         }
        //         // console.log(123, value, point)
        //     })
        // },
    }
}
</script>

<style lang="less" scoped>
.score-detail {
    padding: 25px;
    border: 1px solid #e2e2e4;
    &-title {
        padding-bottom: 20px;
        font-size: 16px;
        color: #8c8c8c;
    }
    &-icon {
        position: absolute;
        left: -70px;
        top: 11px;
    }
    &-input {
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 1;
        outline: 0;
        padding: 0 15px;
        width: 100%;
        vertical-align: middle;
        line-height: 39px;
        color: #ccc;
    }
}
.select-userinfo {
    margin-bottom: 20px;
    border: 1px solid #fff;
}
.select-userinfo, .score-detail-group {
    width: 440px;
}
.supply {
    &-box-item {
        padding-bottom: 20px;
        &-label {
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>

