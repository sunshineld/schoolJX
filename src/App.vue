<template>
  <div id="app">
    <!-- <transition name="router-fade" mode="out-in"> -->
      <router-view></router-view>
    <!-- </transition> -->
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style lang="less">
html,
body,
div,
span,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
abbr,
address,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
samp,
small,
strong,
sub,
sup,
var,
b,
i,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  vertical-align: baseline;
  background: transparent;
}
body {
  font-family: "SimSun", "SimHei", "open sans", "Helvetica Neue", Helvetica,
    Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;
  background-color: #f3f3f4;
  line-height: 1.1;
}
html,
body {
  width: 100%;
  height: 100%;
}
:focus {
  outline: 1;
}
article,
aside,
canvas,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary {
  display: block;
}
nav ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
a {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
  text-decoration: none;
}
ins {
  background-color: #ff9;
  color: #000;
  text-decoration: none;
}
mark {
  background-color: #ff9;
  color: #000;
  font-style: italic;
  font-weight: bold;
}
del {
  text-decoration: line-through;
}
abbr[title],
dfn[title] {
  border-bottom: 1px dotted #000;
  cursor: help;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #cccccc;
  margin: 1em 0;
  padding: 0;
}
input,
select {
  vertical-align: middle;
}
html,
body {
  height: 100%;
}
ul,
li {
  list-style: none;
}
div {
  box-sizing: border-box;
}

.confirm,
.confirm:hover {
  background: #41cac0 !important;
  border: 1px solid #41cac0 !important;
  color: #fff !important;
}
.el-dialog__footer {
  text-align: center;
}
.el-button--success {
  background-color: #41cac0;
  border: #41cac0;
}
.btns {
  background-color: #41cac0;
  border: #41cac0;
  color: white;
}
.btns:hover {
  background-color: #41cac0;
  border: #41cac0;
  color: white;
}
.btn:active {
  background-color: #41cac0;
  border: #41cac0;
  color: white;
}
.btn:visited {
  background-color: #41cac0;
  border: #41cac0;
  color: white;
}
.outd .el-dialog__header {
  background: #41cac0;
  padding: 0 10px;
  span {
    color: white;
  }
}
#app {
  width: 100%;
  height: 100%;
}
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity, transform 0.3s;
}
.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.el-submenu__title:hover {
  background-color: #f3f3f4;
}
.el-message {
  z-index: 9000 !important;

  .el-message__icon {
    display: none;
  }
}
.el-message.el-message--success {
  // z-index: 9000 !important;
  background-color: #41cac0;
  border: none;
  .el-message__content {
    color: #fff;
  }
}
.el-message.el-message--error {
  // z-index: 9000 !important;
  background-color: #fff;
  border: 1px solid #f00;
  .el-message__content {
    color: #999;
  }
}
.el-submenu__title {
  font-size: 16px;
}

.confirm {
  background: #41cac0;
  border: 1px solid #41cac0;
  color: #fff;
}
.confirm:hover {
  color: #fff;
}
// 表格 需要添加<el-table row-class-name="table-row"></el-table>
.el-table .table-row:nth-of-type(2n + 1) {
  background-color: rgba(49, 126, 235, 0.05);
}
// 全局图表样式
.chart {
  width: 95%;
  // min-width: 800px;
  height: 400px;
}
.el-table__body tr td:last-child {
  border-right: 0;
}
.click {
  color: rgb(1, 0, 255);
  cursor: pointer;
}
.mytable .el-card__body {
  overflow: auto;
  height: 100%;
}
.el-menu {
  border: none;
}
.outportaddr-group {
  text-align: center;
  font-size: 16px;
}
.questionstable .el-card__body {
  height: 92%;
  overflow: auto;
  padding-bottom: 50px;
}
.el-input__inner {
  vertical-align: baseline;
}
.teacherBox .el-dialog__body {
  background-color: #f2f3f4;
  border-radius: 0 0 8px 8px;
}

.contentDiv table,
.contentDiv table tr th,
.contentDiv table tr td {
  border: 1px solid gray;
}

.questionTitle table,
.questionTitle table tr th,
.questionTitle table tr td {
  border: 1px solid gray;
}
.itmesContent table,
.itmesContent table tr th,
.itmesContent table tr td {
  border: 1px solid gray;
}

.MathJye table {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: normal;
  font-size: inherit;
  _font-size: 100%;
  font-style: normal;
  font-weight: normal;
  border: 0;
  float: none;
  display: inline-block;
  zoom: 0;
}
table.edittable {
  border-collapse: collapse;
  text-align: center;
  margin: 2px;
}
table.edittable td,
table.edittable th {
  line-height: 30px;
  padding: 5px;
  white-space: normal;
  word-break: break-all;
  border: 1px solid #000;
  vertical-align: middle;
}
table.composition {
  border-collapse: collapse;
  text-align: left;
  margin: 2px;
  width: 98%;
}
table.composition td,
table.composition th {
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border-width: 0;
  vertical-align: middle;
}
table.composition2 {
  border-collapse: collapse;
  width: auto;
}
table.composition2 td,
table.composition2 th {
  text-align: left;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border: none;
  border-width: 0;
  vertical-align: middle;
}
.MathJye table {
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  text-align: center;
  vertical-align: middle;
  line-height: normal;
  font-size: inherit;
  _font-size: 100%;
  font-style: normal;
  font-weight: normal;
  border: 0;
  float: none;
  display: inline-block;
  zoom: 0;
}
table.edittable {
  border-collapse: collapse;
  text-align: center;
  margin: 2px;
}
table.edittable td,
table.edittable th {
  line-height: 30px;
  padding: 5px;
  white-space: normal;
  word-break: break-all;
  border: 1px solid #000;
  vertical-align: middle;
}
table.composition {
  border-collapse: collapse;
  text-align: left;
  margin: 2px;
  width: 98%;
}
table.composition td,
table.composition th {
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border-width: 0;
  vertical-align: middle;
}
table.composition2 {
  border-collapse: collapse;
  width: auto;
}
table.composition2 td,
table.composition2 th {
  text-align: left;
  line-height: 30px;
  white-space: normal;
  word-break: break-all;
  border: none;
  border-width: 0;
  vertical-align: middle;
}
.questionstable .itmesContent .contentDiv img {
  max-width: 100%;
}
.contentCover .subjects img {
  max-width: 100%;
}
</style>
