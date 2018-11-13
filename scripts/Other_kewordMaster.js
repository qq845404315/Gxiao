$(function() {
	//提示的显示时间
	var duration = '800';
	var imainHeight = $(document).height() - 110;
	var OtherKewordMaster = new Vue({
		el: '#OtherKewordMaster',
		data: {
			type: "",
			dataTableSource: [],
			totalNumber: '',
			keyword: '',
			page: '',
			pageIndex: "",
			contentHeight: imainHeight
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryAllPage)
				.then((response) => {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.pageIndex = response.data.pageIndex;
					_self.page = "";
				})
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.query();
			},
			doquery(type) {
				if(this.type == "2") {
					this.page = this.pageIndex;
					this.query();
					this.page = '';
				}
			},
			query() {
				var _self = this;
				axios.get(_self.api.queryAllPage, {
						params: {
							keyword: _self.keyword,
							pageNum: _self.page
						}
					})
					.then((response) => {
						_self.dataTableSource = response.data.dataList;
						_self.totalNumber = response.data.totalNumber;
						_self.pageIndex = response.data.data.pageIndex;
						_self.page = "";
					}).catch((error) => {
						console.log(error);
					});
			},
			add() {
				operateVue.status = '1';
				operateVue.statusName = '新增';
				operateVue.visible = true;
				operateVue.data = {
					id: '',
					chineseName: '',
					chineseOtherName: '',
					englishName: '',
					englishOtherName: '',
					gmtCreate: '',
					gmtModified: ''
				}
				operateVue.dynamicTags1 = [];
				operateVue.dynamicTags2 = [];
			},
			editrow(index, row) {
				operateVue.status = '2';
				operateVue.statusName = '编辑';
				operateVue.visible = true;
				axios.get(this.api.queryOneById, {
						params: {
							id: row.id
						}
					})
					.then((response) => {
						operateVue.data = response.data.data;
						operateVue.dynamicTags1 = response.data.data.chineseOtherName ? response.data.data.chineseOtherName.split(';') : "";
						operateVue.dynamicTags2 = response.data.data.englishOtherName ? response.data.data.englishOtherName.split(';') : "";
					})
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.delById, {
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
			}
		}
	})
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			status: '',
			statusName: '',
			formLabelWidth: '180px',
			visible: false,
			data: {
				id: '',
				chineseName: '',
				chineseOtherName: '',
				englishName: '',
				englishOtherName: '',
				gmtCreate: '',
				gmtModified: ''
			},
			dynamicTags1: [],
			inputValue1: '',
			inputVisible1: false,
			dynamicTags2: [],
			inputValue2: '',
			inputVisible2: false,
			restaurants: [],
			type: "",
			timeout: null
		},
		beforeCreate: function() {},
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
			submit() {
				var _self = this;
				OtherKewordMaster.type = "2";
				var data = {
					id: _self.data.id == '' ? null : _self.data.id,
					chineseName: _self.data.chineseName == '' ? null : _self.data.chineseName,
					chineseOtherName: _self.dynamicTags1 ? _self.dynamicTags1.join(";") : '',
					englishName: _self.data.englishName,
					englishOtherName: _self.dynamicTags2 ? _self.dynamicTags2.join(";") : '',
				}
				if(data.chineseOtherName.length > 20) {
					this.$message({
						type: 'info',
						message: '中文别名不能超过20位！!',
						duration: duration
					});
					return false;
				}
				if(data.englishOtherName.length > 50) {
					this.$message({
						type: 'info',
						message: '英文别名不能超过50位！!',
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
					axios.post(_self.api.add, data)
						.then((response) => {
							if(response.data.code == 200) {
								this.$message({
									type: 'success',
									message: '添加成功!',
									duration: duration
								});
								OtherKewordMaster.doquery();
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
					axios.post(_self.api.editById, data)
						.then((response) => {
							if(response.data.code == "200") {
								$.each(OtherKewordMaster.dataTableSource, function(i, item) {
									if(item.id === data.id) {
										//item = data;
										item.id = data.id;
										item.chineseName = data.chineseName;
										item.englishName = data.englishName;
										item.chineseOtherName = data.chineseOtherName;
										item.englishOtherName = data.englishOtherName;
									}
								})
								this.$message({
									type: 'success',
									message: '编辑成功！',
									duration: duration
								});
								OtherKewordMaster.doquery();
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
			//输入建议同步数据
			loadAll(type) {
				var _self = this;
				if(this.data.chineseName || this.data.englishName) {
					axios.get(this.api.addKeywordSearchotherKeyword, {
							params: {
								type: type,
								keyword: type == 1 ? this.data.chineseName : this.data.englishName
							}
						})
						.then(response => {
							this.restaurants = response.data.data;
						})
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
						_self.dynamicTags1 = [];
						_self.dynamicTags2 = [];
					})
			},
			offdialog() {
				this.dynamicTags1 = [];
				this.dynamicTags2 = [];
			},
			//数据远程获取
			querySearchAsync(queryString, callback) {
				this.loadAll(type = 1)
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					callback(this.restaurants);
				}, 2000 * Math.random());
			},
			querySearchAsync2(queryString, callback) {
				this.loadAll(type = 2)
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					callback(this.restaurants);
				}, 2000 * Math.random());
			},
			handleSelect(item) {
				this.data.chineseName = item.chineseName;
				this.data.englishName = item.englishName;
			},
		},
	})

})