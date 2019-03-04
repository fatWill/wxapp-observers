import * as utils from './utils';
import platform from "./platform";
import {
    watch
} from './config';

export default function(target, isComponent) {
    this.$setData = function(data, cb) {
        let _cb = null;
        // 由于在版本2.6.1微信原生组件支持了observers，所以在2.6.1以下才使用这个数据监听的方法
        if (!isComponent || platform.compareSdkVersion("2.6.1") < 0) {
            if (target && !utils.isEmpty(target)) {
                for (let item of Object.keys(target)) {
                    let keys = utils.trim(item).split(",");
                    let isCB = false; // 触发监听器的判定
                    let argus = []; // 监听器回调参数的key值
                    for (let key of keys) {
                        if (key === "**") {
                            isCB = true;
                            argus.push("**");
                        } else if (key.includes("**")) {
                            let _key = key.replace(".**", "$'");
                            for (let i of Object.keys(data)) {
                                if (i.startsWith(_key)) {
                                    isCB = true;
                                }
                                argus.push(_key);
                            }
                        } else {
                            if (Reflect.has(data, key)) {
                                isCB = true;
                            };
                            argus.push(key);
                        }
                    }
                    if (isCB) {
                        let func = Reflect.get(target, item);
                        _cb = () => {
                            let result = getObject(this.data, argus);
                            this::func(...result);
                        }
                    }
                }
            }
        }
        const setDataReturn = this.setData(data, cb);
        _cb && _cb();
        return setDataReturn;
    }
}

// 获取对应的对象
const getObject = function(target, set) {
    return (() => {
        const get = (map) => {
            const fn = (_target, keys) => {
                try {
                    keys.forEach((key, index) => {
                        if (new RegExp(/^[a-zA-Z_]\w*\[{1}[0-9]+\]$/).test(key)) {
                            // array
                            let arrKey = "",
                                arrIndex = 0;

                            key.replace(/^[a-zA-Z_]\w*/, function(value, index, receiver) {
                                arrKey = value
                                arrIndex = receiver.slice(value.length).match(/[0-9]+/g)[0];
                            })

                            _target = Reflect.get(Reflect.get(_target, arrKey), arrIndex);

                        } else if (new RegExp(/^[a-zA-Z_]\w*/).test(key)) {
                            // normal argument
                            _target = Reflect.get(_target, key);
                        } else {
                            throw new Error(`Thread data not has this key: ${key}`)
                        }
                    })

                    return _target;
                } catch (e) {
                    console.error(e)
                    return
                }
            }
            if (map === "**") {
                return target
            } else {
                const keys = map.split(".");
                return fn(target, keys);
            }
        }
        let value = [];
        for (let map of set) {
            value.push(get(map));
        }
        return value
    })()
}