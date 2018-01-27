/**
 * 代理模式
 * created by zhengshuai
 * date 2018-1-27
 * 是 为一个对象提供一个代用品或占位符，以便控制对它的访问
 * 代理 符合 "单一职责原则"，就 一个类（对象、函数等），应该仅有一个引起它变化的原因
 * 既是一个类只做一件事，降低耦合度
 */

// 1、保护代理
// 场景一，小明追MM，想送花，A是小明和MM共同的朋友，A 可以帮 MM 把关，也可以在 合适的时间 给MM 转送花，既保护了 小明又保护了MM
var Flower = function () {}
// 小明
var xiaoming = {
    sendFlower: function (target) {
        var flower = new Flower()
        target.receiveFlower(flower)
    }
}
// A 双方共同朋友
var A = {
    flower: '',
    receiveFlower: function (flower) {
        this.flower = flower
    },
    sendFlower: function (target) {
        target.listenGoodMood(function () {
            target.receiveFlower(this.flower)
        })
    }
}
// MM
var MM = {
    listenGoodMood: function (fn) {
        fn()
    },
    receiveFlower: function (flower) {
        console.log('收到花')
    }
}
// 小明送花
xiaoming.sendFlower(A)

// 2、虚拟代理
/**
 * 场景一：图片预加载，web开发中，图片未加载完成之前，页面会显示空白，这对于用户体验很不好
 * 常见的做法是先用一张loading图片占位,然后异步加载图片，等图片加载完后填到img标签
 * 这场景很适合用虚拟代理
 */
// 图片加载 -- 没有占位符
var myImage = (function () {
    var img = document.createElement('img')
    document.body.appendChild(img)
    return {
        setSrc: function (src) {
            myImage.src = src
        }
    }
})()
// 图片加载 -- 有占位符
// 通过 proxyImage 间接访问了myImage，并做了一些额外操作，proxyImage 就是 myImage 的代理
var proxyImage = (function () {
    var img = new Image()
    // 等待img加载完成后 渲染图片
    img.onload = function (src) {
        myImage.setSrc = this.src
    }
    return {
        setSrc: function (src) {
            myImage.setSrc('loading图片占位符')
            img.src = src
        }
    }
})()

/**
 * 场景二：合并 http 请求
 * 假设我们做一个文件同步功能，当选中一个 Checkbox 后,对应的文件会被同步到另一个服务器
 * 当我们选中 n 个 checkbox 的时候，依次向服务器发送请求
 * 如果 1s 内点击 3 次或以上，会对服务器带来很大的开销
 */
/** 同步文件函数
 * @param {String} 多个 id，',' 分割 
 */
var synchronousFiles = function (id) {
    console.log('同步文件')
}
// 代理同步文件请求
var proxySynchronousFiles = (function () {
    // 保存一段时间内的 需同步文件的 id
    var cache = []
    // 定时器 一段时间内只 同步一次
    var timer
    return function (id) {
        cache.push(id)
        // 不会覆盖定时器
        if (timer) return
        // 2s 后执行同步文件，清除定时器，文件id cache
        timer = setTimeout(function () {
            synchronousFiles(cache.join(','))
            clearTimeout(timer)
            timer = null
            cache.length = 0
        }, 2000)
    }
})()
// 给 checkbox 绑定事件
var checkbox = document.getElementsByTagName('input')
for (var i = 0, c; c = checkbox[i++]; ) {
    c.onclick = function () {
        if (this.checked) {
            // 执行代理
            proxySynchronousFiles(this.id)
        }
    }
}

/**
 * 场景三：惰性加载
 * 有一个js文件不想一开始就加载，并不是每个用户都会用到
 * 我们希望用户打开的时候才开始加载，在加载之前还能正常使用其API，就需要代理实现
 */
// 定义一个miniConsole 来代理真正的 miniConsole,其中一个方法为 log   
var miniConsole = (function () {
    var cache = []
    var hander = function (ev) {
        // 监听用户是否按下 F12
        if (ev.keyCode === '113') {
            var script = document.createElement('script')
            script.onload = function () {
                cache.forEach(function (fn) {
                    fn()
                })
            }
            script.src = '开始加载的js文件'
            document.getElementsByTagName('head')[0].appendChild(script)
            // 保证只加载一次js文件，移除F12 的 keydown 事件
            document.removeEventListener('keydown', hander)
        }
    }
    document.body.addEventListener('keydown', hander, false)
    return {
        // 代理 miniConsole.log 方法
        log: function () {
            var args = arguments
            // 将真正的 miniConsole.log 函数 push 到 cache 队列中，等待 miniConsole.js 函数加载完成后执行
            cache.push(function () {
                // 执行真正的 miniConsole.log 函数   
                return miniConsole.log.apply(miniConsole, args)
            })
        }
    }
})()

/**
 * 缓冲代理
 * 可将开销大的运算结果提供缓冲，下次直接返回结果
 */
// 场景一：计算 也可用于ajax 异步请求，
// 乘积
var mult = function () {
    var a = 1
    var args = Array.prototype.slice.apply(arguments)
    args.forEach(function (item) {
        a = a * item
    })
    return a
}
// 加和
var plus = function () {
    var a = 0
    var args = Array.prototype.slice.apply(arguments)
    args.forEach(function (item) {
        a = a + item
    })
    return a
}
// 创建代理缓冲 工厂函数
var proxyCacheFactory = function (fn) {
    var cache = {}
    return function () {
        var args = Array.prototype.join.call(arguments, ",")
        // 存在缓冲 返回缓冲
        if (args in cache) {
            return cache[args]
        }
        // 不存在缓冲 执行 fn 函数
        return cache[args] = fn.apply(this, arguments)
    }
}
// 代理乘积
var proxyMult = proxyCacheFactory(mult)
// 代理加和
var proxyPlus = proxyCacheFactory(plus)

console.log(proxyMult(1, 2, 3, 4)) // 24
console.log(proxyMult(1, 2, 3, 4)) // 缓冲 -- 24
console.log(proxyPlus(1, 2, 3, 4)) // 10
console.log(proxyPlus(1, 2, 3, 4)) // 缓冲 -- 10

/**
 * 总结：
 * 代理模式 最常用的是 虚拟代理 和 缓冲代理，代理模式很有用，
 * 写代码的时候不需要预测，遇到在写也不迟
 */