function showMsg(opts) {
  uni.showToast({
    title: '数据加载失败',
    icon: 'error',
    ...opts
  })
}

export {
  showMsg
}