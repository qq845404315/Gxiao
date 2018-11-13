$(function() {
	//提示的显示时间
	var duration = '800';
	/////主窗体的Vue
	var scienceMaster = new Vue({
		el: '#scienceMaster',
		data: {
			type: "",
			page: "",
			totalNumber: 0,
			loading: false,
			dataTableSource: [],
			keyword: "",
			pageIndex: "",
			props: {
				value: 'keywordTypeId',
				label: 'keywordChineseName',
				children: 'childList'
			},
			selectsearchOptionId: [],
			searchOptions: [],
		},
		//初始化调用
		beforeCreate: function() {
			var _self = this;
			this.$ajax.get(_self.api.queryAllEmpiricalResearchInfPage)
				.then((response) => {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.pageIndex = response.data.pageIndex;
					_self.page = "";
					_self.loading = false;
					_self.$ajax.get(_self.api.queryAllViewKeywordMasterClass)
						.then((responseC1) => {
							_self.searchOptions = responseC1.data.data;
						})
				})
				.catch((error) => {
					console.log(error);
				});
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.query();
			},
			doquery(type) {
				if(this.type == "2") {
					this.page = this.pageIndex;
					this.query();
				}
			},
			query() {
				var _self = this;
				var keywordTypeId = "";
				var keywordId = "";
				if(_self.selectsearchOptionId && _self.selectsearchOptionId.length == 1) {
					keywordTypeId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
					keywordId = null;
				}
				if(_self.selectsearchOptionId && _self.selectsearchOptionId.length > 1) {
					keywordTypeId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 2];
					keywordId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
				}
				_self.loading = true;
				_self.$ajax.get(_self.api.queryAllEmpiricalResearchInfPage, {
						params: {
							pageNum: this.page,
							keyword: _self.keyword,
							keywordTypeId: keywordTypeId,
							keywordId: keywordId,
						},
					})
					.then((response) => {
						_self.dataTableSource = response.data.dataList;
						_self.totalNumber = response.data.totalNumber;
						_self.loading = false;
						_self.pageIndex = response.data.pageIndex;
						_self.page = "";
					})
					.catch((error) => {
						_self.loading = false;
						this.$message({
							type: 'info',
							message: '查询超时，请重新查询',
							duration: duration
						});
					})
			},
			add() {
				operateVue.getEditVisible = true;
				operateVue.statusName = "科学实证-新增";
				operateVue.status = "1";
				operateVue.addSelect = [];
				let _self = this;
				operateVue.data = {
					informationId: '',
					url: '',
					doi: '',
					titleChinese: '',
					titleEnglish: '',
					author: '',
					authorOrg: '',
					publication: '',
					pubDay: '',
					conclusions: '',
					summary: '',
					gmtCreate: '',
					gmtModified: '',
					empiricalResearchKeywordList: [],
					keywordTypeId: '',
					keywordId: ''
				}
				_self.$ajax.get(_self.api.queryAllViewKeywordMasterByKeywordType)
					.then((response) => {
						operateVue.selecteditOne = response.data.data;
					})
			},
			editRow(index, row) {

				operateVue.getEditVisible = true;
				operateVue.statusName = "科学实证-编辑";
				operateVue.status = "2";
				let _self = this;
				_self.$ajax.get(this.api.queryEmpiricalResearchInfById, {
						params: {
							informationId: row.informationId
						}
					})
					.then((response) => {
						var editResponse = response.data.data;
						_self.$ajax.get(_self.api.queryAllViewKeywordMasterByKeywordType)
							.then((responseC1) => {
								operateVue.selecteditOne = responseC1.data.data;
							});
						operateVue.data = editResponse;
						operateVue.addSelect = editResponse.empiricalResearchKeywordList;
					})
					.catch((error) => {
						console.log(error)
					});
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						_this.$ajax.get(_this.api.cancelEmpiricalResearchInfById, {
								params: {
									informationId: row.informationId
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.informationId !== row.informationId;
									});
									_this.dataTableSource = noDeleteObj;
									this.$message({
										type: 'success',
										message: '删除成功!',
										duration: duration
									});
								} else {
									this.$message({
										type: 'error',
										message: '删除失败!' + response.data.message,
										duration: duration
									});
								}
							})
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
							duration: duration
						});
					})

			},
		}
	})

	/////编辑和添加数据窗体的Vue
	var operateVue = new Vue({
		el: "#dialogEdit",
		data: {
			kewordObj: {
				keywordTypeId: "",
				keywordId: "",
				keywordChineseName: "",
				keywordTypeName: '',
			},
			getEditVisible: false,
			selecteditOne: [],
			addSelect: [],
			formLabelWidth: '190px',
			status: '',
			statusName: '',

			data: {
				selectKeywordObj: '',
				informationId: '',
				url: '',
				doi: '',
				titleEnglish: '',
				titleChinese: '',
				author: '',
				authorOrg: '',
				publication: '',
				pubDay: '',
				conclusions: '',
				summary: '',
				gmtCreate: '',
				gmtModified: '',
				empiricalResearchKeywordList: [],
				empiricalResearchKeywordList1: [],
				keywordTypeId: '',
				keywordId: '',
				keywordTypeName: ''
			},
			editFormRules: {
				url: [{
					required: true,
					message: '请输入信息链接地址',
					trigger: 'blur'
				}],
				titleChinese: [{
					required: true,
					message: '请输入中文标题',
					trigger: 'blur'
				}],
				titleEnglish: [{
					required: true,
					message: '请输入英文标题',
					trigger: 'blur'
				}],
				author: [{
					required: true,
					message: '请输入文章作者',
					trigger: 'blur'
				}],
				keywordTypeId: [{
					required: true,
					message: '请输入文章作者',
					trigger: 'blur'
				}],
			},

		},
		beforeCreate: function() {

		},
		methods: {
			childByValue: function(childValue) {
				// childValue就是子组件传过来的值
				this.chemicalValue = childValue;
				var obj = {
					keywordTypeId: operateVue.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.constituentCnName,
					keywordId: this.chemicalValue.constituentId,
					keywordTypeName: operateVue.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				this.kewordObj = {
					keywordTypeId: "",
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: "",
				};
				// this.addSelect=_selectArray;		

			},
			essentialOilByValue: function(Value) {
				//this. = Value;
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: operateVue.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.oilChineseName,
					keywordId: this.chemicalValue.oilId,
					keywordTypeName: operateVue.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				this.kewordObj = {
					keywordTypeId: "",
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: "",
				};
			},
			enterByValue: function(Value) {
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: operateVue.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.conditionCnName,
					keywordId: this.chemicalValue.conditionId,
					keywordTypeName: operateVue.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				this.kewordObj = {
					keywordTypeId: "",
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: "",
				};
			},
			abilitymasterByValue: function(Value) {
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: operateVue.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.chineseName,
					keywordId: this.chemicalValue.id,
					keywordTypeName: operateVue.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				this.kewordObj = {
					keywordTypeId: "",
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: "",
				};
			},
			multipleNameByValue: function(Value) {
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: operateVue.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.oilChineseName,
					keywordId: this.chemicalValue.oilId,
					keywordTypeName: operateVue.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				this.kewordObj = {
					keywordTypeId: "",
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: "",
				};
			},
			otherKeywordByValue: function(Value) {
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: operateVue.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.chineseName,
					keywordId: this.chemicalValue.id,
					keywordTypeName: operateVue.data.keywordTypeName,
				}
				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				this.kewordObj = {
					keywordTypeId: "",
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: "",
				};
			},
			submit(editForm) {
				var _self = this;
				scienceMaster.type = "2";
				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					this.$refs[editForm].validate((valid) => {
						if(valid) {
							var data = {
								informationId: this.data.informationId,
								url: this.data.url,
								doi: this.data.doi,
								titleEnglish: this.data.titleEnglish,
								titleChinese: this.data.titleChinese,
								author: this.data.author,
								authorOrg: this.data.authorOrg,
								publication: this.data.publication,
								pubDay: this.data.pubDay,
								conclusions: this.data.conclusions,
								summary: this.data.summary,
								empiricalResearchKeywordList: this.data.empiricalResearchKeywordList1 == undefined ? [] : this.data.empiricalResearchKeywordList1
							}
							for(var i = 0; i < this.addSelect.length; i++) {
								if(this.addSelect[i].keywordId == '' || this.addSelect[i].keywordId == undefined) {
									this.removeInput(i);
								}
								var arr = {};
								if(this.addSelect.length > 0 && this.addSelect[i]) {
									arr['keywordId'] = _self.addSelect[i].keywordId;
									arr['keywordTypeId'] = _self.addSelect[i].keywordTypeId;
									data.empiricalResearchKeywordList.push(arr);
								}
								console.log(data.empiricalResearchKeywordList)
							}
							if(operateVue.status === "1") {
								this.$ajax.post(this.api.addEmpiricalResearchInf, data)
									.then((response) => {
										if(response.data.code == "200") {
											this.$message({
												type: 'success',
												message: '添加成功!',
												duration: duration
											});
											scienceMaster.doquery();
											_self.getEditVisible = false;
										} else {
											this.$message({
												type: 'error',
												message: '添加失败' + response.data.message,
												duration: duration
											});
										}
									})
							} else if(operateVue.status === "2") {
								data.informationId = this.data.informationId;
								this.$ajax.post(this.api.editEmpiricalResearchInfById, data)
									.then((response) => {
										if(response.data.code == "200") {
											this.$message({
												type: 'success',
												message: '编辑成功!',
												duration: duration
											});
											scienceMaster.doquery();
											_self.getEditVisible = false;
										} else {
											this.$message({
												type: 'error',
												message: '编辑失败!' + response.data.message,
												duration: duration
											});
										}
									})
							}
						} else {
							console.log('error submit!!');
							return false;
						}
					})
				})
			},
			addInput(obj) {
				if(obj == '' || obj == undefined) {
					alert("请选择关键词类别");
					return false;
				}
				let _that = this;
				for(var i = 0; i < _that.addSelect.length; i++) {
					if(_that.addSelect[i].keywordChineseName == "" || _that.addSelect[i].keywordId == undefined) {
						this.$message({
							type: 'info',
							message: '请先添加未选关键字',
							duration: duration
						});
						return false;
					}
				}
				_that.data.keywordTypeId = obj.keywordTypeId;
				_that.kewordObj.keywordTypeId = _that.data.keywordTypeId;
				_that.data.keywordTypeName = obj.keywordTypeName;
				_that.kewordObj.keywordTypeName = _that.data.keywordTypeName;
				var obj = {
					keywordTypeId: _that.data.keywordTypeId,
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: _that.data.keywordTypeName
				}
				_that.addSelect.push(obj);
			},
			removeInput(index) {
				let _that = this;
				_that.addSelect.splice(index, 1)
			},
			chooseadd(id) {
				let _that = this;
				if(id == 1) {
					_that.$refs.essentialoilname.initData("单方精油的选择", true); //通过$refs找到子组件，并找到方法执行
				}
				if(id == 2) {
					_that.$refs.multipleoilname.initData1("复方精油的选择", true);
				}
				if(id == 3) {
					_that.$refs.abilitymaster.initData("疗愈属性的选择", true);
				}
				if(id == 4) {
					_that.$refs.childChemical.initData("化学成分选择", true); //通过$refs找到子组件，并找到方法执行
				}
				if(id == 5) {
					_that.$refs.conmaster.initData("用途选择", true);
				}
				if(id == 6) {
					_that.$refs.otherkeyword.initData("其他关键字选择", true);
				}

			},
			callOf1(editForm) {　
				this.$confirm('确认取消吗？', '提示', {
					type: 'warning'
				}).then((response) => {　
					this.getEditVisible = false;　　
					this.$refs[editForm].resetFields();
				})
			},
			closeDialog1(formRule) {　　
				/* done();
									location.reload(); */
				this.$refs[formRule].resetFields();
			},

		}
	})

});