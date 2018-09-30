<template>
    <Base-right
    :title="title"
    :isUpdate="false"
    :isBack="true">
        <el-form class="create-subject"
        ref="form"
        :model="data"
        :rules="rules"
        label-width="100px">
            <el-form-item label="项目名称：" prop="subjectName">
                <el-input v-model="data.subjectName" placeholder="请输入项目名称"
                :disabled="comDisabled"></el-input>
            </el-form-item>
            <el-form-item label="项目别名：" prop="subjectAlias">
                <el-input v-model="data.subjectAlias" placeholder="请输入项目别名"
                :disabled="comDisabled"></el-input>
            </el-form-item>
            <el-form-item label="项目组长：" prop="subjectLeader">
                <el-select v-model="data.subjectLeader" placeholder="请输入项目组长" style="width: 100%;"
                :disabled="comDisabled">
                    <el-option
                    :key="index"
                    v-for="(item, index) in staffList"
                    :label="`${item.name}-${item.phone}`"
                    :value="item.id">
                        <span>{{subjectLeaderText(item)}}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年级：" prop="grade_id">
                <el-select v-model="data.grade_id" placeholder="请选择年级" style="width: 100%;"
                @change="handleGrade">
                    <el-option 
                    :key="index"
                    v-for="(item, index) in gradeList"
                    :label="item.class" 
                    :value="parseInt(item.id)"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考试日期：" prop="dateTime">
                <el-date-picker style="width: 100%;" 
                v-if="!(type === 'editor' && data.dateTime === '')"
                :editable="false"
                :disabled="comDisabled"
                :picker-options="dateTimePickerOptions"
                v-model="data.dateTime"
                type="date"
                placeholder="请输入考试日期">
                </el-date-picker>
            </el-form-item>
            <el-row>
                <div class="subject-count">
                    <el-form-item label="参考学生：" prop="count">
                        <el-input v-model="data.count" placeholder="人数" style="width: 80%;"
                        disabled></el-input>
                        <span style="display: inline-block;width: 15%;">人</span>
                    </el-form-item>
                </div>
                <div class="subject-file"
                v-if="!comDisabled">
                    <el-upload
                    name="upload_file"
                    :action="uploadUrl"
                    :on-success="handleUpload"
                    :data="uploadData"
                    :file-list="fileList"
                    :limit="1">
                        <el-button class="confirm" style="float: right;">选择文件</el-button>
                    </el-upload>
                    <div class="temp"><a href="/static/student_info.xlsx">模板下载</a></div>
                </div>
            </el-row>
            <el-row type="flex" class="row-bg" justify="center">
                <el-button class="confirm"
                v-if="comDisabled"
                @click="$router.go(-1)">返回</el-button>
                <el-button class="confirm"
                v-else
                @click="submit">完成</el-button>
            </el-row>
        </el-form>
    </Base-right>
</template>

<script>
const pad = require('pad-middle')
import BaseRight from '@/components/BaseRight/BaseRight'
import config from '@/config'

const CREATE = 'create'
const EDITOR = 'editor'
const READ = 'read'

