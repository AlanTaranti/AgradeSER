<template>
  <v-container fluid :style="{backgroundImage: 'url('+background+')'}">
    <!-- MD and UP -->
    <v-layout align-center justify-center fill-height hidden-sm-and-down>
      <v-card>
        <v-container fluid fill-height>
          <v-layout align-center justify-space-around fill-height>
            <v-flex md6 style="padding-right: 12px;">
              <img src="https://via.placeholder.com/200x200">
            </v-flex>
            <v-flex md6 style="padding-left: 12px;">
              <!-- Logo -->
              <h5 class="headline text-xs-center">AgradeSER</h5>
              <!-- Email -->
              <v-text-field
                v-model="email"
                type="email"
                placeholder="Email"
                prepend-icon="fas fa-at"
              ></v-text-field>
              <!-- Senha -->
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                prepend-icon="fas fa-key"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <br>
              <v-btn round block color="primary" dark v-on:click="signIn">Login</v-btn>
              <br>
              <p class="text-xs-center">

                Não tem uma conta ainda?
                <br>
                Você pode
                <router-link :to="{ name: 'signup' }">criar uma</router-link>
              </p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-layout>

    <!-- SM and Down -->
    <v-layout align-center justify-center fill-height hidden-md-and-up>
      <v-card>
        <v-container fluid>
          <v-layout align-center justify-space-around column fill-height>
            <v-flex xs12>
              <img src="https://via.placeholder.com/150x150">
            </v-flex>
            <v-flex xs12 style="margin-top: 10px;">
              <!-- Logo -->
              <h5 class="headline text-xs-center">AgradeSER</h5>
              <!-- Email -->
              <v-text-field
                v-model="email"
                type="email"
                placeholder="Email"
                prepend-icon="fas fa-at"
              ></v-text-field>
              <!-- Senha -->
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                prepend-icon="fas fa-key"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <br>
              <v-btn round block color="primary" dark v-on:click="signIn">Login</v-btn>
              <br>
              <p class="text-xs-center">Não tem uma conta ainda?
                <br>
                Você pode
                <router-link :to="{ name: 'signup' }">criar uma</router-link>
              </p>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import firebase from 'firebase'

  import Trianglify from 'trianglify'

  export default {
    name: 'Login',
    data: function () {
      return {
        email: '',
        password: '',
        showPassword: false,
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
    },

    created() {
      // Background
      const colors = ["#ef5f6f", "efa65d", "#f85467", "#f8a554"];
      const pattern = Trianglify({
        width: window.innerWidth,
        height: window.innerHeight,
        x_colors: colors,
        cell_size: 60
      });
      this.background = pattern.png();
    }
  }
</script>

<style scoped>
</style>
