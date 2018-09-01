<template>
  <v-container fluid>

    <div class="text-xs-center" v-show="!relatoCarregado">
      <v-progress-circular
        :size="70"
        :width="7"
        color="primary"
        indeterminate>
      </v-progress-circular>
    </div>

    <div v-show="relatoCarregado">
      <!-- Date Picker -->
      <v-flex xs12 sm6 md4>
        <v-menu
          v-model="models.menuDatePicker"
          absolute
          offset-y
          lazy
          origin="center center"
          transition="scale-transition"
          style="width: 100%;">

          <v-card slot="activator" style="width: 100%;">
            <v-layout justify-space-between row fill-height>

              <!-- Dia do Mês -->
              <v-flex xs3>
                <v-card-text align-center class="center-content-vh" style="height: 100%;">
                  <span>{{ diaDoRelato }}</span>
                </v-card-text>
              </v-flex>

              <v-flex xs9>
                <v-card-text class="text-xs-left">
                  <!-- Dia da Semana-->
                  <span class="text-xs-left">{{ diaDaSemanaDoRelato }}</span>
                  <br>
                  <!-- Mẽs e Ano -->
                  <span class="text-xs-left">{{ mesEAnoDoRelato  }}</span>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>

          <v-date-picker v-model="models.datePicker"></v-date-picker>

        </v-menu>
      </v-flex>

      <!-- Título -->
      <v-flex xs12 sm6 md4 style="margin-top: 10px;">
        <v-text-field
          placeholder="Título"
          v-model="relato.titulo"
          single-line/>
      </v-flex>

      <!-- Conteúdo -->
      <v-flex x12 sm6 md4>
        <v-textarea
          placeholder="Conteúdo"
          v-model="relato.conteudo"
        />
      </v-flex>

      <!-- Localização -->
      <v-flex x12 sm6 md4>
        <v-text-field
          v-model="models.localizacao"
          placeholder="Local"
          prepend-icon="place"
          ref="autocompleteLocation"
        />
      </v-flex>

      <!-- Selecionar Pessoas -->
      <v-flex xs12 sm6 md4>
        <v-combobox
          placeholder="Quem estava com você?"
          chips
          multiple
          prepend-icon="person"
          append-icon=""
          v-model="models.pessoas"
          style="text-transform: capitalize;">
          <template slot="selection" slot-scope="data">
            <v-chip
              close
              @input="pessoaRemover(data.item)"
              :selected="data.selected">
              <strong>{{ data.item }}</strong>&nbsp;
            </v-chip>
          </template>
        </v-combobox>
      </v-flex>

      <!-- Salvar -->
      <v-btn color="primary" v-on:click="salvarRelato">Salvar</v-btn>

    </div>

  </v-container>
</template>

