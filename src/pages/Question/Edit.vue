<template>
    <Base-right class="question-create"
    :isUpdate="false"
    :title="title">
        <template slot-scope="props">
            <el-form :style="'overflow: auto; height:' + props.maxHeight + 'px'"
            :model="formData"
            size="small">
            <!-- 按章节 -->
                <!-- <template 
                v-if="typeIndex === 0"> -->
                    <el-row>
                        <el-col
                        :span="8">
                            <el-form-item label="结构:" label-width="70px">
                                <el-select 
                                :disabled="mode === 'c' ? false : true"
                                @change="handleSelectType" v-model="typeIndex" placeholder="请选择版本">
                                    <el-option
                                    v-for="(item,index) in typeList"
                                    :key="index"
                                    :label="item.name"
                                    :value="index">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col style="height: 55px;"
                        :span="8"
                        :key="index"
                        v-for="(item, index) in list">
                            <el-form-item 
                            :label="item.label + ':'" label-width="70px">
                                <el-select 
                                :disabled="mode === 'c' ? false : item.disabled"
                                @change="(id) => {handleSelectItem(index, id)}" v-model="item.child_value" placeholder="请选择">
                                    <el-option
                                    v-for="(item2, index2) in item.list"
                                    :key="index2"
                                    :label="item2.name"
                                    :value="item2.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                
                <el-form-item label="题目描述:">
                    <script id="editorDescribe" type="text/plain" style="width:92%;height:200px;"></script>
                </el-form-item>
                <div
                v-show="answerType === QUESTION_CLASS_2 && answer">
                    <!-- 主观 -->
                    <el-form-item label="答案:">
                        <script id="editorResult" type="text/plain" style="width:92%;height:200px;"></script>
                    </el-form-item>                
                </div>
                <div
                v-show="answerType === QUESTION_CLASS_1 && answer">
                    <!-- 客观 -->
                    <!-- 多选 -->
                    <template
                    v-if="answer === 1">
                        <!-- 单选 -->
                        <el-form-item label="正确答案:">
                            <el-checkbox-group v-model="answerGroup">
                                <el-checkbox 
                                :disabled="(answerGroup.length > 0 && answerGroup[0] !== item) ? true : false"
                                :key="item"
                                v-for="item in activeAnswerList"
                                :label="item">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </template>
                    <template
                    v-else>
                        <el-form-item label="正确答案:">
                            <el-checkbox-group v-model="answerGroup">
                                <el-checkbox 
                                :key="item"
                                v-for="item in activeAnswerList"
                                :label="item">{{item}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </template>
                </div>

                <el-button class="confirm" @click="back" style="color: #fff;">返回</el-button>
                <el-button type="primary"
                @click="handleSubmit">确定</el-button>
            </el-form>
        </template>
    </Base-right>
</template>

<script>
// 没有区分学校、年级、教师的req的url
import BaseRight from '@/components/BaseRight/BaseRight'
import config from '@/config'

export default {
    props: {
        title: String,
        // 组件模式
        // c 创建 w 修改
        mode: {
            type: String,
            default: 'c'
        },
        data: {
            type: Object,
            default () {
                return {}
            }
        },
        // 是否显示res提示信息        
        echo: {
            type: Boolean,
            default: true,
        }
    },
    data () {
        return {
            // 客观
            QUESTION_CLASS_1: 1,
            // 主观
            QUESTION_CLASS_2: 2,
            // 修改使用
            id: '',
            // 执行状态
            execComplete: false,
            // 用来划分栅格系统
            lastIndex: 0,
            // 传入的数据
            localData: {},
            checkFlag:true,

            typeIndex: 1,
            typeList: [
                {name: '按章节', id: 1},
                {name: '按知识点', id: 2},
            ],
            // currentListIndex: 0,
            formData: {},
            // 请求是否完成
            done: false,
            list: null,
            listCopy: null,
            // 题库类型
            question_type: this.$route.params.type,
            // 当前题类
            // currentIsType: 1,
            // 答案类型
            answerType: null,
            //提交数据 按章节
            list1: [
                {
                    name: 'vid',
                    label: '版本',
                    func: this.getVid,
                    reload: true,
                    child_index: null,
                    child_value: null,
                    disabled: true,
                    list: []
                },
                {
                    name: 'classes',
                    label: '年级',
                    reload: true,
                    func: this.getClasses,
                    child_index: null,
                    child_value: null,
                    disabled: true,
                    list: []
                },
                {
                    name: 'subject',
                    label: '科目',
                    reload: true,
                    func: this.getSubject,
                    child_index: null,
                    child_value: null,
                    disabled: true,
                    list: []
                },
                {
                    name: 'chid',
                    label: '章',
                    reload: true,
                    func: this.getChid,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'unitid',
                    label: '节',
                    reload: true,
                    func: this.getUnitid,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'is_type',
                    label: '题类',
                    reload: false,
                    func: this.getIsType,
                    child_index: 0,
                    child_value: null,
                    disabled: false,
                    list: [
                        {name: '客观', id: 1},
                        {name: '主观', id: 2},
                    ]
                },
                {
                    name: 'q_type',
                    label: '题型',
                    reload: true,
                    func: this.getQType,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'easy_type',
                    label: '难度',
                    reload: false,
                    func: this.getEasyType,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
            ],
            list2: [
                {
                    name: 'pharse',
                    label: '学阶',
                    reload: true,
                    func: this.getPharse,
                    child_index: null,
                    child_value: null,
                    disabled: true,
                    list: []
                },
                {
                    name: 'subject',
                    label: '科目',
                    reload: true,
                    func: this.getSubject2,
                    child_index: null,
                    child_value: null,
                    disabled: true,
                    list: []
                },
                {
                    name: 'level1',
                    label: '知识点1',
                    reload: true,
                    func: this.getKnowledge1,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'level2',
                    label: '知识点2',
                    reload: true,
                    func: this.getKnowledge2,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'level3',
                    label: '知识点3',
                    reload: true,
                    func: this.getKnowledge3,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'is_type',
                    label: '题类',
                    reload: false,
                    func: this.getIsType,
                    child_index: 0,
                    child_value: null,
                    disabled: false,
                    list: [
                        {name: '客观', id: 1},
                        {name: '主观', id: 2},
                    ]
                },
                {
                    name: 'q_type',
                    label: '题型',
                    reload: true,
                    func: this.getQType2,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
                {
                    name: 'easy_type',
                    label: '难度',
                    reload: false,
                    func: this.getEasyType2,
                    child_index: null,
                    child_value: null,
                    disabled: false,
                    list: []
                },
            ],

            //列表数据
            // structureData: [
            //     {name: '按章节', id: 1},
            //     {name: '按知识点', id: 2},
            // ],
            versionData:[],
            gradeData:[],
            sujectData:[],
            chapterData:[],
            nodeData:[],
            typeData:[],
            difficultyData:[
                {
                    id: '1',
                    name:"简单"
                },
                {
                    id: '2',
                    name:"一般"
                },
                {
                    id: '3',
                    name:"困难"
                }
            ],
            queryDataList: [
                'versionData',
                'gradeData',
                'sujectData',
                'chapterData',
                'nodeData',
                '',
                'typeData',
            ],

            editorDescribe: null,
            editorResult: null,
            
            ueditorToolbarsConfig: [
                [
                    'fullscreen',
                    'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|',
                    'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 
                    'touppercase', 'tolowercase', '|',
                    'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'simpleupload', 'insertimage', '|',
                    'spechars', 'snapscreen', 'wordimage', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
                ]
            ],

            QUESTION_CLASS: config.QUESTION_CLASS,
            activeAnswerList: [
                'A',
                'B',
                'C',
                'D',
            ],

            // 题类为客观题时，使用多选
            answerGroup: [],

            // 略过的list name
            filterList: ['unitid', 'level2', 'level3'],            
        }
    },
    computed: {
        answer () {
            this.answerGroup = []      
            let item = this.getItemFromName('q_type')
            if (item) {
                // 如果没有item.child_index, 就使用item.child_value
                if (item.child_index === null || item.child_index === void 0) {
                    let i = item.list.length
                    for (let i = 0, max = item.list.length; i < max; ++i) {
                        const t = item.list[i]
                        if (parseInt(t.id) == parseInt(item.child_value)) {
                            return t.type
                        }
                    }
                } else {
                    if (item.list[item.child_index]) {
                        return item.list[item.child_index].type
                    }
                }
            }
            return null
        }
    },
    watch: {
        data (newVal) {
            if (this.mode === 'w') {
                this.setListItemValue(newVal)
                // this.setType()
            }
        }
    },
    components: {
        BaseRight
    },
    mounted () {
        // this.rmStore()

        this.list = this.list1
        this.listCopy = JSON.parse(JSON.stringify(this.list))
        this.handleSelectType(0)

        let t = setInterval(() => {
            if (!UE) {
                return
            }

            this.createEditorDescribe()
            this.createEditorResult() 

            clearInterval(t)
        }, 100)

    },
    beforeDestroy () {
        this.editorDescribe.destroy()
        this.editorResult.destroy()
    },
    methods: {
        // isType 题类
        // Qtype 题型
        setAnswerType (isType, Qtype) {
            // 在讨论中
            this.answerType = isType
        },
        // 修改时的初始化
        setListItemValue (data) {
            // 结构
            let structure_type = parseInt(data.structure_type)
            let map = {
                vid: data.vid,
                classes: data.clid,
                subject: data.sid,
                chid: data.chid,
                unitid: data.unitid,
                is_type: data.is_type,
                q_type: data.cid,
                easy_type: data.easy_type,
                pharse: data.pharse_id,
                level1: data.level_1_knowledge_id,
                level2: data.level_2_knowledge_id,
                level3: data.level_3_knowledge_id,
            }
            
            this.id = data.id
            this.handleSelectType(structure_type === 1 ? 0 : 1, false)
            this.list.forEach(item => {
                let t
                if (map[item.name] === null || map[item.name] === void 0) {
                    t = null
                } else {
                    t = parseInt(map[item.name])    
                }
                // console.warn(item.name, t, JSON.stringify(item.list))
                item.child_value = t
            }) 
            setTimeout(() => {
                this.editorDescribe.setContent(data.content)
                this.setAnswerType(parseInt(data.is_type), parseInt(data.q_type))
                if (parseInt(data.is_type) === this.QUESTION_CLASS_2) {
                    this.editorResult.setContent(data.answer)
                } else {
                    this.answerGroup = this.answerGroup.concat(data.answer.split(''))
                }
            }, 1000)
        },
        getType () {
            let t = this.typeList[this.typeIndex]
            return {
                id: t.id,
                name: '结构'
            }
        },
        setType (index) {
            this.typeIndex = index
        },
        exec (index=0) {
            let i = index
            let self = this
            let done = true
            this.execComplete = false

            function next () {
                ++i
                if (!self.list[i]) {
                    self.execComplete = true
                    return
                }
                // 跳出条件
                // 如果每个item.child_index都选择了值就退出
                if (self.list[i].child_index === null) {
                    done = false
                }
                self.list[i].func(next, self.list[i])
            }
            next()
        },
        // 通过list.name获取项list[i]
        getItemFromName (name) {
            let obj = null
            if (this.list) {
                for (let item of this.list) {
                    if (item.name === name) {
                        obj = item
                        break
                    }
                }
            }
            return obj
        },
        // 通过list.name获取项list[i].id
        getValueFromName (name) {
            let item = this.getItemFromName(name)
            return item ? item.child_value : null
        },
        handleSelectItem (index, id) {
            // if (this.loading) {
            //     return alert('加载中或未使用next');
            // }
            // 如果是题类时设置
            // 如果是题型
            if (this.list[index].name === 'is_type' || this.list[index].name === 'q_type') {
                // this.currentIsType = parseInt(id)
                let isType = this.getValueFromName('is_type')
                let Qtype = this.getValueFromName('q_type')
                if ((isType !== null && isType !== void 0 && typeof isType === 'number')
                  && (Qtype !== null && Qtype !== void 0 && typeof Qtype === 'number')
                ) {
                    this.setAnswerType(isType, Qtype)
                }
            }

            let l = this.list[index]
            for (let i = 0, max = l.list.length; i < max; ++i) {
                let childValue = l.list[i]
                if (parseInt(childValue.id) === id) {
                    this.list[index].child_index = i
                    break
                }
            }
            this.list[index].child_value = parseInt(id)
            this.rest_child_down(index)
            this.exec(index)
        },
        handleSelectType (index, reload=true) {
            this.typeIndex = index
            if (reload) {
                this.rest_child_down(0)   
            }
            if (index === 0) {
                this.list = this.list1
            } else if (index === 1) {
                this.list = this.list2
            }
            this.exec(-1)
        },
        // 有reload才刷新
        rest_child_down (start_index) {
            let i = start_index + 1
            while (this.list.length > i) {
                let item = this.list[i]
                if (item.reload) {
                    // 重置child中选中index
                    item.child_index = this.listCopy[i].child_index
                    item.child_value = this.listCopy[i].child_value
                    // 重置childlist
                    item.list = JSON.parse(JSON.stringify(this.listCopy[i].list))
                }
                ++i
            }
        },
        fromatData (list, oldKey, oldValue) {
            if (!oldKey || !oldValue) {
                console.log('请输入正确的参数')
                return []
            }
            return list.map(item => {
                return Object.assign({}, item, {
                    name: item[oldKey],
                    id: parseInt(item[oldValue])
                })
            });
        },
        listMap () {
            let obj = {
                // 特殊情况 结构
                structure_type: this.getType()
            }
            let i = 0
            while (this.list.length > i) {
                let item = this.list[i]
                // obj[item.name] = item.list[item.child_index]
                obj[item.name] = {
                    name: item.label,
                    id: item.child_value
                }
                ++i
            }
            return obj
        },
        http (url, method='get', args={}) {
            return this.$http[method](url, args, {
                showError: this.echo
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
                versions_id: this.getValueFromName('vid'),
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
                versions_id: this.getValueFromName('vid'),
                class_id: this.getValueFromName('classes'),
                structure_type: this.getType().id,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'subject', 'id')
                next()
            })

        },
        // 章
        getChid (next, item) {
            this.http('./Question/getChapter', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValueFromName('vid'),
                class_id: this.getValueFromName('classes'),
                subject_id: this.getValueFromName('subject'),
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
                versions_id: this.getValueFromName('vid'),
                class_id: this.getValueFromName('classes'),
                subject_id: this.getValueFromName('subject'),
                chapter_id: this.getValueFromName('chid'),
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'chapter', 'id')
                next()
            })

        },
        // 题类
        getIsType (next, item) {
            next()
        },
        // 题型
        getQType (next, item) {
            this.http('./Question/getCategory', 'post', {
                token: this.$tools.getToken(),
                versions_id: this.getValueFromName('vid'),
                class_id: this.getValueFromName('classes'),
                subject_id: this.getValueFromName('subject'),
                type: this.getValueFromName('is_type'),
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
                pharse_id: this.getValueFromName('pharse'),
                subject_id: this.getValueFromName('subject'),
                level: 1,
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'name', 'id')
                next()
            })
        },
        // 知识点2
        getKnowledge2 (next, item) {
            this.http('./Question/getKnowledge', 'post', {
                token: this.$tools.getToken(),
                pharse_id: this.getValueFromName('pharse'),
                subject_id: this.getValueFromName('subject'),
                level: 2,
                level_1_id: this.getValueFromName('level1'),
            })
            .then(res=>{
                item.list = this.fromatData(res.data, 'name', 'id')
                next()
            })
        },
        // 知识点3
        getKnowledge3 (next, item) {
            let level2 = this.getValueFromName('level2')
            if (level2 === null || level2 === void 0) {
                next()
            } else {
                this.http('./Question/getKnowledge', 'post', {
                    token: this.$tools.getToken(),
                    pharse_id: this.getValueFromName('pharse'),
                    subject_id: this.getValueFromName('subject'),
                    level: 3,
                    level_1_id: this.getValueFromName('level1'),
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
                subject_id: this.getValueFromName('subject'),
                type: this.getValueFromName('is_type'),
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

        createEditorDescribe () {
            try {
                this.editorDescribe = UE.getEditor('editorDescribe', {
                    toolbars: this.ueditorToolbarsConfig,
                    _myExtends: {
                        imageurlprefix: window.req_api
                    }
                })                               
            } catch (error) {
                this.editorDescribe = null
            }

        },
        createEditorResult () {
            try {
                this.editorResult = UE.getEditor('editorResult', {
                    toolbars: this.ueditorToolbarsConfig,
                    _myExtends: {
                        imageurlprefix: window.req_api
                    }             
                })                               
            } catch (error) {
                this.editorResult = null
            }

        },
        handleQuestionClassChange (val) {
            if (val == 0 && !this.editorResult) {
                this.createEditorResult()
            }
        },

        handleSubmit () {
            let listMap = this.listMap()
            let listKays = Object.keys(listMap)
            for (let key of listKays) {
                let item = listMap[key]
                let name = item.name
                let id = item.id
                if (id === null || id === void 0) {
                    let result = true
                    if (this.filterList.indexOf(key) !== -1) {
                        result = false
                    }
                    if (result) {
                        this.$message.error(`请在${name || '下拉框'}中，填写正确的值`)
                        return
                    }
                }
            }

            let answer, id
            // 根据题的类型不同切换不同答案
            if (this.getValueFromName('is_type') == this.QUESTION_CLASS_1) {
                answer = this.answerGroup.join('').toUpperCase()
            } else {
                answer = this.editorResult.getContent()
            }

            let newObj = {
                token: this.$tools.getToken(),
                uid: this.$tools.getUID(),
                school_id: this.$tools.getSchoolID(),
                question_type: this.question_type,
                structure_type: this.getType().id,
            }
            // 根据mode的不同req id
            if (this.mode === 'w') {
                newObj['id'] = this.id
            }
            
            // 分结构提交
            if (newObj.structure_type === 1) {
                Object.assign(newObj, {
                    versions_id: this.getValueFromName('vid'),
                    category_id: this.getValueFromName('q_type'),
                    class_id: this.getValueFromName('classes'),
                    chapter_id: this.getValueFromName('chid'),
                    subject_id: this.getValueFromName('subject'),
                    content: this.editorDescribe.getContent(),
                    answer,
                    type: this.getValueFromName('is_type'),
                    easy_type: this.getValueFromName('easy_type'),
                    unitid: this.getValueFromName('unitid'),
                })
            } else if (newObj.structure_type === 2) {
                 Object.assign(newObj, {
                    category_id: this.getValueFromName('q_type'),
                    subject_id: this.getValueFromName('subject'),
                    content: this.editorDescribe.getContent(),
                    answer,
                    type: this.getValueFromName('is_type'),
                    easy_type: this.getValueFromName('easy_type'),
                    pharse_id: this.getValueFromName('pharse'),
                    level_1_id: this.getValueFromName('level1'),
                    level_2_id: this.getValueFromName('level2'),
                    level_3_id: this.getValueFromName('level3'),
                })
            } else {
                console.error('错误结构id')
            }
            //提交
            this.$http.post("/Question/save", newObj)
            .then(res => {
                this.$message.success(res.info);
                this.back()
            })
            .catch(res=>{
                this.$message.error(res.info);
            })

        },
        //返回
        back() {
            this.$router.go(-1)
        }
    }
}
</script>

<style>
.question-create .el-form-item__label{
    text-align: center;
}
#editorDescribe, #editorResult {
    margin-top: 50px;
}
</style>
