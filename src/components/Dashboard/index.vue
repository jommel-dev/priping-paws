<template>
  <div class="q-pa-md" style="width: 100%;">
    <!-- Generate Text or Sentence Container -->
    <div class="row">
      <div v-if="!subscribedUser" class="col col-sm-12 col-md-12 q-mb-md">
        <!-- Subscribe Banner -->
        <q-banner v-if="!subscribedUser" inline-actions rounded class="bg-orange-4 text-black">
          In order to unlock the generate and other features, please subscribe <br/>
          <span class="text-caption text-black"><i>Note: </i> This one time subscription and you can use it forever! </span>

          <template v-slot:action>
            <q-btn
              color="black"
              label="Subscribe"
              class="q-ml-sm"
              @click="initPaypal"
            />
          </template>
        </q-banner>
      </div>
      <div v-if="subscribedUser && !isTopup" class="col col-sm-12 col-md-12 q-mb-md">
        <!-- Limit of Reach Banner -->
        <q-banner v-if="monthlyLimitValidate" inline-actions rounded class="bg-orange-4 text-black">
          You reached you limit this month to continue, please top-up <br/>
          <span class="text-caption text-black"><i>Note: </i> This is to add another limit characters can be generated</span>

          <template v-slot:action>
            <q-btn
              color="black"
              label="Top Up"
              class="q-ml-sm"
              @click="initPaypalTopUp"
            />
          </template>
        </q-banner>
      </div>
      <div class="col col-md-3 q-pa-sm">
        <!-- Subscription Details -->
        <q-card flat class="my-card shadow-7">
          <q-card-section>
            <div class="text-h6">Subscription Details</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Subcribe Date: {{moment(userData.subscribeDate).format('MMMM Do YYYY') || '--'}}
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <q-list >
                <q-item
                  class="shadow-2 bg-white custom-item-border q-mb-md q-pa-md"
                  v-ripple
                >
                  <q-item-section>
                    <q-item-label caption style="font-size: 7pt;">Monthly</q-item-label>
                    <q-item-label lines="2">Word Generated Limit</q-item-label>
                    <q-item-label class="text-bold text-grey-9 text-h6" lines="2">{{`${userData.limitUsed || 0}/${userData.limit || 0}`}}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar rounded class="generatedIconDash" text-color="white" icon="g_translate" size="xl" />
                  </q-item-section>
                </q-item>

                <q-item
                  class="shadow-2 bg-white custom-item-border q-mb-sm q-pa-md"
                  v-ripple
                >
                  <q-item-section>
                    <!-- <q-item-label caption style="font-size: 7pt;">Some Info</q-item-label> -->
                    <q-item-label lines="2">Top-Up Limit</q-item-label>
                    <q-item-label class="text-bold text-grey-9 text-h6" lines="2">{{`${userData.topUpUsed || 0}/${userData.topUpLimit | 0}`}}</q-item-label>
                  </q-item-section>
                  <q-item-section avatar>
                    <q-avatar rounded class="generatedIconDash" text-color="white" icon="add_shopping_cart" size="xl" />
                  </q-item-section>
                </q-item>

            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <div class="col col-sm-12 col-md-9 q-pa-sm">
        <!-- Textarea for sentences -->
        <q-card flat class="my-card shadow-7">
          <q-card-section>
            <q-input
              outlined
              bottom-slots
              v-model="userInput"
              placeholder="Enter Sentence Here"
              maxlength="3000"
              counter
              dense
              autogrow
              rounded
              type="textarea"
            >
              <template v-slot:prepend>
                <q-icon v-if="!generateLoading" name="history_edu" />
                <q-spinner-dots
                  v-if="generateLoading"
                  color="primary"
                  size="1em"
                />
              </template>
              <template v-slot:append>

              </template>
            </q-input>

            <q-btn
              @click="generateResponse"
              rounded
              textColor="white"
              class="generatedIconDash"
              label="Generate Response"
              :disabled="!subscribedUser || (monthlyLimitValidate && !isTopup)"
            />
          </q-card-section>
        </q-card>


        <!-- Result Content -->
        <q-card flat bordered class="q-mt-md">
          <!-- Heading -->
          <q-bar class="bg-primary text-white">
            <q-icon name="tips_and_updates" />
            <div>Generated Result</div>

            <q-space />
            <q-btn
              :disabled="generatedText === null"
              @click="copyToClipboard(generatedText)"
              dense
              flat
              icon="content_copy"
            >
              <q-tooltip>Copy Text</q-tooltip>
            </q-btn>
          </q-bar>
          <!-- Content -->
          <q-card-section :class="generateLoading ? 'text-center' : ''">
            <!-- Loader while API is generated -->
            <q-spinner-ios
              v-if="generateLoading"
              color="primary"
              size="4em"
            />
            <!-- Display the generated Text -->
            <span v-if="!generateLoading" class="text-subtitle1">{{ generatedText }}</span>
          </q-card-section>
          <q-separator />
          <q-card-actions>
            <p class="q-mr-lg">Letters: <span class="text-bold">{{ letterCountForGeneratedText }}</span></p>
            <p class="q-mr-lg">Words:  <span class="text-bold">{{ wordCountForGeneratedText }}</span></p>
          </q-card-actions>
        </q-card>
      </div>

    </div>

    <!-- 1st step create dialog container -->
    <q-dialog v-model="openHistory">
      <!-- 2nd step create dialog card body -->
      <q-card class="q-pa-md" style="max-width: 80vw; border-radius: 10px;">
        <!-- 4th step content dialog body -->
        <q-card-section>
          Input: <span
            class="text-bold cursor-pointer"
            @click="copyToClipboard(selectedHistory.userInput)"
          >{{selectedHistory.userInput}}</span> <br/>

          Result: <span
            class="text-subtitle1 cursor-pointer"
            @click="copyToClipboard(selectedHistory.generatedText)"
          >{{selectedHistory.generatedText}}</span>
        </q-card-section>
      </q-card>
    </q-dialog>


    <q-dialog v-model="openPaypal" persistent>
      <!-- 2nd step create dialog card body -->
      <q-card class="q-pa-md" style="width: 20vw;max-width: 60vw; border-radius: 10px;">
        <q-toolbar>
          <q-toolbar-title><span class="text-weight-bold">Pay Using</span></q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <!-- 4th step content dialog body -->
        <q-card-section>
          <!-- Loading -->
          <div v-show="paypalLoad" >
            <q-spinner-tail color="blue-grey" size="5.5em" />
          </div>
          <!-- Button Content -->
          <div v-show="!paypalLoad" id="paypal-btn"></div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import ClipboardJS from 'clipboard';
