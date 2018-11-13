$(function() {
	//提示的显示时间
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var PropertyManagement = new Vue({
		el: "#PropertyManagement",
		data: {
			data: [],
			contentHeight: imainHeight,
			defaultProps: {
				children: 'childList',
				label: 'aclName'
			},
			tableData: [],
			editCheckId:"",
		},
		beforeCreate: function() {
			//初始化树状图
			axios.get(this.api.queryAllMenu2Treeacl)
				.then(response => {
					this.data = response.data.data;
				})
		},
		methods: {
			//初始化列表上新增的按钮
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
								this.addtable();
							}
						}
					}),
				]);
			},
			//						//底层权限类型
			//						formatRole: function(row, column) {
			//							return row.aclType == '2' ? "按钮" : "其他";
			//						},
			//点击菜单得到列表内底层权限
			handleNodeClick(item,node,self) {
//				console.log(item,node,self)
				this.editCheckId = item.id;
				this.$refs.tree.setCheckedKeys([item.id]);
				axios.get(this.api.queryAllByMenuIdacl, {
						params: {
							id: item.id
						}
					})
					.then(response => {
						this.tableData = response.data.data.list;
						operateVue.data.parentIds = response.data.data.parentIds;
						if(operateVue.data.parentIds && operateVue.data.parentIds.length > 0) {
							operateVue.parentid = operateVue.data.parentIds[operateVue.data.parentIds.length - 1];
						}
					})
			},
			checkchange(item,node,self){
//				console.log(item,node,self);
				if(node==true){
					this.editCheckId = item.id;
					this.$refs.tree.setCheckedKeys([item.id]);
				}else{
					if(this.editCheckId == item.id){
						this.$refs.tree.setCheckedKeys([item.id]);
					}
				}
			},
			//可调用更新tree
			query() {
				axios.get(this.api.queryAllMenu2Treeacl)
					.then(response => {
						this.data = response.data.data;
					})
			},
			//新增权限菜单树
			add() {
				var _self = this;
				operateVue.status = '1';
				operateVue.statusName = '新增权限菜单';
				operateVue.data.aclType = 1;
				operateVue.visible = true;
				axios.get(_self.api.queryAllMenu2Treeacl)
					.then(response => {
						if(response.data) {
							operateVue.menuList = response.data.data
							operateVue.data.aclStatus = true;
						}
					})
					.catch(error => {
						console.log(error);
					})
			},
			//编辑权限菜单树
			editnode(data) {
				//							console.log(data);
				operateVue.status = '2';
				operateVue.statusName = '编辑权限菜单';
				operateVue.visible = true;
				axios.get(this.api.queryOneByIdacl, {
						params: {
							id: data.id
						}
					})
					.then(response => {
						operateVue.data = response.data.data
						if(response.data.data) {
							operateVue.menuList = response.data.data.menuList
						}
						operateVue.data.aclStatus = operateVue.data.aclStatus == 0 ? false : true
					})
					.catch(error => {
						console.log(error)
					})
			},
			//删除权限菜单树
			deletenode(data) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					//判断树下有无子权限，如果有则不能删除
					if(data.childList.length != 0) {
						this.$message.info({
							message: '该菜单下存在子菜单',
							duration: duration
						});
						return false;
					}
					axios.get(_this.api.delacl, {
							params: {
								id: data.id
							}
						})
						.then((response) => {
							if(response.data.code === "200") {
								this.$message({
									type: 'success',
									message: '删除成功!',
									duration: duration
								});
								_this.query();
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
			//新增底层权限
			addtable() {
				var _self = this;
				operateVue.status = "3";
				operateVue.statusName = '新增底层权限';
				//打开url输入框
				operateVue.data.aclType = 2;
				operateVue.visible = true;
				axios.get(_self.api.queryAllMenu2Treeacl)
					.then(response => {
						if(response.data) {
							operateVue.menuList = response.data.data
						}
						operateVue.data.aclStatus = true;
					})
					.catch(error => {
						console.log(error);
					})
			},
			//编辑底层权限
			editRow(index, row) {
				operateVue.status = '4';
				operateVue.statusName = '编辑底层权限';
				//打开url输入框
				operateVue.visible = true;
				axios.get(this.api.queryOneByIdacl, {
						params: {
							id: row.id
						}
					})
					.then(response => {
						operateVue.data = response.data.data
						if(response.data.data) {
							operateVue.menuList = response.data.data.menuList
						}
						operateVue.data.aclStatus = operateVue.data.aclStatus == 0 ? false : true
						operateVue.dynamicTags1 = operateVue.data.url ? operateVue.data.url.split(";") : []
					})
					.catch(error => {
						console.log(error)
					})
			},
			//删除列表中底层权限
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.delacl, {
							params: {
								id: row.id
							}
						})
						.then((response) => {
							if(response.data.code === "200") {
								this.$message({
									type: 'success',
									message: '删除成功!',
									duration: duration
								});
								var noDeleteObj = $.grep(_this.tableData, function(obj, i) {
									return obj.id !== row.id;
								});
								operateVue.query();
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
			
		}
	})

	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			visible: false,
			statusName: "",
			data: {
				id: "",
				aclName: "",
				parentIds: [],
				aclStatus: "",
				description: "",
				url: [],
				aclType: "",

			},
			menuList: [],
			props: {
				value: 'id',
				label: 'aclName',
				children: 'childList'
			},
			parentid: '',
			dynamicTags1: [],
			inputVisible1: false,
			inputValue1: '',
		},
		methods: {
			//底层权限列表调用查询
			query() {
				axios.get(this.api.queryAllByMenuIdacl, {
						params: {
							id: this.parentid
						}
					})
					.then(response => {
						PropertyManagement.tableData = response.data.data.list;
					})
			},
			//提交，1为左边树状图中新增提交2，为其编辑
			//3为右边列表新增，4为其编辑
			submit() {
				var _self = this;
				var classify = "";
				var classdata = "";
				if(_self.data.parentIds && _self.data.parentIds.length > 0) {
					classify = _self.data.parentIds.length - 1;
					classdata = _self.data.parentIds[classify];
				}
				var data = {
					id: _self.data.id,
					parentId: classdata,
					aclName: _self.data.aclName,
					aclType: _self.data.aclType,
					url: _self.dynamicTags1.join(";")?_self.dynamicTags1.join(";"):_self.data.url,
					aclStatus: _self.data.aclStatus == true ? 1 : 0,
					description: _self.data.description,
				}
				if(_self.data.aclName == '') {
					this.$message({
						type: 'info',
						message: '权限点名称!',
						duration: duration
					});
					return false;
				}
				if(_self.status === "1") {
					axios.post(_self.api.addacl, data)
						.then((response) => {
							if(response.data.code == 200) {
								this.$message({
									type: 'success',
									message: '添加成功!',
									duration: duration
								});
								PropertyManagement.query();
								_self.offdialog();
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
					axios.post(_self.api.editacl, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(PropertyManagement.data, function(i, item) {
									if(item.id === data.id) {
										//item = data;
										item.id = data.id;
										item.parentIds = data.parentIds;
										item.aclName = data.aclName;
										item.aclStatus = data.aclStatus;
										item.description = data.description;
									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								PropertyManagement.query();
								_self.offdialog();
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
				} else if(_self.status === "3") {
					if(_self.dynamicTags1.length === 0) {
						this.$message({
							type: 'info',
							message: 'url不能为空!',
							duration: duration
						});
						return false;
					}
					axios.post(_self.api.addacl, data)
						.then((response) => {
							if(response.data.code == 200) {
								this.$message({
									type: 'success',
									message: '添加成功!',
									duration: duration
								});
								_self.query();
								_self.offdialog();
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
				} else if(_self.status === "4") {
					data.id = _self.data.id;
					axios.post(_self.api.editacl, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(PropertyManagement.tableData, function(i, item) {
									if(item.id === data.id) {
										//item = data;
										item.id = data.id;
										item.url = data.url;
										item.aclName = data.aclName;
										item.aclStatus = data.aclStatus;
										item.aclType = data.aclType;
										item.description = data.description;
									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								_self.query();
								_self.offdialog();
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
			handleClose1(tag) {
				this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag), 1);
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
					//添加根据对应符号进行分割的操作
					var values = inputValue1.split(/[,，;； \n]/).filter(item => {
						return item != '' && item != undefined
					})
					values.forEach(element => {
						var index = this.dynamicTags1.findIndex(i => {
							return i == element
						})
						if(index < 0) {
							this.dynamicTags1.push(element);
						}
					});
				}
				this.inputVisible1 = false;
				this.inputValue1 = '';
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
						_self.offdialog();
					})
			},
			offdialog() {
				this.data.aclName = '';
				this.data.aclStatus = '';
				this.data.description = '';
				this.dynamicTags1 = [];
				this.data.aclStatus = '';
				this.data.url = '';
			}
		}

	})

})