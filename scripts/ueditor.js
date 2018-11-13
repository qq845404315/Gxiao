$(function() {
	var id = window.location.search.substr(window.location.search.lastIndexOf('=') + 1, window.location.search.length);
	//提示的显示时间
	var duration = '800';
	//复方精油
	//表格的高度
	var imainHeight = $(document).height() - 110;

	var dataList = new Vue({
		el: '#dataList',
		data: {
			dataTableSource: [],
			keyword: "",
			page: 0,
			loading: false,
			totalNumber: 0,
			contentHeight: imainHeight,

		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryAllinsideRichText, {
					params: {
						keyword: _self.keyword,
						pageNum: _self.page
					}
				})
				.then(response => {
					_self.dataTableSource = response.data.dataList;
					_self.totalNumber = response.data.totalNumber;
					_self.pageIndex = response.data.pageIndex;
				})
				.catch(error => {
					console.log(error)
				})
		},
		methods: {
			getimgurl(row) {
				return this.api.httpupload + row.coverPictureUrl;
			},
			getaudiourl(row) {
				return this.api.httpupload + row.voiceUrl;
			},
			//获取页码
			handleCurrentChange(val) {
				this.page = val;
				this.query();
			},
			query() {
				var _self = this;
				_self.loading = true;
				axios.get(_self.api.queryAllinsideRichText, {
						params: {
							keyword: _self.keyword,
							pageNum: _self.page
						}
					})
					.then(response => {
						_self.dataTableSource = response.data.dataList;
						_self.totalNumber = response.data.totalNumber;
						_self.loading = false;
						_self.pageIndex = response.data.pageIndex;
						_self.page = 0;
					})
					.catch(error => {
						console.log(error)
					})
			},
			add() {
				var _self = this;
				ueditor.distextid = false;
				ueditor.status = "1";
				ueditor.statusName = "新增富文本";
				ueditor.getEditVisible = true;
				setTimeout(function() {
					ueditor.getedit();
				}, 100)
				axios.get(_self.api.queryAllViewKeywordMasterByKeywordType)
					.then((res) => {
						if(res.data.code === "200") {
							ueditor.selecteditOne = res.data.data;
						}
					})
					.catch(erro => {
						console.log(erro);
					});

			},
			getueditorEdit(index, row) {
				var _self = this;
				ueditor.distextid = true;
				ueditor.status = "2";
				ueditor.statusName = "编辑富文本";
				ueditor.getEditVisible = true;
				axios.get(_self.api.queryOneByIdinsideRichText, {
						params: {
							textId: row.textId
						}
					})
					.then(response => {
						if(response.data.code === "200") {
							ueditor.data = response.data.data;
							axios.get(_self.api.queryAllViewKeywordMasterByKeywordType)
								.then((res) => {
									if(res.data.code === "200") {
										ueditor.selecteditOne = res.data.data;
									}
								})
								.catch(erro => {
									console.log(erro);
								});
							ueditor.addSelect = ueditor.data.keywordList;
							ueditor.getedit();

							//										console.log(response.data.data)
						}

					})
			},
			handleDel(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					confirmButtonText: 'YES',
					cancelButtonText: 'NO',
					type: 'warning'
				}).then((response) => {
					var _this = this;
					axios.get(_this.api.delByIdinsideRichText, {
							params: {
								textId: row.textId
							}
						})
						.then((response) => {
							if(response.data.code === "200") {

								var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
									return obj.textId !== row.textId;
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
			}
		}
	})

	var ueditor = new Vue({
		el: "#ueditor",
		data: {
			status: "",
			Ueditor: "",
			getEditVisible: false,
			dialogVisible: false,
			statusName: "",
			data: {
				coverPictureUrl: "",
				voiceUrl: "",
				selectKeywordObj: "",
				keywordList: [],
				htmlText: "",
			},
			ImageUrl: "",
			cropper: "",
			canvas: "",
			widthxheight: "",
			selecteditOne: [],
			addSelect: [],
			distextid: true,
			//						content: '',
		},
		methods: {
			getimgurl() {
				if(this.data.coverPictureUrl) {
					return this.api.httpupload + this.data.coverPictureUrl;
				}
			},
			getaudiourl() {
				if(this.data.voiceUrl) {
					return this.api.httpupload + this.data.voiceUrl;
				}
			},
			getaudioupload() {
				return '';
			},
			offdialog() {
				if(this.Ueditor) {
					this.Ueditor.destroy();
				}
				this.data = {
					coverPictureUrl: "",
					voiceUrl: "",
					selectKeywordObj: "",
					keywordList: [],
					htmlText: "",
				};
				this.addSelect = [];
				$('#audio').attr({
					'src': ''
				})
				this.Ueditor = "";
				this.content = "";
			},
			getedit() {
				UE.delEditor('editor')
				this.Ueditor = UE.getEditor('editor', {
					textarea: this.content,
					initialFrameWidth: "100%",
					initialFrameHeight: 500
				});
				this.Ueditor.ready(function() {
					ueditor.Ueditor.setContent(ueditor.data.htmlText);

				});
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
			picupload() {
				this.dialogVisible = true;
				axios.get(this.api.queryPictureSizeTypeBySubIdpublicMaster, {
						params: {
							subId: 3
						}
					})
					.then(response => {
						this.widthxheight = response.data.data.subName;
						this.Ueditor.setHide();
					})
			},
			picdemo(e) {
				var _self = this;
				_self.resetcropper();
				var image = document.getElementById('img');
				var files = e.files;
				if(files && files.length > 0) {
					//								console.log(files[0])
					this.ImageUrl = URL.createObjectURL(files[0]);
					$('#img').attr({
						'src': this.ImageUrl
					})
					if(this.cropper) {
						this.cropper.replace(this.ImageUrl);
					}
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
						$('#imga').attr("src", this.canvas.toDataURL("image/jpeg ")) //使用canvas toDataURL方法把图片转换为base64格式
					}
				})
			},
			resetcropper(value) {
				this.ImageUrl = '';
				if(this.cropper) {
					this.cropper.destroy();
				}
				$('#img').attr({
					'src': ''
				})
				$('#imga').attr({
					'src': ''
				})
				this.cropper = "";
				if(value == 1) {
					this.Ueditor.setShow();
				}
			},
			cropperdemo() {
				var _self = this;
				var file = this.dataURLtoBlob($('#imga').attr("src")); //将base64格式图片转换为文件形式
				var formData = new FormData();
				var newImg = new Date().getTime() % 20 + '.jpeg'; //给图片添加文件名   如果没有文件名会报错
				formData.append('file', file, newImg) //formData对象添加文件
				axios.post(this.api.uploadUrl, formData)
					.then(response => {
						if(response.data.code === "200") {
							_self.data.coverPictureUrl = response.data.data.url
							_self.resetcropper();
							_self.dialogVisible = false;
						}

					})
			},
			beforeadMusicUpload(file) {
				const islimitFormate = file.type === 'audio/mp3';
				//							const isLt10M = file.size / 1024 / 1024 < 10;
				if(!islimitFormate) {
					this.$message.error({
						message: '上传音频必须是 MP3 格式!',
						duration: duration
					});
					return false;
				}
				//							if(!isLt10M) {
				//								this.$message.error('上传音频大小不能超过 10MB!');
				//							}

				//							&& isLt10M;//文件大小
				var formData = new FormData();
				var newImg = new Date().getTime() % 20 + '.mp3'; //给音频添加文件名   如果没有文件名会报错
				formData.append('file', file, newImg) //formData对象添加文件
				axios.post(this.api.uploadVoiceFileupload, formData)
					.then(res => {
						this.data.voiceUrl = res.data.data.url;
					})
			},
			closeDialog1() {
				this.offdialog();
				this.getEditVisible = false;

			},
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
			submit() {
				this.$confirm('确认提交该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					var _self = this;
					//								console.log(_self.Ueditor.getContent());
					var data = {
						textId: _self.data.textId,
						title: _self.data.title,
						coverPictureUrl: _self.data.coverPictureUrl,
						vioceTitle: _self.data.vioceTitle,
						voiceUrl: _self.data.voiceUrl,
						htmlText: _self.Ueditor.getContent(),
						keywordList: []
					}
					for(var i = 0; i < _self.addSelect.length; i++) {
						if(_self.addSelect[i].keywordId == '' || _self.addSelect[i].keywordId == undefined) {
							_self.removeInput(i);
						}
						var arr = {};
						if(_self.addSelect.length > 0 && _self.addSelect[i]) {
							arr['keywordId'] = _self.addSelect[i].keywordId;
							arr['keywordTypeId'] = _self.addSelect[i].keywordTypeId;
							data.keywordList.push(arr);
						}
					}
					if(!data.title) {
						this.$message({
							type: 'info',
							message: '请填写标题！',
							duration: duration
						});
						this.$refs.input1.focus();
						return false;
					}
					if(!data.htmlText) {
						this.$message({
							type: 'info',
							message: '富文本信息获取失败！',
							duration: duration
						});
						this.Ueditor.focus();
						return false;
					}
					if(_self.status === "1") {
						axios.post(_self.api.addinsideRichText, data)
							.then(response => {
								if(response.data.code === "200") {
									this.$message({
										type: 'success',
										message: '提交成功',
										duration: duration
									});
									_self.getEditVisible = false;
									dataList.query();
								} else {
									this.$message({
										type: 'error',
										message: '提交失败！' + response.data.message,
										duration: duration
									});
								}
							})
							.catch(error => {
								console.log(error);
							})
					} else if(_self.status === "2") {
						axios.post(_self.api.editinsideRichText, data)
							.then(response => {
								if(response.data.code === "200") {
									this.$message({
										type: 'success',
										message: '提交成功',
										duration: duration
									});
									_self.getEditVisible = false;
									dataList.query();
								} else {
									this.$message({
										type: 'error',
										message: '提交失败！' + response.data.message,
										duration: duration
									});
								}
							})
					}
				})
			}
		}

	})

})