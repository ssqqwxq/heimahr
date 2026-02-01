/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 递归算法 处理列表转化树形结构
export function transListToTreeData(list, rootValue) {
  const arr = []
  list.forEach(item => {
    // 找到 pid === 0 的 '传智教育'
    if (item.pid === rootValue) {
      // 当前节点的id 和 当前子节点的pid相等
      const children = transListToTreeData(list, item.id) // 这次传item.id是1 找pid===1的就是要做子节点
      // 给原本无children的item，动态新增children属性，赋值子节点数组
      // 当前子节点赋值给节点（子节点是pid=1的人事部，给‘传智教育’）
      item.children = children
      arr.push(item)
    }
  })
  return arr
}
// 原始数据
// "data": [
//   {
//     "id": 1,
//     "pid": 0,
//     "name": "传智教育",
//     "code": "CZJY",
//     "managerId": 1,
//     "managerName": "管理员",
//     "introduce": "总部",
//     "createTime": "2022-10-26 09:13:37"
//   },
//   {
//     "id": 4,
//     "pid": 1,
//     "name": "人事部",
//     "code": "RSB",
//     "managerId": 8,
//     "managerName": "黑马周乐天",
//     "introduce": "人事部",
//     "createTime": "2022-10-26 09:13:42"
//   },
//   {
//     "id": 5,
//     "pid": 1,
//     "name": "财务部",
//     "code": "CWB",
//     "managerId": 5,
//     "managerName": "黑马巴思慧",
//     "introduce": "财务部",
//     "createTime": "2022-10-26 09:13:40"
//   },],

// 转换的数据
// "data": [
//   {
//     "id": 1,
//     "pid": 0,
//     "name": "传智教育",
//     "children": [{
//       "id": 4,
//       "pid": 1,
//       "name": "人事部",
//       'children': [{
//         "id": 5,
//         "pid": 1,
//         "name": "财务部",
//       }]
//     }]
//   }]


