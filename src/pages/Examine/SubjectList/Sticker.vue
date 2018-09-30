<template>
    <Base-right
    title="打印贴纸"
    :isUpdate="true"
    :isBack="true"
    @update="update">
        <template slot-scope="scope">
            <el-row>
                <el-col 
                :span="10">
                    <el-row type="flex" justify="space-between" style="padding-bottom: 10px;">
                        <el-row type="flex">
                            <el-col :span="14">
                                <el-input style="width: 200px;"
                                v-model="search" 
                                placeholder="请输入姓名或者考号" 
                                size="small"></el-input>
                            </el-col>
                            <el-col :span="8" :offset="2">
                                <!-- <el-select 
                                v-model="searchClass" 
                                clearable
                                size="small"
                                style="width: 100px;"                        
                                placeholder="请选择班级">
                                    <el-option
                                    v-for="item in classOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select> -->
                            </el-col>
                        </el-row>
                        <el-button 
                        size="small"
                        type="primary"
                        @click="req">查询</el-button>
                    </el-row>
                    <!-- <el-row style="padding: 14px 0;">
                        <b>
                            <span style="margin-right: 10px;">待选学生列表：</span>
                            <span>
                                <el-checkbox v-model="isAll"
                                @change="toggleSelection(!isAll ? null : readyTableData)"></el-checkbox>
                                全选/不全选
                            </span>
                        </b>
                    </el-row> -->
                    <el-row type="flex" justify="space-between" align="middle">
                        <b>待选学生列表：</b>                        
                        <el-tooltip class="item" effect="dark" 
                        content="打印参加本学科考试的全部学生" placement="left">
                            <el-button size="small" type="success"
                            @click="handleAll">打印全部参考学生</el-button>
                        </el-tooltip>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-table
                        ref="isAll"                        
                        border
                        row-class-name="table-row"
                        :height="scope.maxHeight - 150"
                        :data="readyTableData"
                        @selection-change="handleSelectionChange1">
                            <el-table-column
                            type="selection"
                            width="35">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="学生姓名"></el-table-column>
                            <el-table-column
                            prop="exam_no"
                            label="学生考号"></el-table-column>
                            <el-table-column
                            prop="grade_name"
                            label="学生年级"></el-table-column>
                            <el-table-column
                            prop="class_name"
                            label="学生班级"></el-table-column>
                        </el-table>
                    </el-row>
                    <br/>
                    <el-row>
                        <I-table-page
                        small
                        :total="total1"
                        :pageSize="pageSize"
                        @change="handlePageChange1"></I-table-page>
                    </el-row>
                </el-col>
                <el-col
                :span="4">
                    <div 
                    :style="'height: ' + (scope.maxHeight) + 'px;padding-top: ' + (scope.maxHeight / 2) + 'px;'">
                        <el-row type="flex" justify="center">
                            <div class="move-action"></div>
                            <el-button size="small" round class="move-action-btn"
                            @click="handleToRightTable">
                                添加勾选到右侧
                            </el-button>
                            <div class="move-action">
                                <i class="el-icon-arrow-right"></i>
                            </div>
                        </el-row>
                        <br/>
                        <el-row type="flex" justify="center">
                            <div class="move-action">
                                <i class="el-icon-arrow-left"></i>
                            </div>
                            <el-button size="small" round class="move-action-btn"
                            @click="handleToLeftTable">
                                添加勾选到左侧
                            </el-button>
                            <div class="move-action"></div>
                        </el-row>
                    </div>
                </el-col>
                <el-col 
                :offset="0"
                :span="10">
                    <el-row type="flex" justify="space-between" align="middle">
                        <div style="padding: 5px 8px;line-height: 100%;">
                            <span style="padding-right: 10px;">请选择单个学生打印张数</span>
                            <span style="color: #6d9def;">
                                <el-select 
                                style="width: 100px;"
                                v-model="page_count" 
                                size="small"
                                placeholder="请选择打印张数">
                                    <el-option
                                    v-for="num in 5"
                                    :key="num"
                                    :label="num"
                                    :value="num">
                                    </el-option>
                                </el-select>
                            </span>
                        </div>
                        <!-- <el-tooltip class="item" effect="dark" 
                        content="打印已选学生列表的全部学生" placement="left">
                            <el-button size="small" prop="money"
                            @click="handleSelected">打印全部参考学生</el-button>
                        </el-tooltip> -->
                    </el-row>
                    <el-row type="flex" justify="space-between" align="middle">
                        <b>已选学生列表：</b>                        
                        <el-tooltip class="item" effect="dark" 
                        content="打印已选学生列表的全部学生" placement="left">
                            <el-button size="small" prop="money"
                            @click="handleSelected">打印已选学生列表</el-button>
                        </el-tooltip>
                    </el-row>
                    <br/>
                    <el-row>
                        <el-table
                        border
                        row-class-name="table-row"
                        :height="scope.maxHeight - 150"
                        :data="selectedTableDataShow"
                        @selection-change="handleSelectionChange2">
                            <el-table-column
                            type="selection"
                            width="35">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="学生姓名"></el-table-column>
                            <el-table-column
                            prop="exam_no"
                            label="学生考号"></el-table-column>
                            <el-table-column
                            prop="grade_name"
                            label="学生年级"></el-table-column>
                            <el-table-column
                            prop="class_name"
                            label="学生班级"></el-table-column>
                        </el-table>
                    </el-row>
                    <br/>
                    <el-row>
                        <I-table-page
                        small
                        :total="total2"
                        :pageSize="pageSize"
                        @change="handlePageChange2"></I-table-page>
                    </el-row>
                </el-col>
            </el-row>

        </template>
    </Base-right>
