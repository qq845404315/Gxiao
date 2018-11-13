$(function() {
	//提示的显示时间
	var duration = '800';

	//精油身体系统主窗口
	var body_oil = new Vue({
		el: '#body_oil',
		data: {
			oilId: '',
			dataTableSource: [],
			orderNumber: '',
			chineseName: '',
			id: '',
			bodySystemAffectedId: '',
			bodysystemselect: [],
			ruleForm: {
				bodySystemAffectedId: '',
				orderNumber: ''
			},
			rules: {
				bodySystemAffectedId: [{
					required: true,
					message: '请选择身体系统中文名',
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
						message: '输入为数字且长度在 1 到 2 个字符',
						trigger: 'blur'
					}
				]

			}

		},
		//初始化根据精油id加载身体系统信息
		beforeCreate: function() {
			var _self = this;
			var oilid = window.document.URL.split("=")[1];
			axios.get(_self.api.queryAllOilBodySystemByOilId, {
					params: {
						//需要更新精油id
						oilId: oilid
					}
				})
				//返回信息到dataTableSource 表格
				.then((response) => {
					_self.dataTableSource = response.data.data;

				}),

				//调用身体系统信息给bodysystemselect，选择框
				axios.get(_self.api.queryAllBodySystemByAddOilBodySystem)
				.then((response) => {
					_self.bodysystemselect = response.data.data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		methods: {
			//查询（根据精油id查询）
			query() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				axios.get(_self.api.queryAllOilBodySystemByOilId, {
						params: {
							//需要更新精油id
							oilId: oilid
						}
					})
					//返回信息到dataTableSource 表格
					.then((response) => {
						_self.dataTableSource = response.data.data;

					})
			},
			//增加精油关联的身体系统（根据精油id，身体系统id，显示顺序进行新增）
			add() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				var data = {
					//需要更新精油id
					oilId: oilid,
					bodySystemAffectedId: _self.ruleForm.bodySystemAffectedId,
					orderNumber: _self.ruleForm.orderNumber
				}
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].bodySystemAffectedId == _self.ruleForm.bodySystemAffectedId) {
						this.$message({
							type: 'info',
							message: '数据已存在!',
							duration: duration
						});
						return false;
					}
				}
				if(_self.ruleForm.orderNumber == '' || _self.ruleForm.bodySystemAffectedId == '') {
					this.$message({
						type: 'info',
						message: '身体系统和显示顺序不能为空!',
						duration: '800'
					});
					return false;
				}
				axios.post(_self.api.addOilBodySystem, data)
					.then((response) => {
						if(response.data.code == 200) {
							this.$message({
								type: 'success',
								message: '添加成功!',
								duration: duration
							});
							data.oilId = '';
							_self.query();

						} else {
							this.$message({
								type: 'error',
								message: '添加失败!',
								duration: duration
							});
						}
					})
			},
			//根据精油id和身体系统id和排序id进行删除
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						axios.get(_this.api.cancelOilBodySystem, {
								params: {
									oilId: row.oilId,
									bodySystemAffectedId: row.bodySystemAffectedId,
									orderNumber: row.orderNumber
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.bodySystemAffectedId !== row.bodySystemAffectedId;
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
			//点击即编辑功能orderNumber 显示排序列
			handleEdit(index, row) {

				var _self = this;
				var data = {
					oilId: row.oilId,
					bodySystemAffectedId: row.bodySystemAffectedId,
					orderNumber: row.orderNumber
				}
				axios.post(_self.api.editOilBodySystem, data)
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
				console.log(index, row);
			},
			//获取行数并控制输入框显示
			handleCurrentChange(row, event, column) {
				console.log(row, event, column, event.currentTarget)
			}

		}
	})
});