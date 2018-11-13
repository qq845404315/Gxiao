$(function() {
	//提示的显示时间
	var duration = '800';
	var essential_oil = new Vue({
		el: '#essential_oil',
		data: {
			blendOilId: '',
			dataTableSource: [],
			description: '',
			ruleForm: {
				singleOilId: '',
				importanceOrder: '',
				singleOilIdName: ''
			},
			rules: {
				importanceOrder: [{
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
			axios.get(_self.api.queryAllBlendSingleOilByBlendOilId, {
					params: {
						blendOilId: oilid
					}
				})
				.then(function(response) {
					_self.dataTableSource = response.data.data;

				})
				.catch(function(error) {
					console.log(error);
				});
		},
		methods: {
			//查询功能，根据复方精油id进行查询
			query() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				axios.get(_self.api.queryAllBlendSingleOilByBlendOilId, {
						params: {
							blendOilId: oilid
						}
					})
					.then(function(response) {
						_self.dataTableSource = response.data.data;

					})
			},
			//新增功能，新增时提交复方精油id，单方精油id，显示排序和描述
			add() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				var data = {
					blendOilId: oilid,
					singleOilId: _self.ruleForm.singleOilId,
					importanceOrder: _self.ruleForm.importanceOrder,
					description: _self.description
				}
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].importanceOrder == _self.ruleForm.importanceOrder || _self.dataTableSource[i].singleOilId == _self.ruleForm.singleOilId) {
						this.$message({
							type: 'info',
							message: '数据已存在!',
							duration: duration
						});
						return false;
					}
				}
				if(_self.ruleForm.importanceOrder == '' || _self.ruleForm.singleOilId == '') {
					this.$message({
						type: 'info',
						message: '成分精油ID和重要性顺序不能为空!',
						duration: duration
					});
					return false;
				}
				axios.post(_self.api.addBlendSingleOil, data)
					.then((response) => {
						if(response.data.code == 200) {
							this.$message({
								type: 'success',
								message: '添加成功!',
								duration: duration
							});
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
			//编辑，编辑完提交复方精油id，单方精油id，显示排序和描述
			handleEdit(index, row) {
				var _self = this;
				var data = {
					blendOilId: row.blendOilId,
					singleOilId: row.singleOilId,
					importanceOrder: row.importanceOrder,
					description: row.description
				}
				axios.post(_self.api.editBlendSingleOil, data)
					.then((response) => {
						if(response.data.code == 200) {
							this.$message({
								type: 'success',
								message: '编辑成功!',
								duration: duration
							});
							this.query();
						} else {
							this.$message({
								type: 'error',
								message: '编辑失败!' + response.data.message,
								duration: duration
							});
							this.query();
						}
					})
			},
			//或者表格内点击
			handleCurrentChange(row, event, column) {},
			//删除，根据复方精油和单方精油id进行删除
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						axios.get(_this.api.deleteBlendSingleOil, {
								params: {
									blendOilId: row.blendOilId,
									singleOilId: row.singleOilId,
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.singleOilId !== row.singleOilId;
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
			//调用单方精油组件
			chooseadd() {
				this.$refs.essentialOil.initData("添加单方精油", true);
			},
			//获取单方精油组件中选择的值
			essentialOilByValue: function(enterValue) {
				this.userMaseterValue = enterValue;
				var p1 = this.userMaseterValue;
				if(!p1) {
					alert("请选择要添加的数据！")
					return;
				}
				this.ruleForm.singleOilId = p1.oilId;
				this.ruleForm.singleOilIdName = p1.oilChineseName;

			}
		}
	})
})