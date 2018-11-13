$(function() {
	//提示的显示时间
	var duration = '800';
	var healing_attribute_oil = new Vue({
		el: '#healing_attribute_oil',
		data: {
			oilId: '',
			dataTableSource: [],
			conditionId: '',
			description: '',
			selectpublicMaster: [],
			recommendLevel: '',
			recommendLeveladd: '',
			ruleForm: {
				conditionId: '',
				orderNumber: '',
				conditionCnName: ''
			},
			rules: {
				orderNumber: [{
						required: true,
						message: '请输入显示序号',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 2,
						message: '输入为数字且长度在 1 到 2 个字符',
						trigger: 'blur'
					}
				]

			},
			userMaseterValue: []
		},
		beforeCreate: function() {
			var _self = this;
			var oilid = window.document.URL.split("=")[1];
			axios.get(_self.api.queryAllOilHealthCondition, {
					params: {
						oilId: oilid
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.data;

				}),
				axios.get(this.api.queryAllByIdpublic, {
					params: {
						id: "recommend_level"
					}
				})
				.then((response) => {
					this.selectpublicMaster = response.data.data;
				})
		},
		methods: {
			query() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				axios.get(_self.api.queryAllOilHealthCondition, {
						params: {
							oilId: oilid
						}
					})
					.then((response) => {
						_self.dataTableSource = response.data.data;

					}),
					axios.get(this.api.queryAllByIdpublic, {
						params: {
							id: "recommend_level"
						}
					})
					.then((response) => {
						this.selectpublicMaster = response.data.data;
					})
			},
			add() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				var data = {
					oilId: oilid,
					conditionId: _self.ruleForm.conditionId,
					orderNumber: _self.ruleForm.orderNumber,
					description: _self.description,
					recommendLevel: _self.recommendLeveladd
				}
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].conditionId == _self.ruleForm.conditionId) {
						this.$message({
							type: 'info',
							message: '数据已存在!',
							duration: duration
						});
						return false;
					}
				}
				if(_self.ruleForm.orderNumber == '' || _self.ruleForm.conditionId == '') {
					this.$message({
						type: 'info',
						message: '用途和显示顺序不能为空!',
						duration: duration
					});
					return false;
				}
				axios.post(_self.api.addOilHealthCondition, data)
					.then((response) => {
						if(response.data.code == 200) {
							this.$message({
								type: 'success',
								message: '添加成功!',
								duration: duration
							});
							_self.ruleForm.conditionId = '';
							_self.ruleForm.conditionCnName = '';
							_self.ruleForm.orderNumber = '';
							_self.description = '';
							_self.recommendLeveladd = '';
							this.query();
						} else {
							this.$message({
								type: 'error',
								message: '添加失败!' + response.data.message,
								duration: duration
							});
						}
					})
			},
			handleEdit(index, row) {
				var _self = this;
				var data = {
					oilId: row.oilId,
					conditionId: row.conditionId,
					orderNumber: row.orderNumber,
					description: row.description,
					recommendLevel: _self.recommendLevel == "" ? 0 : _self.recommendLevel
				}
				axios.post(_self.api.editOilHealthCondition, data)
					.then((response) => {
						if(response.data.code == 200) {
							_self.$message({
								type: 'success',
								message: '编辑成功!',
								duration: duration
							});
							_self.query();
						} else {
							_self.$message({
								type: 'error',
								message: '编辑失败!' + response.data.message,
								duration: duration
							});
							_self.query();
						}
					})

			},
			handleCurrentChange(row, event, column) {
				this.recommendLevel = row.recommendLevel;
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						axios.get(_this.api.cancelOilHealthConditionByOilIdAndConditionId, {
								params: {
									oilId: row.oilId,
									conditionId: row.conditionId,
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.conditionId !== row.conditionId;
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
					});
			},

			chooseadd() {
				this.$refs.conmaster.initData("添加用途", true);
			},
			enterByValue(enterValue) {
				this.userMaseterValue = enterValue;
				var p1 = this.userMaseterValue;
				if(!p1) {
					alert("请选择要添加的数据！")
					return;
				}
				this.ruleForm.conditionId = p1.conditionId;
				this.ruleForm.conditionCnName = p1.conditionCnName;

			}
		}
	})
});