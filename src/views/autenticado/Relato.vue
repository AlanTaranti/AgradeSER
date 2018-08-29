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
      <v-text-field
        v-model="models.localizacao"
        placeholder="Local"
        prepend-icon="place"
        ref="autocompleteLocation"
      />

      <!-- Salvar -->
      <v-btn color="success" v-on:click="salvarRelato">Salvar</v-btn>

    </div>

  </v-container>
</template>

<script>

  import moment from 'moment';
  import db from '../../main'
  import firebase from 'firebase'

  moment.locale('pt-br');

  export default {
    name: "Relato",
    data: () => ({
      dbRefs: {
        relatosRef: null,
      },
      relatoCarregado: false,
      models: {
        datePicker: moment().format('YYYY-MM-DD'),
        menuDatePicker: false,
        localizacao: ''
      },
      localizacaoUsuario: '',
      relato: {
        id: null,
        data: null,
        titulo: null,
        conteudo: null,
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

      salvarRelato(event) {

        this.relato.data = this.dataParaSalvar;

        const relatoId = this.$route.params.id;
        // Novo Relato
        if (!relatoId) {
          this.relato.createdAt = new Date();
          this.dbRefs.relatosRef.add(this.relato).catch((error) => {
            console.error('Erro ao adicionar um novo relato', error);
            throw Error(error);
          });
        }
        // Update de Relato
        else {
          this.dbRefs.relatosRef.doc(relatoId).update(this.relato);
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
      }

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
