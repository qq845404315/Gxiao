$(function() {
	//提示的显示时间
	var duration = '800';
	/////主窗体的Vue，化学成分Master
	var chemicalMaster = new Vue({
		el: '#chemicalMaster',
		data: {
			keyword: "",
			props: {
				value: 'constituentId',
				label: 'constituentCnName',
				children: 'childList'
			},
			selectsearchOptionId: [],
			searchOptions: [],
			dataTableSource: [],
		},
		//初始化调用，获取级联选择框数据
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
			//化学成分Master查询方法根据级联选择器中的层级和化学成分id进行查询，或者关键字全局查询
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
						_self.dataTableSource = response.data.data
					})
					.catch((errop) => {
						console.log(errop);
					})
			},
			//调用查询方法
			doquery() {
				chemicalMaster.query();
			},
			//化学成分Master新增，给三级联动选择框赋值
			add() {
				operateVue.getEditVisible = true;
				operateVue.statusName = "化学成份-新增";
				operateVue.status = "1";
				operateVue.dynamicTags = [];
				operateVue.dynamicTags1 = [];
				operateVue.dynamicTags2 = [];
				let _self = this;
				operateVue.data = {
					constituentId: '',
					constituentCnName: '',
					constituentCnOtherName: '',
					constituentEnName: '',
					constituentEnOtherName: '',
					parentIdFirst: '',
					parentIdSecond: '',
					parentIdThird: '',
					formula: '',
					formulaWeight: '',
					effectPhysiology: '',
					effectDescription: '',
					effectMood: '',
					fromOil: '',
					odorDescription: ''
				}
				operateVue.selecteditThree = [];
				operateVue.selecteditTwo = [];
				if(operateVue.selecteditOne.length <= 0) {
					this.$ajax.get(this.api.queryAllConstituentByclassifyUrl, {
							params: {
								classify: '1'
							},
						})
						.then((response) => {
							operateVue.selecteditOne = response.data.data;
						});
				}
			},
			//化学成分Master编辑，给三级联动选择器赋值，并回显表单数据
			editRow(index, row) {
				operateVue.getEditVisible = true;
				operateVue.statusName = "化学成份-编辑";
				operateVue.status = "2";
				let _self = this;
				_self.$ajax.get(_self.api.queryOneConstituentEditByIdUrl, {
						params: {
							constituentId: row.constituentId
						}
					})
					.then((response) => {
						var editResponse = response.data.data;
						_self.$ajax.get(_self.api.queryAllConstituentByclassifyUrl, {
								params: {
									classify: '1'
								}
							})
							.then((responseC1) => {
								operateVue.selecteditOne = responseC1.data.data;
								if(editResponse.parentIdFirst) {
									_self.$ajax.get(_self.api.queryAllConstituentByclassifyUrl, {
											params: {
												classify: '2',
												parentId: editResponse.parentIdFirst
											}
										})
										.then((response2) => {
											operateVue.selecteditTwo = response2.data.data;
											if(editResponse.parentIdSecond) {
												_self.$ajax.get(_self.api.queryAllConstituentByclassifyUrl, {
														params: {
															classify: '3',
															parentId: editResponse.parentIdSecond
														}
													})
													.then((response3) => {
														operateVue.selecteditThree = response3.data.data;
													})
											}
										})
								};
							});
						operateVue.data = editResponse;
						operateVue.dynamicTags = editResponse.constituentCnOtherName ? editResponse.constituentCnOtherName.split(';') : "";
						operateVue.dynamicTags1 = editResponse.constituentEnOtherName ? editResponse.constituentEnOtherName.split(';') : "";
						operateVue.dynamicTags2 = editResponse.fromOil ? editResponse.fromOil.split(';') : "";
					})
					.catch((error) => {
						console.log(error)
					});
			},
			//化学成分Master删除根据化学成分id进行删除 
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					var _this = this;
					_this.$ajax.get(_this.api.cancelConstituentByIdUrl, {
							params: {
								constituentId: row.constituentId
							}
						})
						.then((response) => {
							if(response.data.code === "200") {
								var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
									return obj.constituentId !== row.constituentId;
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
						}).catch((error) => {
							console.log(error)
						})
				}).catch((error) => {
					this.$message({
						type: 'info',
						message: '已取消删除!',
						duration: duration
					});
				})
			},
			changeck(val) {
				this.multipleSelection = val;
				console.log("multipleSelection", this.multipleSelection)
			},
			goBack: function() {
				window.history.back(-1);
				//window.parent.document.getElementById("content").src="chemical.html";
			},
			determine: function() {
				var p1 = this.multipleSelection;
				if(!p1) {
					alert("请选择要添加的数据！")
					return;
				}
				var p2 = p1.constituentId;
				var p3 = p1.constituentCnName;
				var p4 = p1.constituentEnName;
				window.parent.operateAddVue.addForm.constituentId = p2;
				window.parent.operateAddVue.addForm.constituentCnName = p3;
				window.parent.operateAddVue.addForm.constituentEnName = p4;
				window.close();
			}
		}
	})

	/////编辑和添加数据窗体的Vue
	var operateVue = new Vue({
		el: "#dialogEdit",
		data: {
			getEditVisible: false,
			selecteditOne: [],
			selecteditTwo: [],
			selecteditThree: [],
			dynamicTags: [],
			inputVisible: false,
			inputValue: '',
			dynamicTags1: [],
			inputVisible1: false,
			inputValue1: '',
			dynamicTags2: [],
			inputVisible2: false,
			inputValue2: '',
			formLabelWidth: '155px',
			status: '',
			statusName: '',
			data: {
				constituentId: '',
				constituentCnName: '',
				constituentCnOtherName: '',
				constituentEnName: '',
				constituentEnOtherName: '',
				parentIdFirst: '',
				parentIdSecond: '',
				parentIdThird: '',
				formula: '',
				formulaWeight: '',
				effectPhysiology: '',
				effectDescription: '',
				effectMood: '',
				fromOil: '',
				odorDescription: ''
			},
			rules: {
				constituentCnName: [{
					required: true,
					message: '请输入化学成份中文名',
					trigger: 'blur'
				}],
				constituentEnName: [{
					required: true,
					message: '请输入化学成份英文名',
					trigger: 'blur'
				}],
				parentIdFirst: [{
					required: true,
					message: '请输入一级父分类',
					trigger: 'blur'
				}],
				parentIdSecond: [{
					required: true,
					message: '请输入二级父分类',
					trigger: 'blur'
				}],
				formulaWeight:[{
					required: true,
					message: '请输入分子量',
					trigger: 'blur'
				},{
					validator: function(rule, value, callback) {
						var reg = /^-?\d+(\.\d{1,3})?$/;
							if(!reg.test(value)) {
								callback(new Error('小数位数不能超过三位!'))
							} else {
								callback();
							}
					},
					trigger: 'blur'
				}]
			},
		},
		beforeCreate: function() {

		},
		methods: {
			submit(editForm) {
				var _self = this;
				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					this.$refs[editForm].validate((valid) => {
						if(valid) {
							var data = {
								constituentCnName: this.data.constituentCnName,
								constituentCnOtherName: this.data.constituentCnOtherName,
								constituentEnName: this.data.constituentEnName,
								constituentEnOtherName: this.data.constituentEnOtherName,
								parentIdFirst: this.data.parentIdFirst,
								parentIdSecond: this.data.parentIdSecond,
								parentIdThird: this.data.parentIdThird,
								formula: this.data.formula,
								formulaWeight: Number(this.data.formulaWeight),
								effectPhysiology: this.data.effectPhysiology,
								effectDescription: this.data.effectDescription,
								effectMood: this.data.effectMood,
								fromOil: this.data.fromOil,
								odorDescription: this.data.odorDescription
							}
							if(operateVue.status === "1") {
								data.constituentCnOtherName = this.dynamicTags.join(";");
								data.constituentEnOtherName = this.dynamicTags1.join(";");
								data.fromOil = this.dynamicTags2.join(";");
								this.$ajax.post(this.api.addConstituentByIdUrl, data)
									.then((response) => {
										if(response.data.code == "200") {
											this.$message({
												type: 'success',
												message: '添加成功!',
												duration: duration
											});
											chemicalMaster.query();
											_self.getEditVisible = false;
										} else {
											this.$message({
												type: 'error',
												message: '添加失败!' + response.data.message,
												duration: duration
											});
										}
									})
									.catch((error) => {
										console.log(error);
									});
							} else if(operateVue.status === "2") {
								data.constituentId = this.data.constituentId;
								/* data.constituentCnOtherName = this.dynamicTags.join(";");
								data.constituentEnOtherName = this.dynamicTags1.join(";");
								data.fromOil = this.dynamicTags2.join(";"); */
								if(this.dynamicTags.length) {
									data.constituentCnOtherName = this.dynamicTags.join(";");
								}
								if(this.dynamicTags1.length) {
									data.constituentEnOtherName = this.dynamicTags1.join(";");
								}
								if(this.dynamicTags2.length) {
									data.fromOil = this.dynamicTags2.join(";");
								}
								this.$ajax.post(this.api.editConstituentByIdUrl, data)
									.then((response) => {
										if(response.data.code == "200") {
											$.each(chemicalMaster.dataTableSource, function(i, item) {
												if(item.constituentId === data.constituentId) {
													//item = data;
													item.constituentCnName = data.constituentCnName;
													item.constituentCnOtherName = data.constituentCnOtherName;
													item.constituentEnName = data.constituentEnName;
													item.constituentEnOtherName = data.constituentEnOtherName;
													item.parentIdSecond = data.parentIdSecond;
												}
											})
											this.$message({
												type: 'success',
												message: '编辑成功!',
												duration: duration
											});
											chemicalMaster.query();
											chemicalMaster.selectsearchOptionId = [];
											_self.getEditVisible = false;
										} else {
											this.$message({
												type: 'error',
												message: '编辑失败!' + response.data.message,
												duration: duration
											});
										}
									})
									.catch((error) => {
										console.log(error);
									});
							}
						} else {
							console.log('error submit!!');
							return false;
						}
					})
				})
			},
			selectChangeOne() {
				var _this = this;
				_this.data.parentIdSecond = '';
				_this.data.parentIdThird = '';
				if(_this.data.parentIdFirst) {
					this.$ajax.get(_this.api.queryAllConstituentByclassifyUrl, {
							params: {
								classify: '2',
								parentId: _this.data.parentIdFirst
							}
						})
						.then((response) => {
							_this.selecteditTwo = response.data.data;
						})
						.catch((error) => {
							console.log(error);
						});

				} else {
					_this.selecteditTwo = [];
					_this.selecteditThree = [];
				}
			},
			selectChangeTwo() {
				var _this = this;
				_this.data.parentIdThird = '';
				if(_this.data.parentIdSecond) {
					this.$ajax.get(_this.api.queryAllConstituentByclassifyUrl, {
							params: {
								classify: '3',
								parentId: _this.data.parentIdSecond
							}
						})
						.then((response) => {
							_this.selecteditThree = response.data.data;
						})
						.catch((error) => {
							console.log(error);
						});
				} else {
					_this.selecteditThree = []
				}

			},
			handleClosetag(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				if(this.dynamicTags == '') {
					this.dynamicTags = [];
				}
				let inputValue = this.inputValue;
				if(inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			handleClosetag1(tag1) {
				this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag1), 1);
			},
			showInput1() {
				this.inputVisible1 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput1.$refs.input.focus();
				});
			},
			handleInputConfirm1() {
				if(this.dynamicTags1 == '') {
					this.dynamicTags1 = [];
				}
				let inputValue1 = this.inputValue1;
				if(inputValue1) {
					this.dynamicTags1.push(inputValue1);
				}
				this.inputVisible1 = false;
				this.inputValue1 = '';
			},
			handleClosetag2(tag2) {
				this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
			},
			showInput2() {
				this.inputVisible2 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput2.$refs.input.focus();
				});
			},
			handleInputConfirm2() {
				if(this.dynamicTags2 == '') {
					this.dynamicTags2 = [];
				}
				let inputValue2 = this.inputValue2;
				if(inputValue2) {
					this.dynamicTags2.push(inputValue2);
				}
				this.inputVisible2 = false;
				this.inputValue2 = '';
			},
			callOf(addForm) {　
				this.$confirm('确认取消吗？', '提示', {
					type: 'warning'
				}).then((response) => {　
					this.getEditVisible = false;　　
					this.$refs[addForm].resetFields();
				})
			},
			closeDialog(formRule) {　　
				this.$refs[formRule].resetFields();
			}

		}
	})

});