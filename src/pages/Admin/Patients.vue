<template>
  <div class="q-pa-md" style="width: 100%;">
    <div class="fit row wrap justify-start items-start content-start">
      <!-- Action Control -->
      <div class="q-pa-md" style="width: 65px;">
        <q-btn @click="addCard" round color="black" icon="add">
          <q-tooltip>
            Add New Patient
          </q-tooltip>
        </q-btn>
      </div>
      <!-- Notes Area -->
      <div class="col q-pa-md">
        <div class="row">
          <div class="col col-sm-12 col-md-12" >
            <span class="text-h4" >Patient List</span> <br/>
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
              class="my-card q-pa-none no-box-shadow"
            >
              <q-card-section class="q-pt-none text-center" @click="openFolder(card)">
                <q-icon name="mdi-folder-account" size="4em"/><br/>
                <span class="text-title">{{ `${card.firstName} ${card.lastName}` }}</span><br/>
                <span class="text-grey" style="font-size: 7pt;">{{ `Purr Count (${card.pets})` }}</span><br/>
                <q-tooltip class="bg-white" anchor="center right" self="center left" :offset="[10, 10]">
                  <span class="text-caption text-black">Address: {{ `${card.address}` }}</span><br/>
                  <span class="text-caption text-black">Contact: {{ `${card.contactNumber}` }}</span>
                </q-tooltip>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <q-dialog persistent v-model="openAddClient">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">ADD NEW OWNER</div>
        </q-card-section>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { LocalStorage } from 'quasar';
import getQueryWithFilter from '../../firebase/firebase-query';

export default {
  data() {
    return {
      search: '',
      cards: [],
      openAddClient: false,
      form: {
        lastName: "",
        firstName: "",
        middleName: "",
        suffix: "",
        address: "",
        sex: "Male",
        email: '',
        contact: '',
      }
    }
  },
  created(){
    this.fetchListOfNotes();
  },
  methods: {
    openFolder(data){
      console.log(data)
    },
    async fetchListOfNotes(){
      try {
        const res = await getQueryWithFilter(`userProfile`, 'userType', 'client')
        res.map(el => {
          let obj = {
            ...el,
            pets: [
              {
                petName: 'my pet',
                age: '10',
              },
              {
                petName: 'my pet 2',
                age: '12',
              },
            ]
          }

          return obj;
        });
        this.cards = res;
      } catch (error) {
        console.log(error)
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
  cursor: pointer;
  background-color: transparent !important;
}
</style>
