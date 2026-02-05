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



// 1. 找到原始 item（未加工，无树形结构）
//遍历数组匹配pid === rootValue(0)时，拿到的原始item是扁平的，只有自身属性，没有子节点：
// 原始item：扁平数据，无children
//item = { id: 1, name: '传智教育', pid: 0 }

// 2. 递归查找并挂载子节点（核心加工步骤）
// 执行const children = transListToTreeData(list, item.id)，递归调用会把 item.id=1 作为新的 rootValue，
// 找到所有pid=1的子节点（比如人事部、技术部），并对这些子节点做同样的加工（给它们也挂载各自的子节点），最终返回加工好的子节点树形数组：
// 递归返回的children：已是加工好的树形子节点数组
// children = [
//   { id:2, name:'人事部', pid:1, children:[] }, // 人事部无子节点，children为空数组
//   { id:3, name:'技术部', pid:1, children: [     // 技术部有子节点，children嵌套树形
//     { id:4, name:'前端组', pid:3, children:[] },
//     { id:5, name:'Java组', pid:3, children:[] }
//   ]}
// ]

// 3. 给 item 挂载 children（加工完成，item 成为树形节点）
// 执行item.children = children后，原始扁平的 item 被挂载了嵌套的 children 属性
// ，此时的item已经是单个完整的树形节点，自身携带了所有子孙节点的嵌套结构：
// 加工后的item：单个树形节点，已实现树形结构
// item = {
//   id: 1,
//   name: '传智教育',
//   pid: 0,
//   children: [ // 嵌套子节点，子节点也有自己的children，树形结构成型
//     { id:2, name:'人事部', pid:1, children:[] },
//     { id:3, name:'技术部', pid:1, children: [
//           { id:4, name:'前端组', pid:3, children:[] },
//           { id:5, name:'Java组', pid:3, children:[] }
//     ]}
//   ]
// }

//4. arr.push (item)：收集加工好的树形节点
//此时把这个树形 item推入 arr，arr 就成了「树形节点的收集容器」，后续 return arr 就能得到完整的树形结构数组。


// item = {
//   id: 1,
//   name: '传智教育',
//   pid: 0,
//   children: [ // 嵌套子节点，子节点也有自己的children，树形结构成型
//     { id:2, name:'人事部', pid:1, children:[] },
//     { id:3, name:'技术部', pid:1, children: [
//       { id:4, name:'前端组', pid:3, children:[] },
//       { id:5, name:'Java组', pid:3, children:[] }
//     ]}
//   ]
// }
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


