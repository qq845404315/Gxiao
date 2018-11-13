$(function() {
	//提示的显示时间
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var UserManagement = new Vue({
		el: "#UserManagement",
		data: {
			id: "",
			tableData: [],
			data: [],
			activeName2: 'first',
			contentHeight: imainHeight,
			defaultProps: {
				children: 'childList',
				label: 'aclName'
			},
			defaultExpandedKeys: [],
			defaultCheckedKeys: [],
			notCheckedManagerList: [],
			checkedManagerList: [],
			acldata: [],
			aclmanager: "",
			props: {
				key: "id",
				label: "username",
				//							disabled:"enabled"
			}
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryAllrole)
				.then(response => {
					_self.tableData = response.data.data;
				})
		},
		methods: {
			handleSelectionChange(row) {
				this.id = row.id;
				if(this.activeName2 != "first") {
					this.activeName2 = "first";
				}
				axios.get(this.api.queryAllAclByIdrole, {
						params: {
							id: row.id
						}
					})
					.then(response => {
						if(response.data.data) {
							this.data = response.data.data.aclList;
						}
						this.defaultExpandedKeys = response.data.data.defaultExpandedKeys;
						this.defaultCheckedKeys = response.data.data.defaultCheckedKeys;
					})
					.catch(error => {
						console.log(error);
					})
			},
			handleClick() {
				var _self = this;
				if(_self.id) {
					if(_self.activeName2 == "first") {
						axios.get(_self.api.queryAllAclByIdrole, {
								params: {
									id: _self.id
								}
							})
							.then(response => {
								if(response.data.data) {
									this.data = response.data.data.aclList;
								}
								this.defaultExpandedKeys = response.data.data.defaultExpandedKeys;
								this.defaultCheckedKeys = response.data.data.defaultCheckedKeys;
							})
							.catch(error => {
								console.log(error);
							})
					} else if(_self.activeName2 == "second") {
						axios.get(_self.api.queryAllManagerByIdrole, {
								params: {
									id: _self.id
								}
							})
							.then(response => {
								_self.acldata = response.data.data.managerList;
								_self.aclmanager = response.data.data.checkedManagerIdList;
							})
					}
				}
			},
			aclrolechange() {
				var _self = this;
				axios.post(this.api.addRoleManagerrole, {
						roleId: _self.id,
						managerIdList: _self.aclmanager
					})
					.then(response => {
						if(response.data.code == "200") {
							this.$message({
								type: 'success',
								message: '修改成功!',
								duration: duration
							});
						} else {
							this.$message({
								type: 'error',
								message: '修改失败!' + response.data.message,
								duration: duration
							});
						}
					})
			},
			query() {
				var _self = this;
				axios.get(_self.api.queryAllrole)
					.then(response => {
						_self.tableData = response.data.data;
					})
			},
			renderProductId(h, {
				column
			}) {
				return h('span', [
					h('span', column.label),
					h('el-button', {
						style: 'margin-left: 5px;',
						class: 'el-icon-plus el-button--mini is-circle el-button--warning',
						on: {
							click: () => {
								this.add();
							}
						}
					}),
				]);
			},
			add() {
				operateVue.status = '1';
				operateVue.statusName = '新增';
				operateVue.visible = true;
				operateVue.data = {
					id: "",
					roleName: "",
					roleStatus: true,
					description: ""
				}
			},
			editRow(index, row) {
				operateVue.status = '2';
				operateVue.statusName = '编辑';
				operateVue.visible = true;
				axios.get(this.api.queryOneByIdrole, {
						params: {
							id: row.id
						}
					})
					.then(response => {
						operateVue.data = response.data.data;
						operateVue.data.roleStatus = operateVue.data.roleStatus == 0 ? false : true
						//									if(response.data.data.roleStatus==0){
						//										operateVue.data.roleStatus=false;
						//									}else if(response.data.data.roleStatus==1){
						//										operateVue.data.roleStatus=true;
						//									}
					})
			},
			deleteRow(idnex, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.delrole, {
							params: {
								id: row.id
							}
						})
						.then((response) => {
							if(response.data.code === "200") {
								var noDeleteObj = $.grep(_this.tableData, function(obj, i) {
									return obj.id !== row.id;
								});
								_this.tableData = noDeleteObj;
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
			querytable() {
				axios.get(this.api.queryAllAclByIdrole, {
						params: {
							id: this.id
						}
					})
					.then(response => {
						if(response.data.data) {
							this.data = response.data.data.aclList;
						}
						this.defaultExpandedKeys = response.data.data.defaultExpandedKeys;
						this.defaultCheckedKeys = response.data.data.defaultCheckedKeys;
					})
			},
			addroled() {
				var aclIdList = this.$refs.tree.getCheckedKeys(true);
				console.log(this.$refs.tree.getCheckedKeys(true));
				this.$confirm('确认保存吗？', '提示', {
						confirmButtonText: 'YES',
						cancelButtonText: 'NO',
						type: 'warning'
					}).then((response) => {
						axios.post(this.api.addRoleAclrole, {
								roleId: this.id,
								aclIdList: aclIdList
							})
							.then(response => {
								if(response.data.code === "200") {
									this.$message({
										type: 'success',
										message: '保存成功!',
										duration: duration
									});
									this.querytable();
								} else {
									this.$message({
										type: 'error',
										message: '保存失败!' + response.data.message,
										duration: duration
									});
								}
							})
					})
					.catch(error => {
						this.$message.info({
							message: '已取消保存',
							duration: duration
						});
					})
			}
		}
	})

	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			visible: false,
			statusName: "",
			data: {
				id: "",
				roleName: "",
				roleStatus: "",
				description: ""
			}
		},
		methods: {
			submit() {
				var _self = this;
				var data = {
					id: _self.data.id,
					roleName: _self.data.roleName,
					roleStatus: _self.data.roleStatus == true ? 1 : 0,
					description: _self.data.description,
				}
				if(_self.data.roleName == '') {
					this.$message({
						type: 'info',
						message: '角色名称必填!',
						duration: duration
					});
					return false;
				}
				if(_self.status === "1") {
					axios.post(_self.api.addrole, data)
						.then((response) => {
							if(response.data.code == 200) {
								this.$message({
									type: 'success',
									message: '添加成功!',
									duration: duration
								});
								UserManagement.query();
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
					axios.post(_self.api.editrole, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(UserManagement.tableData, function(i, item) {
									if(item.id === data.id) {
										//item = data;
										item.id = data.id;
										item.roleName = data.roleName;
										item.roleStatus = data.roleStatus;
										item.description = data.description;
									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								UserManagement.query();
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