<template>
    <Base-right class="examine-listeditor"
    :title="title"
    :isUpdate="false"
    isBack>
        <template slot-scope="props">
            <div
            :style="`overflow: auto; height: ${props.maxHeight}px`">
                <el-row style="width: 450px; margin: 0 auto; padding: 30px 0;">
                    <el-steps :active="active" align-center>
                        <el-step
                        :key="index"
                        v-for="(item, index) in stepsList"
                        :title="item.title">
                            <template slot="icon">
                                <img 
                                :src="computedStepsIcon(index)">
                            </template>
                        </el-step>
                    </el-steps>
                </el-row>
                <el-row>
                    <!-- <template
                    v-if="active === ACTIVE_CREATESUBJECT">
                        <Create-createsubject class="create-item"
                        :model="createsubjectObj"></Create-createsubject>
                    </template> -->
                    <template
                    v-if="active === ACTIVE_PAPER">
                        <create-paper class="create-item"
                        :model.sync="createPaperObj"
                        :submitStatus="submitStatus"
                        @stepsNext="stepsNext"></create-paper>
                    </template>
                    <template
                    v-if="active === ACTIVE_RULE">
                        <Create-rule class="create-item"
                        :type="ruleActive"
                        :submitStatus="submitStatus"
                        :model1="CreateRule1Obj"
                        :model2="CreateRule2Obj"
                        @stepsNext="stepsNext"></Create-rule>
                    </template>
                    <template
                    v-if="active === ACTIVE_SUBMIT">
                        <Create-submit class="create-item"
                        :model="CreateSubmitObj"></Create-submit>
                    </template>
                </el-row>
                <el-row class="create-action" type="flex" justify="center">
                    <el-button class="confirm"
                    v-if="active >= 1"
                    @click="stepsBack">上一步</el-button>
                    <el-button class="confirm"
                    v-if="active < stepsList.length - 1"
                    @click="stageSubmit">下一步</el-button>
                    <el-button style="width: 89px;"
                    type="primary"
                    v-else
                    @click="submit">完成</el-button>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'

import CreatePaper from './CreatePaper'
import CreateRule from './CreateRule'
import CreateSubmit from './CreateSubmit'

export default {
    props: {
        title: {
            type: String,
            default: '新建考试项目'
        }
    },
    data () {
        return {
            stepsList: [
                {
                    title: '选择试卷',
                    class: 'examine_paper',
                },
                {
                    title: '设置评分规则',
                    class: 'examine_rule',
                },
                {
                    title: '完成配置',
                    class: 'examine_submit',
                },
            ],
            active: 0,
            // 设置评分规则模块
            ruleActive: 0,
            // ACTIVE_CREATESUBJECT: 0,
            ACTIVE_PAPER: 0,
            ACTIVE_RULE: 1,
            ACTIVE_SUBMIT: 2,
            // // 新建考试项目
            // createsubjectObj: {
            //     subjectName: '',
            //     subjectAlias: '',
            //     subjectLeader: '',
            //     dataTime: '',
            //     count: 0
            // },
            // 选择试卷
            createPaperObj: {
                // paperName: '',
                paperId: null,
                // subject: null,
                subjectId: null,
                // grade: null,
                gradeId: null,
                maxScore: null,
            },
            // 设置评分规则1 大题
            CreateRule1Obj: {},
            // 设置评分规则2 小题
            CreateRule2Obj: {},
            // 完成配置
            CreateSubmitObj: {
                data1: [],
                data2: [],
                data3: [],
            },
            // 表单上下文
            paperCTX: null,
            ruleCTX: null,
            // active到表单的映射
            // CTXMap: {
            //     '0': {
            //         CTX: null,
            //         callback: this.paperCallback.bind(this)
            //     },
            //     '1': {
            //         CTX: null,
            //         callback: this.ruleCallback.bind(this)
            //     },
            // },
            // 提交状态
            submitStatus: false,
        }
    },
    computed: {
        // 判断当前是添加或是修改
        isAdd () {
            return parseInt(this.$route.params.subject_id) ? false : true
        }
    },
    watch: {
        // paperCTX (val) {
        //     try {
        //         this.CTXMap[String(this.active)].CTX = val
        //     } catch (err) {}
        // },
        // ruleCTX (val) {
        //     try {
        //         this.CTXMap[String(this.active)].CTX = val
        //     } catch (error) {}
        // }
    },
    components: {
        BaseRight,
        CreatePaper,
        CreateRule,
        CreateSubmit,
    },
    mounted () {
        // if (!this.isAdd) {
        //     this.getPaperDetail()
        // }
        // 考试项目信息
        this.$http.post('/ExamProject/info', {
            token: this.$tools.getToken(),
            id: this.$route.params.project_id,
        })
        .then(res => {
            this.$set(this.createPaperObj, 'gradeId', parseInt(res.data.grade_id))
            // this.createPaperObj.gradeId = parseInt(res.data.grade_id)
        })
    },
    methods: {
        computedStepsIcon (index) {
            let c = `/static/imgs/${this.stepsList[index].class}`
            if (this.active >= index) {
                c = c + '_suc'
            }
            c = c + '.png'
            return c;
        },
        stepsBack () {
            if (!this.active) {
                return
            }
            this.submitStatus = false
            if (this.active === this.ACTIVE_RULE && this.ruleActive > 0) {
                this.ruleActive--
            } else {
                this.ruleActive = 0
                this.active--
            }
        },
        // 下一步
        // 如果失败回退
        stepsNext (success) {
            console.log(1, this.active >= this.stepsList.length - 1)
            if (this.active >= this.stepsList.length - 1) {
                return
            }
            this.submitStatus = false
            if (!success) {
                return
            }
            if (this.active === this.ACTIVE_RULE && this.ruleActive < 1) {
                this.ruleActive++
            } else {
                this.ruleActive = 0
                this.active++
            }
        },
        stageSubmit () {
            if (this.active === this.ACTIVE_PAPER) {
                for (let val of Object.values(this.createPaperObj)) {
                    if (val === null) {
                        this.$message.error('请填写数据')
                        return
                    }
                }
            }
            //  else if (active === ACTIVE_RULE) {

            // } else if (active === ACTIVE_SUBMIT) {

            // } else {
            //     console.warn('active error')
            // }
            console.log(222222, this.submitStatus)
            this.submitStatus = true
        },
        submit () {
            // this.$router.go(-1)
            this.$router.replace('/examine-subject-list/' + this.$route.params.project_id)
        },
    }
}
</script>

<style lang="less">
.examine-listeditor {
    .examine_create {
        background: url('/static/imgs/examine_create.png') no-repeat;
    }
    .create-action button{
        margin: 40px 20px 60px 20px;
    }
    .create-item {
        width: 450px;
        margin: 0 auto;
        padding: 30px 0;
    }
}
</style>

