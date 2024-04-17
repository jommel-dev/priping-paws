<template>
  <div class="q-pa-md" style="width: 100%;">
    <div class="row">
      <!-- Action Control -->
      <div class="col col-sm-12 col-md-1 q-pa-md" >
        <q-btn @click="addCard" round color="black" icon="add" />
      </div>
      <!-- Notes Area -->
      <div class="col col-sm-12 col-md-11 q-pa-md">
        <div class="row">
          <div class="col col-sm-12 col-md-12" >
            <span class="text-h3" >Notes</span> <br/>
            <q-separator />
            <q-input
              outlined
              bottom-slots
              v-model="search" 
              placeholder="Search"
              dense
              rounded
              class="q-mt-md"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col col-sm-12 col-md-12 flex gutter" >
            <q-card
              v-for="(card, indx) in cards"
              :key="indx"
              class="my-card text-black q-mr-md q-mb-md q-pt-md"
              style="width: 13vw; max-height: 40vh;"
            >
              <q-card-section class="q-pt-none">
                <div>
                  <span v-if="!card.edit" class="text-h6">{{card.title || 'No Title'}}</span>
                  <q-input v-if="card.edit" borderless v-model="card.title" placeholder="Title" />
                </div>
                <span v-if="!card.edit">{{card.text || 'No Content'}}</span>
                <q-input v-if="card.edit" borderless v-model="card.text" autogrow placeholder="Note" />
              </q-card-section>
              <q-card-actions class="float-right">
                <q-btn 
                  v-if="card.edit" 
                  @click="updateNote(card, indx)" 
                  size="xs" 
                  round 
                  color="green" 
                  icon="save" 
                />
                <q-btn v-if="!card.edit" @click="card.edit = !card.edit" size="xs" round color="blue" icon="edit" />
                <q-btn
                  @click="recycleNote(card)"
                  size="xs" 
                  round 
                  color="red"
                  icon="delete_forever" 
                />
              </q-card-actions>
            </q-card>
          </div>

        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar';
import getQueryWithFilter from '../../firebase/firebase-query';
import updateDocument from '../../firebase/firebase-update';
import createDocument from '../../firebase/firebase-create';

export default {
  data() {
    return {
      search: '',
      cards: [],
    };
  },
  created(){
    this.fetchListOfNotes();
  },
  methods: {
    async fetchListOfNotes(){
      try {
        const user = LocalStorage.getItem('user')
        const userId = user ? user.uid : null
        const res = await getQueryWithFilter(`account-log/${userId}/notes`, 'view', 'notes')
        this.cards = res
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
    async updateNote(note, idx){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null
      try {
        let payload = {
          title: note.title,
          text: note.text,
        }
        updateDocument(`account-log/${userId}/notes`, note.id, payload)

        this.cards[idx].edit = false
      } catch (error) {
        this.$q.notify({
          message: 'Error saving data',
          color: 'negative',
        });
      }
    },
    async recycleNote(note){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null

      // Confirm
      this.$q.dialog({
          title: 'Recycle Note',
          message: 'Would you like to recycle this note?',
          ok: {
              label: 'Yes'
          },
          cancel: {
              label: 'No',
              color: 'negative'
          },
          persistent: true
      }).onOk(() => {
        try {
          let payload = {
            view: "recycled",
          }
          updateDocument(`account-log/${userId}/notes`, note.id, payload)

          this.fetchListOfNotes()
        } catch (error) {
          this.$q.notify({
            message: 'Error saving data',
            color: 'negative',
          });
        }
      })
    },
    addCard() {
      // Add a new card to the array
      let payload = { 
        title: '', 
        text: '',
        view: 'notes',
        status: 1
      }

      try {
        const user = LocalStorage.getItem('user');
        const userId = user ? user.uid : '';

        createDocument(`account-log/${userId}/notes`, payload);
        this.fetchListOfNotes()
      } catch (error) {
        console.log(error)
        this.$q.notify({
          message: 'Error saving data',
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