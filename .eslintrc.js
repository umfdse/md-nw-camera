// http://eslint.org/docs/user-guide/configuring
// [关闭令人抓狂的ESlint 语法检测配置方法 - 涂涂 - CSDN博客](https://blog.csdn.net/qq_34645412/article/details/78974413)
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    semi: [2, 'always'],
    // 空行最多不能超过100行
    'no-multiple-empty-lines': [0, { max: 100 }],
    // 关闭禁止混用tab和空格
    'no-mixed-spaces-and-tabs': [0],
    eqeqeq: 0,
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'space-before-function-paren': 0

  }
};
