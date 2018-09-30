<template>
    <Base-right
    title="开始阅卷"
    :isUpdate="false"
    isBack>
        <template slot-scope="props">
            <div class="read-detail-box"
            :style="'height: ' + props.maxHeight + 'px;'">
                <el-row class="read-detail-box-top">
                    <div class="read-detail-box-top-right">
                        <el-row class="read-detail-item-title">评卷进度</el-row>
                        <el-row class="status">
                            <el-col class="status-item"
                            :span="12">已评：{{countDone}}</el-col>
                            <el-col
                            :span="12">未评：{{countTodo}}</el-col>
                        </el-row>
                        <div
                        v-if="nowPaperInfo && Object.keys(nowPaperInfo).length">
                            <el-row class="read-detail-item-title">第{{countDone + 1}}题分数</el-row>
                            <el-row>
                                <el-input v-model="score" placeholder="输入分数" size="mini" style="width: 100px;"
                                :min="0"></el-input>
                                &lt;= {{nowPaperInfo.score === void 0 ? '' : nowPaperInfo.score}}分
                            </el-row>
                            <el-row class="result-group">
                                <el-button class="result-group-1" type="primary" size="small"
                                :disabled="readTime ? true : false"
                                @click="submit">
                                    <span
                                    v-if="readTime">请等待{{readTime}}秒</span>
                                    <span
                                    v-else>提交</span>
                                </el-button>
                                <el-button class="result-group-2 confirm" size="small"
                                v-if="is_arbit === 1"
                                @click="continueSubmit">申请仲裁</el-button>
                            </el-row>
                        </div>
                    </div>
                    <div class="read-detail-box-top-left">
                        <ul class="left-btn-group">
                            <li class="left-btn"
                            v-for="(item, index) in canvasObj"
                            :key="index"
                            @click="editorBtn(item)">
                                <img 
                                :src="'/static/imgs/' + item.url" alt=""/>
                            </li>
                        </ul>
                        <div class="canvas-group" ref="canvasGroup" style="background-color: #ccc;overflow-y: auto;">
                            <div >
                                <canvas 
                                :width="canvasW"
                                :height="canvasH"
                                :id="canvasId"></canvas>
                            </div>
                        </div>
                    </div>
                </el-row>
                <el-row class="read-detail-box-bottom">
                    <div class="read-detail-box-bottom-title">参考答案</div>
                    <div class="read-detail-box-bottom-body"
                    v-if="nowPaperInfo"
                    v-html="nowPaperInfo.answer">
                        <!-- 草树知春不久归 百般红紫斗芳菲 -->
                    </div>
                </el-row>
            </div>
        </template>
    </Base-right>
</template>

<script>
import BaseRight from '@/components/BaseRight/BaseRight'
import draw from '../../tools/draw'

