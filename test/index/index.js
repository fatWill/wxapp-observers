const app = getApp()

Page({
	data: {
		autor: 'fatwill',

		obj: {
			a: "对象"
		},

		numA: 1,

		numB: 2,
	},
	lifetimes: {
		onLoad() {
			this.$setData({
				autor: 'change 1'
			})

			this.$setData({
				'obj.a': 'change 2',
			})

			this.$setData({
				'a.b.c.d.e.f.g': '不存在的对象'
			})

			this.$setData({
				'numA': 10
			})

			this.method();

			console.log("================这里是page================")
		},
	},

	observers: {
		'autor' (value) {
			console.log('触发了autor的监听, 改变值为' + value)
		},
		'obj.a' (value) {
			console.log('触发了obj的监听，改变值为' + value)
		},
		'a.b.c.d.e.f.g' (value) {
			console.log('触发了a.b.c.d.e.f.g的监听，改变值为' + value)
		},
		'numA, numB' (numA, numB) {
			let sum = numA + numB;
			console.log(numA, numB)
			console.log('也可以作为一个computed触发，numA + numB = ' + sum);
			this.$setData({
				numC: sum
			})
		},
		'numC' (value) {
			console.log("触发了numC的回调。numA 和 numB的总和为" + value)
		}
	},

	methods: {
		method(){
			console.info('方法可以写在这里')
		}
	}
})