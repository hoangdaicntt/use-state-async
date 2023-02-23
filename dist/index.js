"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var immer_1 = require("immer");
function useStateAsync(values) {
    var _a = (0, react_1.useState)(values || {}), value = _a[0], setValue = _a[1];
    var hookRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        if (hookRef.current && hookRef.current.callback && hookRef.current.fieldNames) {
            hookRef.current.callback({
                prevValue: hookRef.current.prevValue,
                nextValue: value,
                fieldNames: hookRef.current.fieldNames,
            });
            hookRef.current = {};
        }
    }, [value]);
    var updateValue = function (fieldNameOrValues, valueOrCallback, callback) {
        var _a;
        var fieldNames = [];
        var updatedValues = {};
        if (typeof fieldNameOrValues === 'string') {
            fieldNames = [fieldNameOrValues];
            updatedValues = (_a = {}, _a[fieldNameOrValues] = valueOrCallback, _a);
        }
        else {
            fieldNames = Object.keys(fieldNameOrValues);
            updatedValues = fieldNameOrValues;
            callback = valueOrCallback;
        }
        hookRef.current = {
            prevValue: value,
            fieldNames: fieldNames,
            callback: callback,
        };
        setValue((0, immer_1.default)(function (draft) {
            fieldNames.forEach(function (fieldName) {
                draft[fieldName] = updatedValues[fieldName];
            });
            draft.___changed_id = Math.random();
        }));
    };
    var changeValue = function (values, callback) {
        hookRef.current = {
            prevValue: value,
            fieldNames: Object.keys(values),
            callback: callback,
        };
        setValue(__assign(__assign({}, (values || {})), { ___changed_id: Math.random() }));
    };
    var resultValue = value;
    delete resultValue.___changed_id;
    var result = {
        value: resultValue,
        setValue: changeValue,
        updateValue: updateValue,
    };
    return [value, setValue, updateValue];
}
exports.default = useStateAsync;
