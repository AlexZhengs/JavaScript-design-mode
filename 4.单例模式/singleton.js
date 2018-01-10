/**
 * 单例模式 singleton
 * create by zhengshuai on 2018.1.8
 */

//  实现单例模式
//  模式1
var Singleton = function (name) {
    this.name = name
    this.instance = null
}
Singleton.prototype.getName = function () {
    console.log(this.name)
}
Singleton.getInstance = function () {
    if (!this.instance) {
        this.instance = new Singleton(name)
    }
    return this.instance
}
// 改进1
// 透明的单例模式
// 创建一个唯一的DIV节点,为了封装instance，利用了匿名函数和闭包，增加了代码复杂度
var CreateSingleDiv = (function () {
    var instance = null
    var createDiv = function (html) {
        if (instance) {
            return instance
        }
        this.html = html
        this.init()
        return instance = this
    }
    createDiv.prototype.init = function () {
        var div = document.createElement('div')
        div.innerHTML = this.html
        document.body.appendChild(div)
    }
    return createDiv
})()
// 新需求，不想创建一个单一的div，想创建N多个div，就需要把创建div 和 单例 div 分开，就是把控制单例的代码提出来
// 改进2  ---  用代理实现单例模式
var createDiv = function (html) {
    this.html = html
    this.init()
}
createDiv.prototype.init = function () {
    var div = document.createElement('div')
    div.innerHTML = this.html
    document.body.appendChild(div)
}
// 下面引入代理模式
var ProxySingletonCreateDiv = (function () {
    var instance
    return function (html) {
        if (!instance) instance = new createDiv(html)
        return instance
    }
})()

// JavaScript中单例模式
// JavaScript是无类（class-free）语言
// 单例模式的核心是确保只有一个实例，并提供全局访问，所以不是必须要引入类，如通用的惰性单例
// 在JavaScript 中，全局变量经常被当成单例模式使用，例如
var a = {}
// 如此存在变量污染 和 不易维护 
// 1 使用命名空间
var namespace = {
    a: function () {},
    b: function () {}
}
// 2 利用闭包 和 命名空间  封装私有变量
var closure = function () {
    var _name = 'tom'
    var _age = 29
    return {
        getName: function () {
            return _name
        },
        getAge: function () {
            return  _age
        }
    }
}

// 以WebQQ 为例，登陆的div浮窗，肯定是单例的
// 通用的惰性单例
var loginLayer = function () {
    var div
    return function () {
        if (!div){
            div = document.createElement('div')
            div.innerHTML = '我是登陆浮窗'
            div.style.display = 'none'
            document.body.appendChild(div)
        }
        return div
    }
}
// 现在改变需求，创建iframe script，还会复制一遍代码，显然不会，所以我们把控制单例模式的代码抽出来

// var obj
// if (!obj) {
//     obj = xxx
// }

// 创建对象 和 管理单例模式 分别写在两个不同的方法中，只有组合在一起才是单例模式
// 管理单例的 方法
var getSingle = (function (fn) {
    var instance = null
    return function () {
        return instance || (instance = fn.apply(this, arguments))
    }
})()
// 创建对象的 方法，登陆的div浮窗，现在更改为
var loginLayer2 = function () {
    var div = document.createElement('div')
    div.innerHTML = '我是登陆浮窗'
    div.style.display = 'none'
    document.body.appendChild(div)
    return div
}

document.getElementById('loginBtn').onclick = function (event) {
    // 创建单例登陆浮窗
    var loginDiv = getSingle(loginLayer2)
    login.style.display = 'block'
}

// 单例模式还可以用在event事件上，比如click，
// 例如 渲染完一个列表后，要给其绑定click事件，click只在第一次渲染的时候被绑定一次，我们还不想判断是不是第一次渲染，
// 借助jQuery 
var bindEvent = function () {
    $('div').one('click', function () {
        console.log('click')
    })
}
// 借助单例模式
var bindEvent = getSingle(function () {
    document.div.onclick = function () {
        console.log('click')
    }
    return true
})