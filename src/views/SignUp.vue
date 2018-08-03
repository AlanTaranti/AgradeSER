<template>
  <div>
    <p>Vamos criar uma nova conta!</p>
    <input type="text" v-model="email" placeholder="Email">
    <br>
    <input type="password" v-model="password" placeholder="Senha">
    <br>
    <button v-on:click="signUp">Cadastre-se</button>
    <span>or go back to <router-link :to="{ name: 'Login' }">login</router-link>.</span>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'SignUp',
    data: function () {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      signUp: function () {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.push({name: 'Home'});
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
