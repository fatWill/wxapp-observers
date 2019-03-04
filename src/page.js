import {
    watch,
    lifetimes,
    pageNormalKey,
    pageLifetimeKey
} from './config';
import * as utils from './utils';
import setdata from "./setdata";

const page = Page;
Page = function(options) {
    for (let value of pageLifetimeKey) {
        const _olifetimes = Reflect.get(options, lifetimes);
        const _lifetime = !utils.isEmpty(_olifetimes) && Reflect.get(_olifetimes, value) || Reflect.get(options, value);
        const _isOnload = value === "onLoad";
        if (_lifetime || _isOnload) {
            Reflect.set(options, value, function(...o) {
                if (_isOnload) {
                    this::setdata(Reflect.get(options, watch));
                }
                return _lifetime && this::_lifetime(...o);
            });
        }
    };
    for (let value of pageNormalKey) {
        try {
            let target = Reflect.get(options, value);
            if (target && !utils.isEmpty(target)) {
                for (let func of Object.values(target)) {
                    let name = func.name
                    if (name && utils.isFunction(func)) {
                        Reflect.set(options, name, func)
                    } else {
                        throw new Error(`Type Error: ${typeof func} is not a function`)
                    }
                }
                Reflect.deleteProperty(options, value)
            }
        } catch (e) {
            console.error(e)
        }
    }
    return page(options);
};