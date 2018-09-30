const validListKey = [
    'vid',
    'classes',
    'subject',
    'chid',
    'q_type',
    'easy_type',
    'level1',
    'level2',
    'level3',
];

export function validListReq (data) {
    // console.log(111111, data,validListKey) 
    for (let dataKey of Object.keys(data)) {
        if (validListKey.indexOf(dataKey) !== -1 && data[dataKey] !== void 0) {
            // console.log(222, dataKey, data[dataKey])
            if (data[dataKey] === '' || data[dataKey] === null) {
                return false
            }
        }
    }
    return true
}