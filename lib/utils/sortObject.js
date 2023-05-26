/**
 * @description: 对对象的属性进行排序
 */

export default function (obj, keyOrder) {
    if (!obj) return
    const res = {}

    // 按照指定的顺序进行排序，仅对自身属性进行排序，忽略原型上的属性
    if (keyOrder) {
        keyOrder.forEach(key => {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                res[key] = obj[key]
                delete obj[key]
            }
        })
    }

    const keys = Object.keys(obj)

    keys.sort()
    keys.forEach(key => {
        res[key] = obj[key]
    })
    
    return res
}