# simple-vuex

vuex简单实现 完成以下功能

```vue
<template>
  <div class="about">
    <h1>姓名：{{$store.state.userinfo.name}}</h1>
    <button @click="minus">-</button>
    <h1>年龄：{{$store.getters.myAge}}</h1>
    <button @click="add">+</button>
    <div>
      模块数据：
      a.x: {{$store.state.a.x}}
      b.y: {{$store.state.b.y}}
      a.c.z: {{$store.state.a.c.z}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',
  mounted () {
    setTimeout(()=>{
      this.$store.state.userinfo.age = 20
    }, 1000)
  },
  methods: {
    minus () {
      this.$store.dispatch('asyncMinus', 10)
    },
    add () {
      this.$store.commit('syncAdd', 10)
    }
  }
}
</script>
```