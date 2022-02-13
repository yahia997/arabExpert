function func(arr) {
    return arr.reduce((prev, curr) => {
        return prev.length > curr.length ? prev : curr;
    })
} 
module.exports = func;