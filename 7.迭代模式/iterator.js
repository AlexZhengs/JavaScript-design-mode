/**
 * 迭代器模式
 * 1、内部迭代器，2、外部迭代器
 */

// 自己实现一个内部迭代器 -- 简单
var each = function (ary, callback) {
    for (var i = 0, l = ary.length; i < l; i++) {
        callback(ary[i], i, ary)
    }
}

// 需求：判断2个数组是否全等
// 方法一： 利用内部迭代器
var compare = function (ary1, ary2) {
    if (ary1.length !== ary2.length) throw new Error('不相等')
    each(ary1, function (item, index) {
        if (item !== ary2[index]) throw new Error('不相等')
    })
    console.log('相等')
}
// 方法二： 利用外部迭代器
// 先实现一个外部迭代器
var iterator = function (ary) {
    var current = 0
    var next = function () {
        current++
    }
    var isDone = function () {
        return current >= ary.length
    }
    var getItem = function () {
        return ary[current]
    }
    return {
        next: next,
        isDone: isDone,
        getItem: getItem
    }
}
// 改下 compare 函数
var iterator1 = iterator([1,2,3])
var iterator2 = iterator([1,2,3])
var compare1 = function (iterator1, iterator2) {
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getItem() !== iterator2.getItem()) throw new Error('不相等')
        iterator1.next()
        iterator2.next()
    }
    console.log('相等')
}
// 终止迭代器，提前退出迭代
var each1 = function (ary, callback) {
    for (let i = 0; i < ary.length; i++) {
        // callback 的结果返回 false，提前终止迭代
        if (callback(ary[i], i, ary) === false) {
            break
        }
    }
}
// 调用 each1
each1([1, 2, 3], function (n, i) {
    // n > 2 退出循环
    if (n > 2) {
        return false
    }
    console.log(n)
})

/**
 * 总结：
 * 迭代器模式相对简单，简单到大多数时候不认为它是设计模式，这里就简单介绍下
 * 而且现在几乎所有语言都内置了迭代器
 */