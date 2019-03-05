#wxapp-observers
wxapp-observers是一个可以监听data属性变化的工具，可以实现`数据监听`和`计算`的方法。详情可以查询[微信小程序2.6.1版本的组件数据监听器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html)。里面包含了版本判断，所以是属于一个兼容微信新增监听函数的一个工具，并且在page页也可以使用。

wxapp-observers的第二个功能是可以规范page对象函数的分类，方法放置methods中，事件放置events中，生命周期放置lifetimes中，这样可以使代码有较强的整洁性和维护性。

#安装&引用
```
npm i -D wxapp-observers
```

>也可以在[github](https://github.com/fatWill/wxapp-observers)上dist/observers.js下载使用


---
引用方式很简单

```
import 'observer'
```


#使用说明

>[点击查看代码片段](https://developers.weixin.qq.com/s/3jymQDmY7P63)

***

###我们可以在生命周期函数中设置`lifetimes`
```
Page({
	lifetimes: {
		onLoad() {
			console.log('================这里是page================')
		},
	},
})
```
###也可以在把方法放置`methods`中
```
Page({
	lifetimes: {
		onLoad() {
			this.method();
			console.log('================这里是page================')
		},
	},
	methods: {
		method(){
			// 注意methods里面的方法或外面的方法不能同名，也不能设置关键字"lifetimes, methods, events"
			console.info('方法可以写在这里')
		}
	}
})
```
###还可以把事件放入`events`中
```
// index.wxml
<view bindtap='event' class="intro">测试请看控制台打印</view>

// index.js
Page({
	events: {
		event(){
			console.log('触发了tap事件')
		}
	}
})
```
_这样我们可以更好的代码整洁性和维护性_
***

###监听函数的使用

```
// 我们一切数据的监听行为都在this.$setData中使用
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
```

>详细的使用方式我在这边不多细讲，因为这套监听方法是兼容[微信小程序2.6.1版本的组件数据监听器](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/observer.html)的使用方法做的兼容，这套监听工具的好处就在于在微信版本合适的范围内用微信的数据监听组件，而在原生不兼容组件使用这一套框架所带来的数据监听，而且是零侵入式的引入。

#注意事项
* 我们的一切监听行为都以this.$setData函数去执行，当版本在2.6.1时则会直接引用原生函数this.setData的回调，另一方面，如果没有使用this.$setData也不会对原有项目造成任何影响
* 除了使用`lifetimes`、 `methods`、`events`实现绑定相关函数（也不能在对象里面使用其他类型），不能在其他地方进行绑定或使用，否则可能会出现不可预知的错误。

#bug&tip
* 组件中的properties的改变无法在observers对象中监听，为了兼容的话建议使用properties中的observer
* 其他欢迎在issue中提出



