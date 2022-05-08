function showMsg(opts) {
  uni.showToast({
    title: '数据加载失败',
    icon: 'error',
    ...opts
  })
}
// 根据传入数组过滤对象属性方法
function pickObj(obj, arr) {
  if (typeof (obj) !== "object" || !Array.isArray(arr)) {
          throw new Error("参数格式不正确");
      }
  const result = {};
  arr.forEach(key => {
      result[key] = obj[key];
  })
  return result;
}

export {
  showMsg,
  pickObj
}