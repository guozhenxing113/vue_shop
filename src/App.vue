<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style>
body,
#app,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 1366px;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.15);
}
.el-row {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
