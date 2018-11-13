$(function() {
	//提示的显示时间
	var duration = '800';
	var default_constant = new Vue({
		el: "#default_constant",
		data: {
			setingId: "",
			setingValue: "",
			description: "",
			dataTableSource: [],
		},
		beforeCreate: function() {
			var _self = this;
			axios.get(_self.api.queryAllsystemSeting)
				.then(response => {
					_self.dataTableSource = response.data.data;
				})
				.catch(error => {
					console.log(error)
				})
		},
		methods: {
			query() {
				var _self = this;
				axios.get(_self.api.queryAllsystemSeting)
					.then(response => {
						_self.dataTableSource = response.data.data;
					})
					.catch(error => {
						console.log(error)
					})
			},
			add() {
				var _self = this;
				var data = {
					setingId: _self.setingId,
					setingValue: _self.setingValue,
					description: _self.description
				}
				for(var i = 0; i < _self.dataTableSource.length; i++) {
					if(_self.dataTableSource[i].setingId == _self.setingId) {
						this.$message({
							type: 'info',
							message: '数据已存在!',
							duration: duration
						});
						return false;
					}
				}
				if(_self.setingId == '' || _self.setingValue == '') {
					this.$message({
						type: 'info',
						message: '项目ID和项目值不能为空!',
						duration: duration
					});
					return false;
				}
				axios.post(_self.api.addsystemSeting, data)
					.then((response) => {
						if(response.data.code == '200') {
							this.$message({
								type: 'success',
								message: '添加成功!',
								duration: duration
							});
							_self.setingId = "";
							_self.setingValue = "";
							_self.description = "";
							_self.query();
						} else {
							this.$message({
								type: 'error',
								message: '添加失败!',
								duration: duration
							});
						}
					})
			},
			handleEdit(index, row) {

				var _self = this;
				var data = {
					setingId: row.setingId,
					setingValue: row.setingValue,
					description: row.description
				}
				axios.post(_self.api.editsystemSeting, data)
					.then((response) => {
						if(response.data.code == 200) {
							_self.$message({
								type: 'success',
								message: '编辑成功!',
								duration: duration
							});
							_self.query();
						} else {
							_self.$message({
								type: 'error',
								message: '编辑失败!' + response.data.message,
								duration: duration
							});
							_self.query();
						}
					})
				console.log(index, row);
			},
			deleteRow(index, row) {
				this.$confirm('确认删除该记录吗？', '提示', {
						type: 'warning'
					}).then((response) => {
						var _this = this;
						axios.get(_this.api.delsystemSeting, {
								params: {
									setingId: row.setingId
								}
							})
							.then((response) => {
								if(response.data.code === "200") {
									var noDeleteObj = $.grep(_this.dataTableSource, function(obj, i) {
										return obj.setingId !== row.setingId;
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
					})
			},

		}
	})
})