</template>

<script>
import { ITablePage, ITableEditor } from '@/components/Table/'
import BaseRight from '@/components/BaseRight/BaseRight.vue'
import HTTP from '../../../http.js';

// 归并排序
function sort (list) {
    if (list.length <= 0) {
        return [];
    }
    if (list.length === 1) {
        return list;
    }
    const centerIndex = Math.ceil(list.length / 2);
    let leftList = sort(list.slice(0, centerIndex));
    let rightList = sort(list.slice(centerIndex));
    let l = 0, r = 0, newList = [];

    while (l < leftList.length && r < rightList.length) {
        if (parseInt(leftList[l].id, 10) < parseInt(rightList[r].id, 10)) {
            newList.push(leftList[l]);
            ++l;
        } else {
            newList.push(rightList[r]);
            ++r;
        }
    }
    while (l < leftList.length) {
        newList.push(leftList[l]);
        ++l;
    }
    while (r < rightList.length) {
        newList.push(rightList[r]);
        ++r;
    }
    return newList;
}

export default {
    data() {
        return {
            readyTableData: [],
            readyTableDataIDBackup: [], // 左侧数据备份
            selectedTableData: [], // 右侧全部数据
            selectedTableDataShow: [], // 单页选择数据
            pageSize: 10,
            search: '',
            searchClass: null,
            showOutQuestionBox: false,

            classOptions: [
                {label: '1年级', value: 1},
                {label: '2年级', value: 2},
            ],
            isAll: false,
            page_count: null,

            // left
            current1: 1,
            total1: 0,
            selected1: [], // 左侧被选择值

            // right
            current2: 1,
            total2: 0,
            selected2: [], // 右侧被选择值
        }
    },
    components: {
        BaseRight,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        // this.getClass()
        this.req()
    },
    methods: {
        req() {
            let query;
            let search = this.search.trim();
            if (search) {
                query = 1
            } else {
                query = 2
            }
            this.$http.get('/exam/getSearchStudentsLists', {
                keywords: search,
                token: this.$tools.getToken(),
                // class_id: this.searchClass,
                page_size: this.current,
                page_number: this.pageSize,
                school_id:this.$tools.getSchoolID(),
                project_id: this.$route.params.exam_id,
                query,
                page_size: this.current1,
            }, {
                showError: true,
                showLoading: true,
            })
            .then(res => {
                // 测试
                // res = {
                //     "status":1,
                //     "info":"成功",
                //     "data":{
                //         "row":[
                //             {
                //                 "id": "1",
                //                 "name": "小明1",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "2",
                //                 "name": "小明2",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "3",
                //                 "name": "小明3",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "4",
                //                 "name": "小明4",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "5",
                //                 "name": "小明5",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "6",
                //                 "name": "小明6",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "7",
                //                 "name": "小明7",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "8",
                //                 "name": "小明8",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "9",
                //                 "name": "小明9",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //             {
                //                 "id": "10",
                //                 "name": "小明10",
                //                 "exam_no": "10001",
                //                 "grade_name": "一年纪",
                //                 "class_name": "1班"
                //             },
                //         ],
                //         "page":{
                //             "total":"1",
                //             "page_size":1
                //         }
                //     }
                // }
                // res.data.page.total = res.data.row.length * 2
                // res.data.page['page_size'] = res.data.row.length * 2

                // 需要排序
                this.readyTableData = this.sortTable(res.data.row)
                this.readyTableDataIDBackup = this.readyTableData.map(item => parseInt(item.id))
                this.total1 = parseInt(res.data.page.total, 10)
            })
        },
        // 暂时不用
        // getClass () {
        //     this.$http.get('/exam/getClassLists', {
        //         token: this.$tools.getToken(),
        //         school_id:this.$tools.getSchoolID(),
        //         grade_id: this.$route.params.grade_id,
        //     })
        //     .then(res => {
        //         // this.classOptions = res.data.data
        //     })
        // },
        sortTable (list) {
            return sort(list)
        },
        updateRightPageTotal () {
            this.total2 = this.selectedTableData.length
        },
        updateRightPageShow () {
            const start = this.pageSize * (this.current2 - 1)
            const end = this.pageSize * this.current2

            this.selectedTableDataShow = this.selectedTableData.slice(start, end)
        },
        // center
        handleToRightTable () {
            if (this.selected1.length <= 0) {
                this.$message.error('请选择学生')
                return
            }
            this.readyTableData = this.readyTableData.filter((item) => {
                for (let oldItem of this.selected1) {
                    if (oldItem.id === item.id) {
                        return false
                    }
                }
                return true
            })

            // let newSelected = []
            
            // for (let leftSelected of this.selected1) {
            //     // 未重复
            //     let status = false
            //     for (let rightSelected of this.selectedTableData) {
            //         if (rightSelected.id === leftSelected.id) {
            //             status = true
            //             break
            //         }
            //     }
            //     if (!status) {
            //         newSelected.push(leftSelected)
            //     }
            // }
            let newSelected = this.filterList(this.selectedTableData, this.selected1)

            this.selectedTableData = this.sortTable(this.selectedTableData.concat(newSelected))
            this.updateRightPageShow()
            this.updateRightPageTotal()
        },
        handleToLeftTable () {
            if (this.selected2.length <= 0) {
                this.$message.error('请选择学生')
                return
            }
            this.selectedTableData = this.selectedTableData.filter((item) => {
                for (let oldItem of this.selected2) {
                    if (oldItem.id === item.id) {
                        return false
                    }
                }
                return true
            })

            // 判断左侧是否存在右侧选择值
            let newSelected = this.filterList(this.readyTableData, this.selected2)
            
            this.readyTableData = this.sortTable(this.readyTableData.concat(newSelected))
            this.updateRightPageShow()
            this.updateRightPageTotal()
        },
        validPageCount () {
            if (typeof this.page_count === 'number') {
                return true
            } else {
                return false
            }
        },
        handleSelected () {
            if (this.selectedTableData.length <= 0) {
                this.$message.error('请勾选学生')
                return
            }
            if (!this.validPageCount()) {
                this.$message.error('请选择打印张数')
                return
            }
            
            const stuIDs = this.selectedTableData.map(item => item.id).join(',')
            this.$http.post('/exam/printSelectSticker', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.exam_id,
                page_count: this.page_count,
                stu_id: stuIDs,
            })
            .then(res => {
                this.$message.success('已选打印成功')
                this.page_count = null
            })
        },
        handleAll () {
            if (!this.validPageCount()) {
                this.$message.error('请选择打印张数')
                return
            }
            this.$http.post('/exam/printSticker', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.exam_id,
                page_count: this.page_count,
            })
            .then(res => {
                this.$message.success('全部打印成功')
                this.page_count = null
            })
        },
        filterList (targetList, baseList) {
            let newSelected = []
            
            for (let leftSelected of baseList) {
                // 未重复
                let status = false
                for (let rightSelected of targetList) {
                    if (rightSelected.id === leftSelected.id) {
                        status = true
                        break
                    }
                }
                if (!status) {
                    newSelected.push(leftSelected)
                }
            }
            return newSelected
        },
        // left
        toggleSelection (rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.isAll.toggleRowSelection(row);
                });
                this.isAll = true
            } else {
                this.$refs.isAll.clearSelection();
                this.isAll = false
            }
        },
        handlePageChange1(current) {
            this.current1 = current
            this.req()
        },
        handleSelectionChange1(val) {
            if (this.readyTableData.length === val.length) {
                this.isAll = true
            } else {
                this.isAll = false
            }
            this.selected1 = val
        },
        // right
        handlePageChange2(current) {
            this.current2 = current
            this.updateRightPageShow()
        },
        handleSelectionChange2(val) {
            this.selected2 = val
        },
        update () {
            this.search = ''
            this.req()
        },
    }
}
</script>

<style scoped>
.move-action {
    width: 30px;
    text-align: center;
    line-height: 45px;
    height: 40px;
}
.move-action i {
    font-size: 20px;
}
.move-action-btn {
    background-color: #fff;
    color: #317eeb;
    border: 1px solid #317eeb;
}
.move-action-btn:focus {
    background-color: #317eeb;
    color: #fff;
    border: 1px solid transparent;
}
</style>