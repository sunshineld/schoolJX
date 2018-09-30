<template>
  <div class="choose">
    <div class="choose_sub_type">
        <el-row>
            <el-col :span="4">
                <span class="choose_title">结构：</span>
            </el-col>
            <el-col :span="18">
                <ul class="choose_ul_type">
                    <li
                    :key="index"
                    v-for="(item, index) in typeList"
                    :class="{'on': typeIndex === index}"
                    @click="handleSelectType(index)">{{item.name}}</li>
                </ul>
            </el-col>
            <el-col :span="2">

            </el-col>
        </el-row>
    </div>

    <div class="choose_sub"
    :key="index"
    v-for="(item, index) in list">
        <el-row>
            <el-col :span="4">
                <span class="choose_title">{{item.label}}：</span>
            </el-col>
            <el-col :span="18">
                <ul class="choose_ul"
                :style="{'height': item.showMore ? 'auto' : '30px'}">
                    <li
                    :key="index2"
                    :class="{'on': (item.required || item.isUse) ? item.child_index === index2 : false}"
                    @click="handleSelectItem(index, index2)"
                    v-for="(item2, index2) in item.list">{{item2.name}}</li>
                </ul>
            </el-col>
            <el-col :span="2">
                <div
                v-if="item.isMore"
                @click="handleMoreList(index)">
                    <span style="cursor: pointer;">
                        <i class="el-icon-arrow-down"
                        v-if="!item.showMore"></i>
                        <i class="el-icon-arrow-up"
                        v-else></i>
                    </span>
                </div>
            </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        pageNumber: Number
    },
    data () {
        return {
            // loading: false,
            typeIndex: 0,
            typeList: [
                {name: '按章节', id: 1},
                {name: '按知识点', id: 2},
            ],
            currentListIndex: 0,
            // 当前列表
            list: null,
            // 请求是否完成
            done: false,
            questionsQueryListIcon: false,
            questionsQueryList: null,
            questionsQueryPageNumber: 1,
            // 按章节
            list1: [
                {
                    name: 'vid',
                    label: '版本',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getVid,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'classes',
                    label: '年级',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getClasses,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'subject',
                    label: '科目',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getSubject,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'chid',
                    label: '章',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getChid,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'unitid',
                    label: '节',
                    required: false,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getUnitid,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'is_type',
                    label: '题类',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getIsType,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'q_type',
                    label: '题型',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getQType,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'easy_type',
                    label: '难度',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getEasyType,
                    child_index: 0,
                    list: []
                },
            ],
            // 按知识点
            list2: [
                {
                    name: 'pharse',
                    label: '学阶',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getPharse,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'subject',
                    label: '科目',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getSubject2,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'level1',
                    label: '知识点1',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getKnowledge1,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'level2',
                    label: '知识点2',
                    required: false,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getKnowledge2,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'level3',
                    label: '知识点3',
                    required: false,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getKnowledge3,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'is_type',
                    label: '题类',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getIsType,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'q_type',
                    label: '题型',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getQType2,
                    child_index: 0,
                    list: []
                },
                {
                    name: 'easy_type',
                    label: '难度',
                    required: true,
                    isUse: false,
                    isMore: false,
                    showMore: true,
                    func: this.getEasyType2,
                    child_index: 0,
                    list: []
                },
            ],
        }
    },
    // watch: {
    //     pageNumber (newVal) {
    //         // this.setStoreList()
    //     }
    // },
    mounted () {
        this.list = this.list1

        let typeIndex = 0
        this.handleSelectType(typeIndex)
    },
    methods: {
        
        // 获取store里的数据
        getQuestionsQuery () {
            if (this.questionsQueryListIcon) {
                return {
                    list: this.questionsQueryList,
                    pageNumber: this.questionsQueryPageNumber,
                }
            } else {
                return false
            }
        },
        getType () {
            return this.typeList[this.typeIndex]
        },
        setSelectCSS (item, childIndex) {
            return item.child_index === childIndex
        },
        setSubH () {
            let nodeList = document.getElementsByClassName('choose_ul')
            let i = this.currentListIndex + 1
            let questionsQuery = this.getQuestionsQuery()
            while (i < nodeList.length) {
                let item = nodeList[i]
                if (parseInt(getComputedStyle(item).height) > 36) {
                    let it = {
                        showMore: false,
                        isMore: true,
                    }
                    if (questionsQuery) {
                        if (questionsQuery.list) {
                            let obj = questionsQuery.list[i]
                            it['showMore'] = obj.showMore
                            it['isMore'] = obj.isMore
                        }
                    }
                    this.list[i].showMore = it.showMore
                    this.list[i].isMore = it.isMore
                }

                ++i
            }
        },
        handleSelectType (index) {
            this.typeIndex = index

            this.rest_child_down(-1)
            
            if (index === 0) {
                this.list = this.list1
            } else if (index === 1) {
                this.list = this.list2
            }

            this.exec(-1)
        },
        exec (index=-1) {
            let i = index
            let self = this
            let questionsQuery = this.getQuestionsQuery()

            function next () {
                ++i
                // 跳出条件
                if (i >= self.list.length) {
                    self.setSubH()
                    self.change()
                    return
                }

                let item = self.list[i]
                if (item.list.length >= item.child_index) {
                    item.child_index = 0
                }
                if (questionsQuery) {
                    if (questionsQuery.list) {
                        let obj = questionsQuery.list[i]
                        if (obj.child_index !== void 0) {
                            item['child_index'] = obj.child_index
                        }
                        item['showMore'] = obj.showMore
                        item['isMore'] = obj.isMore
                    }
                }
                item.func(next, item)
            }
            next()
        },
        rest_child_down (start_index) {
            let i = start_index + 1
            while (this.list.length > i) {
                let item = this.list[i]
                item.isUse = false
                // 重置child中选中index
                item.child_index = 0
                // 重置childlist
                item.list = []
                // 重置下拉按钮
                item.isMore = false
                // 重置显示
                item.showMore = true
                ++i
            }
        },
        // 输出映射
        listMap () {
            let obj = {
                structure_type: this.getType()
            }
            let i = 0
            while (this.list.length > i) {
                let item = this.list[i]
                obj[item.name] = this.getChildValueFromIndex(item, i)
                // obj[item.name] = this.getItemFromName(i).list
                ++i
            }
            return obj
        },
        // 通过list.name获取项list[i]
        getItemFromName (name) {
            let obj = null
            this.list.forEach(item => {
                if (item.name === name) {
                    obj = item
                }
            })
            return obj
        },
        // 通过list[index]获取项list[i]
        getItemFromIndex (index) {
            let obj = this.list[index]
            return obj
        },
        // 获取list.list[index]
        getChildValueFromIndex (item, index) {
            return (item.required || item.isUse) ? item.list[item.child_index] : {}
        },
        // 获取项list[i].id
        getValue (value, type='name') {
            let item
            if (type === 'name') {
                item = this.getItemFromName(value)
            } else if (type === 'index') {
                item = this.getItemFromIndex(value)
            } else {
                console.error('type error')
                return
            }
            if (item.required || item.isUse) {
            // console.warn(value, type, JSON.stringify(item))

                if (item && item.list[item.child_index]) {
                    return item.list[item.child_index].id
                } else {
                    return ''
                }
            } else {
                return null
            }

        },
        handleSelectItem (index, child_index) {
            // if (this.loading) {
            //     return alert('加载中或未使用next');
            // }
            let item = this.list[index]
            this.currentListIndex = index
            item.child_index = child_index
            item.isUse = true
            this.rest_child_down(index)

            // 保存状态
            // this.setStore()

            this.exec(index)
        },
        fromatData (list, oldKey, oldValue) {
            if (!oldKey || !oldValue) {
                console.log('请输入正确的参数')
                return []
            }
            return list.map(item => {
                return {
                    name: item[oldKey],
                    id: parseInt(item[oldValue])
                }
            });
        },
        handleMoreList (index) {
            let item = this.list[index]
            item.showMore = !item.showMore
        },
        // 把标准key转换成使用key
        change () {
            let questionsQuery = this.getQuestionsQuery()
            let keyMap = {
                'vid': 'versions_id',
                'classes': 'grade_id',
                'subject': 'subject_id',
                'chid': 'chapter_id',
                'unitid': 'node_id',
                'q_type': 'type_id',
                'easy_type': 'difficult_id',
                'level1': 'level_1_id',
                'level2': 'level_2_id',
                'level3': 'level_3_id',
            }
            let outputMap = {
                pageNumber: questionsQuery ? questionsQuery.pageNumber : 1,
            }
            let listMap = this.listMap()
            Object.keys(listMap).forEach(key => {
                let value = listMap[key]
                let nowKey = keyMap[key]
                let id
                try {
                    id = value.id === void 0 ?  '' : value.id
                } catch (error) {
                    id = ''
                }
                if (nowKey) {
                    outputMap[nowKey] = id
                } else {
                    outputMap[key] = id
                }
            })
            console.warn(JSON.stringify(listMap), JSON.stringify(outputMap))

            this.$emit('change', outputMap)
        },
        http (url, method='get', args={}) {
            return this.$http[method](url, args, {
                showError: false
            })
        },
        
        // list1
        // 版本
        getVid (next, item) {
            this.http('./Question/getVersions', 'get')
            .then(res => {
                item.list = this.fromatData(res.data, 'versions', 'id')
                next()
            })
        },
        // 年级
        getClasses (next, item) {
            this.http('./Question/getClass', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValue('vid'),
                structure_type: this.getType().id,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'class', 'id')
                next()
            })
        },
        // 科目
        getSubject (next, item) {
            this.http('./Question/getSubject', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValue('vid'),
                class_id: this.getValue('classes'),
                structure_type: this.getType().id,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'subject', 'id')
                next()
            })
            // 清空list
            .catch(err => {
                this.change();
            })
        },
        // 章
        getChid (next, item) {
            this.http('./Question/getChapter', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValue('vid'),
                class_id: this.getValue('classes'),
                subject_id: this.getValue('subject'),
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'chapter', 'id')
                next()
            })
        },
        // 节
        getUnitid (next, item) {
            this.http('/Question/getUnit', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValue('vid'),
                class_id: this.getValue('classes'),
                subject_id: this.getValue('subject'),
                chapter_id: this.getValue('chid'),
                // versions_id: this.getValue('vid'),
                // class_id: 201,
                // subject_id: 2,
                // chapter_id: 35,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'chapter', 'id')
                next()
            })
        },
        // 题类
        getIsType (next, item) {
            item.list = [
                {name: '客观', id: 1},
                {name: '主观', id: 2}
            ]
            next()
        },
        // 题型
        getQType (next, item) {
            this.http('./Question/getCategory', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValue('vid'),
                class_id: this.getValue('classes'),
                subject_id: this.getValue('subject'),
                type: this.getValue('is_type'),
                structure_type: 1,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'title', 'id')
                next()
            })
        },
        // 难度
        getEasyType (next, item) {
            item.list = [
                {name: '容易', id: 1},
                {name: '普通', id: 2},
                {name: '困难', id: 3},
            ]
            next()
        },

        // list2
        // 学阶
        getPharse (next, item) {
            this.http('./Question/getPharse', 'post', {
                token: this.$tools.getToken(),
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'pharse_name', 'id')
                next()
            })
        },
        // 科目
        getSubject2 (next, item) {
            this.http('./Question/getSubject', 'post', {
                token: this.$tools.getToken(),
                structure_type: this.getType().id,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'subject', 'id')
                next()
            })
        },
        // 知识点1
        getKnowledge1 (next, item) {
            this.http('./Question/getKnowledge', 'post', {
                token: this.$tools.getToken(),
                pharse_id: this.getValue('pharse'),
                subject_id: this.getValue('subject'),
                level: 1,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'name', 'id')
                next()
            })
        },
        // 知识点2
        getKnowledge2 (next, item) {
            this.http('./Question/getKnowledge', 'post',{
                token: this.$tools.getToken(),
                pharse_id: this.getValue('pharse'),
                subject_id: this.getValue('subject'),
                level: 2,
                level_1_id: this.getValue('level1'),
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'name', 'id')
                next()
            })
        },
        // 知识点3
        getKnowledge3 (next, item) {
            let level2 = this.getValue('level2')
            if (level2 === null || level2 === void 0) {
                next()
            } else {
                this.http('./Question/getKnowledge', 'post', {
                    token: this.$tools.getToken(),
                    pharse_id: this.getValue('pharse'),
                    subject_id: this.getValue('subject'),
                    level: 3,
                    level_1_id: this.getValue('level1'),
                    level_2_id: level2,
                })
                .then(res=>{
                    item.list = this.fromatData(res.data, 'name', 'id')
                    next()
                })
            }
        },
        // 题型
        getQType2 (next, item) {
            this.http('./Question/getCategory', 'post', {
                token: this.$tools.getToken(),
                subject_id: this.getValue('subject'),
                type: this.getValue('is_type'),
                structure_type: this.getType().id,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'title', 'id')
                next()
            })
        },
        // 难度
        getEasyType2 (next, item) {
            item.list = [
                {name: '容易', id: 1},
                {name: '普通', id: 2},
                {name: '困难', id: 3},
            ]
            next()
        },
    }
}
</script>

