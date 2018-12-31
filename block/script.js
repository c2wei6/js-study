window.onload = function () {
	// 游戏参数配置
	const h = 150              //方块高度
	const speed = 3            //速度
	const scrollTime = 6000    //时间
	let hashHandle = 0         //hash句柄 
    // DOM元素拾取函数
	const q = function (selector) {
		return document.querySelector(selector)
	}
	//成绩
	let score = 0
	// 白块信息
	const block = {
		// 游戏元素主体
		box: q('#box'),
		// 黑白块数据
		list: {},
		// 游戏进行状态
		status: false,
		// 向list头部添加新的一行
		unshift() {
			let temp = {}
			temp[this.hash()] = this.createRow()
			let hashList = Object.keys(this.list)
			for (let i = 0; i < hashList.length; i++) {
				temp[hashList[i]] = this.list[hashList[i]]
			}
			this.list = temp
		},
		// 删除list尾部一行
		pop() {
			let temp = {}
			let hashList = Object.keys(this.list)
			for (let i = 0; i < hashList.length-1; i++) {
				temp[hashList[i]] = this.list[hashList[i]]
			}
			this.list = temp
		},
		// 生成一个hash
		hash() {
			if (hashHandle > 100) hashHandle = 0
			return new Date().getTime() + '' + (++hashHandle )
		},
		// 初始化游戏
		init() {
			// 绑定点击事件
			this.box.addEventListener('click', this.bindClick)
			// 初始化list hash-row
			this.list = {
				'hash0': [0,0,0,0],
				'hash1': [0,0,0,0],
				'hash2': [0,0,0,0],
				'hash3': [0,0,0,0]
			}
			// 向头部添加一行有黑块的
			this.unshift(this.createRow())
			// 显示钢琴块
			this.display()
            // 游戏开始
            score = 0
            this.status = true
			this.scroll()
		},
		// 游戏主体逻辑
		scroll() {
			let offset = parseInt(this.box.offsetTop)
			// 滚动
			let timer = setInterval(() => {
				if (this.status) {
					if (this.box.offsetTop > 0) {
						this.box.style.top = 0
						clearInterval(timer)
	                    // 没踩黑块 终止游戏
	                    let hashList = Object.keys(this.list)
	                    if (this.list[hashList[hashList.length-1]].indexOf(1) > -1) {
	                    	alert('游戏结束，得分：'+score)
	                    	return
	                    }
	                    // 除行  
						this.pop()
						this.unshift(this.createRow())
						this.box.style.top = -150 + 'px'
						this.display()
	                    // 递归调用 不断滚动
						this.scroll()
					} else {
						offset += speed
						this.box.style.top = offset + 'px'
					}
				} else {
					clearInterval(timer)
				}
			}, scrollTime/h/speed)
		},
		// 生成带黑块的一行
		createRow() {
			let colListTemp = [0, 0, 0, 0]
			let colKeyIndex = parseInt(Math.random()*4)
            colListTemp[colKeyIndex] = 1
			return colListTemp
		},
		// 按照list生成html
		display() {
			let html = ''
			let hashList = Object.keys(this.list)
            // 遍历list 渲染钢琴块
			for (let i = 0; i < hashList.length; i++) {
				html += '<div class="row">'
				for (let j = 0; j < this.list[hashList[i]].length; j++) {
                    if (this.list[hashList[i]][j]) {
                    	html += '<div data-hash="'+hashList[i]+'" data-key="'+j+'" class="col-key"></div>'
                    } else {
                    	html += '<div class="col"></div>'
                    }
				}
				html += '</div>'
			}
			box.innerHTML = html
		},
		// 点击逻辑
		bindClick(event) {
			let target = event.target
			if (target.getAttribute('class') == 'col-key') {
				// 踩到黑块 成绩+1
				target.setAttribute('class', 'col')
				q('#score').innerText = ++score
				// 黑块变白块
				let hash = target.getAttribute('data-hash')
				let key = target.getAttribute('data-key')
				block.list[hash][key] = 0
			} else {
				// 踩到白块 游戏结束
				block.status = false
				alert('踩到白块，游戏结束，得分：'+score)
			}
		}
	}
	//开始
	block.init()
}