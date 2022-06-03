module.exports = {
  plugins: [
    require('postcss-preset-env'),
    // require('postcss-functions')({
    //   functions: {
    //     ...require('./postcss/font.js')
    //   }
    // }),
    // require('postcss-mixins'), @mixin
    require('postcss-nested'),
    // require('postcss-atroot'), @at-root
    // require('postcss-conditionals'), //@if
    // require('postcss-for'), @for
    // require('postcss-each'), @each
    require('postcss-short')
    // require('postcss-apply'),
    // require('postcss-font-magician')
  ]
}