import createDocument from '../../firebase/firebase-create';
import updateDocument from '../../firebase/firebase-update';
import listDocuments from '../../firebase/firebase-list';
import getDetailsDocument from '../../firebase/firebase-get';
import captureOrder from '../../paypal/captureOrder';
import createOrderPaypal from '../../paypal/createOrder';
import createOrderTopUpPaypal from '../../paypal/createTopUpOrder';
import { LocalStorage } from 'quasar';
import { loadScript } from "@paypal/paypal-js";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true,
// });

// const clientID = process.env.PAYPAL_CLIENT_ID

export default {
  name: 'DashboardNoteComponent',
  data() {
    return {
      userInput: '',
      generateLoading: false,
      generatedText: null,
      typedGeneratedText: '', // added for typewriter effect
      inputHistory: [],
      textHistory: [],
      subsDetails: [],
      openHistory: false,
      openPaypal: false,
      paypalLoad: false,
      selectedHistory: {},
      userData: {
        isSubscribed: true,
        topUpActive: true
      }
    };
  },
  computed: {
    subscribedUser(){
      // for now
      return this.userData.isSubscribed;
    },
    monthlyLimitValidate(){
      let validate = Number(this.userData.limitUsed) === Number(this.userData.limit) && Number(this.userData.limit) !== 0
      return validate
    },
    isTopup(){
      return this.userData.topUpActive;
    },
    letterCountForGeneratedText() {
      return this.generatedText ? this.generatedText.replace(/[^A-Za-z]/g, '').length : 0;
    },
    wordCountForGeneratedText() {
      const words = this.generatedText ? this.generatedText.split(/\s+/) : [];
      return words.filter(word => word !== '').length;
    },
  },
  created(){
    // this.fetchSearchList()
    this.getUserDetails()
  },
  methods: {
    moment,
    // Global Create Docs
    async insertAuditLog(document, data){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null;

      createDocument(`audit-logs/${userId}/${document}`, data);
    },
    // Paypal Integ
    async initPaypal(){
      let vm = this;
      this.paypalLoad = true
      // Open Modal
      vm.openPaypal = true;
      let paypalOpt = {
         clientId: clientID
      }
      try {
        loadScript(paypalOpt)
        .then((paypal) => {
            this.paypalLoad = false
            paypal
                .Buttons({
                  async createOrder(){
                    const res = await createOrderPaypal()

                    if (res.jsonResponse.id) {
                      const dataToSave = {
                        actionTaken: "Paypal create order Executed success",
                        timeStamp: moment().format(),
                        type: "subscription",
                        snapShot: {
                          response: res.jsonResponse
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                      return res.jsonResponse.id;
                    } else {
                      const errorDetail = res.jsonResponse?.details?.[0];
                      const errorMessage = errorDetail
                        ? `${errorDetail.issue} ${errorDetail.description} (${res.jsonResponse.debug_id})`
                        : JSON.stringify(res.jsonResponse);

                      // Logs
                      const dataToSave = {
                        actionTaken: "Paypal create order Executed Error",
                        timeStamp: moment().format(),
                        type: "subscription",
                        snapShot: {
                          response: errorMessage
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                      throw new Error(errorMessage);
                    }
                  },
                  async onApprove(data){
                    const res = await captureOrder(data.orderID)

                    if(res.httpStatusCode >= 200 & res.httpStatusCode <= 299){
                      // Save to Logs
                      const dataToSave = {
                        actionTaken: "Paypal order approve payment success",
                        timeStamp: moment().format(),
                        type: "subscription",
                        snapShot: {
                          response: res.jsonResponse
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                      // Save and Update the users subscription
                      vm.updateUserSubscription(res.jsonResponse)
                      vm.openPaypal = false;
                    } else {
                      const dataToSave = {
                        actionTaken: "Paypal order approve payment Error",
                        timeStamp: moment().format(),
                        type: "subscription",
                        snapShot: {
                          response: res.jsonResponse
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                    }
                  }
                })
                .render("#paypal-btn")
                .catch((error) => {
                    console.error("failed to render the PayPal Buttons", error);
                });
        })
        .catch((error) => {
            console.error("failed to load the PayPal JS SDK script", error);
        });
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching data',
          color: 'negative',
        });
      }
    },
    async initPaypalTopUp(){
      let vm = this;
      this.paypalLoad = true
      // Open Modal
      vm.openPaypal = true;
      let paypalOpt = {
         clientId: clientID
      }
      try {
        loadScript(paypalOpt)
        .then((paypal) => {
            this.paypalLoad = false
            paypal
                .Buttons({
                  async createOrder(){
                    const res = await createOrderTopUpPaypal()

                    if (res.jsonResponse.id) {
                      const dataToSave = {
                        actionTaken: "Paypal create order Executed success",
                        timeStamp: moment().format(),
                        type: "top-up",
                        snapShot: {
                          response: res.jsonResponse
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                      return res.jsonResponse.id;
                    } else {
                      const errorDetail = res.jsonResponse?.details?.[0];
                      const errorMessage = errorDetail
                        ? `${errorDetail.issue} ${errorDetail.description} (${res.jsonResponse.debug_id})`
                        : JSON.stringify(res.jsonResponse);
                      // Logs
                      const dataToSave = {
                        actionTaken: "Paypal create order Executed Error",
                        timeStamp: moment().format(),
                        type: "top-up",
                        snapShot: {
                          response: errorMessage
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);

                      throw new Error(errorMessage);
                    }
                  },
                  async onApprove(data){
                    const res = await captureOrder(data.orderID)

                    if(res.httpStatusCode >= 200 & res.httpStatusCode <= 299){
                      // Save to Logs
                      const dataToSave = {
                        actionTaken: "Paypal order approve payment success",
                        timeStamp: moment().format(),
                        type: "top-up",
                        snapShot: {
                          response: res.jsonResponse
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                      // Save and Update the users subscription
                      vm.updateUserTopUp(res.jsonResponse)
                      vm.openPaypal = false;
                    } else {
                      const dataToSave = {
                        actionTaken: "Paypal order approve payment error",
                        timeStamp: moment().format(),
                        type: "top-up",
                        snapShot: {
                          response: res.jsonResponse
                        }
                      };
                      vm.insertAuditLog("transaction", dataToSave);
                    }
                  }
                })
                .render("#paypal-btn")
                .catch((error) => {
                    console.error("failed to render the PayPal Buttons", error);
                });
        })
        .catch((error) => {
            console.error("failed to load the PayPal JS SDK script", error);
        });
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching data',
          color: 'negative',
        });
      }
    },

    async updateUserSubscription(data){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null
      try {
        let payload = {
          isSubscribed: true,
          limitUsed: 0,
          limit: 50000,
          topUpUsed: 0,
          topUpLimit: 0,
          topUpActive: false,
          topUpDate: '',
          totalLimit: 50000,
          totalLimitUsed: 0,
          subscribeDate: data.purchase_units[0].payments.captures[0].create_time,
        }
        // update the users
        updateDocument(`userProfile`, userId, payload)

        const dataToSave = {
          actionTaken: "Updated the details",
          timeStamp: moment().format(),
          type: "update-data",
          snapShot: {
            response: "",
            data: payload
          }
        };
        this.insertAuditLog("actions", dataToSave);
        this.getUserDetails();
      } catch (error) {
        const dataToSave = {
          actionTaken: "Error updating the details",
          timeStamp: moment().format(),
          type: "update-data",
          snapShot: {
            response: error,
            data: ""
          }
        };
        this.insertAuditLog("actions", dataToSave);
        this.$q.notify({
          message: 'Error saving data',
          color: 'negative',
        });
      }
    },
    async updateUserTopUp(data){
      const user = LocalStorage.getItem('user')
      const userId = user ? user.uid : null
      try {
        let payload = {
          topUpLimit: 50000,
          topUpActive: true,
          topUpDate: data.purchase_units[0].payments.captures[0].create_time,
          totalLimit: Number(this.userData.totalLimit) + 50000,
        }
        // update the users
        updateDocument(`userProfile`, userId, payload)
        // const dataToSave = {
        //   actionTaken: "Updated the details",
        //   timeStamp: moment().format(),
        //   type: "update-data",
        //   snapShot: {
        //     response: "",
        //     data: payload
        //   }
        // };
        // this.insertAuditLog("actions", dataToSave);
        this.getUserDetails();
      } catch (error) {
        // const dataToSave = {
        //   actionTaken: "Error updating the details",
        //   timeStamp: moment().format(),
        //   type: "update-data",
        //   snapShot: {
        //     response: error,
        //     data: ""
        //   }
        // };
        // this.insertAuditLog("actions", dataToSave);
        this.$q.notify({
          message: 'Error saving data',
          color: 'negative',
        });
      }
    },

    // Some MEthods
    async getUserDetails(){
      try {
        const user = LocalStorage.getItem('user')
        const userId = user ? user.uid : null
        const res = await getDetailsDocument(`userProfile`, userId)
        this.userData = res
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching data',
          color: 'negative',
        });
      }
    },
    showHistoryModal(data = {}){
      // Setting the Data to display
      this.selectedHistory = data
      // Hide and Show of the Dialog
      this.openHistory = !this.openHistory
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
    async fetchSearchList(){
      try {
        const user = LocalStorage.getItem('user')
        const userId = user ? user.uid : null
        const res = await listDocuments(`account-log/${userId}/logs`)
        this.textHistory = res
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
    async generateResponse() {
      if(this.monthlyLimitValidate && !this.isTopup){
        this.$q.notify({
          message: 'You used all of your Limit please top up to generate more',
          color: 'negative',
        });
        return false;
      }

      this.generateLoading = true;

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: 'Correct the grammar of the given text' },
            { role: 'user', content: this.userInput },
          ],
          temperature: 1,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        if (response && response.choices.length > 0) {
          const generatedText = response.choices[0].message.content;
          this.saveToFirebase(generatedText);
          this.generatedText = generatedText;
          this.generateLoading = false;

          // Update the Limit
          let letterCount = this.letterCountForGeneratedText;

          this.updateUsedLimitCount(letterCount)

          // const dataToSave = {
          //   actionTaken: "Generate word correction API",
          //   timeStamp: moment().format(),
          //   type: "generate-data-AI",
          //   snapShot: {
          //     response: response,
          //     data: ""
          //   }
          // };
          // this.insertAuditLog("actions", dataToSave);

          // Refresh the user data
          this.getUserDetails()
        } else {
          this.generatedText = null;
          this.generateLoading = false;
        }
      } catch (error) {
        // const dataToSave = {
        //   actionTaken: "Generate word correction API Error",
        //   timeStamp: moment().format(),
        //   type: "generate-data-AI",
        //   snapShot: {
        //     response: error,
        //     data: ""
        //   }
        // };
        // this.insertAuditLog("actions", dataToSave);
        console.error('Error generating response:', error);
        this.generatedText = null;
        this.generateLoading = false;
      }
    },
    saveToFirebase(generatedText) {
      try {
        const dataToSave = {
          userInput: this.userInput,
          generatedText: generatedText,
          timestamp: new Date().toLocaleString(),
        };
        const user = LocalStorage.getItem('user');
        const userId = user ? user.uid : '';

        createDocument(`account-log/${userId}/logs`, dataToSave);

        // const dataToSaveLogs = {
        //     actionTaken: "Insert generate details",
        //     timeStamp: moment().format(),
        //     type: "insert-details",
        //     snapShot: {
        //       response: response,
        //       data: dataToSave
        //     }
        //   };
        //   this.insertAuditLog("actions", dataToSaveLogs);
        this.fetchSearchList()
      } catch (error) {
        this.$q.notify({
          message: 'Error saving data',
          color: 'negative',
        });
      }
    },
    updateUsedLimitCount(wordCount) {
      try {
        const user = LocalStorage.getItem('user');
        const userId = user ? user.uid : '';
        let payload = {
          totalLimitUsed: Number(this.userData.totalLimitUsed) + Number(wordCount),
        }
        if(this.monthlyLimitValidate){
          payload.topUpUsed = Number(this.userData.topUpUsed) + Number(wordCount)
        } else {
          payload.limitUsed = Number(this.userData.limitUsed) + Number(wordCount)
        }
        // update the users
        updateDocument(`userProfile`, userId, payload)
      } catch (error) {
        this.$q.notify({
          message: 'Error saving data',
          color: 'negative',
        });
      }
    },
  },
};
</script>



<style scoped>
/* start */
.my-card {
  border: 1px solid #80808021;
  border-radius: 15px;
}

.userInputed {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-item-border{
  border-radius: 15px;
  /* border-left: 4px solid rgb(25, 117, 255); */
}

.generatedIconDash{
  background: rgb(0,177,250);
  background: linear-gradient(122deg, rgba(0,177,250,1) 0%, rgba(149,45,253,1) 89%);
}
</style>
