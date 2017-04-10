function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-') 
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function setPrevData(value){
  var pages = getCurrentPages();
  var prevPage = pages[pages.length - 2];
  prevPage.setData({
    'label':value,
  })
}
function pushArray(array){
 var res = [];
 var json = {};
 for(var i = 0; i < array.length; i++){
  if(!json[array[i]]){
   res.push(array[i]);
   json[array[i]] = 1;
  }
 }
 return res;
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

module.exports = {
  formatTime: formatTime,
  setPrevData: setPrevData,
  pushArray:pushArray,
  contains:contains,
}
