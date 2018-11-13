$(function() {
	//提示的显示时间
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	//主窗口vue 实现查询搜索功能，删除功能	
	var conditionMaster = new Vue({
		el: '#conditionMaster',
		data: {
			typeAgeGroup: '',
			typeBaseKind: '',
			typeBodySystem: '',
			dataTableSource: [],
			ageselectedit: [],
			basekindselect: [],
			typebodysystemselect: [],
			typeOrgan: '',
			options: [{
					id: 0,
					label: '通用'
				},
				{
					id: 1,
					label: '男'
				},
				{
					id: 2,
					label: '女'
				}
			],
			props: {
				value: 'id',
				label: 'organName',
				children: 'childList'
			},
			typeSex: '',
			searchOptions: [],
			selectsearchOptionId: [],
			keyword: '',
			typeBodySystem: '',
			parentHealthCondition: [],
			contentHeight: imainHeight
		},
		beforeCreate: function() {
			//初始化将接口中的值传到4个选择框中
			var _self = this;
			axios.get(_self.api.searchAllScreeningInf)
				.then((response) => {
					_self.ageselectedit = response.data.data.typeAgeGroupList;
					_self.basekindselect = response.data.data.typeBaseKindList;
					_self.typebodysystemselect = response.data.data.typeBodySystemList;
					_self.searchOptions = response.data.data.typeOrganList;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		methods: {
			//性别显示
			formatRole: function(row, column) {
				return row.typeSex == '1' ? "男" : row.typeSex == '2' ? "女" : "通用";
			},
			//查询功能
			query() {
				var _self = this;
				var typeOrgan = "";
				var typeOrganClass = "";
				if(_self.selectsearchOptionId && _self.selectsearchOptionId.length > 0) {
					typeOrganClass = _self.selectsearchOptionId.length > 1 ? 2 : 1;
					typeOrgan = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
				}
				axios.get(_self.api.queryAllHealthCondition, {
						params: {
							keyword: _self.keyword,
							typeSex: _self.typeSex,
							typeAgeGroup: _self.typeAgeGroup,
							typeBodySystem: _self.typeBodySystem,
							typeOrgan: typeOrgan,
							typeOrganClass: typeOrganClass,
							typeBaseKind: _self.typeBaseKind
						}
					})
					.then((response) => {
						_self.dataTableSource = response.data.data;
					})
			},
			//增加功能
			add() {
				operateVue.visible = true;
				operateVue.statusName = "新增";
				operateVue.status = "1";
				let _self = this;
				operateVue.data = {
					conditionId: '',
					referenceId: '',
					conditionCnName: '',
					conditionCnOtherName: '',
					conditionEnName: '',
					conditionEnOtherName: '',
					typeSex: '',
					typeAgeGroup: '',
					typeBodySystem: '',
					typeOrgan: '',
					typeBaseKind: '',
					description: '',
					parentId: ''
				}
				operateVue.ageselectedit = [];
				operateVue.basekindselect = [];
				operateVue.typebodysystemselect = [];
				operateVue.typeorganparentselect = [];
				operateVue.typeorganselect = [];
				operateVue.dynamicTags = [];
				operateVue.dynamicTags1 = [];
				operateVue.dynamicTags2 = [];
				operateVue.parentName = '';
				axios.get(_self.api.searchAllScreeningInf)
					.then((response) => {
						operateVue.ageselectedit = response.data.data.typeAgeGroupList;
						operateVue.basekindselect = response.data.data.typeBaseKindList;
						operateVue.typebodysystemselect = response.data.data.typeBodySystemList;
						operateVue.typeorganbodysystemselect = response.data.data.typeBodySystemList;
					})
					.catch((error) => {
						console.log(error);
					});

			},
			//编辑功能
			editRow(index, row) {
				operateVue.visible = true;
				operateVue.statusName = "编辑";
				operateVue.status = "2";
				var _self = this;
				var id = row != null ? row.conditionId : index;
				axios.get(_self.api.queryHealthConditionById, {
						params: {
							conditionId: id
						}
					})

					.then((response) => {
						var editResponse = response.data.data;
						operateVue.ageselectedit = editResponse.healthConditionScreening.typeAgeGroupList;
						operateVue.basekindselect = editResponse.healthConditionScreening.typeBaseKindList;
						operateVue.typebodysystemselect = editResponse.healthConditionScreening.typeBodySystemList;
						operateVue.typeorganbodysystemselect = editResponse.healthConditionScreening.typeBodySystemList;
						operateVue.dynamicTags = editResponse.referenceHealthConditionList ? editResponse.referenceHealthConditionList : [];
						operateVue.dynamicTags1 = editResponse.conditionCnOtherName ? editResponse.conditionCnOtherName.split(';') : "";
						operateVue.dynamicTags2 = editResponse.conditionEnOtherName ? editResponse.conditionEnOtherName.split(';') : "";
						operateVue.parentName = editResponse.parentName;
						axios.get(_self.api.queryTypeOrganByParentId, {
								params: {
									typeOrganClass: '1',
									parentId: editResponse.typeOrganBodySystem
								}
							})
							.then((response1) => {
								operateVue.typeorganparentselect = response1.data.data;
								axios.get(_self.api.queryTypeOrganByParentId, {
										params: {
											typeOrganClass: '2',
											parentId: editResponse.typeOrganParent
										}

									})
									.then((response3) => {
										operateVue.typeorganselect = response3.data.data;
									})
							});
						operateVue.data = editResponse;
					})
					.catch((error) => {
						console.log(error);
					});

			},
			//删除功能
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.cancelHealthConditionById, {
							params: {
								conditionId: row.conditionId
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
						duration: duration
					});
				})
			}
		}
	})
	//副窗口vue实现编辑和增加功能
	var operateVue = new Vue({
		el: "#dialogEdit",
		data: {
			masterstatus: '',
			visible: false,
			status: '',
			statusName: '',
			ageselectedit: [],
			basekindselect: [],
			typebodysystemselect: [],
			typeorganbodysystemselect: [],
			typeorganparentselect: [],
			typeorganselect: [],
			formLabelWidth: '200px',
			typeOrganClass: '',
			dynamicTags1: [],
			dynamicTags2: [],
			inputVisible1: false,
			inputVisible2: false,
			inputValue1: '',
			inputValue2: '',
			dynamicTags: [],
			parentName: '',
			data: {
				conditionId: '',
				parentId: '',
				conditionCnName: '',
				conditionCnOtherName: '',
				conditionEnName: '',
				conditionEnOtherName: '',
				typeAgeGroup: '',
				typeBaseKind: '',
				typeBodySystem: '',
				typeOrganBodySystem: '',
				typeOrganParent: '',
				typeOrgan: '',
				description: '',
				typeSex: '',
				referenceId: '',
			},
			options: [{
					id: 0,
					label: '通用'
				},
				{
					id: 1,
					label: '男'
				},
				{
					id: 2,
					label: '女'
				}
			],
			userMaseterValue: [],
			masterstatus: '',
		},
		methods: {
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
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
					var values = inputValue1.split(/[,，;；\n]/).filter(item => {
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
			handleClose2(tag) {
				this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag), 1);
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
					var values = inputValue2.split(/[,，;；\n]/).filter(item => {
						return item != '' && item != undefined
					})
					values.forEach(element => {
						var index = this.dynamicTags2.findIndex(i => {
							return i == element
						})
						if(index < 0) {
							this.dynamicTags2.push(element);
						}
					});
				}
				this.inputVisible2 = false;
				this.inputValue2 = '';
			},
			//增加或编辑提交
			submit() {
				var _self = this;
				var arr = [];
				var referenceId = "";
				if(_self.dynamicTags && _self.dynamicTags.length > 0) {
					for(var i = 0; i < _self.dynamicTags.length; i++) {
						arr[i] = _self.dynamicTags[i].conditionId
					}
					if(arr && arr.length > 0) {
						referenceId = arr.join(';');
					} else {
						referenceId = "";
					}
				}
				var data = {
					parentId: this.data.parentId == '' ? null : this.data.parentId,
					referenceId: referenceId,
					conditionCnName: this.data.conditionCnName == '' ? null : this.data.conditionCnName,
					conditionCnOtherName: this.dynamicTags1.join(";"),
					conditionEnName: this.data.conditionEnName == '' ? null : this.data.conditionEnName,
					conditionEnOtherName: this.dynamicTags2.join(";"),
					description: this.data.description,
					typeSex: this.data.typeSex,
					typeAgeGroup: this.data.typeAgeGroup,
					typeBaseKind: this.data.typeBaseKind,
					typeBodySystem: this.data.typeBodySystem,
					typeOrgan: this.data.typeOrganParent == '' ? null : this.data.typeOrgan == '' ? this.data.typeOrganParent : this.data.typeOrgan,
				}

				if(this.data.conditionCnName == '' || this.data.conditionCnName == null) {
					this.$message({
						type: 'error',
						message: '中文名不能为空!',
						duration: duration
					});
					return false;
				}
				if(this.data.conditionEnName == '' || this.data.conditionEnName == null) {
					this.$message({
						type: 'error',
						message: '英文名不能为空!',
						duration: duration
					});
					return false;
				}
				if(operateVue.status === "1") {
					axios.post(_self.api.addHealthCondition, data)
						.then((response) => {
							if(response.data.code == "200") {
								this.$message({
									type: 'success',
									message: '添加成功!',
									duration: duration
								});
								conditionMaster.query();
								this.visible = false;
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
					data.conditionId = this.data.conditionId;
					axios.post(_self.api.editHealthConditionById, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(conditionMaster.dataTableSource, function(i, item) {
									if(item.conditionId === data.conditionId) {
										//item = data;
										item.conditionCnName = data.conditionCnName;
										item.conditionCnOtherName = data.conditionCnOtherName;
										item.conditionEnName = data.conditionEnName;
										item.conditionEnOtherName = data.conditionEnOtherName;
										item.typeOrgan = data.typeOrgan;
										item.typeSex = data.typeSex;
										item.typeAgeGroup = data.typeAgeGroup;
										item.typeBaseKind = data.typeBaseKind;

									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								_self.visible = false;
								conditionMaster.query();
							} else {
								this.$message({
									type: 'error',
									message: '编辑失败!' + response.data.message,
									duration: duration
								});
							}
						}).catch((error) => {
							console.log(error);
						});
				}
			},
			//当根据器官身体系统查询的框时，将当前v-model值传入三级联动的二级选择框，二级选择框上传typeOrganBodySystem得到数据
			typeorganbodysystemselectChange() {
				var _self = this;
				_self.data.typeOrganParent = '';
				_self.data.typeOrgan = '';
				if(_self.data.typeOrganBodySystem) {
					axios.get(_self.api.queryTypeOrganByParentId, {
							params: {
								typeOrganClass: '1',
								parentId: _self.data.typeOrganBodySystem
							}
						})
						.then((response) => {
							_self.typeorganparentselect = response.data.data;
						})
						.catch((Error) => {
							console.log(Error);
						})
				} else {
					_self.typeorganparentselect = [];
					_self.typeorganselect = [];
				}
			},
			//当三级联动的主器官系统被改变时，将当前v-model值传入三级联动的三级选择框，三级选择框上传typeOrganParent得到数据

			typeorganparentelectChange() {
				var _self = this;
				_self.data.typeOrgan = ''
				if(_self.data.typeOrganParent) {
					axios.get(_self.api.queryTypeOrganByParentId, {
							params: {
								typeOrganClass: '2',
								parentId: _self.data.typeOrganParent
							}
						})
						.then((response) => {
							_self.typeorganselect = response.data.data;

						})
						.catch((Error) => {
							console.log(Error);
						})

				} else {
					_self.typeorganselect = [];
				}

			},
			//新增父用途和参考用途的组件的值
			enterByValue: function(enterValue) {
				this.userMaseterValue = enterValue;
				if(this.masterstatus === "2") {
					var p1 = this.userMaseterValue;
					if(p1.length == 0) {
						this.$message({
							type: 'info',
							message: '请选择要添加的数据!',
							duration: duration
						});
					} else {
						var arr = {};
						arr['conditionId'] = p1.conditionId;
						arr['conditionCnName'] = p1.conditionCnName;
						operateVue.dynamicTags.push(arr);
					}
				} else if(this.masterstatus === "1") {
					var p1 = this.userMaseterValue;
					if(p1.length == 0) {
						this.$message({
							type: 'info',
							message: '请选择要添加的数据!',
							duration: duration
						});
					} else {
						operateVue.data.parentId = p1.conditionId;
						operateVue.parentName = p1.conditionCnName;
					}
				}
			},
			//父用途打开组件
			fatheruseadd() {
				this.masterstatus = "1";
				var type = "1";
				this.$refs.conmaster.initData1(type, this.masterstatus, "添加父用途", true);

			},
			//参考用途打开组件
			chooseadd() {
				this.masterstatus = "2";
				var type = "";
				this.$refs.conmaster.initData1(type, this.masterstatus, "添加参照用途", true);
			},
			callOf() {　　
				this.visible = false;　　
			},
			refreshparent(){
				this.parentName ="";
				this.data.parentId ="";
			}
		}
	})

});