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