<script>

  import moment from 'moment';
  import md5 from 'blueimp-md5'
  import db from '../../main'
  import firebase from 'firebase'
  import store from '../../vuex/store';

  moment.locale('pt-br');

  export default {
    name: "Relato",
    store: store,
    data: () => ({
      dbRefs: {
        relatosRef: null,
        localizacoesRef: null,
        pessoasRef: null,
        tagsRef: null,
      },
      relatoCarregado: false,
      models: {
        datePicker: moment().format('YYYY-MM-DD'),
        menuDatePicker: false,
        localizacao: '',
        pessoas: [],
      },
      localizacaoUsuario: '',
      relato: {
        id: null,
        data: null,
        titulo: null,
        conteudo: null,
        pessoas: null,
        local: {
          id: null,
          nome: null,
          lat: null,
          lon: null,
        },
      }
    }),

    computed: {
      dataParaSalvar() {
        return firebase.firestore.Timestamp.fromDate(moment(this.models.datePicker).toDate());
      },
      diaDoRelato() {
        return moment(this.models.datePicker).format('DD');
      },
      diaDaSemanaDoRelato() {
        return moment(this.models.datePicker).format('dddd');
      },
      mesEAnoDoRelato() {
        return moment(this.models.datePicker).format('MMMM YYYY');
      },
    },

    methods: {

      pessoaRemover(item) {
        this.relato.pessoas.splice(this.relato.pessoas.indexOf(item), 1);
        this.relato.pessoas = [...this.relato.pessoas];
      },

      setPlace(place) {
        this.models.localizacao = place.name;
        this.relato.local.id = place.place_id;
        this.relato.local.nome = place.name;
        this.relato.local.lat = place.geometry.location.lat();
        this.relato.local.lon = place.geometry.location.lng();
      },

      setRelato(relato) {
        // Set Relato
        this.relato.id = relato.id;
        this.relato.data = relato.data().data;
        this.relato.titulo = relato.data().titulo;
        this.relato.conteudo = relato.data().conteudo;
        this.relato.local = relato.data().local;
        this.relato.createdAt = relato.data().createdAt;
        this.relato.pessoas = relato.data().pessoas;

        // Ajustes models
        this.models.localizacao = this.relato.local.nome;
        this.models.datePicker = moment(this.relato.data.toDate()).format('YYYY-MM-DD');

        // Mostrar relato
        this.relatoCarregado = true;
      },

      coletarLocalizacaoUsuario() {
        const self = this;
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(function (location) {
            self.localizacaoUsuario = location.coords.latitude + ',' + location.coords.longitude;
          });
        }
      },

      mostrarToasterSalvarERedirectHome() {
        this.$store.commit('toasterMensagem', 'Relato salvo com sucesso!');
        this.$store.commit('toasterColor', 'success');
        this.$store.commit('toasterMostrar', true);
        this.$router.push({name: 'home'});
      },

      mostrarToasterAtualizarERedirectHome() {
        this.$store.commit('toasterMensagem', 'Relato atualizado com sucesso!');
        this.$store.commit('toasterColor', 'success');
        this.$store.commit('toasterMostrar', true);
        this.$router.push({name: 'home'});
      },

      mostrarToasterErro() {
        this.$store.commit('toasterMensagem', 'Tente novamente mais tarde');
        this.$store.commit('toasterColor', 'error');
        this.$store.commit('toasterMostrar', true);
        this.$router.push({name: 'home'});
      },

      salvarRelato(event) {

        this.relato.data = this.dataParaSalvar;
        this.relato.pessoas = this.pessoasFormatadasParaFirebase();
        const self = this;

        const relatoId = this.$route.params.id;
        console.log(this.relato);
        // Novo Relato
        if (!relatoId) {
          this.relato.createdAt = new Date();
          this.dbRefs.relatosRef.add(this.relato)
            .then(function () {
              self.dbRefs.localizacoesRef.doc(self.relato.local.id).set(self.relato.local)
                .then(function () {
                  Object.keys(self.relato.pessoas).forEach(function (key) {
                    self.dbRefs.pessoasRef.doc(md5(key)).set({nome: key});
                  });
                  self.mostrarToasterSalvarERedirectHome()
                });
            })
            .catch((error) => {
              console.error('Erro ao adicionar um novo relato', error);
              self.mostrarToasterErro();
            });
        }
        // Update de Relato
        else {
          this.dbRefs.relatosRef.doc(relatoId).update(this.relato)
            .then(function () {
              self.dbRefs.localizacoesRef.doc(self.relato.local.id).set(self.relato.local)
                .then(function () {
                  self.mostrarToasterAtualizarERedirectHome()
                });
            })
            .catch(function (error) {
              console.error('Erro ao adicionar um novo relato', error);
              self.mostrarToasterErro();
            });
        }

      },

      inicializarEscrita() {
        this.coletarLocalizacaoUsuario();

        // Adicionado autocompletar de Localização
        let autocompleteLocation = this.$refs.autocompleteLocation.$refs.input;
        const google = window.google;
        this.autocompleteLocation = new google.maps.places.Autocomplete(
          (autocompleteLocation),
          {
            types: ['geocode'],
            language: ['pt-BR'],
            location: this.localizacaoUsuario,
            radius: 1000
          }
        );

        // Listener de local
        this.autocompleteLocation.addListener('place_changed', () => {
          this.setPlace(this.autocompleteLocation.getPlace());
        });
      },

      getRelato(relatoId) {
        this.dbRefs.relatosRef.doc(relatoId).get()
          .then(this.setRelato)
          .catch(function (error) {
            console.error('Falha em obter relato:', error);
          });
      },

      pessoasFormatadasParaFirebase() {
        let formatado = {};

        this.models.pessoas.forEach(function (pessoa) {
          const pessoaSplited = value.split(' ');
          pessoaSplited.forEach(function (value, index, array) {
            pessoaSplited[index] = value.charAt(0).toUpperCase() + value.slice(1);
          });
          const pessoaCapitalizada = pessoaSplited.join(' ');
          formatado[pessoaCapitalizada] = true;
        });

        return formatado;
      },

    },

    mounted() {

      // Se houver um parametro de id, trata ele
      const relatoId = this.$route.params.id;
      if (relatoId) {
        this.getRelato(relatoId);
      }
      else {
        this.relatoCarregado = true;
        this.inicializarEscrita();
      }
    },

    created() {
      /* Firestore References */
      const userRef = db.collection('usuario').doc(firebase.auth().currentUser.uid);
      this.dbRefs.relatosRef = userRef.collection('relatos');
      this.dbRefs.localizacoesRef = userRef.collection('localizacoes');
      this.dbRefs.pessoasRef = userRef.collection('pessoas');
      this.dbRefs.tagsRef = userRef.collection('tags');
    }
  }
</script>

<style scoped>

  .center-content-vh {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media only screen and (max-width: 959px) {
    .container {
      padding: 0;
    }
  }

</style>
