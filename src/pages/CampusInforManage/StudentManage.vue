<template>
    <div>
        <I-table
        title="学生管理"
		:isUpdate="true"
		@update="refresh"
        >
            <template slot="head">
            	<el-input v-model="search" size="medium" placeholder="姓名/手机号" style="width:200px;"></el-input>
                <el-button size="medium" type="primary" @click="searchbtn">查询</el-button>
                <div class="right">
                    <el-button size="medium" type="success" class="confirm addbtn" @click="addbtn">新增</el-button>
                    <el-button size="medium" type="success" class="confirm addbtn" @click="importbtn" >批量导入</el-button>
                    <!-- <el-button size="medium" type="primary" @click="refresh">刷新</el-button> -->
                </div>
                <div class="choose">
                	<div class="choose_sub" id="gradeBox">
						<span class="choose_title">所在年级：</span>
						<ul class="gradeUl">
							<li @click="getClass(item.id, $event)" class="gradeLi" v-for="(item,index) in this.gradeData" :key="index">{{item.grade}}</li>
						</ul>
						<div class="choose_more" id="gradeMore" v-if="isShowGrade" @click="more('gradeUl',$event)"  onselectstart="return false;"><span>更多</span><i class="el-icon-arrow-down"></i></div>
						<div class="clear"></div>
					</div>
					<div class="choose_sub" id="classBox">
						<span class="choose_title">所在班级：</span>
						<ul class="classUl">
							<li @click="getStudents(item.class,item.student_number, item.class_teacher_name, $event)" v-for="(item, index) in classData" class="classLi" :key="index">{{item.class}}</li>
						</ul>
						<div class="choose_more" id="classMore" v-if="isShowClass" @click="more('classUl',$event)" onselectstart="return false;"><span>更多</span><i class="el-icon-arrow-down"></i></div>
						<div class="clear"></div>
					</div>
                	<div class="choose_sub">
                		<span class="choose_title">班主任：</span>
                		<ul>
                			<li>{{classTeacher}}</li>
                		</ul>
                		<div class="clear"></div>
                	</div>
                	<div class="choose_sub choose_last">
                		<span class="choose_title">班级人数：</span>
                		<ul>
                			<li>{{student_number}}</li>
                		</ul>
                		<div class="clear"></div>
                	</div>
                </div>
            </template>
            <template slot="content" slot-scope="props">
                    <el-table
                    border
                    :height="props.maxHeight"
                    style="width: 100%;"
                    row-class-name="table-row"
                    :data="tableData"
                    @sort-change="sortChange"
                    @selection-change="changeFun">
                        <el-table-column
                        prop="name"
                        label="姓名"></el-table-column>
                        <el-table-column
                        prop="sex_name"
                        label="性别"></el-table-column>
                        <el-table-column
                        prop="nation"
                        label="民族"></el-table-column>
                        <el-table-column
                        prop="grade"
                        label="所在年级"></el-table-column>
                        <el-table-column
                        prop="class_no"
                        label="所在班级"></el-table-column>
                        <el-table-column
                        prop="student_no"
                        label="学号"
                        width="100"></el-table-column>
						<el-table-column
                        prop="building_no"
                        label="楼栋"></el-table-column>
						<el-table-column
                        prop="floor"
                        label="楼层"></el-table-column>
                        <el-table-column
                        prop="dormitory_no"
                        label="宿舍号"></el-table-column>
                        <el-table-column
                        prop="parent_name"
                        label="家长姓名"></el-table-column>
                        <el-table-column
                        prop="parent_phone"
                        label="家长电话"
                        width="100"></el-table-column>
                        <el-table-column
                        prop="address"
                        label="住址"
                        width="260"></el-table-column>
                        <el-table-column
                        prop="money"
                        label="当前余额"></el-table-column>
                        <el-table-column
                        label="操作"
                        width="200"
                        >
	                        <template slot-scope="scope">
								<el-button  type="text" size="small" @click="editshow(scope.row)">编辑</el-button>
								<el-button  type="text" size="small" @click="addFinger(scope.row)">录入指纹</el-button>
								<el-button  type="text" size="small" @click="deletebtn(scope.row)">删除</el-button>
								<el-button  type="text" size="small"  @click="showNFC(scope.row)">NFC设置</el-button>
	                        </template>
                        </el-table-column>
                    </el-table>
                	<!--新增学生-->
                	<I-table-editor v-model="dialogFormVisibleAdd" 
                	:title="title">
	                   <template slot="content">
	                   		<el-form :inline="true" :model="formInline" class="demo-form-inline">
							  <el-form-item label="姓 名:" :label-width="formLabelWidth" class="margin_bottom">
							    <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
							  </el-form-item>
							  <el-form-item label="民族:" :label-width="formLabelWidth" class="margin_bottom">
							    <el-select v-model="formInline.nation" placeholder="请选择民族" filterable>
							      <el-option v-for="(item,index) in nations" :label="item" :value="item" :key="index"></el-option>
							    </el-select>
							  </el-form-item>
							  <el-form-item label="性 别:" :label-width="formLabelWidth" class="radio_gender">
							    <el-radio-group v-model="formInline.sex" @change="getData">
							      <el-radio label="1">男</el-radio>
							      <el-radio label="2">女</el-radio>
							    </el-radio-group>
							  </el-form-item><br />
							  <el-form-item label="所在年级:" :label-width="formLabelWidth">
							    <el-select v-model="formInline.grade_id" placeholder="请选择年级" @change="gradeChange" filterable>
							      <el-option v-for="(item,index) in gradeData" :label="item.grade" :value="item.id" :key="index"></el-option>
							    </el-select>
							  </el-form-item>
							  <el-form-item label="所在班级:" :label-width="formLabelWidth">
							    <el-select v-model="formInline.class_id"  placeholder="请选择班级" filterable>
							      <el-option v-for="(item,key) in classDataS" :label="item" :value="key" :key="key"></el-option>
							    </el-select>
							  </el-form-item>
							  <el-form-item label="学 号:" :label-width="formLabelWidth">
							    <el-input v-model="formInline.student_no" placeholder="请输入学号"></el-input>
							  </el-form-item>
							  <el-form-item label="楼栋:" :label-width="formLabelWidth">
							    <el-select v-model="formInline.building_no" @change="getFloor" placeholder="请选择楼栋" clearable>
									<el-option v-for="(item,key) in buildingData" :label="key" :value="key" :key="key"></el-option>
								</el-select>
							  </el-form-item>
							  <el-form-item label="楼层:" :label-width="formLabelWidth">
							    <el-select v-model="formInline.floor" @change="getDormitory" placeholder="请选择楼层" clearable>
									<el-option v-for="(item,key) in floorData" :label="key" :value="key" :key="key"></el-option>
								</el-select>
							  </el-form-item>
							  <el-form-item label="宿舍号:" :label-width="formLabelWidth">
							    <el-select v-model="formInline.dormitory_no" placeholder="请选择宿舍号" clearable>
									<el-option v-for="item in dormitoryData" :label="item" :key="item" :value="item"></el-option>
								</el-select>
							  </el-form-item>
							  <el-form-item label="家长姓名:" :label-width="formLabelWidth">
							    <el-input v-model="formInline.parent_name" placeholder="请输入家长姓名"></el-input>
							  </el-form-item>
							  <el-form-item label="家长手机号:" :label-width="formLabelWidth">
							    <el-input v-model="formInline.parent_phone" placeholder="请输入家长手机号"></el-input>
							  </el-form-item>
							  <el-form-item label="住 址:" :label-width="formLabelWidth">
							    <el-input v-model="formInline.address" class="addrInput" style="width: 170%;" placeholder="请输入住址"></el-input>
							  </el-form-item>
							</el-form>
	                    </template>
	                    <template slot="foot">
	                        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
	                        <el-button v-if="isAdd == true" class="confirm" type="success"
	                        @click="addStudent">确 定</el-button>
	                        <el-button v-if="isAdd == false" class="confirm" type="success"
	                        @click="addStudent">确 定</el-button>
	                    </template>
                	</I-table-editor>
            		<!--批量导入-->
            		<I-table-editor v-model="dialogFormVisibleImport" 
	                title="批量导入" width="500px">
	                    <template slot="content">
							<div class="downLoad_text">
								 <el-button size="small" type="primary" class="download" @click="btnLoad"><a :href="downloadUrl"
	                        >下载模板</a></el-button>
							</div>
	                       
	                        <el-upload
							  class="upload-demo"
							  :action="uploadUrl"
							  name="uploadFile"
							  :show-file-list="showFileList"
							  :on-success="upSuccess"
							  :before-upload="handleCheck"
							  :file-list="fileList"
							  >
							  <el-button size="small" type="primary">点击上传</el-button>
							</el-upload>
	                    </template>
	                </I-table-editor>
            		<!-- NFC设置 -->
                    <I-table-editor v-model="dialogFormVisibleNFC" 
                	title="NFC设置" width="500px" @dialogVisibleClose="dialogClose">
	                    <template slot="content">
	                        <div class="NFCbox">
	                            <el-button class="addNFCbtn confirm" v-if="!hasNFC" :disabled="sendFlag" type="success" @click="btnClickForAddNFC">绑定NFC</el-button><br/>
	                            <el-button class="lossNFCbtn" v-if="hasNFC"  @click="btnClickForDelNFC">注销NFC</el-button>
	                        </div>
	                    </template>
                	</I-table-editor>
					<!--指纹管理-->
                    <I-table-editor class="teacherBox"  v-model="dialogFormVisibleFinger" title="录入指纹" width="660px" @dialogVisibleClose="stopBiokeyReg">
                         <template slot="content">
                             <table  style="width:100%; vertical-align: middle;"  >
                                <tr style="vertical-align: middle;">
                                    <td v-for="(item, index)  in fingerData"  :key="index" style="vertical-align: middle;">
                                        <div class="fingerBox">
                                            <span v-if="item.value==''" @click="btnClickForAddFinger(item)">+</span>
                                            <img  class="hasFingerImg" v-if="item.value!=''" src="/static/imgs/hasfinger.png">
                                            <div  class="hasFingerDel" v-if="item.value!=''" :disabled="!biokeyFlag" @click="btnClickForDelFinger(item)">×</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="5" style="text-align:center;"><img src="/static/imgs/lefthand.png" ></td>
                                    <td colspan="5" style="text-align:center;"><img src="/static/imgs/righthand.png" ></td>
                                </tr>
                             </table>
                             <div class="noticeForAddFinger" v-if="noticeForAddFingerVisible" >
                                <img :src="noticeForAddFingerSrc">
                                <el-button type="success" id="cancel" @click="btnClickForAddFingerCancel">取 消</el-button>
                             </div>
	                    </template>
                    </I-table-editor>
                    <!--删除-->
            		<I-table-editor v-model="dialogFormVisibleDelete" 
	                title="删除" width="500px">
	                    <template slot="content">
	                        <span>是否确定删除？</span>
	                    </template>
	                    <template slot="foot">
	                        <el-button 
	                        @click="dialogFormVisibleDelete = false">取 消</el-button>
	                        <el-button type="success" class="confirm"
	                        @click="deleteconfirm">确 定</el-button>
	                    </template>
	                </I-table-editor>
					<!-- 批量导入的错误信息 -->
					<I-table-editor v-model="dialogShowErrorMsg" 
	                title="错误信息" width="500px">
	                    <template slot="content">
	                        <div v-html="errorMessage"></div>
	                    </template>
	                </I-table-editor>
            </template>
            <template slot="foot">
                <I-table-page
                :total="total_page"
                @change="pageChange"></I-table-page>
            </template>
        </I-table>
    </div>
    
