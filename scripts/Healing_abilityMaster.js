$(function() {
	//提示的显示时间
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var HealingAbilityMaster = new Vue({
		el: '#HealingAbilityMaster',
		data: {
			dataTableSource: [],
			keyword: '',
			physicalMindFlg: '',
			contentHeight: imainHeight
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(this.api.queryAllHealingAttribute)
				.then((response) => {
					_self.dataTableSource = response.data.data;
				})
		},
		methods: {
			formatRole: function(row, column) {
				return row.physicalMindFlg == '1' ? "生理" : row.physicalMindFlg == '2' ? "心理" : "未知";
			},
			query() {
				var _self = this;
				axios.get(_self.api.queryAllHealingAttribute, {
						params: {
							physicalMindFlg: _self.physicalMindFlg,
							keyword: _self.keyword
						}
					})
					.then((response) => {
						_self.dataTableSource = response.data.data;
					})
			},
			add() {
				operateVue.visible = true;
				operateVue.statusName = "新增";
				operateVue.status = "1";
				operateVue.data = {
					physicalMindFlg: '',
					chineseName: '',
					englishName: '',
					chineseOtherName: '',
					englishOtherName: '',
					description: ''
				}
				operateVue.dynamicTags1 = [];
				operateVue.dynamicTags2 = [];
			},
			editrow(index, row) {
				operateVue.visible = true;
				operateVue.statusName = "编辑";
				operateVue.status = "2";
				var _self = this;
				axios.get(_self.api.queryHealingAttributeById, {
					params: {
						id: row.id
					}
				}).then((response) => {
					var editResponse = response.data.data;
					operateVue.dynamicTags1 = editResponse.chineseOtherName ? editResponse.chineseOtherName.split(';') : [];
					operateVue.dynamicTags2 = editResponse.englishOtherName ? editResponse.englishOtherName.split(';') : [];
					operateVue.data = editResponse;
				})
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _self = this;
					axios.get(_self.api.deleteHealingAttributeById, {
							params: {
								id: row.id
							}
						})
						.then((response) => {
							if(response.data.code === "200") {

								var noDeleteObj = $.grep(_self.dataTableSource, function(obj, i) {
									return obj.id !== row.id;
								});
								_self.dataTableSource = noDeleteObj;
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
				});
			},
		}
	})
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			status: '',
			statusName: '',
			visible: false,
			formLabelWidth: '200px',
			data: {
				physicalMindFlg: '',
				chineseName: '',
				englishName: '',
				chineseOtherName: '',
				englishOtherName: '',
				description: ''
			},
			dynamicTags1: [],
			dynamicTags2: [],
			inputVisible1: false,
			inputVisible2: false,
			inputValue1: '',
			inputValue2: '',
		},
		methods: {
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

					this.dynamicTags1.push(inputValue1);
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
					

					this.dynamicTags2.push(inputValue2);
				}
				this.inputVisible2 = false;
				this.inputValue2 = '';
			},
			submit() {
				var _self = this;
				var data = {
					physicalMindFlg: _self.data.physicalMindFlg,
					chineseName: _self.data.chineseName,
					englishName: _self.data.englishName,
					chineseOtherName: _self.dynamicTags1.join(";"),
					englishOtherName: _self.dynamicTags2.join(";"),
					description: _self.data.description
				}
				if(_self.data.physicalMindFlg == '' || _self.data.physicalMindFlg == null) {
					this.$message({
						type: 'info',
						message: '生理&心理标志必选!',
						duration: duration
					});
					return false;
				}
				if(_self.data.chineseName == '' || _self.data.chineseName == null) {
					this.$message({
						type: 'info',
						message: '中文名必填！!',
						duration: duration
					});
					return false;
				}
				if(_self.status === "1") {
					axios.post(_self.api.addHealingAttribute, data)
						.then((response) => {
							if(response.data.code == "200") {
								this.$message({
									type: 'success',
									message: '添加成功！!',
									duration: duration
								});
								HealingAbilityMaster.query();
								_self.visible = false;
							} else {
								this.$message({
									type: 'error',
									message: '添加失败！!' + response.data.message,
									duration: duration
								});
							}
						})
						.catch((error) => {
							console.log(error)
						});
				} else if(_self.status === "2") {
					data.id = _self.data.id;
					axios.post(_self.api.editHealingAttributeById, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(HealingAbilityMaster.dataTableSource, function(i, item) {
									if(item.id === data.id) {
										//item = data;
										item.id = data.id;
										item.physicalMindFlg = data.physicalMindFlg;
										item.chineseName = data.chineseName;
										item.englishName = data.englishName;
										item.chineseOtherName = data.chineseOtherName;
										item.englishOtherName = data.englishOtherName;
										item.description = data.description;
									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功！',
									duration: duration
								});
								HealingAbilityMaster.query();
								_self.visible = false;
							} else {
								this.$message({
									type: 'error',
									message: '编辑失败！!' + response.data.message,
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
				this.visible = false;
				this.dynamicTags1 = [];
				this.dynamicTags2 = [];
				this.data = [];
			}
		}

	})

})