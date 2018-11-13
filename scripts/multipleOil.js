$(function() {
	//提示的显示时间
	var duration = '800';
	//复方精油
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var multipleOil = new Vue({
		el: '#multipleOil',
		data: {
			type: "",
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
			axios.get(_self.api.queryAllBlendOilBaseInfPage)
				.then(function(response) {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.loading = false;
				})
		},
		methods: {
			//获取页码
			handleCurrentChange(val) {
				this.type = "1";
				this.page = val;
				this.query();
			},
			//查询，根据关键字和页码进行查询
			query() {
				var _self = this;
				_self.loading = true;
				axios.get(_self.api.queryAllBlendOilBaseInfPage, {
						params: {
							keyword: _self.keyword,
							pageNum: _self.page
						}
					})
					.then(function(response) {
						_self.dataTableSource = response.data.dataList;
						_self.totalNumber = response.data.totalNumber;
						_self.loading = false;
						_self.pageIndex = response.data.pageIndex;
						_self.page = "";
					})
			},
			//关键字回车查询
			doquery() {
				if(this.type == "2") {
					this.page = this.pageIndex;
					this.query();
				}
			},
			//新增
			add() {
				let _self = this;
				operateVue.statusName = "复方精油-新增";
				operateVue.status = "1";
				operateVue.fileListData = []; //初始化图片路径
				operateVue.data.plantPictureUrl = "";
				operateVue.data.plantPictureZipUrl = "";
				operateVue.data = {}; //初始化所有的数据
				operateVue.dynamicTags = []; //初始化Tag，关联的精油
				operateVue.dynamicTags1 = []; //初始化Tag，中文别名
				operateVue.dynamicTags2 = []; //初始化Tag，英文别名
				operateVue.dynamicTags3 = []; //初始化Tag，植物的气味描述别名
				setTimeout(function() {
					operateVue.getEditVisible = true;
				}, 600);
				axios.get(_self.api.queryBlendOilBaseInfPublicByAddBlendOilBaseInf)
					.then(function(response) {
						operateVue.dilutionLevelList = response.data.data.dilutionLevelList; //获取致敏性的下拉列表
						operateVue.avoidSunlightLevelList = response.data.data.avoidSunlightLevelList; //获取光敏性的下拉列表
					})
			},
			//编辑
			getEdit(index, row) {
				let _self = this;
				operateVue.statusName = "复方精油-编辑";
				operateVue.status = "2";
				operateVue.dynamicTags = []; //初始化Tag，关联的精油
				setTimeout(function() {
					operateVue.getEditVisible = true;
				}, 600);
				axios.get(_self.api.queryBlendOilBaseInfEditById, {
						params: {
							oilId: row.oilId
						}
					})
					.then(function(response) {
						var editresponse = response.data.data;
						operateVue.dilutionLevelList = editresponse.blendOilBaseInfPublic.dilutionLevelList;
						operateVue.avoidSunlightLevelList = editresponse.blendOilBaseInfPublic.avoidSunlightLevelList;
						operateVue.dynamicTags1 = editresponse.oilChineseOtherName ? editresponse.oilChineseOtherName.split(';') : "";
						operateVue.dynamicTags2 = editresponse.oilEnglishOtherName ? editresponse.oilEnglishOtherName.split(';') : "";
						operateVue.dynamicTags3 = editresponse.aromaticDescription ? editresponse.aromaticDescription.split(';') : "";
						operateVue.dynamicTags = editresponse.togetherOil ? editresponse.togetherOil.split(';') : "";
						operateVue.dialogImageUrl = _self.api.httpupload + (editresponse.plantPictureUrl == null ? "" : editresponse.plantPictureUrl);
						operateVue.data = editresponse;
						operateVue.data.aromatically = operateVue.data.aromatically ? "1" : "0";
						operateVue.data.topically = operateVue.data.topically ? "1" : "0";
						operateVue.data.internally = operateVue.data.internally ? "1" : "0";
						if(operateVue.dialogImageUrl != _self.api.httpupload) {
							operateVue.fileListData = [{
								url: operateVue.dialogImageUrl
							}];
						} else {
							operateVue.fileListData = [];
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.deleteBlendOilBaseInfById, {
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
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【复方精油-身体系统一览】";
				dialogFrame.operType = "body";
				dialogFrame.contentSrc = "body_oil.html?oilId=" + oilId;
			},
			SecurityHints(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【复方精油-安全提示一览】";
				dialogFrame.operType = "hints";
				dialogFrame.contentSrc = "Security_hints.html?oilId=" + oilId;
			},
			therapeuticAttributes(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【复方精油-疗愈属性一览】";
				dialogFrame.operType = "hints2";
				dialogFrame.contentSrc = "Therapeutic_attributes.html?oilId=" + oilId;
			},
			healing_attribute_oil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【复方精油-用途一览】";
				dialogFrame.operType = "healing_attribute_oil";
				dialogFrame.contentSrc = "healing_attribute_oil.html?oilId=" + oilId;
			},
			essential_oil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【复方精油-单方一览】";
				dialogFrame.operType = "essential_oil";
				dialogFrame.contentSrc = "essential_oil.html?oilId=" + oilId;
			},
			otherKeyOil(row) {
				var oilId = row.oilId;
				var oilName = row.oilChineseName + "【" + row.oilEnglishName + "】";
				dialogFrame.getVisible = true;
				dialogFrame.oilNames = oilName;
				dialogFrame.oilNames1 = "【复方精油-关键词编辑】";
				dialogFrame.operType = "otherKeyOil";
				dialogFrame.contentSrc = "OtherKey_oil.html?oilId=" + oilId;
			}
		}
	})
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			getEditVisible: false,
			statusName: '',
			status: '',
			formLabelWidth: '200px',
			data: {
				oilId: '',
				oilChineseName: '',
				oilChineseOtherName: '',
				oilEnglishName: '',
				oilEnglishOtherName: '',
				oilBrandUs: '',
				aromatically: '',
				topically: '',
				internally: '',
				dilutionLevel: '',
				avoidSunlightLevel: '',
				aromaticDescription: '',
				colorDescription: '',
				description: '',
				togetherOil: '',
				plantPictureUrl: '',
				plantPictureZipUrl: '',
				gmtCreate: '',
				gmtModified: '',
			},
			editFormRules: {
				oilChineseName: [{
					required: true,
					message: '请输入复方精油中文名',
					trigger: 'blur'
				}],
				oilEnglishName: [{
					required: true,
					message: '请输入复方精油英文名',
					trigger: 'blur'
				}]
			},
			dilutionLevelList: [],
			avoidSunlightLevelList: [],
			dynamicTags1: [],
			dynamicTags2: [],
			dynamicTags3: [],
			inputVisible1: false,
			inputVisible2: false,
			inputVisible3: false,
			inputValue1: '',
			inputValue2: '',
			inputValue3: '',
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
			//新增和编辑的提交
			submit(data) {
				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					this.$refs.data.validate((valid) => {
						if(valid) {
							var _self = this;
							multipleOil.type = "2";
							var data = {
								oilChineseName: _self.data.oilChineseName,
								oilChineseOtherName: _self.dynamicTags1.toString(),
								oilEnglishName: _self.data.oilEnglishName,
								oilEnglishOtherName: _self.dynamicTags2.toString(),
								oilBrandUs: _self.data.oilBrandUs,
								aromatically: _self.data.aromatically,
								topically: _self.data.topically,
								internally: _self.data.internally,
								dilutionLevel: _self.data.dilutionLevel,
								avoidSunlightLevel: _self.data.avoidSunlightLevel,
								aromaticDescription: _self.dynamicTags3.toString(),
								colorDescription: _self.data.colorDescription,
								description: _self.data.description,
								togetherOil: _self.data.togetherOil,
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
							if(_self.status === "1") {
								axios.post(_self.api.addBlendOilBaseInf, data)
									.then((response) => {
										if(response.data.code == "200") {
											_self.$message({
												type: 'success',
												message: '添加成功!',
												duration: duration
											});
											multipleOil.doquery();
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
								axios.post(_self.api.editBlendOilBaseInf, data)
									.then((response) => {
										if(response.data.code == "200") {
											$.each(multipleOil.dataTableSource, (i, item) => {
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
											multipleOil.doquery();
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
			uploadUrl() {
				return this.api.uploadUrl;
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
			closeDialog1(formRule) {　
				let _this = this;　
				_this.formRule = {};
				_this.dynamicTags1 = [];
				_this.dynamicTags2 = [];
				_this.dynamicTags3 = [];
				_this.fileListData = [];
				_this.getEditVisible = false;
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
							this.resetcropper();
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
				var files = e.files;
				if(files && files.length > 0) {
					//console.log(files[0])
					this.ImageUrl = URL.createObjectURL(files[0]);
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
					crop: function(event) { //剪裁框发生变化执行的函数。
						this.canvas = this.cropper.getCroppedCanvas({ //使用canvas绘制一个宽和高200的图片
							width: Number(_self.widthxheight.split("*")[0]),
							height: Number(_self.widthxheight.split("*")[1]),
							fillColor: '#fff'
						});
						$('#imga').attr("src", this.canvas.toDataURL("image/jpeg")) //使用canvas toDataURL方法把图片转换为base64格式
					}
				})
			}
		}
	})

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
				if(this.operType === "essential_oil") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
				if(this.operType === "otherKeyOil") {
					document.getElementById('content').contentWindow.location.reload(true);
				}
			}

		}
	})
})