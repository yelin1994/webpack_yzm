class MyWebpackPlugins {
  apply(compiler) {
    compiler.hooks.afterResolvers.tap('MyWebpackPlugins', (compiler) => {
      console.log(compiler)
    })
    compiler.hooks.done.tapPromise('MyWebpackPlugins', (stats) => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1000)).then(() => console.log('states', stats))
    })
  }
}