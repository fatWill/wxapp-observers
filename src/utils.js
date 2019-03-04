/**
 *
 * 判断是否为空对象
 *
 * @param  {Object}   obj
 *
 * @return {Boolean}
 *
 * @example utils.isEmpty({}); // => true 
 */
export function isEmpty(obj = {}) {
    if (isObject(obj)) {
        for (let i in obj) {
            return false;
        }
        return true;
    } else {
        return false;
    }
}

/**
 * 字符串去空格
 *
 * @param   {string} str        字符串
 *
 * @return  {string}            返回去空字符串
 *
 * @example  utils.trim("  das  qwd  qqr") // => dasqwdqqr
 */
export function trim(str = "") {
    return str.replace(" ", "");
}

/**
 *
 * 判断类型
 *
 * @param {type} 传入一个数据类型
 *
 * @returns {boolean} 返回相对应数据类型的bool值
 *
 * @example
 *
 * utils.isNumber(1534409068); // => true
 */
function _type(arg) {
    return Reflect.toString.call(arg);
}
export function isString(arg) {
    return _type(arg) === "[object String]" ? true : false;
}
export function isNumber(arg) {
    return _type(arg) === "[object Number]" ? true : false;
}
export function isObject(arg) {
    return _type(arg) === "[object Object]" ? true : false;
}
export function isUndefined(arg) {
    return _type(arg) === "[object Undefined]" ? true : false;
}
export function isNull(arg) {
    return _type(arg) === "[object Null]" ? true : false;
}
export function isFunction(arg) {
    return _type(arg) === "[object Function]" ? true : false;
}
export function isArray(arg) {
    return _type(arg) === "[object Array]" ? true : false;
}
export function isBoolean(arg) {
    return _type(arg) === "[object Boolean]" ? true : false;
}