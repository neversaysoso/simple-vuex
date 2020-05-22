<template>
  <div class="about">
    <h1>姓名：{{$store.state.userinfo.name}}</h1>
    <button @click="minus">-</button>
    <h1>年龄：{{$store.getters.myAge}}</h1>
    <button @click="add">+</button>
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
