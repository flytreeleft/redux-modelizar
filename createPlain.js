import isFunction from 'lodash/isFunction';

import toPlain from './object/toPlain';

export default function createModelizar(options = {}) {
    options.refProps = [].concat(options.refProps || []);
    // TODO 可注册模型class名称，建立name和function的映射关系，且可在运行中动态注册。从而确保在任何时候均可准确还原到任意点的状态
    // TODO 对于组件库的组件class名称，需通过组件库code与class name组合构成唯一的名称

    // NOTE: Middleware can not access `store.subscribe`
    return ({dispatch, getState}) => {
        return (next) => {
            return (action) => {
                if (!isFunction(action)) {
                    action = toPlain(action, options.refProps);
                }
                return next(action);
            };
        };
    };
}