export default {
    data () {
        return {
            canvas: null,
            canvasCTX: null,
            canvasW: 0,
            canvasH: 0,
            canvasId: (new Date()).getTime(),
            id: 0,
            canvasObj: [
                {
                    url: 'move_btn.png',
                    handle: this.handleMove.bind(this),
                },
                {
                    url: 'big_btn.png',
                    handle: this.handleBig.bind(this),
                },
                {
                    url: 'small_btn.png',
                    handle: this.handleSmall.bind(this),
                },
                {
                    url: 'pen_btn.png',
                    handle: this.handlePen.bind(this),
                },
                {
                    url: 'eraser_btn.png',
                    handle: this.handleEraser.bind(this),
                },
                {
                    url: 'words_btn.png',
                    handle: this.handleWords.bind(this),
                },
                {
                    url: 'removeFont.png',
                    handle: this.handleRemove.bind(this),
                },
                {
                    url: 'withdraw_btn.png',
                    handle: this.handleWithdraw.bind(this),
                },
            ],

            todoPaperList: [],
            staffName: null,
            // answer: null,
            countDone: 0,
            countTodo: 0,
            nowPaperInfo: {},
            nowPaperIndex: 0,
            // 分数
            score: null,
            d: null,
            // 当前试题阅读时间
            readTime: 0,
        }
    },
    components: {
        BaseRight,
    },
    mounted () {
        this.id = this.$route.params.id
        this.req()
    },
    methods: {
        req () {
            this.$http.post('/Marking/markingPaper', {
                token: this.$tools.getToken(),
                exam_id: this.$route.params.id,
                type: this.$route.params.type,
            })
            .then(res => {
                
                // 测试
                // res.data = {
                //     "rows": [
                //         {
                //             "task_id": "5",
                //             "answer_id": "38",
                //             "exam_id": "2",
                //             // "picture": "http:\/\/192.168.122.251:8088\/eduPaperService\/paper\/multiMarkingImg.do?loc=Y2xvdWRwYXBlcl9QYXBlclN1Yy8yMDE4MDQxNi82ODVhZWI2MDhkMDk0NWRkOWI3NzU3ZWViOWQwNTJjZC5wbmcmeD0xNjU1Jnk9MzE2Jnc9MTUzMCZoPTE2NzM=",
                //             "picture": "/static/imgs/test-paper01.png",
                //             "t1": "3",
                //             "t2": "13",
                //             "edit_flag": "0",
                //             "mark_flag": "0",
                //             "marking_time": null,
                //             "marktype": "0",
                //             "score": "88.0",
                //             "point": "0.0",
                //             "read_time": "0",
                //             "sequence": 1,
                //             "answer": "<p>八年级写作题<\/p><img src='/static/imgs/qrcode.png'/>"
                //         },
                //         {
                //             "task_id": "6",
                //             "answer_id": "39",
                //             "exam_id": "3",
                //             // "picture": "http:\/\/192.168.122.251:8088\/eduPaperService\/paper\/multiMarkingImg.do?loc=Y2xvdWRwYXBlcl9QYXBlclN1Yy8yMDE4MDQxNi82ODVhZWI2MDhkMDk0NWRkOWI3NzU3ZWViOWQwNTJjZC5wbmcmeD0xNjU1Jnk9MzE2Jnc9MTUzMCZoPTE2NzM=",
                //             "picture": "/static/imgs/qrcode.png",
                //             "t1": "3",
                //             "t2": "13",
                //             "edit_flag": "0",
                //             "mark_flag": "0",
                //             "marking_time": null,
                //             "marktype": "0",
                //             "score": "88.0",
                //             "point": "0.0",
                //             "read_time": "0",
                //             "sequence": 1,
                //             "answer": "<p>八年级写作题<\/p><img src='/static/imgs/qrcode.png'/>"
                //         },
                //     ],
                //     "staff_name": "小海老师",
                //     "answer_service": "http:\/\/39.108.106.217:8082\/",
                //     "count_done": 0,
                //     "count_todo": 3,
                //     "is_arbit": 0
                // }

                this.todoPaperList = res.data.rows
                this.staffName = res.data.staff_name
                this.countDone = parseInt(res.data.count_done)
                this.countTodo = parseInt(res.data.count_todo)
                this.is_arbit = parseInt(res.data.is_arbit)
                this.initNextPaper()
            })
        },
        computedDone (num) {
            this.countDone++    
        },
        computedTodo () {
            this.countTodo--    
        },
        compReadTime () {
            const info = this.getPaperInfo()
            if (info) {
                this.readTime = parseInt(info.read_time)
                let interval = setInterval(() =>{
                    --this.readTime
                    if (this.readTime <= 0) {
                        this.readTime = 0
                        clearInterval(interval)
                    }
                }, 1000)
            }
        },
        getPaperInfo () {
            return this.todoPaperList[this.nowPaperIndex]
        },
        initNextPaper () {
            this.nowPaperInfo = this.getPaperInfo()
            this.compReadTime()
            if (this.nowPaperInfo) {
                this.$store.commit('startLoad');
                if (this.d) {
                    // 清空背景
                    this.d.clearBackgroundImage();
                }
                this.compcanvas(this.nowPaperInfo.picture)
                    .then((img) => {
                        this.$store.commit('endLoad');
                        this.d = draw(document.getElementById(this.canvasId), this.$refs.canvasGroup)
                        this.d.setStatus(this.d._STATUS_MOVE)
                        this.d.setBackgroundImage(img)
                        this.nowPaperIndex++   
                    })
            }
        },
        updateNextPaper () {
            // if (this.nowPaperIndex > this.countDone) {
            //     this.$message.error('已没有可评试卷')
            //     return
            // }
            // 为了等待draw.save完成
            setTimeout(() => {
                this.initNextPaper()
                this.computedDone()
                this.computedTodo()
                if (this.countTodo <= 0) {
                    this.$message.success('阅卷完成')
                    this.$router.go(-1)
                    return
                }
            }, 1000)
        },
        compcanvas (url) {
            const canvasGroupNode = getComputedStyle(document.getElementsByClassName('canvas-group')[0])
            const canvasW = parseInt(canvasGroupNode.width) - 30
            const canvasH = parseInt(canvasGroupNode.height)
            
            return new Promise((resolve, reject) => {
                let img = new Image()
                img.onload = () => {
                    this.canvasW = canvasW
                    this.canvasH = img.height > canvasH ? img.height : canvasH
                    this.$nextTick(() => {
                        resolve(img)
                        // setTimeout(() => {
                        //     resolve(img)                            
                        // }, 2000)
                    })
                }
                img.onerror = () => {
                    this.$message.error('试卷加载失败')
                }
                img.crossOrigin = "Anonymous"                
                img.src = url
            })   
        },
        editorBtn (item) {
            item.handle()
        },
        handleMove () {
            this.d.setStatus(this.d._STATUS_MOVE)
        },
        handleBig () {
            this.d.setStatus(this.d._STATUS_BIG)
        },
        handleSmall () {
            this.d.setStatus(this.d._STATUS_SMALL)
        },
        handlePen () {
            this.d.setStatus(this.d._STATUS_DRAW)
        },
        handleEraser () {
            this.d.setStatus(this.d._STATUS_CLEARDRAW)
        },
        handleWords () {
            this.d.setStatus(this.d._STATUS_TEXT)
        },
        handleRemove () {
            this.d.setStatus(this.d._STATUS_CLEARTEXT)
        },
        handleWithdraw () {
            // this.d.setStatus(this.d._STATUS_UPDATE)
            this.$router.go(0)
        },

        submit () {
            if (this.score === null || this.score === void 0) {
                this.$message.error('请填写分数')
                return
            } else if (parseInt(this.score) > parseInt(this.nowPaperInfo.score)) {
                this.$message.error('超出范围')
                return
            }
            this.$store.commit('startLoad')
            this.d.save((base64) => {
                this.$http.post('/Marking/savePoint', {
                    token: this.$tools.getToken(),
                    task_id: this.nowPaperInfo.task_id,
                    exam_id: this.$route.params.id,
                    answer_id: this.nowPaperInfo.answer_id,
                    point: this.score,
                    baseImage: base64,
                })
                .then(res => {
                    this.score = null
                    this.$message.success(res.info)
                    this.updateNextPaper()
                })
            })
        },
        continueSubmit () {
            this.$http.post('/Marking/applyArbit', {
                token: this.$tools.getToken(),
                task_id: this.nowPaperInfo.task_id,
                exam_id: this.$route.params.id,
                answer_id: this.nowPaperInfo.answer_id,
            })
            .then(res => {
                this.score = null
                this.$message.success(res.info)
                this.updateNextPaper()
            })
        },
    }
}
</script>

