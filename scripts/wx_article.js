$(function() {
	var duration = '800';
	var Wxarticle = new Vue({
		el: '#Wxarticle',
		data: {
			type: "",
			page: "",
			totalNumber: 0,
			loading: false,
			dataTableSource: [],
			keyword: "",
			pageIndex: "",
			props: {
				value: 'keywordTypeId',
				label: 'keywordChineseName',
				children: 'childList'
			},
			selectsearchOptionId: [],
			searchOptions: [],
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryallpage)
				.then((response) => {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.loading = false;
					_self.$ajax.get(_self.api.queryAllRelevanceClass)
						.then((response) => {
							_self.searchOptions = response.data.data;
						})
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		methods: {
			handleCurrentChange(val) {
				this.type = "1";
				this.page = val;
				this.query();
			},
			query() {
				var _self = this;
				var keywordTypeId = "";
				var keywordId = "";
				if(_self.selectsearchOptionId && _self.selectsearchOptionId.length == 1) {
					keywordTypeId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
					keywordId = null;
				}
				if(_self.selectsearchOptionId && _self.selectsearchOptionId.length > 1) {
					keywordTypeId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 2];
					keywordId = _self.selectsearchOptionId[_self.selectsearchOptionId.length - 1];
				}
				_self.loading = true;
				axios.get(_self.api.queryallpage, {
						params: {
							pageNum: this.page,
							keyword: _self.keyword,
							keywordTypeId: keywordTypeId,
							keywordId: keywordId,
						},
					})
					.then((response) => {
						_self.totalNumber = response.data.totalNumber;
						_self.dataTableSource = response.data.dataList;
						_self.loading = false;
						_self.pageIndex = response.data.pageIndex;
						_self.page = "";
					})
					.catch((error) => {
						_self.loading = false;
						this.$message({
							type: 'info',
							message: '查询超时，请重新查询',
							duration: duration
						});
					})
			},
			doquery(type) {
				if(this.type == "2") {
					this.page = this.pageIndex;
					this.query();
				}
			},
			add() {
				operateVue.status = "1";
				operateVue.statusName = "新增";
				operateVue.getEditVisible = true;
				operateVue.addSelect = [];
				let _self = this;
				axios.get(_self.api.queryAllViewKeywordMasterByKeywordType)
					.then((response) => {
						operateVue.selecteditOne = response.data.data;
					})
			},
			editRow(index, row) {
				operateVue.status = "2";
				operateVue.statusName = "编辑";
				operateVue.getEditVisible = true;
				operateVue.addSelect = [];
				let _self = this;
				axios.get(_self.api.queryOneByIdwxarticle, {
						params: {
							articleId: row.articleId
						}
					})
					.then((response) => {
						operateVue.data = response.data.data;
						operateVue.addSelect = response.data.data.researchKeywordList;
						axios.get(_self.api.queryAllViewKeywordMasterByKeywordType)
							.then((response) => {
								operateVue.selecteditOne = response.data.data;
							})
					})
					.catch((error) => {
						console.log(error);
					})
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.delByIdwxarticle, {
							params: {
								articleId: row.articleId
							}
						})
						.then((response) => {
							if(response.data.code === "200") {

								var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
									return obj.articleId !== row.articleId;
								});
								_this.dataTableSource = noDeleteObj;
								this.$message({
									type: 'success',
									message: '删除成功!',
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

	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			status: '',
			statusName: '',
			getEditVisible: false,
			formLabelWidth: '180px',
			selecteditOne: [],
			addSelect: [],
			data: {
				articleId: '',
				url: '',
				titleChinese: '',
				researchKeywordList: [],
				keywordTypeId: '',
				keywordId: '',
				researchKeyword: []
			}
		},
		beforeCreate: function() {

		},
		methods: {
			childByValue: function(childValue) {
				// childValue就是子组件传过来的值
				var _self = this;
				_self.chemicalValue = childValue;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordChineseName: _self.chemicalValue.constituentCnName,
					keywordId: _self.chemicalValue.constituentId,
					keywordTypeName: _self.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
				//							console.log(this.addSelect)
				// this.addSelect=_selectArray;		

			},
			essentialOilByValue: function(Value) {
				//this. = Value;
				var _self = this;
				_self.chemicalValue = Value;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordChineseName: _self.chemicalValue.oilChineseName,
					keywordId: _self.chemicalValue.oilId,
					keywordTypeName: _self.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
			},
			enterByValue: function(Value) {
				var _self = this;
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.conditionCnName,
					keywordId: this.chemicalValue.conditionId,
					keywordTypeName: _self.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
			},
			abilitymasterByValue: function(Value) {
				var _self = this;
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.chineseName,
					keywordId: this.chemicalValue.id,
					keywordTypeName: _self.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
			},
			multipleNameByValue: function(Value) {
				var _self = this;
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.oilChineseName,
					keywordId: this.chemicalValue.oilId,
					keywordTypeName: _self.data.keywordTypeName,
				}

				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
			},
			otherKeywordByValue: function(Value) {
				var _self = this;
				this.chemicalValue = Value;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordChineseName: this.chemicalValue.chineseName,
					keywordId: this.chemicalValue.id,
					keywordTypeName: _self.data.keywordTypeName,
				}
				let _addSelect = this.addSelect
				for(var i = 0; i < _addSelect.length; i++) {
					if(_addSelect[i].keywordChineseName == "" || _addSelect[i].keywordId == undefined) {
						this.addSelect.splice(i, 1);
					}
				}
				this.addSelect.push(obj)
			},
			submit() {
				var _self = this;
				Wxarticle.type = "2";
				var data = {
					articleId: _self.data.articleId,
					url: _self.data.url == '' ? null : _self.data.url,
					titleChinese: _self.data.titleChinese == '' ? null : _self.data.titleChinese,
					researchKeywordList: _self.data.researchKeyword == undefined ? [] : _self.data.researchKeyword
				}
				if(data.url == null || data.url == '') {
					this.$message({
						type: 'info',
						message: 'url不能为空！',
						duration: duration
					});
					return false;
				}
				if(data.titleChinese == null || data.titleChinese == '') {
					this.$message({
						type: 'info',
						message: '标题不能为空！',
						duration: duration
					});
					return false;
				}
				for(var i = 0; i < _self.addSelect.length; i++) {
					if(_self.addSelect[i].keywordId == '' || _self.addSelect[i].keywordId == undefined) {
						_self.removeInput(i);
					}
					var arr = {};
					if(_self.addSelect.length > 0 && _self.addSelect[i]) {
						arr['keywordId'] = _self.addSelect[i].keywordId;
						arr['keywordTypeId'] = _self.addSelect[i].keywordTypeId;
						data.researchKeywordList.push(arr);
					}
					//									console.log(data.researchKeywordList)
				}
				if(_self.status === "1") {
					axios.post(_self.api.addwxarticle, data)
						.then((response) => {
							if(response.data.code == 200) {
								this.$message({
									type: 'success',
									message: '添加成功！!',
									duration: duration
								});
								Wxarticle.doquery();
								_self.getEditVisible = false;
							} else {
								this.$message({
									type: 'error',
									message: '添加失败！!',
									duration: duration
								});
								_self.data.researchKeywordList = [];
							}
						})
						.catch((error) => {
							console.log(error);
						})

				} else if(_self.status === "2") {
					data.articleId = _self.data.articleId;
					axios.post(_self.api.editwxarticle, data)
						.then((response) => {
							if(response.data.code == "200") {
								this.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								Wxarticle.doquery();
								_self.getEditVisible = false;
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
			addInput(obj) {
				if(obj == '' || obj == undefined) {
					this.$message({
						type: 'info',
						message: '请先选择关键字的类别',
						duration: duration
					});
					return false;
				}
				let _self = this;
				for(var i = 0; i < _self.addSelect.length; i++) {
					if(_self.addSelect[i].keywordChineseName == "" ||
						_self.addSelect[i].keywordId == undefined) {
						this.$message({
							type: 'info',
							message: '请先添加未选关键字',
							duration: duration
						});
						return false;
					}
				}
				_self.data.keywordTypeId = obj.keywordTypeId;
				_self.data.keywordTypeName = obj.keywordTypeName;
				var obj = {
					keywordTypeId: _self.data.keywordTypeId,
					keywordId: "",
					keywordChineseName: "",
					keywordTypeName: _self.data.keywordTypeName
				}

				_self.addSelect.push(obj);
			},
			removeInput(index) {
				let _that = this;
				_that.addSelect.splice(index, 1)
			},
			chooseadd(id) {
				let _that = this;
				if(id == 1) {
					_that.$refs.essentialoilname.initData("单方精油的选择", true); //通过$refs找到子组件，并找到方法执行
				}
				if(id == 2) {
					_that.$refs.multipleoilname.initData1("复方精油的选择", true);
				}
				if(id == 3) {
					_that.$refs.abilitymaster.initData("疗愈属性的选择", true);
				}
				if(id == 4) {
					_that.$refs.childChemical.initData("化学成分选择", true); //通过$refs找到子组件，并找到方法执行
				}
				if(id == 5) {
					_that.$refs.conmaster.initData("用途选择", true);
				}
				if(id == 6) {
					_that.$refs.otherkeyword.initData("其他关键字选择", true);
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
						_self.getEditVisible = false;
						_self.data = [];
						_self.addSelect = [];
					})
			},
			offdialog() {
				this.data = [];
				this.addSelect = [];
			}
		}

	})

})