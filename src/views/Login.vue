<template>
  <v-container fluid :style="{backgroundImage: 'url('+background+')'}">
    <!-- MD and UP -->
    <v-layout align-center justify-center fill-height hidden-sm-and-down>
      <v-card>
        <v-container fluid fill-height>
          <v-layout align-center justify-space-around fill-height>
            <v-flex md6 style="padding-right: 12px;">
              <img src="/static/img/logo_200x200.png">
            </v-flex>
            <v-flex md6 style="padding-left: 12px;">
              <!-- Logo -->
              <h5 class="headline text-xs-center">AgradeSER</h5>
              <!-- Email -->
              <v-text-field
                v-model="email"
                type="email"
                name="email"
                placeholder="Email"
                prepend-icon="fas fa-at"
                required
                ref="email"
                :rules="emailRules"
              ></v-text-field>
              <!-- Senha -->
              <v-text-field
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                prepend-icon="fas fa-key"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
                required
                ref="password"
                :rules="passwordRules"
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
              <img src="/static/img/logo_150x150.png">
            </v-flex>
            <v-flex xs12 style="margin-top: 10px;">
              <!-- Logo -->
              <h5 class="headline text-xs-center">AgradeSER</h5>
              <!-- Email -->
              <v-text-field
                v-model="email"
                type="email"
                name="email"
                placeholder="Email"
                prepend-icon="fas fa-at"
                required
                ref="email2"
                :rules="emailRules"
              ></v-text-field>
              <!-- Senha -->
              <v-text-field
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Senha"
                prepend-icon="fas fa-key"
                :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                @click:append="showPassword = !showPassword"
                required
                ref="password2"
                :rules="passwordRules"
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
        formHasErrors: false,
        rules: {
          emailMatch: () => ('O email e senha não combinam'),
          required: () => ('Valor requerido!')
        },
        emailRules: [],
        passwordRules: [],
      }
    },

    watch: {
      password() {
        this.passwordRules = [];
      },
      email() {
        this.emailRules = [];
      },
    },

    methods: {
      signIn: function () {

        this.formHasErrors = false;
        const self = this;

        Object.keys(this.form).forEach(f => {
          if (!this.form[f]) this.formHasErrors = true;
        });

        if (!this.formHasErrors) {
          firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
            (user) => {
              this.$router.push({name: 'home'});
            },
            (err) => {
              self.emailRules = [self.rules.emailMatch];
              self.passwordRules = [self.rules.emailMatch];
              Object.keys(self.form).forEach(f => {
                self.$refs[f].validate(true)
              });
            }
          );
        }
        else {
          this.emailRules = [this.rules.required];
          this.passwordRules = [this.rules.required];
          Object.keys(this.form).forEach(f => {
            this.$refs[f].validate(true)
          });
        }
      },

      onResize() {
        this.criarBackground();
      },

      criarBackground() {
        // Background
        const colors = ["#ef5f6f", "efa65d", "#f85467", "#f8a554"];
        const pattern = Trianglify({
          width: window.innerWidth,
          height: window.innerHeight,
          x_colors: colors,
          cell_size: 60
        });
        this.background = pattern.png();
      },

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
      this.criarBackground();
    },

    beforeDestroy() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize, {passive: true})
      }
    },

    mounted() {
      window.addEventListener('resize', this.onResize, {passive: true})
    },
  }
</script>

<style scoped>
</style>
