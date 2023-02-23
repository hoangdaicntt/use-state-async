import {useEffect, useRef, useState} from "react";

export default function useStateAsync(values: any) {
    const [value, setValue] = useState(values || {});
    const hookRef = useRef<any>();

    useEffect(() => {
        if (hookRef.current && hookRef.current.callback && hookRef.current.fieldNames) {
            hookRef.current.callback({
                prevValue: hookRef.current.prevValue,
                nextValue: value,
                fieldNames: hookRef.current.fieldNames,
            });
            hookRef.current = {};
        }
    }, [value]);

    const updateValue = (fieldNameOrValues: string | Record<string, any>, valueOrCallback?: any, callback?: any) => {
        let fieldNames = [];
        let updatedValues = {};

        if (typeof fieldNameOrValues === 'string') {
            fieldNames = [fieldNameOrValues];
            updatedValues = {[fieldNameOrValues]: valueOrCallback};
        } else {
            fieldNames = Object.keys(fieldNameOrValues);
            updatedValues = fieldNameOrValues;
            callback = valueOrCallback;
        }

        hookRef.current = {
            prevValue: value,
            fieldNames: fieldNames,
            callback: callback,
        };
        setValue(prevValue => {
            const updatedValue = {...prevValue};
            fieldNames.forEach(fieldName => {
                updatedValue[fieldName] = updatedValues[fieldName];
            });
            return updatedValue;
        });
    };

    return {
        value: value,
        setValue: setValue,
        updateValue: updateValue,
    }
}