<style>
.choose .on {
    color: #f00;
}
</style>
<style lang="less">
.choose {
    width: 100%;
    font-size: 13px;
    border:1px solid #ddd;
    border-radius: 4px;
    margin-top: 50px;
    padding-left: 13px;
    padding-right: 20px;
    ul {
        overflow: hidden;
    }
    ul>li {
        float: left;
    }
    .show {
        height: auto !important;
    }
    .choose_sub, .choose_sub_type {
        // height: 36px;
        line-height: 36px;
        overflow: hidden;
        border-bottom: 1px dashed #ddd;
        .choose_title {
            display: block;
            // width: 70px;
            text-align: right;
            margin-right:48px;
        }
        ul { 
            // width:80%;
            // height: 36px;
            // padding-right: 50px;
            // box-sizing: border-box;
            li {
                height: 24px;
                line-height: 24px;
                margin-top:6px;
                padding:0 12px;
                box-sizing: border-box;
                text-align: center;
                cursor: pointer;
                .el-icon-close {
                    margin-left: 10px;
                    visibility: hidden;
                }
            }
        }
        .choose_more {
            float:right;
            font-size: 12px;
            cursor: default;
            cursor: pointer;
        }
        .clear {
            clear: both;
        }
    }
    .choose_last {
        border-bottom: none;
    }
    .on {
        background:#41cac0;
        color: #fff;
        border-radius: 4px;
    }
}
</style>

