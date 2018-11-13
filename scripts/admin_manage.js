$(function() {
	//提示的显示时间
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var AdminManage = new Vue({
		el: "#AdminManage",
		data: {
			keyword: "",
			dataTableSource: [],
			contentHeight: imainHeight,
			totalNumber: "",
			password: "",
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryAllPagemanager)
				.then(response => {
					_self.dataTableSource = response.data.dataList;
					for(var i = 0; _self.dataTableSource.length; i++) {
						_self.dataTableSource[i].visible = false;
					}
				})
				.catch((error) => {
					console.log(error)
				})
		},
		methods: {
			formatRole: function(row, column) {
				return row.enabled == true ? "未禁用" : "已禁用";
			},
			//获取页码
			handleCurrentChange(val) {
				this.page = val;
				this.query();
				this.page = '';
			},
			query() {
				var _self = this;
				axios.get(_self.api.queryAllPagemanager, {
						params: {
							keyword: _self.keyword,
							pageNum: _self.page
						}
					})
					.then((response) => {
						_self.dataTableSource = response.data.dataList;
						_self.totalNumber = response.data.totalNumber;
					})
			},
			add() {
				operateVue.status = '1';
				operateVue.statusName = '新增';
				operateVue.pwd = true;
				operateVue.visible = true;
				operateVue.data = {
					id: "",
					username: "",
					realName: "",
					password: "",
					mobile: "",
					enabled: true,
					gmtCreate: "",
					gmtModified: ""
				}
			},
			editrow(index, row) {
				operateVue.status = '2';
				operateVue.statusName = '编辑';
				operateVue.pwd = false;
				operateVue.visible = true;
				axios.get(this.api.queryOneByIdmanager, {
						params: {
							id: row.id
						}
					})
					.then((response) => {
						operateVue.data = response.data.data;
					})

			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.delmanager, {
							params: {
								id: row.id
							}
						})
						.then((response) => {
							if(response.data.code === "200") {
								var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
									return obj.id !== row.id;
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
				}).catch(() => {
					this.$message.info({
						message: '已取消删除',
						duration: duration
					});
				})
			},
			resetpwd(index, row) {
				var _self = this;
				var data = {
					id: row.id,
					password: _self.password
				}
				axios.post(_self.api.restPswmanager, data)
					.then(response => {
						if(response.data.code == "200") {
							this.$message({
								type: 'success',
								message: '密码已重置!',
								duration: duration
							});
							row.visible = false;
							_self.password = "";
						} else {
							this.$message({
								type: 'error',
								message: '重置失败!' + response.data.message,
								duration: duration
							});
						}
					})
					.catch(error => {
						console.log(error);
					})
			},
			cleanpwd(index, row) {
				row.visible = false;
				this.password = "";

			},
		}
	})

	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			status: "",
			statusName: "",
			visible: false,
			pwd: false,
			data: {
				id: "",
				username: "",
				realName: "",
				password: "",
				mobile: "",
				enabled: true,
				gmtCreate: "",
				gmtModified: "",
			}
		},
		methods: {
			submit() {
				var _self = this;
				var data = {
					id: _self.data.id,
					username: _self.data.username,
					realName: _self.data.realName,
					mobile: _self.data.mobile,
					enabled: _self.data.enabled,
				}
				var data1 = {
					id: _self.data.id,
					username: _self.data.username,
					realName: _self.data.realName,
					password: _self.data.password,
					mobile: _self.data.mobile,
					enabled: _self.data.enabled,
				}
				if(_self.data.username == '') {
					this.$message({
						type: 'info',
						message: '用户名必填!',
						duration: duration
					});
					return false;
				}
				if(_self.data.realName == '') {
					this.$message({
						type: 'info',
						message: '真实名称!',
						duration: duration
					});
					return false;
				}
				if(_self.data.mobile == '') {
					this.$message({
						type: 'info',
						message: '手机号必填!',
						duration: duration
					});
					return false;
				}
				if(_self.status === "1") {
					axios.post(_self.api.addmanager, data1)
						.then((response) => {
							if(response.data.code == 200) {
								this.$message({
									type: 'success',
									message: '添加成功!',
									duration: duration
								});
								AdminManage.query();
								_self.visible = false;
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
				} else if(_self.status === "2") {
					data.id = _self.data.id;
					axios.post(_self.api.editmanager, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(AdminManage.dataTableSource, function(i, item) {
									if(item.id === data.id) {
										//item = data;
										item.id = data.id;
										item.username = data.username;
										item.realName = data.realName;
										item.mobile = data.mobile;
									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								AdminManage.query();
								_self.visible = false;
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
			},
			callOf() {
				var _self = this;
				this.$confirm('确认取消吗？', '提示', {
						confirmButtonText: 'YES',
						cancelButtonText: 'NO',
						type: 'warning'
					})
					.then(() => {
						_self.visible = false;
						_self.data = [];
					})
			},
			offdialog() {
				this.data = [];
			}
		}
	})
})