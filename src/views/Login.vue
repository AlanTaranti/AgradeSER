<template>
  <div>
    <h3>AgradeSER</h3>
    <input type="text" v-model="email" placeholder="Email">
    <br>
    <input type="password" v-model="password" placeholder="Senha">
    <br>
    <button v-on:click="signIn">Entrar</button>
    <p>Não tem uma conta? Você pode
      <router-link :to="{ name: 'signup' }">criar uma</router-link>
    </p>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'Login',
    data: function () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      signIn: function () {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.push({name: 'home'});
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  }
</script>

<style scoped>
</style>
