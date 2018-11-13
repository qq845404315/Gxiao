$(function() {
	//提示的显示时间
	var duration = '800';

	/////主窗体的Vue
	var chemicalAdmin = new Vue({
		el: '#chemicalAdmin',
		data: {
			dataTableSource: [],
		},
		//初始化调用（根据传过来的精油id显示对应的化学成分）
		beforeCreate: function() {
			var _self = this;
			var oilid = window.document.URL.split("=")[1];
			_self.$ajax.get(_self.api.queryAllOilConstituent, {
					params: {
						oilId: oilid
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		methods: {
			//查询（根据精油id进行查询，主要用于后面编辑和新增的调用方法）
			query() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				_self.$ajax.get(_self.api.queryAllSingleOilBaseInfPage, {
						params: {
							oilId: oilid
						},
					})
					.then(function(response) {
						_self.dataTableSource = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					})
			},
			//查询所有，同上
			queryAll() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				_self.$ajax.get(_self.api.queryAllOilConstituent, {
						params: {
							oilId: oilid
						},
					})
					.then((response) => {
						_self.dataTableSource = response.data.data;
					})
					.catch((error) => {
						console.log(error);
					})
			},
			//新增调用页面
			add() {
				operateAddVue.getAddVisible = true;
				let _self = this;
				operateAddVue.addForm = {
					constituentId: '',
					constituentCnName: '',
					constituentEnName: '',
					percentLow: '',
					percentHigh: '',
					description: '',
					gmtCreate: '',
					gmtModified: ''
				}
			},
			//编辑调用页面并回显数据
			getEdit(index, row) {
				operateVue.getEditVisible = true;
				let _self = this;
				var oilid = window.document.URL.split("=")[1];
				_self.$ajax.get(_self.api.queryOilConstituentEditByOilIdAndConstituentId, {
						params: {
							oilId: oilid,
							constituentId: row.constituentId,
						}
					})
					.then((response) => {
						var editResponse = response.data.data;
						operateVue.editForm = editResponse;
					})
					.catch((error) => {
						console.log(error);
					});
			},
			//删除，根据精油id和化学成分id
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					var _this = this;
					var oilid = window.document.URL.split("=")[1];
					_this.$ajax.get(_this.api.cancelOilConstituentByOilIdAndConstituentId, {
							params: {
								oilId: oilid,
								constituentId: row.constituentId,
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
						})
						.catch((error) => {
							console.log(error)
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除!',
						duration: duration
					})
				})
			},
		}
	})

	/////编辑数据窗体的Vue
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			getEditVisible: false,
			formLabelWidth: '200px',
			editForm: {
				constituentId: '',
				constituentCnName: '',
				constituentEnName: '',
				percentLow: '',
				percentHigh: '',
				description: '',
				gmtCreate: '',
				gmtModified: ''
			},
			editFormRules: {
				constituentId: [{
					required: true,
					message: '精油化学成分ID',
					trigger: 'blur'
				}],
				constituentCnName: [{
					required: true,
					message: '中文名',
					trigger: 'blur'
				}],
				constituentEnName: [{
					required: true,
					message: '英文名',
					trigger: 'blur'
				}],
				percentLow: [{
						required: true,
						message: '请输入占精油百分比-最低',
						trigger: 'blur'
					},
					{
						validator: function(rule, value, callback) {
							var reg = /^[0]*?(?:99(?:\.(?:[0-8]\d*|9(?:[0-8]\d*)?|99[0]*))?|(?:[0-8]?\d|9[0-8])(?:\.\d+)?)$/g;
							var reg1 = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
							if(!reg.test(value)) {
								callback(new Error('请输入不大于99.99的数字'))
							} else if(!reg1.test(value)) {
								callback(new Error('请输入小数位不超过2位的数值！'))
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				percentHigh: [{
					required: true,
					message: '请输入占精油百分比-最高',
					trigger: 'blur'
				}, {
					validator: function(rule, value, callback) {
						var reg = /^[0]*?(?:99(?:\.(?:[0-8]\d*|9(?:[0-8]\d*)?|99[0]*))?|(?:[0-8]?\d|9[0-8])(?:\.\d+)?)$/g;
						var reg1 = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
						if(!reg.test(value)) {
							callback(new Error('请输入不大于99.99的数字'))
						} else if(!reg1.test(value)) {
							callback(new Error('请输入小数位不超过2位的数值！'))
						} else if(value < operateVue.editForm.percentLow) {
							callback(new Error('精油百分比-最高不低于精油百分比-最低!'))
						} else {
							callback();
						}
					},
					trigger: 'blur'
				}],
			}
		},
		beforeCreate: function() {

		},
		methods: {
			//编辑的提交 
			editSubmit(editForm) {
				var _self = this;
				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					this.$refs[editForm].validate((valid) => {
						if(valid) {
							var data = {
								oilId: window.document.URL.split("=")[1],
								constituentId: this.editForm.constituentId,
								constituentCnName: this.editForm.constituentCnName,
								constituentEnName: this.editForm.constituentEnName,
								percentLow: this.editForm.percentLow,
								percentHigh: this.editForm.percentHigh,
								description: this.editForm.description,
								gmtCreate: this.editForm.gmtCreate,
								gmtModified: this.editForm.gmtModified
							}
							data.oilId = window.document.URL.split("=")[1];
							data.constituentId = this.editForm.constituentId;
							this.$ajax.post(this.api.editOilConstituentByOilIdAndConstituentId, data)
								.then((response) => {
									if(response.data.code == "200") {
										this.$message({
											type: 'success',
											message: '编辑成功!',
											duration: duration
										});
										chemicalAdmin.queryAll();
										_self.getEditVisible = false;
									} else {
										this.$message({
											type: 'error',
											message: '编辑失败!' + response.data.message,
											duration: duration
										})
									}
								})
						} else {
							console.log('error submit!!');
							return false;
						}
					})
				})
			},
			callOf1(data) {　　
				this.getEditVisible = false;　　
				this.$refs[data].resetFields();
			},
			closeDialog1(formRule) {　　
				this.$refs[formRule].resetFields();
			}
		}
	})

	/////添加数据窗体的Vue
	var operateAddVue = new Vue({
		el: '#dialogAdd',
		data: {
			getAddVisible: false,
			formLabelWidth: '200px',
			addForm: {
				constituentId: '',
				constituentCnName: '',
				constituentEnName: '',
				percentLow: '',
				percentHigh: '',
				description: '',
				gmtCreate: '',
				gmtModified: ''
			},
			addFormRules: {
				constituentId: [{
					required: true,
					message: '精油化学成分ID',
					trigger: 'blur'
				}],
				constituentCnName: [{
					required: true,
					message: '中文名',
					trigger: 'blur'
				}],
				constituentEnName: [{
					required: true,
					message: '英文名',
					trigger: 'blur'
				}],
				percentLow: [{
						required: true,
						message: '请输入占精油百分比-最低',
						trigger: 'blur'
					},
					{
						validator: function(rule, value, callback) {
							var reg = /^[0]*?(?:99(?:\.(?:[0-8]\d*|9(?:[0-8]\d*)?|99[0]*))?|(?:[0-8]?\d|9[0-8])(?:\.\d+)?)$/g;
							var reg1 = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
							if(!reg.test(value)) {
								callback(new Error('请输入不大于99.99的数字'))
							} else if(!reg1.test(value)) {
								callback(new Error('请输入小数位不超过2位的数值！'))
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
				percentHigh: [{
						required: true,
						message: '请输入占精油百分比-最高',
						trigger: 'blur'
					},
					{
						validator: function(rule, value, callback) {
							var reg = /^[0]*?(?:99(?:\.(?:[0-8]\d*|9(?:[0-8]\d*)?|99[0]*))?|(?:[0-8]?\d|9[0-8])(?:\.\d+)?)$/g;
							var reg1 = /^\d{0,8}\.{0,1}(\d{1,2})?$/;
							if(!reg.test(value)) {
								callback(new Error('请输入不大于99.99的数字'))
							} else if(!reg1.test(value)) {
								callback(new Error('请输入小数位不超过2位的数值！'))
							} else if(value < operateAddVue.addForm.percentLow) {
								callback(new Error('精油百分比-最高不低于精油百分比-最低!'))
							} else {
								callback();
							}
						},
						trigger: 'blur'
					}
				],
			}
		},
		beforeCreate: function() {

		},
		methods: {
			childByValue: function(childValue) {
				// childValue就是子组件传过来的值
				this.chemicalValue = childValue;
				this.addForm.constituentId = childValue.constituentId;
				this.addForm.constituentCnName = childValue.constituentCnName;
				this.addForm.constituentEnName = childValue.constituentEnName;
			},
			//添加的提交
			addSubmit(addForm) {
				var _self = this;
				this.$refs[addForm].validate((valid) => {
					if(valid) {
						var data = {
							oilid: window.document.URL.split("=")[1],
							constituentId: this.addForm.constituentId,
							constituentCnName: this.addForm.constituentCnName,
							constituentEnName: this.addForm.constituentEnName,
							percentLow: this.addForm.percentLow,
							percentHigh: this.addForm.percentHigh,
							description: this.addForm.description,
							gmtCreate: this.addForm.gmtCreate,
							gmtModified: this.addForm.gmtModified
						}
						data.oilId = window.document.URL.split("=")[1];
						this.$ajax.post(this.api.addOilConstituent, data)
							.then((response) => {
								if(response.data.code == "200") {
									this.$message({
										type: 'success',
										message: '添加成功!',
										duration: duration
									});
									chemicalAdmin.queryAll();
									_self.getAddVisible = false;
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

					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//关闭新增界面时清除所有的输入框数据
			resetForm(addForm) {
				this.$refs[addForm].resetFields();
			},
			//调用化学成分组件
			chemicalMaster() {
				//dialogchoose.getchooseVisible = true;
				//console.log(this.$refs);
				this.$refs.childChemical.initData("化学成分选择", true); //通过$refs找到子组件，并找到方法执行
			},
			//编辑取消时清空表单已填项
			callOf(addForm) {　　
				this.getAddVisible = false;　　
				this.$refs[addForm].resetFields();
			},
			//关闭按钮执行清空表单
			closeDialog(formRule) {　　
				this.$refs[formRule].resetFields();
			}
		}
	})
});