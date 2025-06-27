const FunctionDeclNode = {
  type: 'FunctionDecl' // 代表该节点是函数声明
  // 函数的名称是一个标识符，标识符本身也是一个节点
  id: {
    type: 'Identifier',
    name: 'render' // name 用来存储标识符的名称，在这里它就是渲染函数的名称 render
  },
  params: [], // 参数，目前渲染函数还不需要参数，所以这里是一个空数组
  // 渲染函数的函数体只有一个语句，即 return 语句
  body: [
    {
      type: 'ReturnStatement',
      // 最外层的 h 函数调用
      return: {
        type: 'CallExpression',
        callee: { type: 'Identifier', name: 'h' },
        arguments: [
          // 第一个参数是字符串字面量 'div'
          {
            type: 'StringLiteral',
            value: 'div'
          },
          // 第二个参数是一个数组
          {
            type: 'ArrayExpression',
            elements: [
              // 数组的第一个元素是 h 函数的调用
              {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'h' },
                arguments: [
                  // 该 h 函数调用的第一个参数是字符串字面量
                  { type: 'StringLiteral', value: 'p' },
                  // 第二个参数也是一个字符串字面量
                  { type: 'StringLiteral', value: 'Vue' },
                ]
              },
              // 数组的第二个元素也是 h 函数的调用
              {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'h' },
                arguments: [
                  // 该 h 函数调用的第一个参数是字符串字面量
                  { type: 'StringLiteral', value: 'p' },
                  // 第二个参数也是一个字符串字面量
                  { type: 'StringLiteral', value: 'Template' },
                ]
              }
            ]
          }
        ]
      }
    }
  ]
}

// 用来创建 StringLiteral 节点
function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value
  }
}
// 用来创建 Identifier 节点
function createIdentifier(name) {
  return {
    type: 'Identifier',
    name
  }
}
// 用来创建 ArrayExpression 节点
function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements
  }
}
// 用来创建 CallExpression 节点
function createCallExpression(callee, arguments) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments
  }
}

// 转换 Root 根节点
function transformRoot(node) {
  // 将逻辑编写在退出阶段的回调函数中，保证子节点全部被处理完毕
  return () => {
    // 如果不是根节点，则什么都不做
    if (node.type !== 'Root') {
      return
    }
    // node 是根节点，根节点的第一个子节点就是模板的根节点，
    // 当然，这里我们暂时不考虑模板存在多个根节点的情况
    const vnodeJSAST = node.children[0].jsNode
    // 创建 render 函数的声明语句节点，将 vnodeJSAST 作为 render 函数体的返回语句
    node.jsNode = {
      type: 'FunctionDecl',
      id: { type: 'Identifier', name: 'render' },
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJSAST
        }
      ]
    }
  }
}

export default {
  createStringLiteral,
  createIdentifier,
  createArrayExpression,
  createCallExpression,
  transformRoot
}