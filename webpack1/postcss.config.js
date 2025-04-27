const autoprefixer = require('autoprefixer')
// const postcssCssnext = require('postcss-cssnext')
const px2rem = require('postcss-pxtorem')
module.exports = {
  plugins: [
    px2rem({
      rootValue: 50,
      propList: ['*']
    }),
    autoprefixer({
      grid: true
    }),
    // postcssCssnext({})
   
  ]
}