<style lang="less" scoped>
.read-detail-item-title {
    font-size: 14px;color: #4c4c4c;font-weight: bold;
    padding: 20px 0 20px 0;
}
.read-detail-box {
    border: 1px solid #dddddd;
    &-top {
        height: 63%;
        overflow: hidden;
        &-left {
            margin-right: 250px;
            height: 100%;
        }
        &-right {
            width: 249px;
            border-left: 1px solid #dddddd;
            float: right;
            height: 100%;
            overflow-y: auto;
            padding: 30px 28px;
            position: relative;
            z-index: 50;
            background-color: #fff;
                .title {
                    font-family: SimSun;
                    font-size: 14px;
                    color: #666666;
                }
                // .status {
                //     font-size: 14px;
                //     padding: 20px 0;
                //     &-item {

                //     }
                // }
                .result-group {
                    display: flex;
                    // justify-content: center;
                    padding-top: 20px;
                }
        }
    }
    &-bottom {
        height: 37%;
        border-top: 1px solid #dddddd;
        background-color: #f4f8fe;
        padding: 22px 20px;
        // overflow-y: auto;
        &-title {
            color: #666666;
        }
        &-body {
            padding: 20px 48px;
            color: #333333;
            overflow-y: auto;            
            height: 100%;
        }
    }
}
.left-btn-group {
    width: 60px;
    float: left;
    height: 100%;
    background-color: #a3d6ff;
    padding: 10px 0;
    overflow-y: auto;
    .left-btn {
        margin: 10px auto;
        border-radius: 4px;
        background-color: #fff;
        text-align: center;
        width: 36px;
        height: 36px;
        cursor: pointer;
        img{
            width: 100%;
            height: 100%;
        }
    }
}
.canvas-group {
    margin-left: 60px;
    height: 100%;
    canvas {
        // background-color: #fff;
        margin: 0 auto;
        padding: 0; 
    }
}
</style>
