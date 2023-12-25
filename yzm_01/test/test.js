function getNode(data) {
  let stack = [];
  let know = [] // 已知子节点 内容
  let indexStack = [0] // 每一层遍历到第几个子节点
  stack.push(data);
  while(stack.length){
     let node = stack[stack.length - 1];
     if(node.children) {
       if (indexStack.length <= stack.length) {
         indexStack.push(0)
         stack.push(node.children[0])
       } else {
         let index = ++indexStack[indexStack.length - 1]
         if(index > node.children.length) { // 当前节点的子节点已经遍历完了
           stack.pop()
           indexStack.pop()
         } else {
           stack.push(node.children[index])// 遍历当前节点下一个子节点
         }
       }
     } else { // 叶节点
         let { value, text} = node;
         if (know.includes(value)) {// 当前节点的内容等于子节点的内容
             for (let i = 0; i < stack.length; i++) {
                 //获取当前链路 内容
             }
         }
         stack.pop()
     }
  }
}


function nodes(data) {
  let result = []
  let knows = []
  let getNode = (node, pre = []) => {
    let { value } = node
    if(node.children) {
      for (let child of children) {
        getNode(child, [...pre, value])
      }
    } else if (knows.includes(value)) {
      pre.push(value)
      result.push(pre)
    }
  }
  getNode(data, [])
}