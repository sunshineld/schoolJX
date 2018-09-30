<template>
    <I-table
    title="教师工作量"
    @update="update">
        <template slot="head">
            <span style="color: #9e9e9e;font-size: 16px;">
                考试项目
                <el-select v-model="project" clearable placeholder="请选择考试项目"
                @change="handleSelectProject">
                    <el-option
                    v-for="item in projectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <span style="color: #9e9e9e;font-size: 16px;">
                考试科目
                <el-select v-model="subject" clearable placeholder="请选择考试科目">
                    <el-option
                    v-for="item in subjectOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <el-button size="smail" type="primary" class="confirm"
            @click="search">查询</el-button>

            <el-button class="confirm" style="float: right;"
            @click="toQueryChart">
                查看统计图
            </el-button>
        </template>
        <template slot="content" slot-scope="props">
            <el-table
            border
            :data="data"
            :height="props.maxHeight"
            row-class-name="table-row"
            @sort-change="handleSortChange">
                <el-table-column
                sortable
                prop="teacher_name"
                label="教师姓名">
                </el-table-column>
                <!-- <el-table-column
                sortable
                prop="teacher_no"
                label="工号">
                </el-table-column> -->
                <el-table-column
                sortable
                prop="teacher_type"
                label="老师权限">
                </el-table-column>
                <el-table-column
                sortable
                prop="count"
                label="评阅份数">
                </el-table-column>
            </el-table>
        </template>
        <template slot="foot">
            <I-table-page v-model="current"
            :total="total"
            @change="handlepageChange"></I-table-page>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'

export default {
    data () {
        return {
            data: [],
            total: 0,
            current: 1,
            subject: null,
            subjectOptions: [],
            sort: '',
            order: '',
            project: null,
            projectOptions: [],
        }
    },
    components: {
        ITable,
        ITablePage,
    },
    mounted () {
        // const storage = this.getStorage()
        // if (storage) {
        //     this.subject = storage.subject
        //     this.project = storage.project
        //     this.getSubject()
        //     this.req()
        // }
        this.getProject()
    },
    methods: {
        req() {
            if (this.project === null) {
                this.$message.error('请选择考试项目')
                return
            } else if (this.subject === null) {
                this.$message.error('请选择考试科目')
                return
            }
            let obj = {
                exam_id: this.subject,
                token: this.$tools.getToken(),
                page_size: 10,
                page_number: this.current,
            }
            if (this.sort) {
                obj['sort'] = this.sort
            }
            if (this.order) {
                obj['order'] = this.order
            }
            this.$http.post('/Marking/teacherWorkload', obj)
            .then(res => {
                this.data = []

                this.data = res.data.row
                this.total = parseInt(res.data.page.total)
            })
            .catch(err => {
                this.data = []
                this.current = 1
                this.total = 0
            })
        },
        update () {
            this.req()
        },
        getSubject () {
            this.$http.post('/Exam/lists', {
                token: this.$tools.getToken(),
                page_size: 99999,
                project_id: this.project,
            })
            .then(res => {
                this.subjectOptions = res.data.row.map(item => {
                    return {
                        value: parseInt(item.id),
                        label: item.subject,
                    }
                })
            })
        },
        handlepageChange(current) {
            this.current = current
            this.req()
        },
        handleSortChange({ column, prop, order }) {
            // console.log('handleSortChange', column, prop, order);
            this.sort = prop
            this.order = order === 'ascending' ? 'asc' : ''
            this.req()
        },
        search () {
            this.current = 1
            this.req()
        },
        toQueryChart () {
            if (this.subject === null) {
                this.$message.error('请选择考试科目')
                return
            }
            this.setStorage()
            this.$router.push({
                name: 'ExamineQueryChart',
                params: {
                    subject_id: this.subject,
                }
            })
        },
        handleSelectProject () {
            this.subject = null
            this.subjectOptions = []
            this.data = []
            this.total = 0
            this.page_number = 0
            if (!this.project) {
                return
            }
            this.getSubject()
        },
        getProject () {
            this.$http.post('/ExamProject/lists', {
                token: this.$tools.getToken(),
                page_size: 999999,
                is_all: 2,
            })
            .then(res => {
                this.projectOptions = res.data.row.map(item => {
                    return {
                        value: parseInt(item.id),
                        label: item.name,
                    }
                })
            })
        },
        setStorage () {
            sessionStorage.setItem('TeacherWorkloadQuery', JSON.stringify({
                project: this.project, 
                subject: this.subject,
            }))
        },
        getStorage () {
            const data = sessionStorage.getItem('TeacherWorkloadQuery')
            if (!data) {
                return ''
            }
            return JSON.parse(data)
        },
    }
}
</script>
