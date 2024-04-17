<template>
  <div class="q-pa-md" style="width: 100%;">
    <div class="row">
      <!-- Notes Area -->
      <div class="col col-sm-12 col-md-12 q-pa-md">
        <div class="row">
          <div class="col col-sm-12 col-md-12" >
            <span class="text-h3" >Recycled Notes</span> <br/>
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
                  @click="retrieveNote(card)" 
                  size="xs" 
                  round 
                  color="green" 
                  icon="undo" 
                />
                <q-btn
                  @click="deleteForever(card)"
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
import deleteDocument from '../../firebase/firebase-delete';

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
        const res = await getQueryWithFilter(`account-log/${userId}/notes`, 'view', 'recycled')
        this.cards = res
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
    async retrieveNote(note){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null
       // Confirm
      this.$q.dialog({
          title: 'Retrieve Note',
          message: 'Would you like to retrieve this note?',
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
                view: "notes",
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
    async deleteForever(note){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null
       // Confirm
      this.$q.dialog({
        title: 'Delete Note',
        message: 'This will permanently deleted your note, Would you like to proceed?',
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
            // Delete action to firebase
            deleteDocument(`account-log/${userId}/notes`, note.id)

            this.fetchListOfNotes()
        } catch (error) {
            this.$q.notify({
                message: 'Error saving data',
                color: 'negative',
            });
        }
      })
    }
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