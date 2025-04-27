module.exports = {
  presets: [
    [
      '@babel/preset-env', // 将es6+ 转译到一个向下兼容的版本
      {
        modules: false // 禁止babel的模块依赖解析 避免接收到转化过的commonjs 模块 无法treeShaking
      },
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
}