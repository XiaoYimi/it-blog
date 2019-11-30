export default {
  datetime (iso_date) {
    let zh_date = new Date(iso_date)
    const dates = [
      zh_date.getFullYear(),
      (zh_date.getMonth() + 1),
      zh_date.getDate(),
      zh_date.getHours(),
      zh_date.getMinutes(),
      zh_date.getSeconds()
    ]
    // 添加前缀 0
    for (let i=0; i<dates.length; i++) {
      if (dates[i] < 10) {
        dates[i] = '0' + dates[i]
      }
    }
    zh_date = '' + dates[0] + '-' + dates[1] + '-' + dates[2] + ' ' + dates[3] + ':' + dates[4] + ':' + dates[5]
    return zh_date
  },
  date (iso_date) {
    let zh_date = new Date(iso_date)
    const dates = [
      zh_date.getFullYear(),
      (zh_date.getMonth() + 1),
      zh_date.getDate(),
    ]
    for (let i=0; i<dates.length; i++) {
      if (dates[i] < 10) {
        dates[i] = '0' + dates[i]
      }
    }
    zh_date = '' + dates[0] + '-' + dates[1] + '-' + dates[2]
    return zh_date
  },
  time (iso_date) {
    let zh_date = new Date(iso_date)
    const dates = [
      zh_date.getHours(),
      zh_date.getMinutes(),
      zh_date.getSeconds()
    ]
    for (let i=0; i<dates.length; i++) {
      if (dates[i] < 10) {
        dates[i] = '0' + dates[i]
      }
    }
    zh_date = '' + dates[0] + ':' + dates[1] + ':' + dates[2]
  }
}