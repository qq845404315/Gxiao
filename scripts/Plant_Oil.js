$(function() {
	//提示的显示时间
	var duration = '800';
	//植物油
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var PlantOil = new Vue({
		el: '#PlantOil',
		data: {
			page: "",
			totalNumber: 0,
			totalPage: "",
			keyword: "",
			loading: false,
			dataTableSource: [],
			pageIndex: '',
			contentHeight: imainHeight
		},
		beforeCreate: function() {
			var _self = this;
			_self.loading = true;
			axios.get(_self.api.queryAllPagevegetableOilBaseInf)
				.then(function(response) {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.pageIndex = response.data.pageIndex;
					_self.loading = false;
				})
				.catch(error => {
					console.log(error)
				})
		},
		methods: {
			//获取页码
			handleCurrentChange(val) {
				this.page = val;
				this.query();
			},
			//查询，根据关键字和页码进行查询
			query() {
				var _self = this;
				_self.loading = true;
				axios.get(_self.api.queryAllPagevegetableOilBaseInf, {
						params: {
							keyword: _self.keyword,
							pageNum: _self.page
						}
					})
					.then(function(response) {
						_self.dataTableSource = response.data.dataList;
						_self.totalNumber = response.data.totalNumber;
						_self.pageIndex = response.data.pageIndex;
						_self.loading = false;
						_self.page = "";
					})
			},
			add() {
				var _self = this;
				operateVue.statusName = "植物油-新增";
				operateVue.status = "1";
				axios.get(_self.api.queryAllPlantFamilyByEditSingleOilBaseInf)
					.then(response => {
						if(response.data.code === "200") {
							operateVue.selecteditOne = response.data.data;
							axios.get(_self.api.queryPublicvegetableOilBaseInf)
								.then(res => {
									if(res.data.code === "200") {
										operateVue.publicVO = res.data.data;
										setTimeout(function() {
											operateVue.getEditVisible = true;
										}, 600);
									} else {
										_self.$message.error({
											message: response.data.message,
											duration: duration
										});
									}
								})
								.catch(error => {
									console.log(error);
								})
						} else {
							_self.$message.error({
								message: response.data.message,
								duration: duration
							});
						}
					})
					.catch(error => {
						console.log(error);
					})

			},
			getEdit(index, row) {
				var _self = this;
				operateVue.statusName = "植物油-编辑";
				operateVue.status = "2";
				axios.get(_self.api.queryOneByIdvegetableOilBaseInf, {
						params: {
							oilId: row.oilId
						}
					})
					.then(response => {
						if(response.data.code === "200") {
							var editResponse = response.data.data;
							axios.get(_self.api.queryAllPlantFamilyByEditSingleOilBaseInf)
								.then(res => {
									if(res.data.code === "200") {
										operateVue.selecteditOne = res.data.data;
										if(editResponse.plantFamilyId != null) {
											axios.get(_self.api.queryAllPlantFamilyByEditSingleOilBaseInf, {
													params: {
														parentId: editResponse.plantFamilyId
													}
												})
												.then(respon => {
													if(respon.data.code === "200") {
														operateVue.selecteditTwo = respon.data.data;
													} else {
														_self.$message.error({
															message: response.data.message,
															duration: duration
														});
													}
												})
												.catch(error => {
													console.log(error);
												});
										}
									} else {
										_self.$message.error({
											message: response.data.message,
											duration: duration
										});
									}

								})
								.catch(error => {
									console.log(error);
								});
							operateVue.data = editResponse;
							operateVue.data.aromatically = editResponse.aromatically ? "1" : "0";
							operateVue.data.topically = editResponse.topically ? "1" : "0";
							operateVue.data.internally = editResponse.internally ? "1" : "0";
							operateVue.publicVO = editResponse.publicVO;
							operateVue.dynamicTags1 = editResponse.oilChineseOtherName ? editResponse.oilChineseOtherName.split(";") : [];
							operateVue.dynamicTags2 = editResponse.oilEnglishOtherName ? editResponse.oilEnglishOtherName.split(";") : [];
							operateVue.dynamicTags3 = editResponse.aromaticDescription ? editResponse.aromaticDescription.split(";") : [];
							operateVue.dynamicTags4 = editResponse.origin ? editResponse.origin.split(";") : [];
							operateVue.dynamicTags5 = editResponse.oilBotanicalOtherName ? editResponse.oilBotanicalOtherName.split(";") : [];
							if(editResponse.plantPictureUrl) {
								operateVue.fileListData = [{
									url: _self.api.httpupload + editResponse.plantPictureUrl
								}]
							}
							setTimeout(function() {
								operateVue.getEditVisible = true;
							}, 600);
						} else {
							_self.$message.error({
								message: response.data.message,
								duration: duration
							});
						}

					})
					.catch(error => {
						console.log(error);
					});
			},

			therapeuticAttributes(row) {
				var oilId = row.oilId;
				var type = 1;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【植物油-疗愈属性一览】";
				dialogFrame.operType = "hints2";
				dialogFrame.contentSrc = "Therapeutic_attributes.html?oilId=" + oilId + "=" + type;
			},
			healing_attribute_oil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【植物油-用途一览】";
				dialogFrame.operType = "healing_attribute_oil";
				dialogFrame.contentSrc = "healing_attribute_oil.html?oilId=" + oilId;
			},
			chemicalMaster(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【植物油-化学成分一览】";
				dialogFrame.operType = "chemical";
				dialogFrame.contentSrc = "chemical.html?oilId=" + oilId;
				//window.location.href = "chemical.html?oilId=" + oilId;
			},
			otherKeyOil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【植物油-关键词编辑】";
				dialogFrame.operType = "otherKeyOil";
				dialogFrame.contentSrc = "OtherKey_oil.html?oilId=" + oilId;
			},
			//删除
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.cancelByIdvegetableOilBaseInf, {
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
		}

	})
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			getEditVisible: false,
			statusName: '',
			status: '',
			formLabelWidth: '200px',
			data: [],
			publicVO: {
				extractionMethodList: [], //所有萃取方式集合
				plantPartList: [], //萃取植物部位集合
				dryTypeList: [], //干性类型集合
			},
			dataRules: {
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
				]
			},
			dynamicTags1: [],
			dynamicTags2: [],
			dynamicTags3: [],
			dynamicTags4: [],
			dynamicTags5: [],
			inputVisible1: false,
			inputVisible2: false,
			inputVisible3: false,
			inputVisible4: false,
			inputVisible5: false,
			inputValue1: '',
			inputValue2: '',
			inputValue3: '',
			inputValue4: '',
			inputValue5: '',
			selecteditOne: [],
			selecteditTwo: [],
			fileListData: [],
			dialogVisible: false,
			dialogImageUrl: '',
			ImageUrl: "",
			cropper: "",
			canvas: "",
			widthxheight: "",
			picloading: false,
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
			handleClose3(tag) {
				this.dynamicTags3.splice(this.dynamicTags3.indexOf(tag), 1);
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
					var values = inputValue3.split(/[,，;；\n]/).filter(item => {
						return item != '' && item != undefined
					})
					values.forEach(element => {
						var index = this.dynamicTags3.findIndex(i => {
							return i == element
						})
						if(index < 0) {
							this.dynamicTags3.push(element);
						}
					});
				}
				this.inputVisible3 = false;
				this.inputValue3 = '';
			},
			handleClose4(tag) {
				this.dynamicTags4.splice(this.dynamicTags4.indexOf(tag), 1);
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
					var values = inputValue4.split(/[,，;；\n]/).filter(item => {
						return item != '' && item != undefined
					})
					values.forEach(element => {
						var index = this.dynamicTags4.findIndex(i => {
							return i == element
						})
						if(index < 0) {
							this.dynamicTags4.push(element);
						}
					});
				}
				this.inputVisible4 = false;
				this.inputValue4 = '';
			},
			handleClose5(tag) {
				this.dynamicTags5.splice(this.dynamicTags5.indexOf(tag), 1);
			},
			showInput5() {
				this.inputVisible5 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput5.$refs.input.focus();
				});
			},
			handleInputConfirm5() {
				if(this.dynamicTags5 == '') {
					this.dynamicTags5 = [];
				}
				let inputValue5 = this.inputValue5;
				if(inputValue5) {
					var values = inputValue5.split(/[,，;；\n]/).filter(item => {
						return item != '' && item != undefined
					})
					values.forEach(element => {
						var index = this.dynamicTags5.findIndex(i => {
							return i == element
						})
						if(index < 0) {
							this.dynamicTags5.push(element);
						}
					});
				}
				this.inputVisible5 = false;
				this.inputValue5 = '';
			},
			uploadUrl() {
				return this.api.uploadUrl;
			},
			submit() {
				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					this.$refs.data.validate((valid) => {
						if(valid) {
							var _self = this;
							_self.data.publicVO = [];
							var data = {
								oilId: _self.data.oilId,
								oilChineseName: _self.data.oilChineseName,
								oilChineseOtherName: _self.data.oilChineseOtherName,
								oilEnglishName: _self.data.oilEnglishName,
								oilEnglishOtherName: _self.data.oilEnglishOtherName,
								oilBotanicalName: _self.data.oilBotanicalName,
								oilBotanicalOtherName: _self.data.oilBotanicalOtherName,
								plantFamilyId: _self.data.plantFamilyId,
								plantGenusId: _self.data.plantGenusId,
								plantPartId: _self.data.plantPartId,
								extractionMethodId: _self.data.extractionMethodId,
								aromatically: _self.data.aromatically,
								topically: _self.data.topically,
								internally: _self.data.internally,
								dryType: _self.data.dryType,
								aromaticDescription: _self.data.aromaticDescription,
								colorDescription: _self.data.colorDescription,
								origin: _self.data.origin,
								useTaboo: _self.data.useTaboo,
								plantForm: _self.data.plantForm,
								history: _self.data.history,
								description: _self.data.description,
								plantPictureUrl: _self.data.plantPictureUrl,
								plantPictureZipUrl: _self.data.plantPictureZipUrl
							}
							if(_self.dynamicTags1.length) {
								data.oilChineseOtherName = _self.dynamicTags1.join(";");
							}
							if(_self.dynamicTags2.length) {
								data.oilEnglishOtherName = _self.dynamicTags2.join(";");
							}
							if(_self.dynamicTags3.length) {
								data.aromaticDescription = _self.dynamicTags3.join(";");
							}
							if(_self.dynamicTags4.length) {
								data.origin = _self.dynamicTags4.join(";");
							}
							if(_self.dynamicTags5.length) {
								data.oilBotanicalOtherName = _self.dynamicTags5.join(";");
							}
							if(_self.status === "1") {
								axios.post(_self.api.addvegetableOilBaseInf, data)
									.then((response) => {
										if(response.data.code == "200") {
											_self.$message({
												type: 'success',
												message: '添加成功!',
												duration: duration
											});
											PlantOil.page = PlantOil.pageIndex;
											PlantOil.query();
											_self.getEditVisible = false;
										} else {
											_self.$message.error({
												message: '添加失败' + response.data.message,
												duration: duration
											});
										}
									})
									.catch((error) => {
										console.log(error);
									});
							} else if(_self.status === "2") {
								data.oilId = _self.data.oilId;
								axios.post(_self.api.editByIdvegetableOilBaseInf, data)
									.then((response) => {
										if(response.data.code == "200") {
											$.each(PlantOil.dataTableSource, (i, item) => {
												if(item.oilId === data.oilId) {
													item.oilChineseName = data.oilChineseName;
													item.oilChineseOtherName = data.oilChineseOtherName;
													item.oilEnglishName = data.oilEnglishName;
													item.oilEnglishOtherName = data.oilEnglishOtherName;
												}
											})
											_self.$message({
												type: 'success',
												message: '编辑成功!',
												duration: duration
											});
											PlantOil.page = PlantOil.pageIndex;
											PlantOil.query();
											_self.getEditVisible = false;
										} else {
											_self.$message.error({
												message: '编辑失败' + response.data.message,
												duration: duration
											});
										}
									})
									.catch((error) => {
										console.log(error);
									});
							} else {
								console.log('error submit!!');
								return false;
							}
						}
					})
				})
			},
			selectChangeOne() {
				var _this = this;
				operateVue.data.plantGenusId = '';
				if(_this.data.plantFamilyId) {
					axios.get(_this.api.queryAllPlantFamilyByEditSingleOilBaseInf, {
							params: {
								parentId: _this.data.plantFamilyId
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
			closeDialog1(formRule) {　
				let _this = this;　
				_this.formRule = [];
				_this.data = [];
				_this.dynamicTags1 = [];
				_this.dynamicTags2 = [];
				_this.dynamicTags3 = [];
				_this.dynamicTags4 = [];
				_this.dynamicTags5 = [];
				_this.fileListData = [];
				_this.dataRules = [];
				_this.getEditVisible = false;
				//							console.log(_this);
			},
			chooseImg1() {
				this.$message.error("只能上传一个图片");
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			handleRemove(file, fileList) {
				this.data.plantPictureUrl = "";
				this.data.plantPictureZipUrl = "";
				this.$message({
					type: 'info',
					message: '已删除原有图片',
					duration: 6000
				});
			},
			handleAvatarSuccess(res, file) {
				//					        this.imageUrl = URL.createObjectURL(file.raw);
				this.data.plantPictureUrl = res.data.url;
				this.data.plantPictureZipUrl = res.data.picZipUrl;
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isLt10M = file.size / 1024 / 1024 < 10;

				if(!isJPG && !isPNG) {
					this.$message.error('上传图片必须是 JPG/PNG 格式!');
				}
				if(!isLt10M) {
					this.$message.error('上传图片大小不能超过 10MB!');
				}
				return(isJPG || isPNG) && isLt10M;
			},
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
			cropperdemo() {
				var _self = this;
				_self.picloading = true;
				var file = this.dataURLtoBlob($('#imga').attr("src")); //将base64格式图片转换为文件形式
				var formData = new FormData();
				var newImg = new Date().getTime()%20 + '.jpeg'; //给图片添加文件名   如果没有文件名会报错
				formData.append('file', file, newImg) //formData对象添加文件
				axios.post(this.api.uploadUrl, formData)
					.then(response => {
						_self.picloading = false;
						if(response.data.code === "200") {
							_self.data.plantPictureUrl = response.data.data.url;
							_self.data.plantPictureZipUrl = response.data.data.picZipUrl;
							_self.dialogImageUrl = _self.api.httpupload + response.data.data.url;
							_self.fileListData = [{
								url: _self.dialogImageUrl
							}];
							_self.resetcropper();
							_self.dialogVisible = false;
						}

					})
			},
			resetcropper() {
				this.ImageUrl = '';
				if(this.cropper) {
					this.cropper.destroy();
				}

				var image = document.getElementById('img');
				image.outerHTML = image.outerHTML;
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
				var files = e.files;
				if(files && files.length > 0) {
					//console.log(files[0])
					this.ImageUrl = URL.createObjectURL(files[0]);
					$('#img').attr({
						'src': this.ImageUrl
					})
					if(this.cropper) {
						this.cropper.replace(this.ImageUrl);
					}
				}
				this.cropper = new Cropper(image, {
					aspectRatio: Number(this.widthxheight.split("*")[0]) / Number(this.widthxheight.split("*")[1]),
					viewMode: 0,
					dragMode: 'move',
					background: false, //是否显示网格背景
					//					zoomable: false, //是否允许放大图像
					guides: false, //是否显示裁剪框虚线
					crop: function(event) { //剪裁框发生变化执行的函数。
						this.canvas = this.cropper.getCroppedCanvas({ //使用canvas绘制一个宽和高200的图片
							width: Number(_self.widthxheight.split("*")[0]),
							height: Number(_self.widthxheight.split("*")[1]),
							fillColor: '#fff'
						});
						$('#imga').attr("src", this.canvas.toDataURL("image/jpeg ")) //使用canvas toDataURL方法把图片转换为base64格式
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
})