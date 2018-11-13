$(function() {
	//提示的显示时间
	var duration = '800';
	var Security_hints = new Vue({
		el: '#Therapeutic_attributes',
		data: {
			oilId: '',
			dataTableSource: [],
			Therapeuticselect: [],
			id: '',
			chineseName: '',
			description: '',
			physicalMindFlg: '',
			selectpublicMaster: [],
			recommendLevel: '',
			recommendLeveladd: '',
			ruleForm: {
				healingAttributeId: '',
				orderNumber: ''
			},
			rules: {
				healingAttributeId: [{
					required: true,
					message: '请选择安全提示中文名',
					trigger: 'change'
				}],
				orderNumber: [{
						required: true,
						message: '请输入显示序号',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 2,
						message: '长度在 1 到 2 个字符',
						trigger: 'blur'
					}
				]

			}
		},
		beforeCreate: function() {
			var _self = this;
			var oilid = window.document.URL.split("=")[1];
			axios.get(_self.api.queryAllOilHealingAttributeByOilId, {
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
			formatRole: function(row, column) {
				return row.physicalMindFlg == '1' ? "生理" : row.physicalMindFlg == '2' ? "心理" : "未知";
			},
			query() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				axios.get(_self.api.queryAllOilHealingAttributeByOilId, {
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
					//需要更新精油id
					oilId: oilid,
					healingAttributeId: _self.ruleForm.healingAttributeId,
					orderNumber: _self.ruleForm.orderNumber,
					description: _self.description,
					recommendLevel: _self.recommendLeveladd
				}
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].healingAttributeId == _self.ruleForm.healingAttributeId) {
						_self.$message({
							type: 'info',
							message: '数据已存在!',
							duration: duration
						});
						return false;
					}
				}
				if(_self.ruleForm.orderNumber == '' || _self.ruleForm.healingAttributeId == '') {
					_self.$message({
						type: 'info',
						message: '疗愈属性和显示id不能为空!',
						duration: duration
					});
					return false;
				}

				axios.post(_self.api.addOilHealingAttribute, data)
					.then((response) => {
						if(response.data.code == 200) {
							_self.$message({
								type: 'success',
								message: '添加成功!',
								duration: duration
							});
							_self.physicalMindFlg = '';
							_self.description = '';
							_self.recommendLeveladd = '';
							_self.query();
						} else {
							_self.$message({
								type: 'error',
								message: '添加失败!' + response.data.message,
								duration: duration
							});
						}
					})
			},
			phyMindswitch() {
				var _self = this;
				axios.get(_self.api.queryAllHealingAttributeByAddOilHealingAttribute, {
						params: {
							physicalMindFlg: _self.physicalMindFlg
						}
					})
					.then(function(response) {
						_self.ruleForm.healingAttributeId = '';
						_self.Therapeuticselect = response.data.data;

					})
			},
			healingAttribute() {
				var _self = this;
				var type = window.document.URL.split('=')[2];
				if(type) {
					axios.get(_self.api.queryAllHealingAttributeByAddOilHealingAttribute, {
							params: {
								physicalMindFlg: type
							}
						})
						.then((response) => {
							_self.Therapeuticselect = response.data.data;

						})
				}

			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					})
					.then((response) => {
						var _this = this;
						axios.get(_this.api.cancelOilHealingAttributeByOilIdAndHealingAttributeId, {
								params: {
									oilId: row.oilId,
									healingAttributeId: row.healingAttributeId,
									orderNumber: row.orderNumber
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.healingAttributeId !== row.healingAttributeId;
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
			handleEdit(index, row) {
				var _self = this;
				var data = {
					oilId: row.oilId,
					healingAttributeId: row.healingAttributeId,
					orderNumber: row.orderNumber,
					description: row.description,
					recommendLevel: _self.recommendLevel == "" ? 0 : _self.recommendLevel
				}

				axios.post(_self.api.editOilHealingAttribute, data)
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
			resetData(ruleForm) {
				this.$refs[ruleForm].resetFields();
			}
		}
	})
});