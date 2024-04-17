<template>
  <div class="q-pa-md" style="width: 100%;">
    <div class="row">
      <!-- Notes Area -->
      <div class="col col-sm-12 col-md-12 q-pa-md">
        <div class="row">
          <div class="col col-sm-12 col-md-12" >
            <span class="text-h3" >Generated History</span> <br/>
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
            <q-list class="q-pa-md">

                <q-item
                    v-for="(item, index) in cards"
                    :key="index"
                    active 
                    clickable
                    class="shadow-2 bg-white custom-item-border q-mb-sm"
                >
                    <q-item-section top avatar>
                    <q-icon name="history" color="primary" size="md" />
                    </q-item-section>

                    <q-item-section  @click="showHistoryModal(item)">
                    <q-item-label caption style="font-size: 7pt;">{{item.timestamp}}</q-item-label>
                    <q-item-label lines="2">{{item.userInput}}</q-item-label>
                    <q-item-label caption lines="2">{{item.generatedText}}</q-item-label>
                    
                    </q-item-section>

                    <q-item-section side top>
                    <q-btn
                        @click="copyToClipboard(item.generatedText)" 
                        dense 
                        flat 
                        size="sm"
                        class="q-mt-sm"
                        icon="content_copy"
                    >
                        <q-tooltip>Copy Text</q-tooltip>
                    </q-btn>      
                    </q-item-section>
                </q-item>

            </q-list>
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
        const res = await listDocuments(`account-log/${userId}/logs`)
        this.cards = res
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
    copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$q.notify({
        message: 'Text copied to clipboard!',
        color: 'positive',
      });
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