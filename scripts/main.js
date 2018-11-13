/*
 * 在Axios和Vue之后，主要用于Axios的初始化以及Vue的组件注册的功能
 */
/**************************************1 初始化默认的axios******************************************/
//测试开发环境默认接口头
axios.defaults.baseURL = 'http://192.168.0.101:8080/jywy-manager';
//线上接口头
//axios.defaults.baseURL = 'http://manager.drmom.cn/jywy-manager'
//axios.defaults.headers.common['Authorization'] = "AUTH_TOKEN";
//axios.defaults.headers.post['Content-Type'] = 'application/json';


// 请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	if(localStorage.token) {
		config.headers.token = localStorage.token;
	}
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 响应拦截器
var _this = Vue.prototype;
var duration = '800'
axios.interceptors.response.use(function(response) {
	// 对响应数据做点什么

	if(response.data.code === '003' || response.data.code === '006' || response.data.code === '005') {
		_this.$message({
			message: response.data.message,
			type: 'error',
			duration: duration
		});
		setTimeout(function() {
			window.location.href = "http://manager.drmom.cn";
		}, 950);

	}

	return response;
}, function(error) {
	// 对响应错误做点什么
	//	if (!window.sessionStorage.getItem("token")) {
	//    // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
	//    parent.location.href="../login.html";
	//  }else{
	//  	
	//  }
	console.log(error);
	return Promise.reject(error);
});
/**************************************2 扩展Vue的调用******************************************/
Vue.prototype.$ajax = axios
Vue.prototype.api = {
	//测试开发环境上传音频文件
	uploadVoiceFileupload:'/upload/uploadVoiceFile',
	
	//测试开发环境图片接口头
	httpupload: 'http://img.test.drmom.cn',
	//线上环境图片接口头
	//			httpupload: 'http://img.drmom.cn',
	//开发环境图片接口 
	uploadUrl: 'http://192.168.0.101:8080/jywy-manager/upload/uploadPicFileByEditSingleOilBaseInf',
	//线上图片接口
	//			uploadUrl: 'http://manager.drmom.cn/jywy-manager/upload/uploadPicFileByEditSingleOilBaseInf',
	//单方（复方）精油关联身体系统
	queryAllOilBodySystemByOilId: '/oilBodySystem/queryAllOilBodySystemByOilId',
	queryAllBodySystemByAddOilBodySystem: '/bodySystem/queryAllBodySystemByAddOilBodySystem',
	addOilBodySystem: '/oilBodySystem/addOilBodySystem',
	cancelOilBodySystem: '/oilBodySystem/cancelOilBodySystem',
	editOilBodySystem: '/oilBodySystem/editOilBodySystem',
	//单方（复方）精油关联安全提示
	queryAllOilSafetyWarningByOilId: '/oilSafetyWarning/queryAllOilSafetyWarningByOilId',
	queryAllSafetyWarningByAddOilSafetyWarning: '/safetyWarning/queryAllSafetyWarningByAddOilSafetyWarning',
	addOilSafetyWarning: '/oilSafetyWarning/addOilSafetyWarning',
	cancelOilSafetyWarningByOilIdAndSafetyWarningId: '/oilSafetyWarning/cancelOilSafetyWarningByOilIdAndSafetyWarningId',
	editOilSafetyWarning: '/oilSafetyWarning/editOilSafetyWarning',
	//单方（复方）精油关联疗愈属性
	queryAllOilHealingAttributeByOilId: '/oilHealingAttribute/queryAllOilHealingAttributeByOilId',
	queryAllHealingAttributeByAddOilHealingAttribute: '/healingAttribute/queryAllHealingAttributeByAddOilHealingAttribute',
	addOilHealingAttribute: '/oilHealingAttribute/addOilHealingAttribute',
	editOilHealingAttribute: '/oilHealingAttribute/editOilHealingAttribute',
	cancelOilHealingAttributeByOilIdAndHealingAttributeId: '/oilHealingAttribute/cancelOilHealingAttributeByOilIdAndHealingAttributeId',
	//化学成分Master
	queryAllConstituentByclassifyUrl: '/constituent/queryAllConstituentByclassify',
	queryAllConstituentUrl: '/constituent/queryAllConstituent',
	queryAllConstituentClassUrl: '/constituent/queryAllConstituentClass',
	queryOneConstituentEditByIdUrl: '/constituent/queryOneConstituentEditById',
	cancelConstituentByIdUrl: '/constituent/cancelConstituentById',
	editConstituentByIdUrl: '/constituent/editConstituentById',
	addConstituentByIdUrl: '/constituent/addConstituent',
	//单方精油
	queryAllSingleOilBaseInfPage: '/singleOilBaseInf/queryAllSingleOilBaseInfPage',
	cancelSingleOilBaseInfById: '/singleOilBaseInf/cancelSingleOilBaseInfById',
	querySingleOilBaseInfEditById: '/singleOilBaseInf/querySingleOilBaseInfEditById',
	queryAllPlantFamilyByEditSingleOilBaseInf: '/plantFamily/queryAllPlantFamilyByEditSingleOilBaseInf',
	editSingleOilBaseInfById: '/singleOilBaseInf/editSingleOilBaseInfById',
	addSingleOilBaseInf: '/singleOilBaseInf/addSingleOilBaseInf',
	querySingleOilBasePublicByAddSingleOilBaseInf: '/singleOilBaseInf/querySingleOilBasePublicByAddSingleOilBaseInf',
	uploadPicFileByEditSingleOilBaseInf: '/upload/uploadPicFileByEditSingleOilBaseInf',
	//单方精油关联化学成分
	queryAllOilConstituent: '/oilConstituent/queryAllOilConstituent',
	cancelOilConstituentByOilIdAndConstituentId: '/oilConstituent/cancelOilConstituentByOilIdAndConstituentId',
	queryOilConstituentEditByOilIdAndConstituentId: '/oilConstituent/queryOilConstituentEditByOilIdAndConstituentId',
	editOilConstituentByOilIdAndConstituentId: '/oilConstituent/editOilConstituentByOilIdAndConstituentId',
	addOilConstituent: '/oilConstituent/addOilConstituent',
	//用途Master
	searchAllScreeningInf: '/healthCondition/searchAllScreeningInf',
	queryTypeOrganByParentId: '/healthCondition/queryTypeOrganByParentId',
	queryAllHealthCondition: '/healthCondition/queryAllHealthCondition',
	queryHealthConditionById: '/healthCondition/queryHealthConditionById',
	addHealthCondition: '/healthCondition/addHealthCondition',
	editHealthConditionById: '/healthCondition/editHealthConditionById',
	cancelHealthConditionById: '/healthCondition/cancelHealthConditionById',
	//单方（复方）精油关联用途
	queryAllOilHealthCondition: '/oilHealthCondition/queryAllOilHealthCondition',
	addOilHealthCondition: '/oilHealthCondition/addOilHealthCondition',
	editOilHealthCondition: '/oilHealthCondition/editOilHealthCondition',
	cancelOilHealthConditionByOilIdAndConditionId: '/oilHealthCondition/cancelOilHealthConditionByOilIdAndConditionId',
	//实验研究论文
	queryAllViewKeywordMasterClass: '/viewKeywordMaster/queryAllViewKeywordMasterClass',
	addEmpiricalResearchInf: '/empiricalResearchInf/addEmpiricalResearchInf',
	editEmpiricalResearchInfById: '/empiricalResearchInf/editEmpiricalResearchInfById',
	queryEmpiricalResearchInfById: '/empiricalResearchInf/queryEmpiricalResearchInfById',
	cancelEmpiricalResearchInfById: '/empiricalResearchInf/cancelEmpiricalResearchInfById',
	queryAllEmpiricalResearchInfPage: '/empiricalResearchInf/queryAllEmpiricalResearchInfPage',
	queryAllViewKeywordMasterByKeywordType: '/viewKeywordMaster/queryAllViewKeywordMasterByKeywordType',
	//疗愈属性一览
	queryAllHealingAttribute: '/healingAttribute/queryAllHealingAttribute',
	addHealingAttribute: '/healingAttribute/addHealingAttribute',
	queryHealingAttributeById: '/healingAttribute/queryHealingAttributeById',
	editHealingAttributeById: '/healingAttribute/editHealingAttributeById',
	deleteHealingAttributeById: '/healingAttribute/deleteHealingAttributeById',
	//复方精油
	queryAllBlendOilBaseInfPage: '/blendOilBaseInf/queryAllBlendOilBaseInfPage',
	queryBlendOilBaseInfEditById: '/blendOilBaseInf/queryBlendOilBaseInfEditById',
	editBlendOilBaseInf: '/blendOilBaseInf/editBlendOilBaseInf',
	queryBlendOilBaseInfPublicByAddBlendOilBaseInf: '/blendOilBaseInf/queryBlendOilBaseInfPublicByAddBlendOilBaseInf',
	addBlendOilBaseInf: '/blendOilBaseInf/addBlendOilBaseInf',
	deleteBlendOilBaseInfById: '/blendOilBaseInf/deleteBlendOilBaseInfById',
	//管理员登录
	login: '/manager/login',
	logout: '/manager/logout',
	//复方精油关联单方精油
	queryAllBlendSingleOilByBlendOilId: '/blendSingleOil/queryAllBlendSingleOilByBlendOilId',
	addBlendSingleOil: '/blendSingleOil/addBlendSingleOil',
	editBlendSingleOil: '/blendSingleOil/editBlendSingleOil',
	deleteBlendSingleOil: '/blendSingleOil/deleteBlendSingleOil',
	//其他关键词
	queryAllPage: '/otherKeyword/queryAllPage',
	add: '/otherKeyword/add',
	queryOneById: '/otherKeyword/queryOneById',
	editById: '/otherKeyword/editById',
	delById: '/otherKeyword/delById',
	//关键字搜索新增编辑页面中文名和英文名搜索
	addKeywordSearchotherKeyword: '/otherKeyword/addKeywordSearch',
	//微信公众号文章
	queryAllRelevanceClass: '/articlesList/queryAllRelevanceClass',
	queryallpage: '/articlesList/queryAllPage',
	addwxarticle: '/articlesList/add',
	editwxarticle: '/articlesList/edit',
	queryOneByIdwxarticle: '/articlesList/queryOneById',
	delByIdwxarticle: '/articlesList/delById',

	//精油关联疗愈属性和用途新增星级
	queryAllByIdpublic: '/publicMaster/queryAllById',

	//家庭关系Master
	queryrelationship: '/relationship/queryAll',
	addrelationship: '/relationship/add',
	delByIdrelationship: '/relationship/delById',
	//关系图片
	queryAllByRelationshipId: '/relationshipCartoon/queryAllByRelationshipId',
	addrelationshipCartoon: '/relationshipCartoon/add',
	ceilingNumber: '/relationshipCartoon/ceilingNumber',
	delByIdrelationshipCartoon: '/relationshipCartoon/delById',
	defaultFlgrelationshipCartoon: '/relationshipCartoon/defaultFlg',
	//系统设置常量信息
	queryAllsystemSeting: '/systemSeting/queryAll',
	addsystemSeting: '/systemSeting/add',
	editsystemSeting: '/systemSeting/edit',
	delsystemSeting: '/systemSeting/del',
	//管理员列表管理
	queryAllPagemanager: '/manager/queryAllPage',
	addmanager: '/manager/add',
	editmanager: '/manager/edit',
	queryOneByIdmanager: '/manager/queryOneById',
	delmanager: '/manager/del',
	restPswmanager: '/manager/restPsw',

	//角色管理
	queryAllrole: '/role/queryAll',
	queryOneByIdrole: '/role/queryOneById',
	addrole: '/role/add',
	editrole: '/role/edit',
	delrole: '/role/del',
	//角色关联权限
	queryAllAclByIdrole: '/role/queryAllAclById',
	addRoleAclrole: '/role/addRoleAcl',
	//角色关联管理员
	queryAllManagerByIdrole: '/role/queryAllManagerById',
	addRoleManagerrole: '/role/addRoleManager',

	//权限菜单管理
	queryAllMenu2Treeacl: '/acl/queryAllMenu2Tree',
	queryOneByIdacl: '/acl/queryOneById',
	editacl: '/acl/edit',
	addacl: '/acl/add',
	delacl: '/acl/del',

	//权限按钮管理
	queryAllByMenuIdacl: '/acl/queryAllByMenuId',

	//home页面菜单项获取
	menumanager: '/manager/menu',
	//home当前管理员信息
	detailmanager: '/manager/detail',
	//得到图片尺寸类型-根据类目ID中的详细项目ID
	queryPictureSizeTypeBySubIdpublicMaster: '/publicMaster/queryPictureSizeTypeBySubId',

	//图标上传接口
	//得到列表
	queryAllpictureManager: '/pictureManager/queryAll',

	//根据共通master类目ID(英文字符串)，得到所有图片类型数据
	queryAllByIdpublicMaster: '/publicMaster/queryAllById',

	//图标上传
	uploadpictureManager: '/pictureManager/upload',
	//新增-保存新增的图标
	addpictureManager: '/pictureManager/add',
	//编辑-保存修改后的图标信息
	editpictureManager: '/pictureManager/edit',
	//删除-根据图表信息id，删除指定信息
	delpictureManager: '/pictureManager/del',

	//植物有列表 列表分页显示
	queryAllPagevegetableOilBaseInf: '/vegetableOilBaseInf/queryAllPage',

	//植物油编辑-查看
	queryOneByIdvegetableOilBaseInf: '/vegetableOilBaseInf/queryOneById',
	//新增植物油-获取萃取方式,萃取植物部位,干性类型列表
	queryPublicvegetableOilBaseInf: '/vegetableOilBaseInf/queryPublic',

	//新增植物油-保存新添加的植物油信息
	addvegetableOilBaseInf: '/vegetableOilBaseInf/add',
	//编辑植物油-保存编辑后的植物油信息，根据植物油id
	editByIdvegetableOilBaseInf: '/vegetableOilBaseInf/editById',
	//删除植物油-根据植物油id，删除植物油信息
	cancelByIdvegetableOilBaseInf: '/vegetableOilBaseInf/cancelById',

	//根据精油id获取精油关联关键词列表
	queryAllByOilIdoilKeyword:'/oilKeyword/queryAllByOilId',
	//根据精油(单方精油，复方精油，植物油)id，设置关键词信息
	editByOilIdoilKeyword:'/oilKeyword/editByOilId',
	
	//列表-得到所有内部富文本信息，可关键字搜索，分页显示
	queryAllinsideRichText:'/insideRichText/queryAll',
	//编辑-根据内部富文本id，得到详情信息
	queryOneByIdinsideRichText:'/insideRichText/queryOneById',
	//编辑-保存编辑后的信息
	editinsideRichText:'/insideRichText/edit',
	//新增-保存新增的信息
	addinsideRichText:'/insideRichText/add',
	//删除-根据内部富文本id，删除对应信息
	delByIdinsideRichText:'/insideRichText/delById',
};

