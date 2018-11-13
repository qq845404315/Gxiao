$(function() {
	var duration = '800';
	//表格的高度
	var imainHeight = $(document).height() - 110;
	var RelationMaster = new Vue({
		el: '#RelationMaster',
		data: {
			id: "",
			chineseName: '',
			dataTableSource: [],
			gender: '',
			contentHeight: imainHeight,
			dialogVisible: false,
			ImageUrl: "",
			widthxheight: "",
			cropper: "",
			canvas: "",
			relationship: "",
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryrelationship)
				.then((response) => {
					_self.dataTableSource = response.data.data;
				})
		},

		methods: {
			//表格内显示图片的方法（拼接路径）
			getimgurl(row) {
				return this.api.httpupload + row.cartoonUrl;
			},
			//根绝后台传入的值显示男和女
			formatRole: function(row, column) {
				return row.gender == '1' ? "男" : row.gender == '2' ? "女" : "未知";
			},
			//查询方法，备用或者等待调用
			query() {
				var _self = this;
				axios.get(_self.api.queryrelationship)
					.then((response) => {
						_self.dataTableSource = response.data.data;
					})
			},
			//新增根据关系名称和性别进行新增
			add() {
				var _self = this;
				//编辑表格中数据，如果关系名称存在即重复
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].chineseName == _self.chineseName) {
						this.$message({
							type: 'info',
							message: '数据已存在!',
							duration: duration
						});
						return false;
					}
				}
				//关系名称为空，和性别为空时不执行添加操作
				if(_self.chineseName == '' || _self.gender == '') {
					this.$message({
						type: 'info',
						message: '关系名称，性别不能为空!',
						duration: duration
					});
					return false;
				}
				//新增接口
				axios.post(_self.api.addrelationship, {
						chineseName: _self.chineseName,
						gender: Number(_self.gender)
					})
					.then((response) => {
						//后台返回值判断 200为success
						if(response.data.code === "200") {
							this.$message({
								type: 'success',
								message: '添加成功!',
								duration: duration
							});
							_self.chineseName = "";
							_self.gender = "";
							//调用查询查看新增的数据
							_self.query();
						} else {
							this.$message({
								type: 'error',
								message: '添加失败!' + response.data.message,
								duration: duration
							});
						}
					})
			},
			//删除方法，根据id进行删除
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						axios.get(_this.api.delByIdrelationship, {
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
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
							duration: duration
						});
					});
			},
			//打开关系卡通图一览
			handeledit(index, row) {
				var _self = this;
				operateVue.statusName = row.chineseName + "关联的卡通图一览";
				operateVue.getEditVisible = true;
				axios.get(_self.api.queryAllByRelationshipId, {
						params: {
							relationshipId: row.id
						}
					})
					.then(response => {
						operateVue.dataTableSource = response.data.data;
						operateVue.relationship = row.id;
					})
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
				var file = this.dataURLtoBlob($('#imga').attr("src")); //将base64格式图片转换为文件形式
				var formData = new FormData();
				var newImg = new Date().getTime() + '.jpeg'; //给图片添加文件名   如果没有文件名会报错
				formData.append('file', file, newImg) //formData对象添加文件
				formData.append('relationshipId', _self.relationship); //传其他参数
				axios.post(this.api.addrelationshipCartoon, formData)
					.then(response => {
						if(response.data.code === "200") {
							_self.query();
							this.ImageUrl = '';
							this.cropper.destroy();
							var image = document.getElementById('img');
							image.outerHTML = image.outerHTML;
							$('#img').attr({
								'src': ''
							})
							$('#imga').attr({
								'src': ''
							})
							this.cropper = "";
							_self.dialogVisible = false;
						}

					})
			},
			resetcropper() {
				this.ImageUrl = '';
				this.cropper.destroy();
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
			picupload(index, row) {
				this.dialogVisible = true;
				axios.get(this.api.queryPictureSizeTypeBySubIdpublicMaster, {
						params: {
							subId: 2
						}
					})
					.then(response => {
						this.widthxheight = response.data.data.subName;
						this.relationship = row.id;

					})
			},
			picdemo(e) {
				var _self = this;
				var image = document.getElementById('img');
				var files = e.files;
				if(files && files.length > 0) {
					console.log(files[0])
					this.ImageUrl = URL.createObjectURL(files[0]);
					$('#img').attr({
						'src': this.ImageUrl
					})
					if(this.cropper) {
						this.cropper.replace(this.ImageUrl);
					}
					var width = Number(this.widthxheight.split("*")[0])
					var height = Number(this.widthxheight.split("*")[1])
				}
				this.cropper = new Cropper(image, {
					aspectRatio: width / height,
					dragMode: 'move',
					viewMode: 1,
					background: false, //是否显示网格背景
					zoomable: false, //是否允许放大图像
					guides: false, //是否显示裁剪框虚线
					crop: function(event) { //剪裁框发生变化执行的函数。
						this.canvas = this.cropper.getCroppedCanvas({ //使用canvas绘制一个宽和高200的图片
							width: width,
							height: height
						});
						$('#imga').attr("src", this.canvas.toDataURL("image/jpeg ", 0.3)) //使用canvas toDataURL方法把图片转换为base64格式
					}
				})
			}
		}
	})
	//关系图
	var operateVue = new Vue({
		el: '#dialogEdit',
		data: {
			dataTableSource: [], //列表数据
			getEditVisible: false, //默认不显示dialog
			statusName: '', //标题名 title
			relationshipId: '', //关系id
			relationship: '', //转存关系id
			doUpload: '', //待用action
		},
		methods: {
			query() {
				var _self = this;
				axios.get(_self.api.queryAllByRelationshipId, {
						params: {
							relationshipId: _self.relationship
						}
					})
					.then(response => {
						_self.dataTableSource = response.data.data;
					})
			},
			getimgurl(row) {
				return this.api.httpupload + row.cartoonUrl;
			},
			limitfile(files, fileList) {

				if(fileList.length > 0) {
					this.$message({
						type: 'info',
						message: '只支持单张上传！！！',
						duration: duration
					});
					return false;
				}

			},
			defaultFlg(index, row) {
				var _self = this;
				axios.get(_self.api.defaultFlgrelationshipCartoon, {
						params: {
							id: row.id,
							relationshipId: _self.relationship
						}
					})
					.then(response => {
						if(response.data.code != 200) {
							_self.$message({
								type: 'error',
								message: '默认图设置失败！' + response.data.message,
								duration: duration
							});
							return false;
						} else {
							_self.$message({
								type: 'success',
								message: '默认图设置成功！！！',
								duration: duration
							});
							_self.query();
						}
					})
			},
			beforeUpload(file) {
				var _self = this;
				//上传之前判断如果超过了图片的上限，则取消上传
				axios.get(_self.api.ceilingNumber)
					.then(response => {
						if(_self.dataTableSource.length == response.data.data) {
							_self.$message({
								type: 'info',
								message: '当前家庭关系关联的卡通图已达最大值',
								duration: duration
							});
							return false;
						} else {
							let fd = new FormData();
							fd.append('file', file); //传文件
							fd.append('relationshipId', _self.relationship); //传其他参数
							axios.post(_self.api.addrelationshipCartoon, fd)
								.then((res) => {
									if(res.data.code === "200") {
										_self.query();
									}
								})
						}
					})

			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			submitUpload() {
				this.$refs.upload.submit()
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						axios.get(_this.api.delByIdrelationshipCartoon, {
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
					})
					.catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除',
							duration: duration
						});
					});

			},
			closeDialog() {
				RelationMaster.query();
			}
		}
	})

})