<template>
    <el-form class="create-paper"
    :model="model"
    label-width="100px"
    :rules="rules"
    ref="form">
        <!-- <el-form-item label="年级：" prop="gradeId">
            <el-select v-model="model.gradeId" placeholder="请选择年级" style="width: 100%;"
            @change="handleGrade">
                <el-option 
                :key="index"
                v-for="(item, index) in gradeList"
                :label="item.class" 
                :value="parseInt(item.id)"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="科目：" prop="subjectId">
            <el-select v-model="model.subjectId" placeholder="请选择科目" style="width: 100%;"
            @change="handleSubject">
                <el-option 
                :key="index"
                v-for="(item, index) in subjectList"
                :label="item.subject"
                :value="parseInt(item.id)"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="试卷名称：" prop="paperId">
            <el-select v-model="model.paperId" placeholder="请选择试卷" style="width: 100%;"
            @change="handlePaper">
                <el-option 
                :key="index"
                v-for="(item, index) in paperList"
                :label="item.title" 
                :value="parseInt(item.id)"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="试卷满分：" prop="maxScore">
            <el-input v-model="model.maxScore" placeholder="选择试卷后可知" disabled></el-input>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        model: Object,
        submitStatus: {
            type: Boolean,
            default: false,
        },
    },
    data () {
        return {
            rules: {
                gradeId: [{ required: true, message: '请选择', trigger: 'blur' },],
                subjectId: [{ required: true, message: '请选择', trigger: 'blur' },],
                paperId: [{ required: true, message: '请选择', trigger: 'blur' },],
                maxScore: [{ required: true, message: '请选择', trigger: 'blur' },],
            },
            // grade_id: null,
            subject_id: null,
            gradeList: [],
            subjectList: [],
            paperList: [],
        }
    },
    watch: {
        submitStatus (val) {
            console.log(222222, this.submitStatus)
            if (val) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.paperCallback((success) => {
                            // this.stepsNext()
                            this.$emit('stepsNext', success)
                        })
                    } else {
                        this.$emit('update:submitStatus', false)
                        return false;
                    }
                })
            }
        }
    },
    computed: {
        // 判断当前是添加或是修改
        isAdd () {
            return parseInt(this.$route.params.subject_id) ? false : true
        }
    },
    mounted () {
        // this.$emit('setContext', this.$refs.form)
        this.getSubject()
        // this.getGrade(() => {
            if (!this.isAdd) {
                let num = 0
                const getDetail = setInterval(() => {
                    ++num
                    this.getPaperDetail()
                    if (num > 2 || this.model.gradeId) {
                        clearInterval(getDetail)
                        return
                    }
                }, 500)
            }
        // })

        // setInterval(() => {
        //     console.log(this.isAdd , JSON.stringify(this.model))
        // }, 1000)
    },
    methods: {
        // 获取科目列表
        getSubject () {
            this.$http.post('/Exam/subject', {
                token: this.$tools.getToken(),
            })
            .then(res => {
                this.subjectList = res.data
            })
        },
        // 获取年级列表
        // getGrade (callback=()=>{}) {
        //     this.$http.post('/Exam/grade', {
        //         token: this.$tools.getToken(),
        //     })
        //     .then(res => {
        //         this.gradeList = res.data
        //         this.$nextTick(() => {
        //             callback()
        //         })
        //     })
        // },
        // 获取试卷列表
        getPaper (callback=()=>{}) {
            // alert('修复中')
            // 清空
            this.paperList = []
            // console.warn(123, JSON.stringify(this.model))
            this.$emit('update:model', Object.assign({}, this.model, {
                paperId: null,
                maxScore: null,
            }))
            // console.warn(345, JSON.stringify(this.model))

            this.$http.post('/Exam/paper', {
                token: this.$tools.getToken(),
                // grade_id: this.grade_id,
                grade_id: this.model.gradeId,
                subject_id: this.subject_id,
            })
            .then(res => {
                this.paperList = res.data
                this.$nextTick(() => {
                    callback()
                })
            })
        },
        // handleGrade (val) {
        //     this.grade_id = parseInt(val)
        //     // this.$emit('update:model', Object.assign({}, this.model, {
        //     //     gradeId: this.grade_id
        //     // }))
        //     // this.$nextTick(() => {
        //         this.change()
        //     // })
        // },
        handleSubject (val) {
            this.subject_id = parseInt(val)
            this.$emit('update:model', Object.assign({}, this.model, {
                subjectId: this.subject_id
            }))
            this.$nextTick(() => {
                this.change()
            })

        },
        handlePaper (val) {
            val = parseInt(val)
            for (let item of this.paperList) {
                let id = parseInt(item.id)
                if (id === val) {
                    this.$emit('update:model', Object.assign({}, this.model, {
                        maxScore: parseInt(item.total_points),
                        paperId: id,
                    }))
                }
            }
        },
        change () {
            if (/*this.grade_id !== null &&*/ this.subject_id !== null) {
                this.getPaper()
            }
        },
        // 在修改状态时
        getPaperDetail () {
            this.$http.post('/Exam/info', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
            })
            .then(res => {
                // let gradeId = parseInt(res.data.grade_id)
                let gradeId = parseInt(this.model.gradeId)
                let paperId = parseInt(res.data.paper_id)
                let subjectId = parseInt(res.data.subject_id)
                // this.$emit('update:model', Object.assign({}, this.model, {
                //     // maxScore: parseInt(item.total_points),
                //     paperId,
                //     subjectId,
                //     gradeId,
                //     // maxScore: null,
                // }))
                // this.handleGrade(gradeId)
                this.$nextTick(() => {
                    this.handleSubject(subjectId)
                    this.$nextTick(() => {
                        this.getPaper(() => {
                            this.handlePaper(paperId)
                        })
                    })
                })
            })
        },
        // 试卷提交 添加和修改
        // subject_id 0 '/Exam/add'
        // subject_id !0 '/Exam/edit'
        paperCallback (callback=()=>{}) {
            let url
            let obj
            if (!this.isAdd) {
                url = '/Exam/edit'
                obj = {
                    id: this.$route.params.subject_id,
                    paper_id: this.model.paperId,
                    token: this.$tools.getToken(),
                }
            } else {
                url = '/Exam/add'
                obj = {
                    project_id: this.$route.params.project_id,
                    paper_id: this.model.paperId,
                    token: this.$tools.getToken(), 
                }
            }
            this.$http.post(url, obj)
            .then(res => {
                this.$message.success(res.info)
                if (this.isAdd) {
                    this.$router.replace({
                        name: 'ExamineSubjectCreate',
                        params: {
                            project_id: this.$route.params.project_id,
                            subject_id: res.data.exam_id,
                        }
                    }, () => {
                        callback(true)
                    })
                } else {
                    callback(true)
                }
            })
            .catch(res => {
                callback(false)
            })
        },
    }
}
</script>

<style lang="less">
// .create-paper {
//     width: 600px;
//     margin: 0 auto;
//     padding: 30px 0;
//     // .el-form-item__label {
//     //     display: flex;
//     //     justify-content: space-between;
//     // }
// }
</style>

