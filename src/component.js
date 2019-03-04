import * as utils from './utils';
import {
    watch,
    lifetimes,
    componentsLifetimeKey
} from './config';
import platform from "./platform";
import setdata from "./setdata";

const plat261 = platform.compareSdkVersion("2.6.1");

let obsymbol = Symbol();
let obmap = new Map();

const component = Component;
Component = function(options) {
    rewrite(options, function() {
        this::setdata(Reflect.get(options, watch), true);
    });
    return component(options)
}

const behavior = Behavior;
Behavior = function(options) {
    rewrite(options, function() {
        if (plat261 < 0) {
            if (options.observers && !utils.isEmpty(options.observers)) {
                if (options.is) {
                    obmap.set(options.is, options.observers)
                } else {
                    Reflect.set(this, obsymbol, options.observers)
                }
            }
        }
    })
    return behavior(options)
}

const rewrite = function(options, cb) {
    for (let value of componentsLifetimeKey) {
        const _olifetimes = Reflect.get(options, lifetimes);
        const _lifetime = !utils.isEmpty(_olifetimes) && Reflect.get(_olifetimes, value) || Reflect.get(options, value);
        const _isCreated = value === "created";
        if (_lifetime || _isCreated) {
            Reflect.set(options, value, function(o) {
                if (_isCreated) {
                    let getObs = Reflect.get(options, watch);
                    if (getObs && plat261 < 0) {
                        if (obmap.size > 0) {
                            if (options.behaviors && options.behaviors.length > 0) {
                                for (let b of options.behaviors) {
                                    const beobs = obmap.get(b)
                                    if (beobs) {
                                        this::setBeobs(getObs, beobs);
                                    }
                                }
                            }
                        } else if (Reflect.has(this, obsymbol)) {
                            const beobs = Reflect.get(this, obsymbol)
                            this::setBeobs(getObs, beobs);
                        }
                    }
                    this::cb()
                }
                return _lifetime && this::_lifetime(o);
            });
        }
    };
}

function setBeobs(getObs, beobs) {
    for (let key of Object.keys(beobs)) {
        let func = Reflect.get(beobs, key);
        if (Reflect.has(getObs, key)) {
            let _func = Reflect.get(getObs, key);
            Reflect.set(getObs, key, (...arg) => {
                this::func(...arg);
                return this::_func(...arg);
            })
        } else {
            Reflect.set(getObs, key, this::func)
        }
    }
}