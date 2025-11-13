// 封装一个函数，返回当前时间
export const getTime = () => {
  let message = ''
  // 通过内置构造函数Date
  let hours = new Date().getHours()
  if (hours <= 12 && hours > 5) {
    message = '早上好'
  } else if (hours <= 18) {
    message = '下午好'
  } else {
    message = '晚上好'
  }
  return message
}

