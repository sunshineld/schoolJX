<template>
    <Base-right
    title="添加阅卷老师"
    isBack
    @update="update">
        <template slot-scope="scope">
            <el-row style="padding-bottom: 10px;">
                <el-row type="flex" justify="space-between">
                    <div>
                        <b>
                            已选教师：
                            <span style="color: #407bf3;">
                                <span v-text="selectedID.size"></span>人
                            </span>
                        </b>
                        <el-button size="small" type="primary"
                        @click="() => {handleSelectClear(), scopeChecked=false}">清空</el-button>
                    </div>
                    <el-button type="primary" size="small"
                    @click="next">确认选择</el-button>
                </el-row>
                <br/>
                <el-row style="height: 80px;overflow: auto;">
                    <el-row>
                        <el-tooltip placement="bottom-start" effect="light"
                        :key="index"                    
                        v-for="(id, index) in selectedID.getData()">
                            <div 
                            :class="'selected check-box ' + (selectedMap[id].checked ? 'check-box-checked' : '')">
                                <span style="padding-left: 10px;">
                                    {{selectedMap[id].label}}
                                </span>
                                <i class="icon el-icon-close"
                                @click="() =>{handleSelectRemove(id)}"></i>
                            </div>
                            <div slot="content">
                                <div>
                                    <label>性别：</label>
                                    <span v-text="selectedMap[id].sex_text"></span>
                                </div>
                                <div>
                                    <label>学历：</label>
                                    <span v-text="selectedMap[id].education"></span>
                                </div>
                                <div>
                                    <label>电话号码：</label>
                                    <span v-text="selectedMap[id].phone"></span>
                                </div>
                                <div>
                                    <label>所授科目：</label>
                                    <span v-text="selectedMap[id].ts"></span>
                                </div>
                                <div>
                                    <label>工龄：</label>
                                    <span v-text="selectedMap[id].work_year"></span>
                                </div>
                                <div>
                                    <label>教务：</label>
                                    <span v-text="selectedMap[id].work_position"></span>
                                </div>
                            </div>
                        </el-tooltip>
                    </el-row>
                </el-row>
            </el-row>
            <div style="background-color: #f3f3f4; width: 100%;height: 15px; position: absolute;left: 0;right: 0;"></div>
            <el-row 
            :style="'overflow: auto; height: ' + (scope.maxHeight - 100) + 'px;'">
                <el-row style="padding: 40px 0 30px 0;" class="search-tool">
                    <span>
                        <b>
                            教师列表：
                            <span style="color: #407bf3;">
                                <span v-text="selectedID.size"></span>人
                            </span>
                        </b>
                    </span>
                    <span>
                        <el-checkbox v-model="scopeChecked"
                        @change="handleScopeChecked"><b>全选 / 全不选</b></el-checkbox>
                    </span>
                    <span style="padding-left: 20px;">
                        <el-select v-model="searchSubject" clearable placeholder="请选择学科" size="small" style="width: 120px;">
                            <el-option
                            v-for="(item, index) in subjectOptions"
                            :key="index"
                            :label="item.subject_name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </span>
                    <span>
                        <el-input v-model="searchTeacher" placeholder="请输入教师名称" size="small" style="width: 150px;"></el-input>
                    </span>
                    <span>
                        <el-button type="primary" size="small"
                        @click="req">查询</el-button>
                    </span>
                </el-row>
                <el-row :style="'overflow-x: auto;width: 100%;height: ' + (scope.maxHeight - 240) + 'px;'">
                    <el-row class="check-box-group">
                        <el-tooltip class="item" effect="light" placement="bottom-start" 
                        :key="index"                    
                        v-for="(item, index) in list">
                            <el-checkbox v-model="item.checked" 
                            @change="(val) => {handleCheckboxChange(item.staff_id, val, item)}"
                            :class="'check-box ' + (item.checked ? 'check-box-checked' : '')"
                            >{{item.label}}</el-checkbox>
                            <div slot="content">
                                <div>
                                    <label>性别：</label>
                                    <span v-text="item.sex_text"></span>
                                </div>
                                <div>
                                    <label>学历：</label>
                                    <span v-text="item.education"></span>
                                </div>
                                <div>
                                    <label>电话号码：</label>
                                    <span v-text="item.phone"></span>
                                </div>
                                <div>
                                    <label>所授科目：</label>
                                    <span v-text="item.ts"></span>
                                </div>
                                <div>
                                    <label>工龄：</label>
                                    <span v-text="item.work_year"></span>
                                </div>
                                <div>
                                    <label>教务：</label>
                                    <span v-text="item.work_position"></span>
                                </div>
                            </div>
                        </el-tooltip>
                    </el-row>
                </el-row>
            </el-row>
            <el-row style="position: absolute;right: 10px;bottom: 10px;">
                <I-table-page
                small
                :total="total"
                :pageSize="pageSize"
                @change="handlePageChange"></I-table-page>
            </el-row>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import { ITablePage } from '@/components/Table/'

