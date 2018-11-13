$(function() {
	//提示的显示时间
	var duration = '800';
	/////主窗体的Vue
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var oilAdmin = new Vue({
		el: '#oilAdmin',
		data: {
			type: "",
			page: "",
			totalNumber: 0,
			keyword: "",
			loading: false,
			dataTableSource: [],
			pageIndex: "",
			contentHeight: imainHeight
		},
		//初始化调用
		beforeCreate: function() {
			//初始化查询获取表格信息
			var _self = this;
			_self.loading = true;
			_self.$ajax.get(_self.api.queryAllSingleOilBaseInfPage)
				.then(function(response) {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.loading = false;
				})
		},
		methods: {
			//或者点击的页码进行查询
			handleCurrentChange(val) {
				this.page = val;
				this.query();
			},
			//查询功能，根据页码和关键字进行查询
			query() {
				var _self = this;
				_self.loading = true;
				_self.$ajax.get(_self.api.queryAllSingleOilBaseInfPage, {
						params: {
							pageNum: _self.page,
							keyword: _self.keyword,
						},
					})
					.then(function(response) {
						_self.totalNumber = response.data.totalNumber;
						_self.dataTableSource = response.data.dataList;
						_self.loading = false;
						_self.pageIndex = response.data.pageIndex;
						_self.page = "";
					})
					.catch(function(errop) {
						console.log(errop);
					})
			},
			doquery() {
				if(this.type == "2") {
					this.page = this.pageIndex;
					this.query();
					this.page = '';
				}
			},
			//新增打开新增的dialog
			add() {
				operateVue.statusName = "单方精油-新增";
				operateVue.status = "1";
				operateVue.dialogImage = '';
				operateVue.dialogZipImage = '';
				operateVue.value5 = '';
				operateVue.fileListData = [];
				operateVue.dynamicTags = [];
				operateVue.dynamicTags1 = [];
				operateVue.dynamicTags2 = [];
				operateVue.dynamicTags3 = [];
				operateVue.dynamicTags4 = [];
				setTimeout(function() {
					operateVue.getEditVisible = true;
				}, 600);
				let _self = this;
				operateVue.editForm = {
						oilId: '',
						oilChineseName: '',
						oilChineseOtherName: '',
						oilEnglishName: '',
						oilEnglishOtherName: '',
						oilBotanicalName: '',
						oilBotanicalOtherName: '',
						plantFamilyId: '',
						plantGenusId: '',
						plantPartId: '',
						extractionMethodId: '',
						dilutionLevel: '',
						avoidSunlightLevel: '',
						aromaticDescription: '',
						aromaticToneId: '',
						aromaticStrengthLevel: '',
						consistencyLevel: '',
						colorDescription: '',
						fda: [],
						aromatically: '',
						topically: '',
						internally: '',
						origin: '',
						plantForm: '',
						history: '',
						description: '',
						plantPictureUrl: '',
						plantPictureZipUrl: '',
						gmtCreate: '',
						gmtModified: '',
						picZipUrl: '',
						url: '',
					},
					_self.$ajax.get(_self.api.queryAllPlantFamilyByEditSingleOilBaseInf)
					.then((response) => {
						operateVue.selecteditOne = response.data.data;
					});
				_self.$ajax.get(_self.api.querySingleOilBasePublicByAddSingleOilBaseInf)
					.then((response) => {
						var addResponse = response.data.data;
						operateVue.editForm1.extractionMethodList = addResponse.extractionMethodList;
						operateVue.editForm1.plantPartList = addResponse.plantPartList;
						operateVue.editForm1.dilutionLevelList = addResponse.dilutionLevelList;
						operateVue.editForm1.avoidSunlightLevelList = addResponse.avoidSunlightLevelList;
						operateVue.editForm1.aromaticToneList = addResponse.aromaticToneList;
						operateVue.options = addResponse.pdaList == null ? [] : addResponse.pdaList;
					})
					.catch(function(error) {
						alert(error)
					});

			},
			//编辑
			getEdit(index, row) {
				let _self = this;
				operateVue.statusName = "单方精油-编辑";
				operateVue.status = "2";
				operateVue.dialogImage = '';
				operateVue.dialogZipImage = '';
				operateVue.value5 = '';
				operateVue.fileListData = [];
				//operateVue.importFileUrl1=_self.api.uploadPicFileByEditSingleOilBaseInf;
				setTimeout(function() {
					operateVue.getEditVisible = true;
				}, 600);

				_self.$ajax.get(_self.api.querySingleOilBaseInfEditById, {
						params: {
							oilId: row.oilId
						}
					})
					.then((response) => {
						var editResponse = response.data.data;
						_self.$ajax.get(_self.api.queryAllPlantFamilyByEditSingleOilBaseInf)
							.then((response1) => {
								operateVue.selecteditOne = response1.data.data;
								if(editResponse.plantFamilyId != null) {
									_self.$ajax.get(_self.api.queryAllPlantFamilyByEditSingleOilBaseInf, {
											params: {
												parentId: operateVue.editForm.plantFamilyId
											}
										})
										.then((response2) => {
											operateVue.selecteditTwo = response2.data.data;
										})
								};
							});
						operateVue.editForm = editResponse;
						operateVue.dynamicTags = editResponse.oilEnglishOtherName ? editResponse.oilEnglishOtherName.split(';') : "";
						operateVue.dynamicTags1 = editResponse.oilBotanicalOtherName ? editResponse.oilBotanicalOtherName.split(';') :
							"";
						operateVue.dynamicTags2 = editResponse.oilChineseOtherName ? editResponse.oilChineseOtherName.split(';') :
							"";
						operateVue.dynamicTags3 = editResponse.origin ? editResponse.origin.split(';') :
							"";
						operateVue.dynamicTags4 = editResponse.aromaticDescription ? editResponse.aromaticDescription.split(';') : "";
						operateVue.editForm1 = editResponse.singleOilBaseInfPublic;
						operateVue.dialogImageUrl = _self.api.httpupload + editResponse.plantPictureUrl;
						operateVue.dialogZipImageUrl = _self.api.httpupload + editResponse.plantPictureZipUrl;
						operateVue.dialogImage = editResponse.plantPictureUrl;
						operateVue.options = editResponse.singleOilBaseInfPublic.pdaList;
						operateVue.dialogZipImage = editResponse.plantPictureZipUrl;
						operateVue.editForm.fda = editResponse.fda ? editResponse.fda.split(';').map(Number) : [];
						operateVue.editForm.aromatically = editResponse.aromatically ? "1" : "0";
						operateVue.editForm.topically = editResponse.topically ? "1" : "0";
						operateVue.editForm.internally = editResponse.internally ? "1" : "0";
						if(operateVue.dialogImageUrl != _self.api.httpupload) {
							operateVue.fileListData = [{
								url: operateVue.dialogImageUrl
							}];

						}

					})
					.catch(function(error) {
						console.log(error);
					});

			},
			//删除功能，根据精油id进行删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					var _this = this;
					_this.$ajax.get(_this.api.cancelSingleOilBaseInfById, {
							params: {
								oilId: row.oilId
							}
						})
						.then((response) => {
							if(response.data.code === "200") {
								var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
									return obj.oilId !== row.oilId;
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
				});
			},
			bodyOil(row) {
				//window.location.href="body_oil.html?id=12";
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【单方精油-身体系统一览】";
				dialogFrame.operType = "body";
				dialogFrame.contentSrc = "body_oil.html?oilId=" + oilId;
			},
			SecurityHints(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【单方精油-安全提示一览】";
				dialogFrame.operType = "hints";
				dialogFrame.contentSrc = "Security_hints.html?oilId=" + oilId;
				//window.location.href = "Security_hints.html?oilId=" + oilId;
			},
			therapeuticAttributes(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【单方精油-疗愈属性一览】";
				dialogFrame.operType = "hints2";
				dialogFrame.contentSrc = "Therapeutic_attributes.html?oilId=" + oilId;
				//window.location.href = "Security_hints.html?oilId=" + oilId;
			},
			chemicalMaster(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【单方精油-化学成分一览】";
				dialogFrame.operType = "chemical";
				dialogFrame.contentSrc = "chemical.html?oilId=" + oilId;
				//window.location.href = "chemical.html?oilId=" + oilId;
			},
			healing_attribute_oil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【单方精油-用途一览】";
				dialogFrame.operType = "healing_attribute_oil";
				dialogFrame.contentSrc = "healing_attribute_oil.html?oilId=" + oilId;
				//window.location.href = "chemical.html?oilId=" + oilId;
			},
			otherKeyOil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【单方精油-关键词编辑】";
				dialogFrame.operType = "otherKeyOil";
				dialogFrame.contentSrc = "OtherKey_oil.html?oilId=" + oilId;
			}
		}
	})

	/////编辑数据窗体的Vue
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			getEditVisible: false,
			selecteditOne: [],
			selecteditTwo: [],
			formLabelWidth: '200px',
			status: '', //辨识新增的删除的标识
			statusName: '',
			dynamicTags: [],
			inputVisible: false,
			inputValue: '',
			dynamicTags1: [],
			inputVisible1: false,
			inputValue1: '',
			dynamicTags2: [],
			inputVisible2: false,
			inputValue2: '',
			dynamicTags3: [],
			inputVisible3: false,
			inputValue3: '',
			dynamicTags4: [],
			inputVisible4: false,
			inputValue4: '',
			options: [],
			editForm: { //后台返回值接受的字段名
				oilId: '',
				oilChineseName: '',
				oilChineseOtherName: '',
				oilEnglishName: '',
				oilEnglishOtherName: '',
				oilBotanicalName: '',
				oilBotanicalOtherName: '',
				plantFamilyId: '',
				plantGenusId: '',
				plantPartId: '',
				extractionMethodId: '',
				dilutionLevel: '',
				avoidSunlightLevel: '',
				aromaticDescription: '',
				aromaticToneId: '',
				aromaticStrengthLevel: '',
				consistencyLevel: '',
				colorDescription: '',
				fda: '',
				aromatically: '',
				topically: '',
				internally: '',
				origin: '',
				plantForm: '',
				history: '',
				description: '',
				plantPictureUrl: '',
				plantPictureZipUrl: '',
				gmtCreate: '',
				gmtModified: '',
			},
			editForm1: { //后台返回接收的数组
				extractionMethodList: [],
				plantPartList: [],
				dilutionLevelList: [],
				avoidSunlightLevelList: [],
				aromaticToneList: [],
				pdaList: []
			},

			editFormRules: {
				oilId: [{
					required: true,
					message: '请输入精油ID',
					trigger: 'blur'
				}, ],
				oilChineseName: [{
						required: true,
						message: '请输入精油中文名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 45,
						message: '长度在 1 到 45 个字符',
						trigger: 'blur'
					}
				],
				oilChineseOtherName: [{
					min: 1,
					max: 100,
					message: '长度在 1 到 100 个字符',
					trigger: 'blur'
				}],
				oilEnglishName: [{
						required: true,
						message: '请输入英文名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 45,
						message: '长度在 1 到 45 个字符',
						trigger: 'blur'
					}
				],
				oilEnglishOtherName: [{
					min: 1,
					max: 100,
					message: '长度在 1 到 100 个字符',
					trigger: 'blur'
				}],
				oilBotanicalName: [{
						required: true,
						message: '请输入植物名称拉丁文',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 100,
						message: '长度在 1 到 100 个字符',
						trigger: 'blur'
					}
				],
				oilBotanicalOtherName: [{
					min: 1,
					max: 100,
					message: '长度在 1 到 100 个字符',
					trigger: 'blur'
				}],
				aromaticDescription: [{
					min: 1,
					max: 100,
					message: '长度在 1 到 100 个字符',
					trigger: 'blur'
				}],
				colorDescription: [{
					min: 1,
					max: 45,
					message: '长度在 1 到 45 个字符',
					trigger: 'blur'
				}],
				origin: [{
					min: 1,
					max: 100,
					message: '长度在 1 到 100 个字符',
					trigger: 'blur'
				}],
				plantForm: [{
					min: 1,
					max: 1024,
					message: '长度在 1 到 1024 个字符',
					trigger: 'blur'
				}],
				history: [{
					min: 1,
					max: 2048,
					message: '长度在 1 到 2048 个字符',
					trigger: 'blur'
				}],
				description: [{
					min: 1,
					max: 2048,
					message: '长度在 1 到 2048 个字符',
					trigger: 'blur'
				}]
			},
			importFileUrl1: '',
			dialogImageUrl: '',
			dialogZipImageUrl: '',
			ImageUrl: [],
			dialogVisible: false,
			fileListData: [],
			dialogImage: '',
			dialogZipImage: '',
			cropper: '',
			canvas: '',
			widthxheight: '',
			files: [],
			picloading: false,
		},
		beforeCreate: function() {

		},
		methods: {
			//提交根据status进行区分提交，1为新增2为编辑
			submit(editForm) {
				var _self = this;

				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					this.$refs[editForm].validate((valid) => {
						if(valid) {
							oilAdmin.type = "2";
							var data = {
								oilId: this.editForm.oilId,
								oilChineseName: this.editForm.oilChineseName,
								oilChineseOtherName: this.oilChineseOtherName == null ? "" : this.editForm.oilChineseOtherName,
								oilEnglishName: this.editForm.oilEnglishName,
								oilEnglishOtherName: this.oilEnglishOtherName == null ? "" : this.dynamicTags.toString(),
								oilBotanicalName: this.editForm.oilBotanicalName,
								oilBotanicalOtherName: this.oilBotanicalOtherName == null ? "" : this.dynamicTags1.toString(),
								plantFamilyId: this.editForm.plantFamilyId,
								plantGenusId: this.editForm.plantGenusId,
								plantPartId: this.editForm.plantPartId,
								extractionMethodId: this.editForm.extractionMethodId,
								dilutionLevel: this.editForm.dilutionLevel,
								avoidSunlightLevel: this.editForm.avoidSunlightLevel,
								aromaticDescription: this.aromaticDescription == null ? "" : this.editForm.aromaticDescription.toString(),
								aromaticToneId: this.editForm.aromaticToneId,
								aromaticStrengthLevel: this.editForm.aromaticStrengthLevel,
								consistencyLevel: this.editForm.consistencyLevel,
								colorDescription: this.editForm.colorDescription,
								fda: this.editForm.fda == null ? "" : this.editForm.fda.join(";"),
								origin: this.origin == null ? "" : this.editForm.origin.toString(),
								plantForm: this.editForm.plantForm,
								history: this.editForm.history,
								description: this.editForm.description,
								plantPictureUrl: "",
								plantPictureZipUrl: this.editForm.plantPictureZipUrl,
								aromatically: this.editForm.aromatically,
								topically: this.editForm.topically,
								internally: this.editForm.internally,
							}
							if(this.dynamicTags.length) {
								data.oilEnglishOtherName = this.dynamicTags.join(";");
							}
							if(this.dynamicTags1.length) {
								data.oilBotanicalOtherName = this.dynamicTags1.join(";");
							}
							if(this.dynamicTags2.length) {
								data.oilChineseOtherName = this.dynamicTags2.join(";");
							}
							if(this.dynamicTags3.length) {
								data.origin = this.dynamicTags3.join(";");
							}
							if(this.dynamicTags4.length) {
								data.aromaticDescription = this.dynamicTags4.join(";");
							}
							data.oilId = this.editForm.oilId;
							data.plantPictureUrl = operateVue.dialogImage;
							data.plantPictureZipUrl = operateVue.dialogZipImage;
							if(this.status === "1") {
								//新增提交
								this.$ajax.post(this.api.addSingleOilBaseInf, data)
									.then((response) => {
										if(response.data.code == "200") {
											this.$message({
												type: 'success',
												message: '添加成功!',
												duration: duration
											});
											_self.getEditVisible = false;
											oilAdmin.doquery();
										} else {
											this.$message({
												type: 'error',
												message: '添加失败!' + response.data.message,
												duration: duration
											});
										}
									})
							} else if(operateVue.status === "2") {
								//编辑提交
								this.$ajax.post(this.api.editSingleOilBaseInfById, data)
									.then((response) => {
										if(response.data.code == "200") {
											this.$message({
												type: 'success',
												message: '编辑成功!',
												duration: duration
											});
											$.each(oilAdmin.dataTableSource, function(i, item) {
												if(item.oilId === data.oilId) {
													item.oilChineseName = data.oilChineseName;
													item.oilChineseOtherName = data.oilChineseOtherName;
													item.oilEnglishName = data.oilEnglishName;
													item.oilEnglishOtherName = data.oilEnglishOtherName;
													item.oilBotanicalName = data.oilBotanicalName;
													item.oilBotanicalOtherName = data.oilBotanicalOtherName;
												}
											})
											_self.getEditVisible = false;
										} else {
											this.$message({
												type: 'error',
												message: '编辑失败!' + response.data.message,
												duration: duration
											});
										}
									})
							} else {
								console.log('error submit!!');
								return false;
							}
						}
					})
				})
			},
			//点击新增或者编辑里面的植物科别的下拉框时，选择完给植物属别赋值
			selectChangeOne() {
				var _this = this;
				operateVue.editForm.plantGenusId = '';
				if(_this.editForm.plantFamilyId) {
					_this.$ajax.get(_this.api.queryAllPlantFamilyByEditSingleOilBaseInf, {
							params: {
								parentId: _this.editForm.plantFamilyId
							}
						})
						.then((response) => {
							_this.selecteditTwo = response.data.data;
						})
						.catch((error) => {
							console.log(error);
						});
				} else {
					_this.selecteditTwo = [];
				}

			},
			handleClosetag(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				if(this.dynamicTags == '') {
					this.dynamicTags = [];
				}
				let inputValue = this.inputValue;
				if(inputValue) {

					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			handleClosetag1(tag1) {
				this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag1), 1);
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
			handleClosetag2(tag2) {
				this.dynamicTags2.splice(this.dynamicTags2.indexOf(tag2), 1);
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
			handleClosetag3(tag3) {
				this.dynamicTags3.splice(this.dynamicTags3.indexOf(tag3), 1);
			},
			showInput3() {
				this.inputVisible3 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput3.$refs.input.focus();
				});
			},
			handleInputConfirm3() {
				if(this.dynamicTags3 == '') {
					this.dynamicTags3 = [];
				}
				let inputValue3 = this.inputValue3;
				if(inputValue3) {
					this.dynamicTags3.push(inputValue3);
				}
				this.inputVisible3 = false;
				this.inputValue3 = '';
			},
			handleClosetag4(tag4) {
				this.dynamicTags4.splice(this.dynamicTags4.indexOf(tag4), 1);
			},
			showInput4() {
				this.inputVisible4 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput4.$refs.input.focus();
				});
			},
			handleInputConfirm4() {
				if(this.dynamicTags4 == '') {
					this.dynamicTags4 = [];
				}
				let inputValue4 = this.inputValue4;
				if(inputValue4) {
					this.dynamicTags4.push(inputValue4);
				}
				this.inputVisible4 = false;
				this.inputValue4 = '';
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
				//alert(66)
				operateVue.dialogImage = '';
				operateVue.dialogZipImage = ''
			},
			//将base64格式图片转换为文件形式
			dataURLtoBlob(dataurl) {
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while(n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime
				});
			},
			handleAvatarSuccess(res, file) {
				// this.dialogImageUrl = URL.createObjectURL(file.raw);
				this.dialogImageUrl = this.api.httpupload + res.data.url;
				this.dialogZipImageUrl = this.api.httpupload + res.data.picZipUrl;
				this.dialogImage = res.data.url;
				this.dialogZipImage = res.data.picZipUrl;
				//this.ImageUrl = res.data.url;
				//$(".uploadedit").children().eq(1).hide()
				//$(".el-upload--picture-card").hide()
			},
			//上传托i按之前的钩子
			beforeAvatarUpload(file) {
				// 文件类型进行判断  
				const isJPEG = file.type === 'image/jpeg';
				const isPNG = file.type === "image/png";
				const isLt2M = file.size / 1024 / 1024 < 2;

				if(!isJPEG && !isPNG) {
					this.$message.error("上传的文件只能是图片格式!");
					return false;
				}
				if(!isLt2M) {
					this.$message.error("上传图片大小不能超过 2MB!");
				}
				return isJPEG || isLt2M || isPNG;
			},
			callOf1(editForm) {　
				this.$confirm('确认取消吗？', '提示', {
					type: 'warning'
				}).then((response) => {　
					this.getEditVisible = false;　　
					this.$refs.editForm.resetFields();
				})
			},
			chooseImg1() {
				this.$message.error("只能上传一个图片");
			},
			uploadUrl() {
				return this.api.uploadUrl;
			},
			cropperdemo() {
				var _self = this;
				_self.picloading = true;
				var file = this.dataURLtoBlob($('#imga').attr("src")); //将base64格式图片转换为文件形式
				var formData = new FormData();
				var newImg = new Date().getTime() + '.jpeg'; //给图片添加文件名   如果没有文件名会报错
				formData.append('file', file, newImg) //formData对象添加文件
				axios.post(this.api.uploadUrl, formData)
					.then(response => {
						_self.picloading = false;
						if(response.data.code === "200") {
							this.dialogImage = response.data.data.url;
							this.dialogZipImage = response.data.data.picZipUrl;
							_self.dialogImageUrl = _self.api.httpupload + response.data.data.url;
							_self.fileListData = [{
								url: operateVue.dialogImageUrl
							}];
							this.$message({
								type: 'success',
								message: '图片上传成功!',
								duration: duration
							});
							_self.resetcropper();
							_self.dialogVisible = false;
						}

					})
			},
			resetcropper() {
				this.files = [];
				this.ImageUrl = '';
				var image = document.getElementById('img');
				image.outerHTML = image.outerHTML;
				if(this.cropper) {
					this.cropper.destroy();
					this.cropper.unbuild();
				}
				$('#img').attr({
					'src': ''
				})
				$('#imga').attr({
					'src': ''
				})
				this.cropper = "";
			},
			picupload() {
				this.dialogVisible = true;
				axios.get(this.api.queryPictureSizeTypeBySubIdpublicMaster, {
						params: {
							subId: 1
						}
					})
					.then(response => {
						this.widthxheight = response.data.data.subName;
					})
			},
			picdemo(e) {
				var _self = this;
				_self.resetcropper();
				var image = document.getElementById('img');
				this.files = e.files;
				if(this.files && this.files.length > 0) {
					//console.log(this.files)
					this.ImageUrl = URL.createObjectURL(this.files[0]);
					if(this.ImageUrl) {
						$('#img').attr({
							'src': this.ImageUrl
						})
					}
				}
				if(this.cropper) {
					this.cropper.replace(this.ImageUrl);
				}
				this.cropper = new Cropper(image, {
					aspectRatio: Number(_self.widthxheight.split("*")[0]) / Number(_self.widthxheight.split("*")[1]),
					viewMode: 0,
					dragMode: 'move',
					background: false, //是否显示网格背景
					//					zoomable: false, //是否允许放大图像
					guides: false, //是否显示裁剪框虚线
					ready: function() {},
					crop: function(event) { //剪裁框发生变化执行的函数。
						this.canvas = this.cropper.getCroppedCanvas({ //使用canvas绘制一个宽和高200的图片
							width: Number(_self.widthxheight.split("*")[0]),
							height: Number(_self.widthxheight.split("*")[1]),
							fillColor: '#fff'
						})
						if(this.canvas) {
							$('#imga').attr("src", this.canvas.toDataURL("image/jpeg")) //使用canvas toDataURL方法把图片转换为base64格式
						}

					}

				})
			},

		}
	})

	/////添加数据窗体的Vue
	var dialogFrame = new Vue({
		el: '#dialogFrame',
		data: {
			getVisible: false,
			oilNames: "",
			oilNames1: "",
			oilId: "",
			operType: "",
			contentSrc: "",
		},
		beforeCreate: function() {

		},
		methods: {
			////关闭事件  可进行相应窗体的刷新
			handleClose() {
				if(this.operType === "body") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
				if(this.operType === "hints") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
				if(this.operType === "hints2") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
				if(this.operType === "chemical") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
				if(this.operType === "healing_attribute_oil") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
				if(this.operType === "otherKeyOil") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
			}

		}
	})

});