</template>

<script>
import { ITable, ITablePage, ITableEditor } from '@/components/Table/'
import config from '@/config.js'
export default {
    data() {
        return {
			uploadUrl:config.BASEURL+"/Students/import?token="+localStorage.jxtoken,
			downloadUrl:config.BASEURL+"/Public/students_import.xlsx",
			showFileList:true,
			fileList:[],
        	page_number:1,
        	sort:"",
        	order:"",
        	page_size:10,
        	deleteId:"",//删除
        	search:"",
        	gradeId:"",
        	grade_first_id:"",
        	classId:"",
        	class_first_id:"",
        	class_no:"",//班级序号
			title:"",//新增和编辑标题
			buildingData:"",//楼栋数据
			buildingDataB:"",//男生宿舍数据
			buildingDataG:"",//女生宿舍数据
			floorData:"",//楼层数据
			dormitoryData:"",//宿舍数据
        	flagCheck:true,//是否是第一次进入页面
        	gradeData:{},
        	classData:{},
        	classDataS:{},//下拉选择班级的数据
        	classTeacher:"",//班主任
        	student_number:"",//班级人数
        	headmasterData:[{vlaue:1,name:'张三'}],
        	totalData:[{vlaue:1,name:'60'}],
        	flag:true,
        	gradeHeight:0,//所在年级div高度
        	classHeight:0,//所在班级div高度
        	isShowClass:false,
        	isShowGrade:false,
			errorMessage:"",
			dialogShowErrorMsg:false,
            dialogFormVisibleAdd: false,
            dialogFormVisibleDelete: false,
            dialogFormVisibleNFC:false,
            dialogFormVisibleAddNFC:false,
            dialogFormVisibleLossNFC:false,
            dialogFormVisibleDetail:false,
            dialogFormVisibleImport:false,
            multipleSelection:[], //选中的数据
            formLabelWidth: '100px',
            isAdd:true,
            ids:[],//删除
            nations: ["汉族","蒙古族","回族","藏族","维吾尔族","苗族","彝族","壮族","布依族","朝鲜族","满族","侗族","瑶族","白族","土家族",  
               "哈尼族","哈萨克族","傣族","黎族","傈僳族","佤族","畲族","高山族","拉祜族","水族","东乡族","纳西族","景颇族","柯尔克孜族",  
               "土族","达斡尔族","仫佬族","羌族","布朗族","撒拉族","毛南族","仡佬族","锡伯族","阿昌族","普米族","塔吉克族","怒族", "乌孜别克族",  
              "俄罗斯族","鄂温克族","德昂族","保安族","裕固族","京族","塔塔尔族","独龙族","鄂伦春族","赫哲族","门巴族","珞巴族","基诺族"],
            //搜索参数
            type:"",
            number:"",
            total_page:0,
          	//编辑添加参数
            formInline: {
                id:"",
                name:"",
                sex:"",
                sex_name:"",
                nation:"",
                grade_id:"",
                class_id:"",
                class_no:"",
                student_no:"",
				building_no:"",
				floor:"",
                dormitory_no:"",
                parent_name:"",
                parent_phone:"",
                address:"",
                money:""
            },
            //获取的数据
            tableData: [
			],
			/************* add by xing.wei ************ */
			entryId:{},                         //指纹ID
			fingerType:"",//手指类型
			dialogFormVisibleFinger:false,      //指纹管理界面
            watiForOperID:0,                    //教职工ID
            watiForOperNFCCode:"",              //教职工NFC编码
            noticeForAddFingerVisible:false,           //显示录入指纹步骤
            noticeForAddFingerSrc:"/static/imgs/finger_01.png",
            noticeForAddFingerSrc1:"/static/imgs/finger_01.png",
            noticeForAddFingerSrc2:"/static/imgs/finger_02.png",
            noticeForAddFingerSrc3:"/static/imgs/finger_03.png",
            noticeForAddFingerSrc4:"/static/imgs/finger_04.png",
            fmc:null,
            fmd:null,
            biokeyFlag:false,       //biokey是否加载完毕
            regFingerCount:3,
            regFingerStep:1,
            waitForOperItem:{}, //等待操作的教职工信息   
			hasNFC:false,
            fingerData:[
                {label:"l-5",value:""},
                {label:"l-4",value:""},
                {label:"l-3",value:""},
                {label:"l-2",value:""},
                {label:"l-1",value:""},
                {label:"r-1",value:""},
                {label:"r-2",value:""},
                {label:"r-3",value:""},
                {label:"r-4",value:""},
                {label:"r-5",value:""},
			],
			//nfc
			nfcFlag: false,//nfc是否加载完毕
			times: 0,
			nfc_code:"",
			closeNfc: false,//结束打卡
			//指纹
            regStepHandle:"",
            regResultHandle:"",
			sendFlag: false,
        };
    },
    mounted() {
		this.getGrade();
		this.getBuilding();
		this.nfcFlag = window.NFC.init();
        if(this.nfcFlag) {
			nfcObject.EstablishContext();
		}
	    //初始化指纹
        this.biokeyFlag = window.biokey.init();
        console.log("初始化",this.biokeyFlag)
        if (!this.biokeyFlag) return;
    },
    methods: {
    	//刷新
    	refresh() {
   			this.search = "";
    		this.req();
    	},
    	searchbtn() {
			this.page_number = 1;
        	this.req();
        },
    	req() {
    		this.$http.post("/Students/index",{
    			token: localStorage.jxtoken,
    			page_size: this.page_size,
    			page_number: this.page_number,
    			sort: this.sort,
    			order: this.order,
    			grade_id: this.gradeId,
    			class_no: this.class_no,
    			search: this.search
    		})
    		.then(res => {
				console.log("学生列表数据",res);
				if(this.page_number > 1) {
                    if(!res.data) {
                        this.page_number = this.page_number - 1
                        this.req()
                    }
                }
    			this.tableData = res.data.rows;
				this.student_number = res.data.page.total;
    			this.total_page = parseInt(res.data.page.total)
    		})
    		.catch(res => {
    			this.$message.error(res.info);
    		})
    		
    	},
    	//获取年级
		getGrade() {
			this.$http.post("/SchoolGrade/lists", {
					token: localStorage.jxtoken,
					page_size:999999,
					page_number:1
				})
				.then(res => {
					this.gradeData = res.data.row;
					console.log("年级列表信息", this.gradeData);
					this.$nextTick(function() {
						this.getWidth('.gradeUl', '.gradeLi');
						document.querySelectorAll('.gradeLi')[0].click();
					});

				}).catch(res => {
					this.$message.error(res.info);
				})
		},
		//获取班级
		getClass(grade_id, e) {
			this.tableData = [];
            this.classTeacher = '';
            this.student_number = '';
			this.chooseLi('grade', e);
			this.gradeId = grade_id;
			document.getElementById("classBox").style.height = "36px";
			
			this.$http.post("/SchoolClass/lists", {
					token: localStorage.jxtoken,
					page_size:999999,
					page_number:1
				}).then(res => {
					var data = res.data.row, obj = [];
					console.log("班级",data)
					for(let i = 0; i < data.length; i++) {
						if(data[i].grade_id == this.gradeId) {
							obj.push(data[i]);
						}
					}
					this.classData = obj;
					console.log('点击年级获取班级数据',this.classData);
					if(this.classData.length == 0) {
						this.isShowClass = false;
					}
					this.classTeacher = obj[0].class_teacher_name;
					//this.student_number = obj[0].student_number;
					this.$nextTick(function() {
						this.getWidth('.classUl', '.classLi');
						document.querySelectorAll('.classLi')[0].click();
					});
				})
				.catch(res => {
					this.$message.error(res.info);
				})
				
		},
		getStudents(class_name,number, teacher, e) {
			this.chooseLi('class', e);
			this.classTeacher = teacher ? teacher :'';
			//this.student_number = number ? number :'';
			this.class_no = class_name;
			this.req();
		},
		chooseLi(type, e) {
			for(let i = 0; i < document.querySelectorAll('.' + type + 'Li').length; i++) {
				document.querySelectorAll('.' + type + 'Li')[i].className = type + 'Li';
			}
			e.target.className = type + 'Li on';
		},
		//批量导入
		importbtn() {
			this.dialogFormVisibleImport = true;
			this.showFileList = true;
			this.fileList = [];
		},
		//下载模板
		btnLoad() {
			location.href = this.downloadUrl;
		},
		//上传文件之前检查文件后缀名
		handleCheck(file) {
			const name = file.name.split(".")[1];
			if(name != "xlsx") {
				this.$message.error("只能上传后缀名为xlsx的文件");
				return false;
			}
		},
    	//上传成功
    	upSuccess(res) {
			//console.log("点击上传",res);
			if(res.status) {
				this.$message.success(res.info);
				this.req();
			} else {
				this.dialogShowErrorMsg = true;
				this.errorMessage = res.info;
				console.log(this.errorMessage)
			}
			this.dialogFormVisibleImport = false;
			this.showFileList = false;
		},
        //年级改变时，对应的班级改变
        gradeChange(class_no) {
			this.formInline.class_id = "";
        	this.$http.post("/SchoolClass/lists",{
        		token: localStorage.jxtoken,
        		page_size:999999,
        		page_number:1
        	})
        	.then(res => {
        		let gradeId = this.formInline.grade_id;
        		let data = res.data.row,obj = {};
        		for(let i = 0; i < data.length; i ++) {
        			if(data[i].grade_id == gradeId) {
        				obj[data[i].id] = data[i].class;
        			}
        		}
        		this.classDataS = obj;
        		for(var i in this.classDataS) {
        			if(class_no == this.classDataS[i]) {
						this.formInline.class_id = i;
						break;
        			} 
        		}
        		//console.log("班级id对应数据",this.classDataS);
        	})
        	.catch(res => {
        		this.$message.error(res.info);
        	})
        },
    	sortChange({ column, prop, order }) {
            console.log('sortChange', column, prop, order);
        },
        pageChange(current) {
            this.page_number = current
            this.req()
        },
        changeFun(val) {
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },
        //新增
        addbtn() {
            this.formInline = {
            	name:"",
            	sex:"",
                sex_name:"",
                nation:"",
                grade_id:"",
				class_id:"",
				building_no:"",
				floor:"",
                dormitory_no:"",
                parent_name:"",
                student_no:"",
                parent_phone:"",
                address:"",
                money:""
			}
			this.buildingData = {};
			this.floorData = {};
			this.dormitoryData = [];
			this.title = "新增学生";
            this.isAdd = true;
            this.dialogFormVisibleAdd = true;
		},
		//性别改变,宿舍数据改变
		getData(val) {
			this.formInline.building_no = "";
			this.formInline.floor = "";
			this.formInline.dormitory_no = "";
			this.floorData = {};
			this.dormitoryData = [];
			if(val == 1) {
				this.buildingData = this.buildingDataB;
			}
			if(val == 2) {
				this.buildingData = this.buildingDataG;
			}
		},
		//获取楼栋数据
		getBuilding(flag) {
			this.floorData = {};
			this.dormitoryData = [];
			this.$http.post("/Students/dorm_choice",{
				token: localStorage.jxtoken,
				page_size: 999
			})
			.then(res => {
				console.log("宿舍数据",res.data);
				var datas = res.data,arr = [];
				var t1 = {}, t2 = {};
				for (var i in datas) {
					var data = datas[i];
					if(data.is_status == 1) {
						if(data.sex == 1) {//男宿舍
							if (t1[data.building_no]) {
								if (t1[data.building_no][data.floor]) {
									t1[data.building_no][data.floor].push(data.dormitory_no);
								} else{
									t1[data.building_no][data.floor] = [data.dormitory_no];
								}
							} else{
								var f = {};
								f[data.floor] = [data.dormitory_no]
								t1[data.building_no] = f
							}
						} else if(data.sex == 2) {//女宿舍
							if (t2[data.building_no]) {
								if (t2[data.building_no][data.floor]) {
									t2[data.building_no][data.floor].push(data.dormitory_no);
								} else{
									t2[data.building_no][data.floor] = [data.dormitory_no];
								}
							} else{
								var f = {};
								f[data.floor] = [data.dormitory_no]
								t2[data.building_no] = f
							}
						}
					}
				}
				this.buildingDataB = t1;
				this.buildingDataG = t2;
				console.log("楼栋数据男",this.buildingDataB);
				console.log("楼栋数据女",this.buildingDataG);
				//this.buildingData = t;
				if(flag) {
					var num1 = this.formInline.building_no;
					var num2 = this.formInline.floor;
					this.floorData = this.buildingData[num1];
					this.dormitoryData = this.buildingData[num1][num2];
				}
			})
			.catch(res => {
				this.$message.error(res.info);
			})
		},
		//获取楼层数据
		getFloor() {
			var num = this.formInline.building_no;
			this.formInline.floor = "";
			this.formInline.dormitory_no = "";
			this.dormitoryData = [];
			this.floorData = this.buildingData[num];
			//console.log(this.formInline.building_no);
		},
		//获取宿舍数据
		getDormitory() {
			this.formInline.dormitory_no = "";
			var num1 = this.formInline.building_no;
			var num2 = this.formInline.floor;
			this.dormitoryData = this.buildingData[num1][num2];
		},
        //确认新增和编辑
        addStudent() {
			let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
			let cnName = /^[\u4E00-\u9FA5]{2,20}$/;
			let enName = /^[A-Za-z]{2,20}$/;
			let studentNO = /^[0-9]{1,15}$/;
			let address = /^[0-9a-zA-Z\u4E00-\u9FA5]{2,50}$/;
        	if(this.formInline.name.trim() == ""){
        		this.$message.error('请输入姓名!'); 
        		return;
			}
			if(!cnName.test(this.formInline.name) && !enName.test(this.formInline.name)) {
				this.$message.error('姓名应为汉字或字母且长度为2到20个字符！'); 
        		return;
			}
        	if(this.formInline.nation == ""){
        		this.$message.error('请选择民族!'); 
        		return;
        	}
        	if(this.formInline.sex == ""){
        		this.$message.error('请选择性别!'); 
        		return;
        	}
        	if(this.formInline.grade_id == ""){
        		this.$message.error('请选择所在年级!'); 
        		return;
        	}
        	if(this.formInline.class_id == ""){
        		this.$message.error('请选择所在班级!'); 
        		return;
        	}
        	if(this.formInline.student_no.trim() == ""){
        		this.$message.error('请输入学号!'); 
        		return;
			}
			if(!studentNO.test(this.formInline.student_no)) {
				this.$message.error('学号应为数字且长度不超过15个字符!'); 
        		return;
			}
			if(this.formInline.building_no && !this.formInline.floor && !this.formInline.dormitory_no) {
				this.$message.error("请选择楼层和宿舍号！");
				return;
			}
			if(this.formInline.building_no && this.formInline.floor && !this.formInline.dormitory_no) {
				this.$message.error("请选择宿舍号！");
				return;
			}
        	if(this.formInline.parent_name.trim() == ""){
        		this.$message.error('请输入家长姓名!'); 
        		return;
			}
			if(!cnName.test(this.formInline.parent_name) && !enName.test(this.formInline.parent_name)) {
				this.$message.error('家长姓名应为汉字或字母且长度为2到20个字符！'); 
        		return;
			}
        	if(this.formInline.parent_phone == "" || !mobile.test(this.formInline.parent_phone)){
        		this.$message.error('请输入正确的手机号码!'); 
        		return;
        	}
        	if(this.formInline.address.trim() == ""){
        		this.$message.error('请输入住址!'); 
        		return;
			}
			if(!address.test(this.formInline.address)) {
				this.$message.error('住址应为汉字、数字或字母且长度为2到50个字符！'); 
        		return;
			}
        	this.formInline.token = localStorage.jxtoken;
        	if(this.isAdd) {
        		this.$http.post("/Students/add",this.formInline)
        		.then(res => {
        			this.$message.success(res.info);
					this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        		.catch(res => {
        			this.$message.error(res.info);
        		})
        	} else {
        		this.$http.post("/Students/edit",this.formInline)
        		.then(res => {
        			this.$message.success(res.info);
        			this.dialogFormVisibleAdd = false;
        			this.req();
        		})
        	}
        },
        //编辑
        editshow(val) {
			this.title = "编辑学生";
			if(val.sex == 1) {
				this.buildingData = this.buildingDataB;
			}
			if(val.sex == 2) {
				this.buildingData = this.buildingDataG;
			}
			console.log("编辑学生信息",val)
			for (var key in this.formInline) {
				this.formInline[key] = val[key];
			}
			this.formInline.id = val.id;
			this.getBuilding(true);
			this.gradeChange(val.class_no);
			console.log('表单数据',this.formInline)
			this.isAdd = false;
			setTimeout(() => {
				this.dialogFormVisibleAdd = true;
			},50)
		
        },
        //显示删除窗口
        deletebtn(val) {
			console.log('删除信息',val);
			this.deleteId = val.id;
        	this.dialogFormVisibleDelete = true;
        },
         //确认删除
        deleteconfirm() {
        	console.log(this.deleteId);
        	this.$http.post("/Students/delete",{
        		token: localStorage.jxtoken,
        		id: this.deleteId
        	})
        	.then(res => {
        		this.$message.success(res.info);
				this.dialogFormVisibleDelete = false;
				this.req();
        	})
        	.catch(res => {
        		this.$message.error(res.info);
        	})
		},
        //更多
        more(type,e){
			//console.log("更多",type);
			console.log(e.target);
        	if(this.flag) {
        		if(type == "gradeUl") {
					document.getElementById("gradeBox").style.height = this.gradeHeight + "px";
					document.getElementById("gradeMore").innerHTML = '<span>收起</span><i class="el-icon-arrow-up">';
        		} else if(type == "classUl") {
					document.getElementById("classBox").style.height = this.classHeight + "px";
					document.getElementById("classMore").innerHTML = '<span>收起</span><i class="el-icon-arrow-up">';
        		}
        		this.flag = false;
        	} else {
				if(type == "gradeUl") {
					document.getElementById("gradeBox").style.height = "36px";
					document.getElementById("gradeMore").innerHTML = '<span>更多</span><i class="el-icon-arrow-down">';
        		} else if(type == "classUl") {
					document.getElementById("classBox").style.height = "36px";
					document.getElementById("classMore").innerHTML = '<span>更多</span><i class="el-icon-arrow-down">';
        		}
        		this.flag = true;
        	}
        },
        //获取宽度
        getWidth(ul,li) {
        	if(ul == ".gradeUl") {
        		var ulWidth = document.querySelector(ul).clientWidth;
	        	var liCount = document.querySelectorAll(li).length;
	        	var liWidth = 0;
	        	for(let i = 0; i < liCount; i++){
	        		liWidth = liWidth + document.querySelectorAll(li)[i].clientWidth
	        	}
	        	var num = Math.ceil(liWidth / ulWidth);
	        	this.gradeHeight = num * 36;
	        	if(num > 1) {
	        		this.isShowGrade = true;
	        	} else {
	        		this.isShowGrade = false;
	        	}
        	} else if(ul == ".classUl") {
        		var ulWidth = document.querySelector(ul).clientWidth;
	        	var liCount = document.querySelectorAll(li).length;
	        	var liWidth = 0;
	        	for(let i = 0; i < liCount; i++){
	        		liWidth = liWidth + document.querySelectorAll(li)[i].clientWidth
	        	}
	        	var num = Math.ceil(liWidth / ulWidth);
	        	this.classHeight = num * 36;
	        	if(num > 1) {
	        		this.isShowClass = true;
	        	} else {
	        		this.isShowClass = false;
	        	}
        	}
		},
		//录入指纹
        addFinger(item){
			if(!this.biokeyFlag){
                this.$message.error("您的浏览器不支持指纹阅读组件，请安装好驱动后使用IE浏览器进行操作！");
                return;
            }
            //alert("录入指纹:" + item.id);
            for(var k = 0; k < 10; k++) {
            	this.fingerData[k].value = "";
            }
            this.$http.post("/Students/list_entry",{
            	token: localStorage.jxtoken,
            	id:item.id
            },{showLoading:false})
            .then(res => {
            	//console.log(res.data);
            	var data = res.data;
            	for(let i = 0; i < 10; i ++) {
            		for(let j = 0; j < data.length; j ++) {
            			if(this.fingerData[i].label == data[j].type) {
            				this.fingerData[i].value = data[j].id;
            			}
            		}
            	}
            })
            .catch(res => {
            	this.$message.error(res.info);
            })
            this.watiForOperID =item.id;
            this.dialogFormVisibleFinger = true;
            this.noticeForAddFingerVisible = false;
		},
		//注册指纹步骤
        OnRegStep(AQuality) {
            this.regFingerStep++;
            switch (this.regFingerStep) {
                case 1:this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1; console.log("步骤",this.regFingerStep); break;
                case 2:this.noticeForAddFingerSrc = this.noticeForAddFingerSrc2; console.log("步骤",this.regFingerStep); break;
                case 3:this.noticeForAddFingerSrc = this.noticeForAddFingerSrc3; console.log("步骤",this.regFingerStep); break;
            }
        },
        //注册指纹结果
        OnRegResult(data) {
            if(!data.ActionResult){
                this.regFingerStep = 1;
                this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
                this.$message.error("获取指纹模板失败，请重新录入！");
                //继续，重新开启指纹录入
                window.biokey.startReg(3);
                return;
            }
            this.noticeForAddFingerSrc = this.noticeForAddFingerSrc4;
			//发起请求，入库指纹。
			this.$http.post("/Students/add_entry",{
				token: localStorage.jxtoken,
				id: this.watiForOperID,
				type: this.fingerType,
				entry_list: data.finger
			})
			.then(res => {
				//console.log("指纹ID",this.entryId);
				this.$message.success("添加成功");
				this.entryId[this.fingerType] = res.data.entry_id;
				this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
				this.noticeForAddFingerVisible = false;
				this.waitForOperItem.value = ".....";
				this.stopBiokeyReg();
			})
			.catch(res => {
				this.$message.error(res.info);
				//继续，重新开启指纹录入
				this.regFingerStep = 1;
				this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
				// this.btnClickForAddFinger(this.waitForOperItem);
				window.biokey.startReg(3);
			})
        },
        //删除指定的指纹ID
        btnClickForDelFinger(item){
            //alert("删除指纹:" + item.label);
            this.$http.post("/Students/del_entry",{
            	token: localStorage.jxtoken,
            	id: this.entryId[item.label] ? this.entryId[item.label] : item.value
            })
            .then(res => {
            	this.$message.success(res.info);
            	item.value = "";
            })
        },
        //添加指定的学生ID的指纹
        btnClickForAddFinger(item){
			if(!this.biokeyFlag){this.$message.error("指纹阅读器未正确加载，无法执行当前操作！");return;}
			this.regStepHandle = window.biokey.on(
                "regStep",
                this.OnRegStep
            );
            this.regResultHandle = window.biokey.on(
                "regResult",
                this.OnRegResult
            );
            this.fingerType = item.label;
            this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
            this.noticeForAddFingerVisible = true;
            this.regFingerStep=1;
			this.waitForOperItem = item;
			window.biokey.startReg(3);//开始注册指纹
        },
		//停止注册指纹，删除注册事件
        stopBiokeyReg() {
            window.biokey.stopReg();//停止注册指纹
            window.biokey.remove('regStep', this.regStepHandle);
            window.biokey.remove('regResult', this.regResultHandle);
            this.noticeForAddFingerSrc = this.noticeForAddFingerSrc1;
            this.regFingerStep=1;
        },
		dialogClose() {
			this.closeNfc = true;
        },
        //NFC设置界面开启
        showNFC(item){
			this.times = 0;
			this.closeNfc = false;
			if(!this.nfcFlag){
                this.$message.error("您的浏览器不支持NFC阅读组件，请安装好驱动后使用IE浏览器进行操作！");
                return;
            }
        	if(!item.nfc_code) { 
        		this.hasNFC = false;
        	} else {
        		this.hasNFC = true;
        	}
        	this.watiForOperID =item.id;
            this.watiForOperNFCCode = item.nfc_code;
			// this.sendMsg({code:"dialog_open",data:null});
            this.dialogFormVisibleNFC = true
		},
		//读取NFC
		readNfc() {
            if(this.times++ > 20) {
                this.$message.info("未检测到NFC卡，请重新绑定！");
				this.sendFlag = !this.sendFlag;
                this.times = 0;
                return;
			}
			//弹框关闭结束打卡
			if(this.closeNfc) {
				this.sendFlag = !this.sendFlag;
				console.log("结束打卡。。。。。。");
				return;
			}
            setTimeout(() => {
                this.nfc_code = window.NFC.read();
                if(this.nfc_code == 6) {
                   this.readNfc();
                } else {
					this.times = 0;
					console.log("卡号：",this.nfc_code);
					//发送绑定nfc请求
					this.$http.post("/Students/add_nfc",{
						token: localStorage.jxtoken,
						id: this.watiForOperID,
						nfc_code: this.nfc_code
					})
					.then(res => {
						this.$message.success(res.info);
						this.sendFlag = !this.sendFlag;
						this.dialogFormVisibleNFC = false;
						this.req();
					})
					.catch(res => {
						this.$message.error(res.info);
						this.sendFlag = !this.sendFlag;
						this.nfc_code = "";
					})
                }
            },500) 
		},
        //绑定NFC
        btnClickForAddNFC(){
			this.sendFlag = !this.sendFlag;
			this.readNfc();
			this.$message.info("NFC已开启，请刷卡！");
            //alert(this.watiForOperNFCCode);
        },
        //删除NFC
        btnClickForDelNFC(){
            //alert("删除：" + this.watiForOperNFCCode);
            this.$http.post("/Students/delete_nfc",{
            	token: localStorage.jxtoken,
            	id: this.watiForOperID
            })
            .then(res => {
            	this.$message.success(res.info);
            	this.dialogFormVisibleNFC = false;
            	this.req();
            })
            .catch(res => {
            	this.$message.error(res.info);
            })
        },
        //取消录入指纹
        btnClickForAddFingerCancel(){
            console.log("cancel");
            this.stopBiokeyReg();
            this.noticeForAddFingerVisible = false;
            this.fingerType = "";
            this.waitForOperItem = {};
        }
    },
    components: {
        ITable,
        ITablePage,
        ITableEditor,
    }
}
</script>
<style lang="less" scoped>
	.choose {
		width: 100%;
		font-size: 14px;
		border:1px solid #ddd;
		border-radius: 4px;
		margin-top: 20px;
		padding-left: 13px;
		padding-right: 20px;
		.choose_sub {
			height: 36px;
			line-height: 36px;
			overflow: hidden;
			border-bottom: 1px dashed #ddd;
			.choose_title,ul,ul>li {
				float: left;
			}
			.choose_title {
				display: block;
				width: 70px;
				text-align: right;
				margin-right:48px;
			}
			ul { 
				width:70%;
				li {
					height: 24px;
					line-height: 24px;
					padding:1px 16px;
					margin-top: 4px;
					text-align: center;
					cursor: default;
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
			}
			.clear {
				clear: both;
			}
		}
		.choose_last {
			border-bottom: none;
		}
	}
    .addbtn {
        padding:11px 21px;
    }
    .addNFCbtn {
        margin-bottom: 40px;
        width: 120px;
    }
    .lossNFCbtn {
    	width:120px;
    }
   .el-dialog {
        border-radius: 8px !important;
        .el-dialog__header {
            border-radius: 8px 8px 0 0;
		}
		.el-dialog__body {
			.NFCbox {
				text-align: center;
			}
		}
	}
	
    .radio_gender {
    	margin-bottom: 6px;
    }
    .el-button {
    	margin-left: 0;
    	margin-right: 8px;
    }
	.el-button--text {
        padding:5px;
        background-color: #409EFF;
        color:#fff;
        margin-right: 12px;
        margin-bottom: 10px;
    }
    .el-button--text:nth-child(2),
    .el-button--text:nth-child(3),
    .el-button--text:nth-child(4) {
    	margin-left: 0;
    	margin-bottom: 0;
    }
    .el-button--text:focus, .el-button--text:hover {
    	background: #409EFF;
        color:#fff;
    }
    .el-select {
    	width: 202px;
    }
    .right {
        position: absolute;
        right: 10px;
        top: 0;
    }
    .on {
    	background:#41cac0;
    	color: #fff;
    	border-radius: 4px;
    }
    .el-input {
    	width: 202px;
    }
    .addrInput {
    	width: 100%;
    }
    .margin_bottom {
    	margin-bottom: 8px;
	}
	/*批量导入*/
	.downLoad_text {
		width: 80px;
		margin: 0 auto;
		margin-bottom: 10px;
	}
	.download {
		a {
			color: #fff;
			display: block;
		}
		text-align: center;
	}
	
	div.upload-demo {
		width: 80px;
		margin: 0 auto;
	}
	
	/**** add by xing.wei *****/
	
    .fingerBox{
        width:50px;
        height: 45px;
        box-shadow:1px 1px 1px #cccccc;
        border: 1px solid #cccccc;
        border-radius: 8px;
        text-align: center;
        vertical-align:middle;
        font-size:45px;
        line-height: 45px;
        color:#cccccc;
        cursor: pointer;
        position: relative;
    }
    .fingerBox:hover{
        color:#1CB394;
        box-shadow:2px 2px 2px #cccccc;
        border-color: #1CB394;
    }
    .fingerBox .hasFingerImg{
        width: 71%;
        height: 90%;
    }
    .fingerBox .hasFingerDel{
        position: absolute;
        width: 14px;
        height: 14px;
        font-size: 13px;
        line-height: 14px;
        border-radius: 8px;
        border:1px solid  red;
        top:0px;
        right: 0px;
        background-color: red;
        color: #fff;
    }
    .fingerBox .hasFingerDel:hover{
       border:1px solid  #1CB394;
    }
    .noticeForAddFinger{
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        position: absolute;
        left: 0;
        top:0;
    }
    .noticeForAddFinger img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        border: 1px solid #cccccc;
        border-radius: 10px;
    }
    #cancel {
        position: absolute;
        bottom: 90px;
        left: 40%;
        width: 20%;
    }
</style>