export default {
    data () {
        return {
            scopeChecked: false,
            list: [],
            // 选择store [id]
            selectedID: new (window.ISet)(),
            // {id: info}
            selectedMap: {},
            
            subjectOptions: [],
            searchSubject: '',
            searchTeacher: '',
            total: 0,
            current: 1,
            pageSize: 100,
        }
    },
    components: {
        BaseRight,
        ITablePage,
    },
    mounted () {
        this.req()        
        this.getSubjectList()
    },
    methods: {
        req () {
            let queryStatus = 1
            if (
                (this.searchTeacher === null 
                || this.searchTeacher === '')
                && (this.searchSubject === null
                || this.searchSubject === '')
            ) {
                queryStatus = 2
            }
            this.$http.get('/Common/getConditionStaff', {
                token: this.$tools.getToken(),
                keywords: this.searchTeacher,
                query: queryStatus,
                page_size: this.current,
                page_number: this.pageSize,
                teaching_sub_id: this.searchSubject,
            })
            .then(res => {
                this.list = this.handleSelectInit(res.data.row.map(item => {
                    return Object.assign({}, item, {
                        label: item.name,
                        checked: false,
                        staff_id: parseInt(item.id),
                    })
                }))

                this.total = parseInt(res.data.page.total)
            })
        },
        update () {
            this.selectedID = new (window.ISet)()
            this.selectedMap = {}
            this.searchSubject = null
            this.searchTeacher = null
            this.req()
        },
        getSubjectList () {
            this.$http.get('/teaching/getTeacherSubjectLists')
            .then(res => {
                this.subjectOptions = res.data
            })
        },
        // 归并排序
        // mergeSort (list) {
        //     if (list.length <= 1) {
        //         return list
        //     } else {
        //         var center = parseInt(list.length / 2)
        //         var l = []
        //         var left = this.mergeSort(list.slice(0, center))
        //         var right = this.mergeSort(list.slice(center))
        //         var i = 0
        //         var o = 0
        //         var m = left.length
        //         var n = right.length
        //         while (i < m && o < n) {
        //             var leftItem = left[i]
        //             var rightItem = right[o]
        //             if (leftItem.label <= rightItem.label) {
        //                 l.push(leftItem)
        //                 ++i
        //             } else {
        //                 l.push(rightItem)
        //                 ++o
        //             }
        //         }
        //         while (i < m) {
        //             l.push(left[i++])
        //         }
        //         while (o < n) {
        //             l.push(right[o++])
        //         }
        //         return l
        //     }
        // },
        submit (callback=()=>{}) {
            let staff_id_arr = []
            
            // for (let item of this.list) {
            //     if (item.checked) {
            //         staff_id_arr.push(item.staff_id)
            //     }
            // }
            for (let staff_id of this.selectedID.arr) {
                staff_id_arr.push(staff_id)
            }
            if (staff_id_arr.length === 0) {
                this.$message.error('请选择阅卷老师')
                return
            }
            this.$http.post('/ExamTask/addStaff', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.subject_id,
                staff_id: staff_id_arr.length <= 1 ? staff_id_arr.join('') : staff_id_arr.join(','),
            })
            .then(res => {
                this.$message.success(res.info)
                callback()
            })
        },
        next () {
            this.submit(() => {
                this.$emit('change', true)
            })
        },
        handleScopeChecked (val) {
            if (val) {
                this.handleSelectAddAll()
            } else {
                // this.handleSelectClear()
                // 根据当前list删除指定的选中值
                this.list.forEach(item => {
                    this.handleSelectRemove(item.id)
                })
            }
            this.list.forEach(item => {
                item.checked = val
            })
        },
        handleCheckboxChange (staff_id, val, item) {
            if (val) {
                this.handleSelectAdd(staff_id, item)
            } else {
                this.handleSelectRemove(staff_id)
            }
        },
        // 根据this.selectedID来初始化
        handleSelectInit (list) {
            let arr = [];
            let scopeChecked = true
            
            arr = list.map((item) => {
                if (this.selectedID.has(parseInt(item.staff_id))) {
                    item.checked = true
                } else {
                    if (scopeChecked) {
                        scopeChecked = false
                    }
                }
                return item
            })
            if (!scopeChecked) {
                scopeChecked = false
            }
            this.scopeChecked = scopeChecked
            return arr
        },

        handleSelectAdd (id, item) {
            this.selectedID.add(id)
            this.selectedMap[id] = item
        },
        handleSelectAddAll () {
            for (let item of this.list) {
                this.handleSelectAdd(item.staff_id, item)
            }
        },
        handleSelectRemove (id) {
            id = parseInt(id)

            if (this.selectedID.delete(id)) {
                this.selectedMap[id] = null
                for (let item of this.list) {
                    if (item.staff_id === id) {
                        item.checked = false
                        break
                    }
                }
            }
        },
        handleSelectClear () {
            this.selectedID.clear()
            this.selectedMap = {}
            for (let item of this.list) {
                item.checked = false
            }
        },
        handlePageChange (current) {
            this.current = current
            this.req()
        },
    }
}
</script>

<style scoped lang='less'>
.check-box {
    // color: #818181;
    padding: 5px;
    border-radius: 3px;
    width: 120px;
    margin-left: 10px !important;
    float: left;
    margin-bottom: 10px;
    &-checked {
        background-color: #f0f0f0;
    }
}
.check-box-group {
    width: 1400px;
}
.selected {
    height: 30px;
    line-height: 22px;
    display: flex;
    justify-content: space-between;
    align-items: middle;
}
.selected .icon {
    background-color: #df3d2c;
    width: 15px;
    height: 15px;
    text-align: center;
    line-height: 16px;
    color: #fff;
    cursor: pointer;
}
.search-tool>*{
    padding-right: 10px;
}
</style>
