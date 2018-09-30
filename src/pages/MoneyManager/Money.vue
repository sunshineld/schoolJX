<template>
  <I-table
  title="充值退款"
  @update="init">
      <template slot="head">
            <el-date-picker
            v-model="startDatetime"
            type="date"
            placeholder="请选择开始日期"
            :picker-options="startDatetimePickerOptions"
            :editable="false"
            @change="startDatetimeChange">
            </el-date-picker>
            <el-date-picker
            v-model="endDatetime"
            type="date"
            placeholder="请选择结束日期"
            :picker-options="endDateTimePickerOptions"
            :editable="false"
            @change="endDatetimeChange">
            </el-date-picker>
            <el-select v-model="qryType" placeholder="请选择">
					    <el-option
					      v-for="item in qryTypeOptions"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
  
            <el-input v-model="search" size="smail" placeholder="请输入姓名" style="width:150px;"></el-input>
            <el-button size="primary"
            @click="searchChange">查询</el-button>
            <el-button size="smail" style="background-color: #41cac0;color: #fff;" @click="exportFn">导出记录</el-button>
            <el-button type="danger" style="float:right;"
            @click="rechargeBtn">充值 / 退款</el-button>
      </template>
      <template slot="content" slot-scope="props">
            <el-table
            border
            row-class-name="table-row"
            :height="props.maxHeight"
            :data="tableData"
            @sort-change="sortChange">
                <el-table-column
                prop="name"
                label="学生名称"></el-table-column>
                <el-table-column
                sortable
                prop="class_name"
                label="班级"></el-table-column>
                <el-table-column
                prop="operation_type"
                label="操作类型"></el-table-column>
                <el-table-column
                prop="operation_money"
                label="金额"></el-table-column>
                <el-table-column
                prop="operation_time"
                label="时间"></el-table-column>
                <el-table-column
                prop="operation_name"
                label="操作者"></el-table-column>
                <el-table-column
                prop="ps"
                sortable
                label="备注"></el-table-column>
            </el-table>
            
            <!-- <el-dialog
            :visible.sync="showSignBox"
            width="300px"
            @open="handleSignBoxOpen"
            @close="handleSignBoxClose">
                <div class="waiting">
                    <img :src="waitImg" alt="">
                    <div>等待学生打卡...</div>
                </div>
            </el-dialog> -->

            <I-table-editor v-model="box" 
            :title="boxTitle"
            :width="boxWidth"
            @dialogVisibleOpen="handleSignBoxOpen"
            @dialogVisibleClose="handleSignBoxClose" 
            id="box">
                <template slot="content" v-if="showSignBox">
                    <div class="waiting">
                        <img :src="waitImg" alt="">
                        <div>等待学生打卡...</div>
                    </div>
                </template>
                <template slot="content" v-if="showMoneyBox">
                    <el-form class="money-form-box">
                        <el-form-item label="学生姓名">
                            {{moneyInfo.name}}
                        </el-form-item>
                        <el-form-item label="班级">
                            {{moneyInfo.class_name}}
                        </el-form-item>
                        <el-form-item label="余额">
                            {{moneyInfo.money}}
                        </el-form-item>
                        <el-form-item label="操作类型">
                            <el-select v-model="moneyInfo.selectType" placeholder="请选择" style="width: 100px;"
                            size="small">
                                <el-option label="充值" value="1"></el-option>
                                <el-option label="退款" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="充值/退款金额">
                            <el-input-number v-model="moneyInfo.operMoney" label="请输入"
                            size="mini"
                            :min="0"
                            :precision="2"
                            @blur="limitNum"
                            ></el-input-number>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input
                            size="small"
                            type="textarea"
                            :rows="4"
                            placeholder="请输入内容"
                            v-model="moneyInfo.ps">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>
                <template slot="foot" v-if="showMoneyBox">
                    <el-button 
                    @click="box = false">取 消</el-button>
                    <el-button type="success" class="confirm"
                    @click="confirmRecharge">确 定</el-button>
                </template>
            </I-table-editor>
            <I-table-editor v-model="dialogFormVisibleRecharge" 
            :title="title" width="400px">
                <template slot="content">
                    <span>确认进行该操作？</span>
                </template>
                <template slot="foot">
                    <el-button 
                    @click="dialogFormVisibleRecharge = false">取 消</el-button>
                    <el-button type="success" class="confirm"
                    @click="handleMoney">确 定</el-button>
                </template>
            </I-table-editor>

      </template>
      <template slot="foot">
          <I-table-page
          :total="total_page"
          @change="pageChange"></I-table-page>
      </template>
  </I-table>
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
export default {
    data() {
        return {
            waitImg:"/static/imgs/wait.png",
            disabled:false,
            fmc:null,
            fmd:null,
            biokeyFlag:false,       //biokey是否加载完毕
            startDatetimePickerOptions:{
                disabledDate(time) {return time.getTime() > Date.now();}
            },
            endDateTimePickerOptions:{
                disabledDate(time) {return time.getTime() > Date.now();}
            },
            dialogFormVisibleRecharge:false,//确认充值/退款操作弹框
            tableData: [],
            search: '',
            startDatetime: this.$tools.formatDate(new Date().getTime()/1000 - 6*60*60*24,'yyyy-MM-dd'),
            endDatetime: this.$tools.formatDate(new Date().getTime()/1000,'yyyy-MM-dd'),
            qryType:10,
            qryTypeOptions:[{label:"充值",value:1},{label:"退款",value:0},{label:"充值&退款",value:10}],
            box: false,//大盒子
            boxTitle:'',
            boxWidth:"",
            showSignBox: false, // 打卡box
            showMoneyBox: false, // 充值box
            title:"",//确认充值/退款操作的标题
            moneyInfo: {
                id:"",
                name: '',
                class_name: '',
                money: 0,
                selectType: '1',    // 	1:充值。0:扣款
                operMoney: 0,
                ps: '',
            },
            page_size:10,
            sort:"",
            order:"",
            total_page:0,
            verifyResultHandle: "",
            //nfc
            nfcFlag: false,          //nfc是否加载完毕
            nfc_code:"", 
            // times: 0,
            closeNfc: false,
        };
    },
    watch: {
        showSignBox: function() {
            if(!this.showSignBox) {
                this.closeNfc = true;
                window.biokey.remove("verifyResult", this.verifyResultHandle);
                console.log("等待学生打卡已关闭，结束nfc和指纹");
            }
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    },
    mounted () {
        window.biokey.dispose();//卸载指纹阅读器
        this.init();
        this.nfcFlag = window.NFC.init();
        if(this.nfcFlag) {
			nfcObject.EstablishContext();
        }
        console.log("NFC",this.nfcFlag);
        this.getFingerData();
        //初始化指纹
        this.biokeyFlag = window.biokey.init();
        if (!this.biokeyFlag) return;
        // window.addEventListener('message', this.receivedMsg);
    },
    destroyed() {
        window.biokey.remove("verifyResult", this.verifyResultHandle);
    },
    methods: {
        init() {
            this.startDatetime = this.$tools.formatDate(new Date().getTime()/1000 - 6*60*60*24,'yyyy-MM-dd');
            this.endDatetime = this.$tools.formatDate(new Date().getTime()/1000,'yyyy-MM-dd');
            this.search="";
            this.sort="";
            this.order="";
            this.page_current=1;
            this.page_size=10;
            this.total_page=0;
            this.qryType = 10;
            //执行查询
            this.searchChange();
        },
        //限制充值、退款输入数值的小数点后的位数
        limitNum() {
            if(this.moneyInfo.operMoney == undefined) {
                this.moneyInfo.operMoney = 0;
            }
            if(this.moneyInfo.operMoney > 100000) {
                this.moneyInfo.operMoney = 0;
            }
            this.moneyInfo.operMoney = this.moneyInfo.operMoney.toFixed(2);
        },

        //充值、退款按钮
        rechargeBtn() {
            // this.times = 0;
            console.log("指纹和NFC：",this.biokeyFlag,this.nfcFlag)
            if(!this.biokeyFlag && !this.nfcFlag) {
                this.$message.error("您的浏览器不支持该功能，请安装好驱动后使用IE浏览器进行操作！")
                return;
            }
            // if(!this.nfcFlag){
            //     this.$message.error("您的浏览器不支持NFC阅读组件，请安装好驱动后使用IE浏览器进行操作！");
            //     return;
            // }
            var m = document.querySelector("#box .el-dialog__header");
            m.style.background = "#fff";
            this.box = true;
            this.boxTitle = '';
            this.boxWidth = "300px";
            this.showSignBox = true;
            this.showMoneyBox = false;
        },
        onVerifyFinger(FingerID) {
            if (FingerID <= 0) {
                this.$message.error("未找到匹配的指纹信息，请重按手指！");
                return;
            }
            console.log("指纹id",FingerID);
            //获取学生信息
            this.$http.post("/MoneyLog/balance  ", {
                    entry_id: FingerID,
                    token: localStorage.jxtoken
                },{showLoading:false})
                .then(res => {
                    this.moneyInfo.id = res.data.id;
                    this.moneyInfo.name = res.data.name;
                    this.moneyInfo.money = res.data.money;
                    this.moneyInfo.class_name = res.data.class_name;
                    this.moneyInfo.operMoney = 0;
                    this.moneyInfo.ps = "";
                    this.showSignBox = false;
                    this.showMoneyBox = true;
                    this.styleChange();
                })
                .catch(res => {
                    this.$message.error(res.info);
                });
        },
        //获取指纹
        getFingerData() {
        //调用接口获取全部指纹
        //this.$message.info('加载中...');
            this.$http.post("/MoneyLog/entry", {
                token: localStorage.jxtoken
            })
            .then(res => {
            // this.sendMsg({ code: "fp_add", data: res.data });
                for (let i = 0; i < res.data.length; i++) {
                    window.biokey.addTemplateStr(
                    parseInt(res.data[i].entry_id),
                    res.data[i].entry_list
                    );
                }
            })
            .catch(res => {
                this.$message.error(res.info);
            });
        },
        //读取nfc
        readNfc() {
            // if(this.times++ > 15) {
            //     this.$message.info("未检测到NFC卡，请重新刷卡！");
            //     this.times = 0;
            //     return;
            // }
            //弹框关闭结束打卡
            this.nfc_code = "";
			if(this.closeNfc) {
				console.log("结束读卡。。。。。。");
				return;
			}
            setTimeout(() => {
                this.nfc_code = window.NFC.read();
                if(this.nfc_code == 6) {
                    this.readNfc();
                } else {
                    // this.times = 0;
                    console.log("卡号：",this.nfc_code);
                     //获取学生信息
                    this.$http.post('/MoneyLog/checkuser', {
                        nfc_code: this.nfc_code,
                        token:localStorage.jxtoken
                    },{showLoading:false}).then((ret) => {
                        //通过ID获得学生余额信息
                        this.$http.post('/MoneyLog/balance  ', {
                            id:ret.data.id,
                            token:localStorage.jxtoken
                        },{showLoading:false}).then((res) => {
                            this.moneyInfo.id = res.data.id;
                            this.moneyInfo.name = res.data.name;
                            this.moneyInfo.money = res.data.money;
                            this.moneyInfo.class_name = res.data.class_name;
                            this.moneyInfo.operMoney = 0;
                            this.moneyInfo.ps="";
                            this.styleChange();
                        }).catch(res=>{
                            //this.$message.error(res.info);
                            this.$message.error("未找到匹配的NFC学生信息，请重新刷卡！");
                            this.readNfc();
                        });
                    }).catch(res=>{
                        //this.$message.error(res.info);
                        this.$message.error("未找到匹配的NFC信息，请重新刷卡！");
                        this.readNfc();
                    });
                }
            },2000)
        },
        //充值信息样式改变
        styleChange() {
            this.boxTitle = "充值信息";
            this.boxWidth = "400px";
            var m = document.querySelector("#box .el-dialog__header");
            m.style.background = "#41cac0";
            this.showSignBox = false;
            this.showMoneyBox = true;
        },
        //时间改变
        startDatetimeChange() {
            console.log(this.startDatetime);
            if(this.endDatetime=="" || this.endDatetime==null)return;
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('开始日期不能大于结束日期！');
                this.startDatetime = this.endDatetime;
            }
        },
        endDatetimeChange() {
            if(this.startDatetime=="" || this.startDatetime==null)return;
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyyMMdd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyyMMdd")
            if(start>end){
                this.$message.error('结束日期不能小于开始日期！');
                this.startDatetime = this.endDatetime;
            }
        },
        getSchoolUsername () {
            // 测试
            this.moneyInfo = {
                name: '小名',
                grade: '三年二班',
                endMoney: 25.09,
                selectType: '1',
                money: 0.01,
                text: 'hhh',
            }
        },
        sortChange({ column, prop, order }) {
            this.sort = column.property
            if(column.order == 'ascending') {
                this.order = 'asc'
            }else if(column.order == 'descending') {
                this.order = 'desc'
            }
            this.searchChange();
        },
        pageChange(current) {
            this.page_current = current
            this.searchChange()
        },
        searchChange() {
            this.$http.post('/MoneyLog/index', {
                sort: this.sort,
                order: this.order,
                page_number: this.page_current,
                page_size: this.page_size,
                token:localStorage.jxtoken,
                start_date:this.$tools.formatDate(this.startDatetime.toString(),"yyyy-MM-dd"),
                end_date:this.$tools.formatDate(this.endDatetime.toString(),"yyyy-MM-dd"),
                search:this.search,
                operation_type:this.qryType
            })
            .then((res) => {
                console.log(res)
                if(res.data.rows) {
                    res.data.rows.forEach(e => {
                    e.operation_time = this.$tools.formatDate(e.operation_time,"yyyy-MM-dd hh:mm:ss");
                    });
                    res.data.rows.forEach(e=>{
                    	if(e.operation_type==0){
                    		e.operation_type = "退款";
                    		e.operation_money = "-" + e.operation_money;
                    	}else if(e.operation_type==1){
                    		e.operation_type = "充值";
                    	}
                    });
                    this.tableData = res.data.rows;
                    this.total_page = parseInt(res.data.page.total);
                }else {
                    this.page_number = 1
                    this.total_page = 1
                    this.tableData = []
                }
            })
            .catch(res=>{
                this.$message.error(res.info);
            })
        },
        handleSignBoxOpen(){
            // this.times = 0;
            this.closeNfc = false;
            if(this.nfcFlag)this.readNfc();
            this.verifyResultHandle = window.biokey.on(
                "verifyResult",
                this.onVerifyFinger
            );
        },
        handleSignBoxClose () {
            this.closeNfc = true;
            window.biokey.remove("verifyResult", this.verifyResultHandle);
            setTimeout(() => {
                this.showSignBox = false;
            },50);
        },
        //显示确认该操作弹框
        confirmRecharge () {
            if(this.moneyInfo.selectType == 1) {
                this.title = "充值";
            }else if(this.moneyInfo.selectType == 0) {
                this.title = "退款";
            }
            this.dialogFormVisibleRecharge = true;
        },
        // 确认充值信息
        handleMoney () {
            console.log('充值信息', this.moneyInfo);
            let psRule = /^.{0,20}$/;
            if(!psRule.test(this.moneyInfo.ps)) {
                this.$message.error("最大长度为20个字符");
                return;
            }
            this.$http.post('/MoneyLog/editbalance', {
                token:localStorage.jxtoken,
                id:this.moneyInfo.id,
                operation_type:this.moneyInfo.selectType,
                operation_money:this.moneyInfo.operMoney,
                ps:this.moneyInfo.ps
            }).then((res) => {
                if(this.moneyInfo.selectType==1){
                    this.$message.success("恭喜您，充值成功！");
                }else if(this.moneyInfo.selectType==0)
                {
                    this.$message.success("恭喜您，退款成功！");
                }
                this.init();
                this.box = false;
                this.showSignBox = false;
                this.showMoneyBox = false;
                this.dialogFormVisibleRecharge = false;
            }).catch(res=>{
                    this.$message.error(res.info);
                })
        },
        // 打开充值界面
        handleShowMoneyBox () {
            // setTimeout(() => {
               
            //     setTimeout(() => {
            //         this.getSchoolUsername()
            //     }, 1000)
            // }, 2000)
        },
        //充值扣款导出
        exportFn() {
            var start = this.$tools.formatDate(this.startDatetime.toString(),"yyyy-MM-dd");
            var end = this.$tools.formatDate(this.endDatetime.toString(),"yyyy-MM-dd")
            this.$tools.exportFile('/MoneyLog/export', {
                start_date:start,
                end_date:end,
                search:this.search,
                operation_type:this.qryType,
                token:localStorage.jxtoken
            },{type: 'get'});
            // window.open(config.BASEURL+"/MoneyLog/export?token="+localStorage.jxtoken+"&start_date="+
            // this.startDatetime+"&end_date="+this.endDatetime+"&search="+this.search);
        }
    }
}
</script>

<style lang="less">
.money-form-box {
    .el-form-item {
        margin-bottom: 0px;
    }
}
.waiting {
    text-align: center;
}
</style>
