$(function() {
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var PictureManagement = new Vue({
		el: '#PictureManagement',
		data: {
			dataTableSource: [],
			contentHeight: imainHeight,
			pictureDescription: '',
			dialogVisible: false,
			picdata: [],
			picType: "",
			ImageUrl: "",
			cropper: "",
			canvas: "",
			pichange: true,
			editabled: false,
			picType1: "",
			type: "",
			url: "",
			id: "",
			picloading: false,
		},
		beforeCreate: function() {
			_self = this;
			axios.get(_self.api.queryAllpictureManager)
				.then(response => {
					if(response.data.code === "200") {
						_self.dataTableSource = response.data.data;
					} else {
						this.$message.error('查询失败', duration);
						return false;
					}

				})
		},
		methods: {
			query() {
				_self = this;
				axios.get(_self.api.queryAllpictureManager)
					.then(response => {
						_self.dataTableSource = response.data.data;
					})
			},
			//表格内显示图片的方法（拼接路径）
			getimgurl(row) {
				return this.api.httpupload + row.picturePath + row.pictureName;
			},
			//点击新增时展示新增的页面（dialog）
			add() {
				var _self = this;
				_self.cleardata1();
				_self.type = 1;
				_self.dialogVisible = true;
				_self.editabled = false;
				axios.get(_self.api.queryAllByIdpublicMaster, {
						params: {
							id: "picture_size_type"
						}
					})
					.then(response => {
						if(response.data.code === "200") {
							_self.picdata = response.data.data;
						} else {
							this.$message.error('查询失败' + response.data.message, duration);
						}
					})
			},
			handeditRow(index, row) {
				var _self = this;
				_self.id = row.id;
				_self.type = 2; //编辑的标识
				_self.dialogVisible = true; //打开编辑窗口
				_self.editabled = true; //不可选择尺寸
				_self.pichange = false;
				_self.pictureDescription = row.pictureDescription; //图片描述
				axios.get(_self.api.queryAllByIdpublicMaster, {
						params: {
							id: "picture_size_type"
						}
					})
					.then(response => {
						if(response.data.code === "200") {
							_self.picdata = response.data.data;
							_self.picType = Number(row.pictureSizeTypeId); //图片尺寸
						} else {
							this.$message.error('查询失败' + response.data.message, duration);
						}
					})
			},
			//点击更改裁剪框的大小（只限于初始化）
			pictypechange(value) {
				var _self = this;
				if(value !== "") {
					_self.pichange = false;
				} else {
					_self.pichange = true;
				}

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
			//文件改变时触发，生成裁剪框
			picdemo(e) {
				var _self = this;
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
					var width = _self.picdata[_self.picType].subName == "不明" ? 0 : Number(_self.picdata[_self.picType].subName.split("*")[0]);
					var height = _self.picdata[_self.picType].subName == "不明" ? 1 : Number(_self.picdata[_self.picType].subName.split("*")[1]);
				}
				//							console.log(_self.picType)
				this.cropper = new Cropper(image, {
					aspectRatio: width / height,
					viewMode: 1,
					dragMode: 'move',
					background: false, //是否显示网格背景
					zoomable: false, //是否允许放大图像
					guides: false, //是否显示裁剪框虚线
					crop: function(event) { //剪裁框发生变化执行的函数。
						this.canvas = this.cropper.getCroppedCanvas({ //使用canvas绘制一个宽和高200的图片
							width: width,
							height: height
						});
						$('#imga').attr("src", this.canvas.toDataURL("image/jpeg")) //使用canvas toDataURL方法把图片转换为base64格式
					}
				})

			},
			cropperdemo() {
				var _self = this;
				_self.picloading = true;
				var file = this.dataURLtoBlob($('#imga').attr("src")); //将base64格式图片转换为文件形式
				var formData = new FormData();
				var newImg = new Date().getTime() % 20 + '.jpeg'; //给图片添加文件名   如果没有文件名会报错
				formData.append('file', file, newImg) //formData对象添加文件
				formData.append('type', _self.type)
				axios.post(_self.api.uploadpictureManager, formData)
					.then(response => {
						_self.picloading = false;
						if(response.data.code === "200") {
							_self.url = response.data.data.url
							_self.$message({
								type: 'success',
								message: '上传成功!',
								duration: duration
							});
						} else {
							this.$message.error('上传失败' + response.data.message, duration);
						}
					})
			},
			resetcropper() {
				this.ImageUrl = '';
				this.cropper.destroy();
				this.cropper = "";
				var image = document.getElementById('img');
				image.outerHTML = image.outerHTML;
				$('#img').attr({
					'src': ''
				})
				$('#imga').attr({
					'src': ''
				})

			},
			submit() {
				var _self = this;
				var data = {
					id: _self.id,
					url: _self.url,
					pictureSizeType: _self.picType,
					pictureDescription: _self.pictureDescription,
				};
				if(_self.type === 1) {
					_self.id = "";
					axios.post(_self.api.addpictureManager, data)
						.then(response => {
							if(response.data.code === "200") {
								_self.$message({
									type: 'success',
									message: '新增成功!',
									duration: duration
								});
								_self.cleardata();
							} else {
								_self.$message({
									type: 'error',
									message: '新增失败!' + response.data.message,
									duration: duration
								});
							}
						})
				} else if(_self.type === 2) {
					axios.post(_self.api.editpictureManager, data)
						.then(response => {
							if(response.data.code === "200") {
								_self.$message({
									type: 'success',
									message: '编辑成功!',
									duration: duration
								});
								_self.cleardata();
							} else {
								_self.$message({
									type: 'error',
									message: '编辑失败!' + response.data.message,
									duration: duration
								});
							}
						})
				}
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
					type: 'warning'
				}).then((response) => {
					var _this = this;
					_this.$ajax.get(_this.api.delpictureManager, {
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
						}).catch((error) => {
							console.log(error)
						})
				}).catch((error) => {
					this.$message({
						type: 'info',
						message: '已取消删除!',
						duration: duration
					});
				})
			},
			cleardata() {
				var _self = this;
				_self.id = "";
				_self.type = ""; //新增/编辑的标识
				_self.dialogVisible = false; //关闭新增/编辑窗口
				_self.pictureDescription = ""; //图片描述
				_self.pichange = true; //图片上传的控制
				_self.picType = "";
				_self.url = "";
				_self.resetcropper();
				_self.query();
			},
			cleardata1() {
				var _self = this;
				_self.id = "";
				_self.pictureDescription = ""; //图片描述
				_self.picType = "";
				_self.url = "";
			}
		}
	})
})