<template>
    <I-table
    title="科目列表"
    :isUpdate="true"
    isBack
    @update="req">
        <template slot="head">
            <el-button type="primary" style="float: right;"
            @click="toCreate">添加科目</el-button>
        </template>
        <template slot="content" slot-scope="props">
            <!-- props.maxHeight 父组件传递给子组件的内容最大高度(可形成滚动条) -->
            <el-table
            border
            row-class-name="table-row"
            :height="props.maxHeight"
            :data="tableData"
            @sort-change="handleSortChange">
                <!-- <el-table-column
                sortable
                prop="name"
                label="项目名称">
                    <template slot-scope="scope">
                        <p style="color: #0100ff;">{{scope.row.name}}</p>
                    </template>
                </el-table-column> -->
                <el-table-column
                prop="subject"
                label="科目名称"></el-table-column>
                <el-table-column
                prop="class"
                label="年级"></el-table-column>
                <el-table-column
                prop="step"
                label="完成步骤"></el-table-column>
                <el-table-column
                prop="status"
                label="状态">
                    <template slot-scope="scope">
                        <p style="color: #41cac0;">{{EXAM_STATUS[String(scope.row.status)]}}</p>
                    </template>
                </el-table-column>
                <el-table-column 
                sortable
                prop="create_time"
                label="操作时间">
                    <template slot-scope="scope">
                        {{$tools.formatDate(scope.row.create_time, 'yyyy/MM/dd hh:mm:ss')}}
                    </template>
                </el-table-column>
                <el-table-column 
                label="操作"
                width="530px">
                    <template slot-scope="scope">
                        <!-- <el-button
                        size="mini"
                        type="primary"
                        @click="showSticker1(scope.row)">贴纸（测试）</el-button> -->

                        <div
                        v-if="parseInt(scope.row.status) === STATUS0">
                            <el-button class="confirm"
                            size="mini"
                            type="primary"
                            @click="showStartBox(scope.row)">启动</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toDetail(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toEditor(scope.row)">修改</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="deleteRow(scope.row)">删除</el-button>
                            <!-- status !== 0 -->
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleShowP(scope.row)">生成答题卡</el-button>
                            <!-- <el-button
                            size="mini"
                            type="primary"
                            :disabled="parseInt(scope.row.qrcode_type) !== 1"
                            @click="handleShowSticker(scope.row)">打印贴纸</el-button> -->
                            <el-button
                            size="mini"
                            type="primary"
                            :disabled="parseInt(scope.row.qrcode_type) !== 1"
                            @click="showSticker1(scope.row)">打印贴纸</el-button>
                        </div>
                        <div
                        v-if="parseInt(scope.row.status) === STATUS1">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toDetail(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="startTeacherTask(scope.row)">分配任务</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            :disabled="parseInt(scope.row.qrcode_type) !== 1"
                            @click="showSticker1(scope.row)">打印贴纸</el-button>
                        </div>
                        <div
                        v-if="parseInt(scope.row.status) === STATUS2">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toDetail(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="handleReadBoxClick(scope.row)">开始阅卷</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toTeacherTask(scope.row)">修改阅览任务</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toReadTask(scope.row)">查看分配任务</el-button>

                        </div>
                        <div
                        v-if="parseInt(scope.row.status) === STATUS3">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toDetail(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toReadTask(scope.row)">查看分配任务</el-button>

                        </div>
                        <div
                        v-if="parseInt(scope.row.status) === STATUS4">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toDetail(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toReadTask(scope.row)">查看分配任务</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toSupply(scope.row)">成绩补录</el-button>

                        </div>
                        <div
                        v-if="parseInt(scope.row.status) === STATUS5">
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toDetail(scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toReadTask(scope.row)">查看分配任务</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toReadScoreList(scope.row)">成绩查看</el-button>
                            <el-button
                            size="mini"
                            type="primary"
                            @click="toErrorList(scope.row)">错题分布</el-button>

                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 开始阅卷 -->
            <I-table-editor v-model="showStartRead" 
            title="开始阅卷"
            :width="tableEditorWidth + 'px'">
                <template slot="content">
                    <el-row>
                        您确认要开始阅卷吗？开始阅卷后将不能修改与分配阅卷老师任务！
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showStartRead = false">取 消</el-button>
                    <el-button type="success"
                    @click="toRead">确 定</el-button>
                </template>
            </I-table-editor>
            <!-- 启动 -->
            <I-table-editor v-model="showStart" 
            title="启动"
            :width="tableEditorWidth + 'px'">
                <template slot="content">
                    <el-row>
                        您确认要启动{{row.class}}的{{row.subject}}科目吗？启动后将不能修改考试项目设置！
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showStart = false">取 消</el-button>
                    <el-button type="success"
                    @click="handleShowStart">确 定</el-button>
                </template>
            </I-table-editor>
            <!-- 删除 -->
            <I-table-editor v-model="showDelete" 
            title="删除"
            :width="tableEditorWidth + 'px'">
                <template slot="content">
                    <el-row>
                        您确定删除{{row.class}}的{{row.subject}}科目吗?
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showDelete = false">取 消</el-button>
                    <el-button type="success"
                    @click="handleDelete">确 定</el-button>
                </template>
            </I-table-editor>
            <!-- 生成答题卡 -->
            <I-table-editor v-model="showP" 
            title="生成答题卡"
            :width="tableEditorWidth + 'px'">
                <template slot="content">
                    <el-row>
                        试卷类型:
                    </el-row>
                    <el-row>
                        <el-select v-model="p.qrcode_type" placeholder="请选择试卷类型">
                            <!-- （普通）生成二维码 -->
                            <el-option label="普通答题卡" 
                            :value="0"></el-option>
                            <!-- （贴纸）粘贴二维码 -->
                            <el-option label="二维码答题卡" 
                            :value="1"></el-option>
                        </el-select>
                    </el-row>
                    <br/>
                    <el-row>
                        <!-- 您确定删除{{row.class}}的{{row.subject}}科目吗? -->
                        试卷样式:
                    </el-row>
                    <el-row>
                        <el-radio-group v-model="p.style" style="width: 100%;display: flex;justify-content: center;margin-top: 10px;">
                            <el-radio 
                            :key="key"
                            :label="key"
                            v-for="(value, key) in PSTYLELIST">{{value}}</el-radio>
                        </el-radio-group>
                    </el-row>
                    <br/>
                    <el-row>
                        准考证号位数(5-10位):
                    </el-row>
                    <el-row style="margin-top: 10px;">
                        <el-input-number v-model="p.number" placeholder="请输入内容"
                        size="mini"
                        :min="5"
                        :max="10"></el-input-number>
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showP = false">取 消</el-button>
                    <el-button type="success"
                    @click="handleP">确 定</el-button>
                </template>
            </I-table-editor>

            <!-- <I-table-editor v-model="showSticker" 
            title="打印贴纸"
            :width="tableEditorWidth + 'px'">
                <template slot="content">
                    <el-row>
                        <div style="width: 180px; margin: 0 auto;">
                            纸张总数:
                        <el-input-number v-model="stickerCount" :controls="false" placeholder="请填写纸张总数" style="width: 100px;"></el-input-number>
                        </div>
                    </el-row>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="showSticker = false">取 消</el-button>
                    <el-button type="success"
                    @click="handleSticker">确 定</el-button>
                </template>
            </I-table-editor> -->

        </template>
        <template slot="foot">
            <I-table-page
            :total="total"
            @change="handlePageChange"></I-table-page>
        </template>
    </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import config from '../../../config'

export default {
    data() {
        return {
            tableData: [],
            search: '',
            current: 1,
            total: 0,
            showStartRead: false,
            showStart: false,
            showDelete: false,
            showP: false,
            // 当前选择的行
            row: {},
            tableEditorWidth: 336,
            EXAM_STATUS: config.EXAM_STATUS,

            // 生成答题卡
            // qrcode_type 1,粘贴二维码，0,生成二维码
            p: {
                style: null,
                number: null,
                qrcode_type: 0,
            },
            // 生成答题卡试卷样式列表
            PSTYLELIST: config.PSTYLELIST,

            // 状态
            STATUS0: 0, // 启动、查看、修改、删除
            STATUS1: 1, // 分配阅卷任务、查看
            STATUS2: 2, // 分配阅卷任务、查看
            STATUS3: 3, // 查看分配任务、查看
            STATUS4: 4, // 查看分配任务、查看、成绩查看、错题补录
            STATUS5: 5, // 完成

            showSticker: false,
            // 	一份答题卡的纸张总数
            stickerCount: null,
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        this.req()
    },
    methods: {
        req() {
            this.$http.post('/Exam/lists', {
                // page: this.current
                token: this.$tools.getToken(),
                project_id: this.$route.params.id,
            })
            .then(res => {
                this.tableData = res.data.row
                this.total = parseInt(res.data.page.total)
            })
        },
        handlePageChange(current) {
            this.current = current
        },
        handleSortChange({ column, prop, order }) {
            console.log('handleSortChange', column, prop, order);
        },
        toCreate () {
            this.$router.push({
                name: 'ExamineSubjectCreate',
                params: {
                    project_id: this.$route.params.id,
                    subject_id: 0,
                }
            })
        },
        toDetail (row) {
            this.row = row
            this.$router.push({
                name: 'ExamineSubjectDetail',
                params: {
                    project_id: this.$route.params.id,
                    subject_id: row.id,
                }
            })
        },
        showStartBox (row) {
            this.row = row
            this.showStart = true
        },
        toEditor (row) {
            this.row = row
            this.$router.push({
                name: 'ExamineSubjectEditor',
                params: {
                    project_id: this.$route.params.id,
                    subject_id: row.id,
                }
            })
        },
        toReadTask (row) {
            this.row = row
            this.$router.push({
                name: 'ExamineSubjectReadTask',
                params: {
                    project_id: this.$route.params.id,
                    subject_id: row.id,
                }
            })
        },
        toSupply (row) {
            this.row = row
            this.$router.push({
                name: 'ExamineSupply',
                params: {
                    subject_id: row.id
                }
            })
        },
        toReadScoreList (row) {
            this.row = row
            this.$router.push({
                name: 'ExamineReadScoreList',
                params: {
                    subject_id: row.id,
                    title: row.subject + row.class
                }
            })
        },
        toErrorList (row) {
            this.row = row
            this.$router.push({
                name: 'ExamineErrorList',
                params: {
                    subject_id: row.id,
                    title: row.subject + row.class
                }
            })
        },
        toTeacherTask (row) {
            this.$message.warning('请确保试卷已扫描结束')
            
            this.row = row
            this.$router.push({
                name: "ExamineTeacherTask",
                params: {
                    project_id: this.$route.params.id,
                    subject_id: row.id
                }
            })
        },
        startTeacherTask (row) {
            this.toTeacherTask(row)
        },
        handleReadBoxClick (row) {
            this.showStartRead = true
            this.row = row
        },
        toRead () {
            this.showStartRead = false
            // this.$router.push({
            //     name: 'ExamineReadItem',
            //     params: {
            //         id: this.row.id
            //     }
            // })
            this.$http.post('/Exam/startMarking', {
                token: this.$tools.getToken(),
                exam_id: this.row.id
            })
            .then(res => {
                this.$message.success(res.info)
                this.req()
            })
        },
        deleteRow (row) {
            this.row = row
            this.showDelete = true
        },
        // 启动
        handleShowStart () {
            this.$http.post('/Exam/starup', {
                token: this.$tools.getToken(),
                exam_id: this.row.id
            })
            .then(res => {
                this.$message.success(res.info)
                this.showStart = false
                this.req()
            })
        },
        // 删除
        handleDelete () {
            this.$http.post('/Exam/delete', {
                token: this.$tools.getToken(),
                exam_id: this.row.id
            })
            .then(res => {
                this.$message.success(res.info)
                this.showDelete = false
                this.req()
            })
        },
        // 生成答题卡
        handleShowP (row) {
            this.showP = true
            this.row = row
            this.p = {
                style: null,
                number: null,
                qrcode_type: 0,
            }
            // this.p.qrcode_type = parseInt(row.qrcode_type)
        },
        // 生成答题卡
        handleP () {
            for (let key of Object.keys(this.p)) {
                if (this.p[key] === void 0 || this.p[key] === null) {
                    this.$message.warning('请选择试卷样式')
                    return
                }
            }

            let url = `/Exam/answerCard?exam_id=${this.row.id}&exam_no_length=${this.p.number}&type=${this.p.style}&qrcode_type=${this.p.qrcode_type}`;

            this.$http.post(url, {
                // exam_id: this.row.id,
                // exam_no_length: this.p.number,
                // type: this.p.style,
                // qrcode_type: config.QRCODE_TYPE0,
                token: this.$tools.getToken(),
            })
            .then(res => {
                this.showP = false
                Object.keys(this.p).forEach(key => {
                    this.p[key] = null
                })
                if (!res.data.url) {
                    this.$message.warning('下载url错误')
                    return
                }
                // this.$tools.exportFile(res.data.url, {},{type: 'get'})
                // 根据返回的url去下载静态资源
                window.open(res.data.url)
                this.req()
            })
        },
        handleShowSticker (row) {
            this.showSticker = true
            this.row = row
        },
        handleSticker () {
            if (!this.stickerCount) {
                this.$message.warning('请填写贴纸总数')
                return
            }

            this.$http.post('/exam/printSticker', {
                exam_id: this.row.id,
                page_count: this.stickerCount,
                token: this.$tools.getToken(),
            })
            .then(res => {
                this.stickerCount = null
                this.showSticker = false
            })
        },
        showSticker1 (row) {
            this.$router.push({
                name: 'ExamineSticker',
                params: {
                    // grade_id: row.grade_id,
                    exam_id: this.$route.params.id,
                },
            });
        },
    }
}
</script>
