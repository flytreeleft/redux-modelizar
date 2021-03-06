// https://github.com/vbardales/chai-properties/blob/master/chai-properties.js
export default function (chai, utils) {
    var _;

    if (typeof window === 'object'
        && typeof window._ === 'function') {
        // browser-side
        _ = window._;
    } else {
        // server-side
        _ = require('lodash');
    }

    var flag = utils.flag;
    var inspect = utils.inspect;

    chai.Assertion.addMethod('properties', function (expected) {
        var obj = flag(this, 'object');

        if (flag(this, 'negate')) {
            throw new Error('Not implemented yet.');
        }

        function check(testDescr, testVal) {
            if (testDescr === testVal) {
                return true;
            }

            try {
                return _.every(testDescr, function (val, attr) {
                    if (!(attr in testVal)) {
                        throw new Error('No ' + attr + ' in ' + inspect(testVal));
                    }

                    if (typeof val !== typeof testVal[attr]) {
                        throw new Error('Types are incompatible ('
                                        + (typeof val)
                                        + ' vs '
                                        + (typeof testVal[attr])
                                        + ')');
                    }

                    if (_.isArray(val)) {
                        if (_.size(val) !== _.size(testVal[attr])) {
                            throw new Error('Array sizes are incompatible ('
                                            + _.size(val)
                                            + ' vs '
                                            + _.size(testVal[attr]) + ')');
                        }

                        return check(val, testVal[attr]);
                    }

                    if (_.isObject(val)) {
                        return check(val, testVal[attr]);
                    }

                    if (val !== testVal[attr]) {
                        throw new Error('Values are incompatible ('
                                        + inspect(val)
                                        + ' vs '
                                        + inspect(testVal[attr])
                                        + ')');
                    }

                    return true;
                });
            } catch (e) {
                return false;
            }
        }

        function diffFn(testDescr, testVal) {
            if (testDescr === testVal) {
                return {};
            }

            return _.transform(testVal, function (result, val, key) {
                if (!_.has(testDescr, key)) {
                    return;
                }

                if (_.isObject(val)) {
                    var innerDiff = diffFn(testDescr[key], val);
                    if (_.size(innerDiff)) {
                        result[key] = innerDiff;
                    }
                    return;
                }

                result[key] = val;
            }, {});
        }

        //var diff = _.pick(obj, _.keys(expected));
        var diff = diffFn(expected, obj);
        var moreMessage = _.size(diff) ? ', but found ' + inspect(diff) : '';

        this.assert(
            check(expected, obj),
            'expected ' + inspect(obj) + ' to have properties ' + inspect(expected) + moreMessage,
            'expected ' + inspect(obj) + ' to not have properties ' + inspect(expected) + moreMessage,
            expected,
            obj,
            true
        );
    });

    //export tdd style
    var assert = chai.assert;
    assert.haveProperties = function (val, exp, msg) {
        new chai.Assertion(val, msg).to.have.properties(exp);
    };
}
