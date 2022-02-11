function func(arr) {
    var myArr = arr;
    var max = Math.max(...myArr);
    var newArr = [max];
    while (myArr.length-1 > 0) {
        myArr.splice(myArr.indexOf(max), 1);
        max = Math.max(...myArr);
        newArr.push(max);
    }
    return newArr;
} 
module.exports = func;