/**************************************3 Vue的校验组件********************************************/
try {
	if(VeeValidate) {
		VeeValidate.Validator.localize("zh_CN");
		////验证的扩展---以后的验证扩展可在这里进行
		VeeValidate.Validator.extend("phone", {
			getMessage: function() {
				return "请输入正确的手机号"
			},
			validate: function(val) {
				return /^1\d{10}$/.test(val)
			}
		})
		Vue.use(VeeValidate); //一般插件都要use一下
	}
} catch {
	//	console.log("校验组件有问题VeeValidate,请检查！！");
}

/**************************************4 Vue的组件********************************************/
/////这是Vue的组件开发，定义好的组件以后可以在这里使用
Vue.component('chemical', {
	// 声明 props
	props: ['mdata'],
	template: '<span>{{ mdata }}</span>'
})

//<my-chemical ref="childChemical" v-on:childvalue="childByValue"></my-chemical>
Vue.component('my-chemical', {
	template: '<el-dialog :title="chemicalName" width="80%" append-to-body :visible.sync="chemicalVisible" :close-on-click-modal="false"><div><div><el-cascader :options="searchOptions" :props="cascaderProps" v-model="selectsearchOptionId" separator="/" clearable change-on-select filterable placeholder="化学成分"></el-cascader>' +
		'<el-input v-model="keyword" placeholder="输入化学成分ID、化学成分中文名或英文名" @keyup.enter.native="query()" style="width: 300px;"></el-input>' +
		'<el-button type="primary" v-on:click="query">查询</el-button>' +
		'<el-button type="primary" @click="childClick">确  定</el-button></div>' +
		'<div><el-table border  highlight-current-row  @row-dblclick="childClick" @row-click="handleSelectionChange" :data="chemicalData" :header-cell-style="getRowClass">' +
		'<el-table-column prop="constituentId" label="化学成分ID" sortable></el-table-column>' +
		'<el-table-column prop="constituentCnName" label="中文名" sortable></el-table-column>' +
		'<el-table-column prop="constituentCnOtherName" label="中文别名" sortable></el-table-column>' +
		'<el-table-column prop="constituentEnName" label="英文名" sortable></el-table-column>' +
		'<el-table-column prop="constituentEnOtherName" label="英文别名" sortable></el-table-column>' +
		'<el-table-column prop="parentNameSecond" label="二级父分类" sortable>/el-table-column>' +
		'</el-table></div></div></el-dialog>',
	data: function() {
		return {
			chemicalName: '',
			chemicalVisible: false,
			keyword: '',
			selectsearchOptionId: [],
			chemicalData: [],
			searchOptions: [],
			cascaderProps: {
				value: 'constituentId',
				label: 'constituentCnName',
				children: 'childList'
			},
			multipleSelection: []
		}
	},
	beforeCreate: function() {
		var _self = this;
		this.$ajax.get(this.api.queryAllConstituentClassUrl)
			.then((response) => {
				_self.searchOptions = response.data.data;
			})
			.catch((error) => {
				console.log(error);
			});
	},
	methods: {
		getRowClass({
			row,
			column,
			rowIndex,
			columnIndex
		}) {
			if(rowIndex == 0) {
				return 'background:#eceff5'
			}

		},

		childClick() {
			this.$emit('childvalue', this.multipleSelection);
			this.chemicalVisible = false;
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		query() {
			var _self = this;
			var constituentId = "";
			var classify = "";
			if(_self.selectsearchOptionId && _self.selectsearchOptionId.length > 0) {
				classify = _self.selectsearchOptionId.length;
				constituentId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
			}
			this.$ajax.get(this.api.queryAllConstituentUrl, {
					params: {
						keyword: _self.keyword,
						constituentId: constituentId,
						classify: classify,
					}
				})
				.then((response) => {
					_self.chemicalData = response.data.data
				})
				.catch((errop) => {
					console.log(errop);
				})
		},
		initData(name, isShow) {
			//alert("我将要初始化");
			this.keyword = '';
			this.selectsearchOptionId = [];
			this.chemicalData = [];
			//this.searchOptions = [];
			this.multipleSelection = [];
			this.chemicalName = name;
			this.chemicalVisible = isShow;
		}
	}
})

//<condition-master ref="conmaster" v-on:entervalue="enterByValue"></condition-master>
Vue.component('condition-master', {
	template: '<el-dialog :title="fathermastername" width="98%" append-to-body :visible.sync="getVisible" :close-on-click-modal="false"><el-row><el-col :span="24"><div class="grid-content bg-purple-light">' +
		'<el-form label-width="20px"><el-form-item><el-col :span="5">性别：<el-select  clearable  placeholder="请选择" v-model="typeSex"><el-option v-for="item in options" v-model="item.id":key="item.typeSex" :label="item.label" :value="item.typeSex"></el-option></el-select>' +
		'</el-col><el-col :span="5">年龄层：<el-select  clearable placeholder="请选择" :data="ageselectedit" v-model="typeAgeGroup"><el-option v-for="item in ageselectedit" v-model="item.subId":key="item.typeAgeGroup" :label="item.subName" :value="item.typeAgeGroup">	' +
		'</el-option></el-select></el-col><el-col :span="5">基本种类：<el-select  clearable placeholder="请选择" :data="basekindselect" v-model="typeBaseKind">' +
		'<el-option v-for="item in basekindselect" v-model="item.id":key="item.typeBaseKind" :label="item.chineseName" :value="item.typeBaseKind"></el-option></el-select></el-col>' +
		'<el-col :span="5">身体系统：<el-select  clearable placeholder="请选择" :data="typebodysystemselect" v-model="typeBodySystem"><el-option v-for="item in typebodysystemselect" v-model="item.id":key="item.typeBodySystem" :label="item.chineseName" :value="item.typeBodySystem">' +
		'</el-option></el-select></el-col></el-form-item><el-form-item>身体器官：<el-cascader :options="searchOptions" v-model="selectsearchOptionId" :props="props" separator="/" clearable change-on-select filterable placeholder="请选择" style="width: 166px;">' +
		'</el-cascader>用途关键字搜索：<el-input v-model="keyword" placeholder="请输入" @keyup.enter.native="query()" style="width: 160px;"></el-input><el-button type="primary"  v-on:click="query">查询</el-button>' +
		'<el-button type="primary" @click="enterClick">确定</el-button></el-form-item>	</el-form></div>' +
		'<el-table style="width: 100%" class="tb-edit" border :data="dataTableSource" @row-dblclick="enterClick"  highlight-current-row @row-click="handleSelectionChange" :header-cell-style="getRowClass">' +
		'<el-table-column prop="conditionId" label="用途ID"  sortable></el-table-column>' +
		'<el-table-column prop="parentHealthCondition.conditionCnName"  label="父用途" sortable></el-table-column>' +
		'<el-table-column prop="conditionCnName"  label="中文名" sortable></el-table-column>' +
		'<el-table-column prop="conditionCnOtherName"  label="中文别名" sortable></el-table-column>' +
		'<el-table-column prop="conditionEnName"  label="英文名" sortable></el-table-column>' +
		'<el-table-column prop="conditionEnOtherName"  label="英文别名" sortable></el-table-column>' +
		'<el-table-column prop="typeSex"  label="性别" :formatter="formatRole" sortable></el-table-column>' +
		'<el-table-column prop="typeAgeGroupStr"  label="年龄层说明" sortable></el-table-column>' +
		'<el-table-column prop="typeBodySystemStr"  label="身体系统名称" sortable></el-table-column>' +
		'<el-table-column prop="typeOrganStr"  label="器官名称" sortable></el-table-column>' +
		'<el-table-column prop="typeBaseKindStr"  label="基本用途" sortable></el-table-column>' +
		'</el-table></el-col></el-row></el-dialog>',
	data: function() {
		return {
			masterstatus: '',
			getVisible: false,
			fathermastername: '',
			typeAgeGroup: '',
			typeBaseKind: '',
			typeBodySystem: '',
			dataTableSource: [],
			ageselectedit: [],
			basekindselect: [],
			typebodysystemselect: [],
			typeOrgan: '',
			type: '',
			options: [{
					id: 0,
					label: '通用'
				},
				{
					id: 1,
					label: '男'
				},
				{
					id: 2,
					label: '女'
				}
			],
			props: {
				value: 'id',
				label: 'organName',
				children: 'childList'
			},
			typeSex: '',
			searchOptions: [],
			selectsearchOptionId: [],
			keyword: '',
			parentHealthCondition: [],
			multipleSelection: []
		}
	},
	beforeCreate: function() {
		var _self = this;
		axios.get(this.api.searchAllScreeningInf)
			.then((response) => {
				_self.ageselectedit = response.data.data.typeAgeGroupList;
				_self.basekindselect = response.data.data.typeBaseKindList;
				_self.typebodysystemselect = response.data.data.typeBodySystemList;
				_self.searchOptions = response.data.data.typeOrganList;
			})
	},
	methods: {
		//性别显示
		formatRole: function(row, column) {
			return row.typeSex == '1' ? "男" : row.typeSex == '2' ? "女" : "通用";
		},
		getRowClass({
			row,
			column,
			rowIndex,
			columnIndex
		}) {
			if(rowIndex == 0) {
				return 'background:#eceff5'
			} else {
				return ''
			}

		},
		enterClick() {
			this.$emit('entervalue', this.multipleSelection, this.masterstatus);
			this.getVisible = false;
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		query() {
			var _self = this;
			var typeOrgan = "";
			var typeOrganClass = "";
			if(_self.selectsearchOptionId && _self.selectsearchOptionId.length > 0) {
				typeOrganClass = _self.selectsearchOptionId.length > 1 ? 2 : 1;
				typeOrgan = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
			}
			axios.get(this.api.queryAllHealthCondition, {
					params: {
						type: _self.type,
						keyword: _self.keyword,
						typeSex: _self.typeSex,
						typeAgeGroup: _self.typeAgeGroup,
						typeBodySystem: _self.typeBodySystem,
						typeOrgan: typeOrgan,
						typeOrganClass: typeOrganClass,
						typeBaseKind: _self.typeBaseKind
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.data;
				})
		},
		initData1(type, id, name, isShow) {
			//alert("我将要初始化");
			this.keyword = '';
			this.typeSex = '';
			this.typeAgeGroup = '';
			this.typeBaseKind = '';
			this.typeBodySystem = '';
			this.selectsearchOptionId = [];
			this.dataTableSource = [];
			this.multipleSelection = [];
			this.type = type;
			this.masterstatus = id;
			this.fathermastername = name;
			this.getVisible = isShow;

		},
		initData(name, isShow) {
			this.keyword = '';
			this.typeSex = '';
			this.typeAgeGroup = '';
			this.typeBaseKind = '';
			this.typeBodySystem = '';
			this.selectsearchOptionId = [];
			this.dataTableSource = [];
			this.multipleSelection = [];
			this.fathermastername = name;
			this.getVisible = isShow;
		}
	},

})

//<my-essentialOil ref="essentialOil" v-on:essentialOilvalue="essentialOilByValue"></my-essentialOil>
Vue.component('my-essentialoil', {
	template: '<el-dialog :title="essentialOilName" width="80%" append-to-body :visible.sync="essentialOilVisible" :close-on-click-modal="false"><div><div>' +
		'<el-tooltip class="item" effect="dark" content="输入精油ID或精油名称(精油中文名称、中文别名、英文名称、英文别名、植物名称-拉丁文、植物名称-拉丁别名)进行模糊查询" ><el-input v-model="keyword" placeholder="查询条件输入框"  @keyup.enter.native="doquery()" style="width: 165px;"></el-input></el-tooltip>' +
		'<el-button type="primary" v-on:click="query">查询</el-button>' +
		'<el-button type="primary" @click="childClick">确  定</el-button></div>' +
		'<div><el-table border  highlight-current-row @row-click="handleSelectionChange"   @row-dblclick="childClick" :data="dataTableSource" :header-cell-style="getRowClass">' +
		'<el-table-column type="index" sortable label="序号"></el-table-column>' +
		'<el-table-column prop="oilId" label="精油ID" sortable  sortable></el-table-column>' +
		'<el-table-column prop="oilChineseName" label="中文名" sortable  sortable></el-table-column>' +
		'<el-table-column prop="oilChineseOtherName" label="中文别名" sortable  sortable></el-table-column>' +
		'<el-table-column prop="oilEnglishName" label="英文名" sortable  sortable></el-table-column>' +
		'<el-table-column prop="oilEnglishOtherName" label="英文别名" sortable  sortable></el-table-column>' +
		'<el-table-column prop="oilBotanicalName" label="拉丁名" sortable  sortable></el-table-column>' +
		'<el-table-column prop="oilBotanicalOtherName" label="拉丁别名" sortable  sortable></el-table-column>' +
		'</el-table></div></div><el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="totalNumber" style="float:right;">' +
		'</el-pagination></el-dialog>',
	data: function() {
		return {
			essentialOilName: '',
			essentialOilVisible: false,
			page: "",
			totalNumber: 0,
			keyword: "",
			dataTableSource: [],
			multipleSelection: [],
			pageIndex: "",
		}
	},
	beforeCreate: function() {},
	methods: {
		getRowClass({
			row,
			column,
			rowIndex,
			columnIndex
		}) {
			if(rowIndex == 0) {
				return 'background:#eceff5'
			}

		},
		childClick() {
			this.$emit('essentialoilvalue', this.multipleSelection, this.page);
			this.essentialOilVisible = false;
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},

		handleCurrentChange(val) {
			this.page = val;
			this.query();
		},
		query() {
			var _self = this;
			_self.$ajax.get(_self.api.queryAllSingleOilBaseInfPage, {
					params: {
						pageNum: _self.page,
						keyword: _self.keyword,
					},
				})
				.then((response) => {
					_self.totalNumber = response.data.totalNumber;
					_self.dataTableSource = response.data.dataList;
					_self.pageIndex = response.data.pageIndex;
					_self.page = "";
				})
				.catch((errop) => {
					console.log(errop);
				})
		},
		doquery() {
			this.query();
		},
		initData(name, isShow) {
			//alert("我将要初始化");
			this.keyword = '';
			this.essentialOilName = name;
			this.essentialOilVisible = isShow;
			this.dataTableSource = [];
			this.multipleSelection = [];
		},
	}
})

//<my-attributes ref ="abilitymaster" v-on:abilitymastervalue ="abilitymasterByValue"></my-attributes>
Vue.component('my-attributes', {
	template: `<el-dialog :title="statusName" :visible.sync="visible" append-to-body :close-on-click-modal="false" width="80%"><div><div>
			<el-radio-group  v-model="physicalMindFlg">
			<el-radio-button label="1">生理</el-radio-button><el-radio-button label="2">心理</el-radio-button></el-radio-group>
			<el-input v-model="keyword" placeholder="请输入关键字" style="width: 165px;" @keyup.enter.native="doquery"></el-input>
			<el-button type="primary" 	 v-on:click="query()">查询</el-button><el-button type="primary" @click="childClick">确  定</el-button></div><div>
			<el-table  border :data="dataTableSource" highlight-current-row @row-click="handleSelectionChange" :header-cell-style="getRowClass"   @row-dblclick="childClick">
			<el-table-column type="index" 			 label="序号"></el-table-column><el-table-column prop="id" 	  			 label="疗愈属性id"></el-table-column>
			<el-table-column prop="physicalMindFlg"  label="生理&心理属性标志" :formatter="formatRole"></el-table-column><el-table-column prop="chineseName" 	 label="中文名"></el-table-column>
			<el-table-column prop="englishName" 	 label="英文名"></el-table-column><el-table-column prop="chineseOtherName" label="中文别名"></el-table-column>
			<el-table-column prop="englishOtherName" label="英文别名"></el-table-column><el-table-column prop="description" 	 label="描述"></el-table-column></el-table>
			</div></div></el-dialog>`,
	data: function() {
		return {
			id: '',
			statusName: '',
			visible: false,
			dataTableSource: [],
			keyword: '',
			physicalMindFlg: '',
			chineseName: '',
			multipleSelection: []
		}
	},
	beforeCreate: function() {},
	methods: {
		//性别显示
		formatRole: function(row, column) {
			return row.physicalMindFlg == '1' ? "生理" : row.physicalMindFlg == '2' ? "心理" : "未知";
		},
		getRowClass({
			row,
			column,
			rowIndex,
			columnIndex
		}) {
			if(rowIndex == 0) {
				return 'background:#eceff5'
			} else {
				return ''
			}

		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		query() {
			var _self = this;
			axios.get(_self.api.queryAllHealingAttribute, {
					params: {
						physicalMindFlg: _self.physicalMindFlg,
						keyword: _self.keyword
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.data;
				})
		},
		doquery() {
			this.query();
		},
		childClick() {
			this.$emit('abilitymastervalue', this.multipleSelection);
			this.visible = false;
		},
		initData(name, isShow) {
			//alert("我将要初始化");
			this.id = "";
			this.chineseName = "";
			this.visible = isShow;
			this.statusName = name;
			this.dataTableSource = [];
			this.multipleSelection = [];
			this.keyword = '';
			this.physicalMindFlg = '';
		}
	}
})
//<my-multipleoil ref="multipleoilname" v-on:multiplenamevalue="multipleNameByValue"></my-multipleoil>
Vue.component('my-multipleoil', {
	template: `<el-dialog :title="statusName" :visible.sync="visible" append-to-body :close-on-click-modal="false" width="80%"><div><div>
			 <el-tooltip  content="输入精油ID或精油名称(精油中文名称、中文别名、英文名称、英文别名)进行模糊查询">
			<el-input placeholder="查询条件输入框"  @keyup.enter.native="doquery" v-model="keyword" style="width: 165px;"></el-input></el-tooltip>
			<el-button type="primary"  v-on:click="query()">查询</el-button><el-button type="primary" @click="childClick">确  定</el-button></div><div>
			<el-table  border :data="dataTableSource" highlight-current-row @row-click="handleSelectionChange" :header-cell-style="getRowClass"   @row-dblclick="childClick">
			<el-table-column type="index" 			 label="序号"></el-table-column><el-table-column prop="oilId" 	  			 label="复方精油id"></el-table-column>
			<el-table-column prop="oilChineseName"  label="中文名"></el-table-column><el-table-column prop="oilChineseOtherName" 	 label="中文别名"></el-table-column>
			<el-table-column prop="oilEnglishName" 	 label="英文名"></el-table-column><el-table-column prop="oilEnglishOtherName" label="英文别名"></el-table-column>
			</el-table></div></div><el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="totalNumber" style="float:right;"></el-pagination></el-dialog>`,

	data: function() {
		return {
			page: "",
			totalNumber: 0,
			keyword: "",
			dataTableSource: [],
			multipleSelection: [],
			visible: false,
			statusName: '',
			pageIndex: "",

		}
	},
	beforeCreate: function() {},
	methods: {
		getRowClass({
			row,
			column,
			rowIndex,
			columnIndex
		}) {
			if(rowIndex == 0) {
				return 'background:#eceff5'
			} else {
				return ''
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleCurrentChange(val) {
			this.page = val;
			this.query();
		},
		query() {
			var _self = this;
			axios.get(_self.api.queryAllBlendOilBaseInfPage, {
					params: {
						keyword: _self.keyword,
						pageNum: _self.page
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.pageIndex = response.data.pageIndex;
					_self.page = "";
				})
		},
		doquery() {
			this.query();
		},
		childClick: function() {
			this.$emit("multiplenamevalue", this.multipleSelection);
			this.visible = false;
		},
		initData1(name, isShow) {
			//alert("我将要初始化");
			this.dataTableSource = [];
			this.multipleSelection = [];
			this.keyword = '';
			this.visible = isShow;
			this.statusName = name;
		}
	}
})
//<my_other_keword ref="otherkeyword" v-on:otherkeywordvalue="otherKeywordByValue"> </my_other_keword>
Vue.component('my_other_keword', {
	template: `<el-dialog :title="statusName" :visible.sync="visible" append-to-body :close-on-click-modal="false" width="80%"><div><div>
			 <el-tooltip  content="输入完整关键词ID或关键词名称(中文名、中文别名、英文名、英文别名)进行模糊查询">
			<el-input placeholder="查询条件输入框"   @keyup.13.native="doquery()" v-model="keyword" style="width: 165px;"></el-input></el-tooltip>
			<el-button type="primary"  v-on:click="query()">查询</el-button><el-button type="primary" @click="childClick">确  定</el-button></div><div>
			<el-table  border :data="dataTableSource" highlight-current-row @row-click="handleSelectionChange" :header-cell-style="getRowClass"   @row-dblclick="childClick">
			<el-table-column type="index" 			 label="序号"></el-table-column><el-table-column prop="id" 	  			 label="关键词id"></el-table-column>
			<el-table-column prop="chineseName" 	 label="中文名"></el-table-column><el-table-column prop="chineseOtherName" 	 label="中文别名"></el-table-column>
			<el-table-column prop="englishName" 	 label="英文名"></el-table-column><el-table-column prop="englishOtherName" label="英文别名"></el-table-column>
			</el-table></div></div><el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :total="totalNumber" style="float:right;"></el-pagination></el-dialog> `,
	data: function() {
		return {
			page: "",
			totalNumber: 0,
			keyword: "",
			dataTableSource: [],
			multipleSelection: [],
			visible: false,
			statusName: '',
			pageIndex: "",
		}
	},
	beforeCreate: function() {},
	methods: {
		getRowClass({
			row,
			column,
			rowIndex,
			columnIndex
		}) {
			if(rowIndex == 0) {
				return 'background:#eceff5'
			} else {
				return ''
			}
		},
		childClick() {
			this.$emit("otherkeywordvalue", this.multipleSelection);
			this.visible = false;
		},
		doquery() {
			this.query();
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleCurrentChange(val) {
			this.page = val;
			this.query();
		},
		initData(name, isShow) {
			//alert("我将要初始化");
			this.dataTableSource = [];
			this.multipleSelection = [];
			this.keyword = '';
			this.visible = isShow;
			this.statusName = name;
		},
		query() {
			var _self = this;
			axios.get(_self.api.queryAllPage, {
					params: {
						keyword: _self.keyword,
						pageNum: _self.page
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.pageIndex = response.data.pageIndex;
					_self.page = "";
				}).catch((error) => {
					console.log(error);
				});
		}

	}
})