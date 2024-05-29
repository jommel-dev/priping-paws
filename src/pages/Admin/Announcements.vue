<template>
  <div class="q-pa-md" style="width: 100%;">
    <div class="row">
      <!-- Action Control -->
      <div class="col col-sm-12 col-md-1 q-pa-md" >
        <q-btn round color="black" icon="add" >
            <q-popup-proxy >
                <q-card style="width: 85dvw;">
                    <q-card-section>
                        <div>
                            <q-input outlined v-model="form.title" placeholder="Title" class="q-mb-sm" />
                        </div>
                        <q-editor v-model="form.description" min-height="15rem" />
                    </q-card-section>
                    <q-card-actions >
                        <q-btn v-close-popup no-caps size="xs" rounded color="red" label="Cancel" icon="close" />
                        <q-btn 
                            @click="saveToAnnouncements()" 
                            size="xs" 
                            rounded 
                            no-caps
                            label="Create Content"
                            color="blue" 
                            icon="save" 
                        />
                        <!-- <q-btn
                        @click="recycleNote(card)"
                        size="xs" 
                        round 
                        color="red"
                        icon="delete_forever" 
                        /> -->
                    </q-card-actions>
                </q-card>
            </q-popup-proxy>
        </q-btn>
      </div>
      <!-- Notes Area -->
      <div class="col col-sm-12 col-md-11 q-pa-md">
        <div class="row">
          <div class="col col-sm-12 col-md-12" >
            <span class="text-h3" >Announcements</span> <br/>
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
          <div class="col col-xs-12 col-sm-12 col-md-12" >
            <q-card
              v-for="(card, indx) in cards"
              :key="indx"
              class="my-card text-black q-mb-md"
            >
              <q-card-section>
                <div>
                  <span v-if="!card.edit" class="text-h6">{{card.title || 'No Title'}}</span>
                  <q-input v-if="card.edit" outlined v-model="card.title" placeholder="Title" class="q-mb-sm" />
                </div>
                <span v-if="!card.edit" v-html="card.description || 'No Content'"></span>
                <q-editor v-if="card.edit" v-model="card.description" min-height="5rem" />
                <!-- <q-input  borderless v-model="card.text" autogrow placeholder="Note" /> -->
              </q-card-section>
              <q-card-actions >
                <q-btn v-if="card.edit" @click="card.edit = !card.edit" no-caps size="xs" rounded color="red" label="Cancel Edit" icon="close" />
                <q-btn 
                  v-if="card.edit" 
                  @click="updateNote(card, indx)" 
                  size="xs" 
                  rounded 
                  no-caps
                  label="Save Content"
                  color="green" 
                  icon="save" 
                />
                
                <q-btn v-if="!card.edit" @click="card.edit = !card.edit" size="xs" no-caps rounded label="Edit Content" color="blue" icon="edit" />
                <!-- <q-btn
                  @click="recycleNote(card)"
                  size="xs" 
                  round 
                  color="red"
                  icon="delete_forever" 
                /> -->
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
import getAnnouncements from '../../firebase/firebase-announcement';
import createDocument from '../../firebase/firebase-create';
import moment from 'moment';

export default {
  data() {
    return {
      search: '',
      cards: [],
      form: {
        title: "",
        subject: '{"label":"Announcement","value":"Announcement","icon":"campaign","color":"blue","type":1}',
        description: "",
        createdBy: "Primping Paws",
        tags: '["Paw Owners"]',
        createdDate: moment().format("LL at LTS UTC+8"),
        status: 1
      }
    };
  },
  created(){
    this.fetchListOfNotes();
  },
  methods: {
    async fetchListOfNotes(){
      try {
        const res = await getAnnouncements()
        this.cards = res.list
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
    saveToAnnouncements() {
      // Add a new card to the array
      let payload = this.form

      try {
        createDocument(`announcements`, payload);
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
  .my-card{
    width: 100%;
    border-radius: 20px;
  }
</style>