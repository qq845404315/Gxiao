$(function() {
	var Security_hints = new Vue({
		el: '#Security_hints',
		data: {
			oilId: '',
			orderNumber: '',
			safetyWarningId: '',
			dataTableSource: [],
			safetyWarningselect: [],
			id: '',
			chineseName: '',
			description: '',
			message: '',
			addfalse: false,
			ruleForm: {
				safetyWarningId: '',
				orderNumber: ''
			},
			rules: {
				safetyWarningId: [{
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
			axios.get(_self.api.queryAllOilSafetyWarningByOilId, {
					params: {
						oilId: oilid
					}
				})
				.then((response) => {
					_self.dataTableSource = response.data.data;

				}),
				axios.get(_self.api.queryAllSafetyWarningByAddOilSafetyWarning)
				.then((response) => {
					_self.safetyWarningselect = response.data.data;
				})
		},
		methods: {
			query() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				axios.get(_self.api.queryAllOilSafetyWarningByOilId, {
						params: {
							oilId: oilid
						}
					})
					.then((response) => {
						_self.dataTableSource = response.data.data;
					})
			},
			add() {
				var _self = this;
				var oilid = window.document.URL.split("=")[1];
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].safetyWarningId == _self.ruleForm.safetyWarningId) {
						this.$message({
							type: 'info',
							message: '数据已存在!',
							duration: '800'
						});
						return false;
					}
				}
				if(_self.ruleForm.safetyWarningId == '' || _self.ruleForm.orderNumber == '') {
					this.$message({
						type: 'info',
						message: '安全提示和显示顺序不能为空!',
						duration: '800'
					});
					return false;
				}
				var data = {
					//需要更新精油id
					oilId: oilid,
					safetyWarningId: _self.ruleForm.safetyWarningId,
					orderNumber: _self.ruleForm.orderNumber,
					description: _self.description
				}
				axios.post(_self.api.addOilSafetyWarning, data)
					.then((response) => {
						if(response.data.code == 200) {
							this.$message({
								type: 'success',
								message: '添加成功!',
								duration: '800'
							});
							this.query();
						} else {
							this.$message({
								type: 'error',
								message: '添加失败!' + response.data.message,
								duration: '800'
							});

						}
					})
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					})
					.then((response) => {
						var _this = this;
						axios.get(_this.api.cancelOilSafetyWarningByOilIdAndSafetyWarningId, {
								params: {
									oilId: row.oilId,
									safetyWarningId: row.safetyWarningId,
									orderNumber: row.orderNumber
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									this.$message({
										type: 'success',
										message: '删除成功!',
										duration: '800'
									});
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.safetyWarningId !== row.safetyWarningId;
									});
									_this.dataTableSource = noDeleteObj;
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
							duration: '800'
						});
					})
			},
			handleEdit(index, row) {

				var _self = this;
				var data = {
					oilId: row.oilId,
					safetyWarningId: row.safetyWarningId,
					orderNumber: row.orderNumber,
					description: row.description
				}
				axios.post(_self.api.editOilSafetyWarning, data)
					.then((response) => {
						if(response.data.code == 200) {
							this.$message({
								type: 'success',
								message: '编辑成功!',
								duration: '800'
							});
							_self.query();
						} else {
							this.$message({
								type: 'error',
								message: '编辑失败!' + response.data.message,
								duration: '800'
							});
							_self.query();
						}
					})
			},
			handleCurrentChange(row, event, column) {
				console.log(row, event, column, event.currentTarget)

			}
		}
	})
});