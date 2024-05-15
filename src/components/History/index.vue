<template>
  <div class="q-pa-md" style="width: 100%;">
    <div class="row">
      <!-- Notes Area -->
      <div class="col col-sm-12 col-md-12 q-pa-md">
        <div class="row">
          <div class="col col-sm-12 col-md-12 flex gutter" >
            <q-table
                :rows="rows"
                row-key="name"
                :filter="search"
                grid
                :rows-per-page-options="[20]"
                hide-header
                :loading="isLoading"
            >
              <template v-slot:top-right>
                <q-input outlined dense debounce="300" v-model="search" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
              </template>

              <template v-slot:item="props">
                    
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar';
import listDocuments from '../../firebase/firebase-list';

export default {
  data() {
    return {
      search: '',
      cards: [],
    };
  },
  created(){
    this.fetchSearchList();
  },
  methods: {
    async fetchSearchList(){
      try {
        const user = LocalStorage.getItem('user')
        const userId = user ? user.uid : null
        const res = await listDocuments(`userPet/${userId}`)
        console.log(res)
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
  },
};
</script>
<style>
.note-container {
  display: flex;
}
  .my-card1{
    width: 100%;
    height: 30vh;
    max-width:20% ;
    margin: 10px;
  }
</style>