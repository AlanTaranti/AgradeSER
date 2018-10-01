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
              <!-- Logo Text -->
              <h5 class="headline text-xs-center">AgradeSER</h5>
              <br/>
              <!-- Titulo -->
              <h6 class="title text-xs-center">Vamos criar uma nova conta!</h6>
              <!-- Email -->
              <v-text-field
                v-model="email"
                type="email"
                placeholder="Email"
                prepend-icon="fas fa-at"
                :rules="[rules.required, rules.email]"
                ref="email"
                required
              ></v-text-field>
              <!-- Senha -->
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                prepend-icon="fas fa-key"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required, rules.min]"
                ref="password"
                required
              ></v-text-field>
              <br>
              <v-btn round block color="primary" dark v-on:click="signUp">Cadastre-se</v-btn>
              <br>
              <p class="text-xs-center">
                Já tem uma conta?
                <br>
                Você pode fazer
                <router-link :to="{ name: 'login' }">login</router-link>
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
              <!-- Logo Text -->
              <h5 class="headline text-xs-center">AgradeSER</h5>
              <br/>
              <!-- Titulo -->
              <h6 class="title text-xs-center">Vamos criar uma nova conta!</h6>
              <!-- Email -->
              <v-text-field
                v-model="email"
                type="email"
                placeholder="Email"
                prepend-icon="fas fa-at"
                :rules="[rules.required, rules.email]"
                ref="email2"
                required
              ></v-text-field>
              <!-- Senha -->
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                prepend-icon="fas fa-key"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required, rules.min]"
                ref="password2"
                required
              ></v-text-field>
              <br>
              <v-btn round block color="primary" dark v-on:click="signUp">Cadastre-se</v-btn>
              <br>
              <p class="text-xs-center">
                Já tem uma conta?
                <br>
                Você pode fazer
                <router-link :to="{ name: 'login' }">login</router-link>
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
    name: 'SignUp',
    data: function () {
      return {
        email: '',
        password: '',
        showPassword: false,
        rules: {
          required: value => !!value || 'Requerido.',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Email inválido.'
          },
          min: v => v.length >= 8 || 'Mínimo de 8 caracteres',
        },
        formHasErrors: false,
      }
    },
    methods: {
      signUp: function () {

        this.formHasErrors = false;

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true;
          this.$refs[f].validate(true)
        });

        if (!this.formHasErrors) {
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
            () => {
              this.$router.push({name: 'home'});
            },
            (err) => {
              alert('Oops. ' + err.message)
            }
          );
        }

      }
    },

    computed: {
      form() {
        return {
          email: this.email,
          email2: this.email,
          password: this.password,
          password2: this.password,
        }
      },
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