export default {
    props: {
        type: {
            type: String,
            default: READ,
        },
        title: String,
        model: {
            type: Object,
            default () {
                return {}
            }
        },
    },
    data () {
        var countValidator = (rule, value, callback) => {
            if (this.data.count === null) {
                callback(new Error('请上传文件，以显示正确的人数'));
            } else {
                callback();
            }
        }
        const subjectNameValidator = (rule, value, callback) => {
            if (value.length < 2) {
                callback(new Error('名称长度小于2'))
            } else if (value.length > 50) {
                callback(new Error('名称长度超过50'))
            } else {
                callback()
            }
        }
        const dateTimeValidator = (rule, value, callback) => {
            if (!this.validateDate(value)) {
                callback()
            } else {
                callback(new Error('请输入正确的日期'))
            }
        }
        const subjectLeaderValidator = (rule, value, callback) => {
            if (this.data.subjectLeader === '') {
                callback(new Error('请选择正确的项目组长'))
            } else {
                callback()
            }
        }
        const gradeIdValidator = (rule, value, callback) => {
            if (this.data.grade_id === '') {
                callback(new Error('请选择正确的年级'))
            } else {
                callback()
            }
        }

        return {
            data: {
                subjectName: '',
                subjectAlias: '',
                subjectLeader: '',
                dateTime: '',
                count: null,
                student_uniqid: '',
                grade_id: '',
            },
            staffList: [],
            gradeList: [],
            uploadUrl: config.BASEURL + '/ExamProject/importStudent',
            uploadData: {
                token: this.$tools.getToken()
            },
            fileList: [],
            rules: {
                subjectName: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' },
                    { required: true, validator: subjectNameValidator, trigger: 'blur' },
                ],
                subjectAlias: [
                    { required: true, message: '请输入正确的项目别名', trigger: 'blur' },
                    { required: true, validator: subjectNameValidator, trigger: 'blur' },
                ],
                subjectLeader: [{ required: true, validator: subjectLeaderValidator/*message: '请选择正确的项目组长', trigger: 'blur' */}],
                grade_id: [{ required: true, validator: gradeIdValidator/*message: '请选择正确的年级', trigger: 'blur' */}],
                dateTime: [
                    // { required: true, type: 'date', message: '请选择考试日期', trigger: 'blur' },
                    { required: true, validator: dateTimeValidator, trigger: 'blur' },
                ],
                count: [{required: true, validator: countValidator}],
                // student_uniqid: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
            },
            dateTimePickerOptions: {
                disabledDate: (time) => {
                    return this.validateDate(time)
                }
            },
        }
    },
    computed: {
        comDisabled () {
            return this.type === READ
        }
    },
    watch: {
        model (newVal) {
            if (this.type === 'editor') {
                this.getStaffList(() => {
                    this.getGrade(() =>{
                        this.update(newVal)
                    })
                })
            }
        }
    },
    components: {
        BaseRight,
    },
    created () {
        // if (this.type === CREATE) {

        // } else {
            this.update(this.model)
        // }
    },
    mounted () {
        if (this.type === 'create') {
            this.getStaffList()
            this.getGrade()
        }
    },
    methods: {
        // 输入的时间是否小于当天0时
        validateDate (time) {
            let d = 1000 * 60 * 60 * 24
            let nowTime = new Date(parseInt(Date.now() / d) * d + (new Date()).getTimezoneOffset() * 60 * 1000)
            return new Date(time) < nowTime
        },
        getStaffList (callback=()=>{}) {
            this.$http.post('/Common/staff', {
                token: this.$tools.getToken()
            })
            .then(res => {
                this.staffList = res.data
                callback()
            })
        },
        submit () {
            let data
            if (!this.comDisabled) {
                data = Object.keys(this.data).filter(key => {
                    if (key === 'student_uniqid') {
                        return false
                    } else {
                        return true
                    }
                })
            }
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.$emit('submit', this.data)
                } else {
                    return false;
                }
            })
        },
        handleUpload (response, file) {
            if (response.status === 1) {
                this.$message.success('上传成功')
                this.data.student_uniqid = response.data.student_uniqid
                this.data.count = response.data.number
            } else if (response.status === 101) {
                this.$router.push({
                    name: 'Login'
                })
            } else {
                this.$message.error(response.info || '未知错误')
                this.fileList = []
            }
        },
        update (d) {
            this.data = Object.assign({}, this.data, d)
        },
        subjectLeaderText (item) {
            return `${pad(item.name, 8)}-${item.phone}`
        },
        // 获取年级列表
        getGrade (callback=()=>{}) {
            this.$http.post('/Exam/grade', {
                token: this.$tools.getToken(),
            })
            .then(res => {
                this.gradeList = res.data
                callback()
            })
        },
        handleGrade (val) {
            // this.grade_id = parseInt(val)
            // this.$emit('update:model', Object.assign({}, this.model, {
            //     grade_id: this.grade_id
            // }))
            // this.$nextTick(() => {
            //     this.change()
            // })
        },
    }
}
</script>

<style lang="less">
.subject-count, .subject-file {
    float: left;
}
.subject-count {
    width: 80%;
}
.subject-file {
    width: 20%;
    position: relative;
    .temp {
        position: absolute;
        right: -55px;
        top: 13px;
        a {
            text-decoration: underline;
        }
    }
}
.create-subject {
    width: 500px;
    margin: 0 auto;
    padding: 30px 0;
}
</style>
