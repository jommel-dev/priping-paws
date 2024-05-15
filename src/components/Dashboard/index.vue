<template>
  <div class="q-pa-md" style="width: 100%;">
    <!-- Generate Text or Sentence Container -->
    <div class="row">
      <div class="col col-xs-12 col-sm-12 col-md-12 q-mb-sm">
        <span class="text-h5">Hi <span class="text-bold">{{`${userData.firstName},`}}</span></span><br/>
        <span class="text-caption text-grey-8">
          Pets are just like your children; they make your life awesome.
        </span>
        <q-separator />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-12 q-mb-sm">
        <div class="row">
          <div
            v-for="(item, idx) in overviewList"
            :key="idx"
            class="col-3 col-xs-3 col-sm-3 col-md-3 q-pa-sm text-center"
          >
            <q-card
              flat
              class="my-card-item "
              :class="item.color"
              @click="item.action"
            >
              <q-card-section class="text-center">
                <q-avatar
                    size="lg"
                    :color="item.iconBg"
                    text-color="white"
                    :icon="item.icon"
                />
              </q-card-section>
            </q-card>
            <span class="text-bold">{{item.label}}</span>
          </div>
        </div>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-12">
        <div 
          v-if="scheduleList.length === 0" 
          class="text-center"
        >
          <q-img
            width="15%"
            class="singleImgOpcity q-mr-sm"
            src="/imgs/icons/schedule-cal.png"
          />
          <span class="text-h6 text-grey-8">No Schedule Found!</span><br/>
          <span class="text-caption text-grey-8">
            Looks like you dont have added your pets schedule.
          </span>
        </div>

        <q-card
          v-for="(item, key) in scheduleList"
          class="my-card-schedule shadow-5 q-mb-md"
          :key="key"
        >
          <q-card-section class="">
            <q-icon  name="vaccines" size="md" color="primary" /> 
            <label class="text-h6 q-ml-sm">{{`${item.pet.label}'s ${item.title}`}}</label><br/><br/>
            <q-icon name="schedule" size="xs" color="primary" />
            <span class="text-caption q-ml-sm" >
              {{moment(item.scheduleDate).format('dddd LL')}}
            </span>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="col col-xs-12 col-sm-12 col-md-12 q-mb-md">
        <span class="text-h5 text-bold">My Pets</span>
        <q-btn @click="openPetForm = true" class="float-right" size="md" flat round color="primary" icon="add_circle" />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-12 q-mb-md">
        <q-tabs
          v-model="petType"
          class="text-teal"
        >
          <q-tab class="q-pa-md" name="dog">
            <q-img
              src="/imgs/icons/dog.png"
              spinner-color="white"
              fit
            />
          </q-tab>
          <q-tab name="cat">
            <q-img
              src="/imgs/icons/cat.png"
              spinner-color="white"
              fit
            />
          </q-tab>
        </q-tabs>
        

        <q-tab-panels v-model="petType" animated>
          <q-tab-panel name="dog">
            <q-card
              v-for="(item, key) in filteredPetList"
              class="shadow-5 q-mb-md"
              :class="`formBG-${item.type}`"
              :key="key"
            >
              <q-card-section class="">
                <q-icon 
                  :name="item.gender === 'Male' ? 'male' : 'female'" 
                  size="md" 
                  :color="item.gender === 'Male' ? 'primary' : 'red'" 
                /> 
                <label class="text-h6 q-ml-sm">{{item.petName}}</label><br/><br/>
                
                <span class="text-caption q-ml-sm" >
                  <q-icon name="today" size="xs" color="primary" /> {{generateAge(item.dateOfBirth)}} / 
                  <q-icon name="scale" size="xs" color="primary" /> {{item.weight}} / 
                  <q-icon name="pets" size="xs" color="primary" /> {{item.breed}}
                </span>
              </q-card-section>
            </q-card>
            <div 
              v-if="filteredPetList.length === 0" 
              class="text-center q-pa-xl"
            >
              <q-img
                width="50%"
                class="singleImgOpcity"
                src="/imgs/icons/pets.png"
              /><br/>
              <span class="text-h5 text-grey-8">Uh Oh!</span><br/>
              <span class="text-caption text-grey-8">
                Looks like you dont have added your pets yet.
              </span>
            </div>
          </q-tab-panel>

          <q-tab-panel name="cat">
            <q-card
              v-for="(item, key) in filteredPetList"
              class="shadow-5 q-mb-md"
              :class="`formBG-${item.type}`"
              :key="key"
            >
              <q-card-section class="">
                <q-icon 
                  :name="item.gender === 'Male' ? 'male' : 'female'" 
                  size="md" 
                  :color="item.gender === 'Male' ? 'primary' : 'red'" 
                /> 
                <label class="text-h6 q-ml-sm">{{item.petName}}</label><br/><br/>
                
                <span class="text-caption q-ml-sm" >
                  <q-icon name="today" size="xs" color="primary" /> {{generateAge(item.dateOfBirth)}} / 
                  <q-icon name="scale" size="xs" color="primary" /> {{item.weight}} / 
                  <q-icon name="pets" size="xs" color="primary" /> {{item.breed}}
                </span>
              </q-card-section>
            </q-card>
            <div 
              v-if="filteredPetList.length === 0" 
              class="text-center q-pa-xl"
            >
              <q-img
                width="50%"
                class="singleImgOpcity"
                src="/imgs/icons/pets.png"
              /><br/>
              <span class="text-h5 text-grey-8">Uh Oh!</span><br/>
              <span class="text-caption text-grey-8">
                Looks like you dont have added your pets yet.
              </span>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>

    </div>


    <q-dialog
      v-model="openPetForm"
    >
      <q-card style="width: 90vw; max-width: 90vw; border-radius: 20px;">
        <q-card-section class="q-pt-none">
          <div class="text-h6">Pet Details</div>
          <div class="row">
            <div class="col-12 text-center q-pa-xs">
              <q-tabs
                v-model="petForm.type"
                class="text-teal"
              >
                <q-tab class="q-pa-md" name="dog">
                  <q-img
                    src="/imgs/icons/dog.png"
                    spinner-color="white"
                    fit
                  />
                </q-tab>
                <q-tab name="cat">
                  <q-img
                    src="/imgs/icons/cat.png"
                    spinner-color="white"
                    fit
                  />
                </q-tab>
              </q-tabs>
            </div>
            <q-input dense v-model="petForm.petName" outlined label="Pet Name" name="Pet Name" class="col-12 col-md-6 q-pa-xs" />
            <q-input dense v-model="petForm.weight" outlined  label="Weight" name="Weight" class="col-12 col-md-6 q-pa-xs" />
            <q-input type="date" dense v-model="petForm.dateOfBirth" outlined  label="Date Of Birth" name="dateOfBirth" class="col-12 col-md-6 q-pa-xs" />
            <q-input dense v-model="petForm.breed" outlined label="Breed" name="Breed" class="col-12 col-md-6 q-pa-xs" />
            <q-select
              class="col-12 col-md-6 q-pa-xs"
              v-model="petForm.gender"
              :options="sexOption"
              label="Gender"
              dense
              outlined
              :options-dense="true"
            />
          
            <q-btn class="col-12 q-pa-xs q-mt-sm" color="primary" dense icon="add" label="Add Pet" @click="addPetDetails" />
            <div class="col-12 q-pa-xs">
              <q-table
                grid
                flat 
                bordered
                :rows="petList"
                row-key="name"
                hide-header
              >
                <template v-slot:item="props">
                  <div class="q-pa-xs col-xs-12 col-sm-3 col-md-2">
                    <q-card flat bordered>
                      <q-card-section class="text-center">
                        <q-img
                          :src="`/imgs/icons/${props.row.type}-item.png`"
                          width="30%"
                          fit
                        />
                        <strong>{{ props.row.petName }} ({{props.row.breed}})</strong> <br/>
                        <q-separator class="q-mt-sm" />
                        <div class="text-left">
                          <strong>Age: {{ props.row.age }}</strong><br>
                          <strong>Weight: {{ props.row.weight }}</strong>
                        </div>
                        
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="red" flat label="Cancel" @click="closePetForm" />
          <q-btn color="deep-purple" flat label="Submit" @click="saveToFirebase" />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <q-dialog
      v-model="openScheduleForm"
    >
      <q-card style="width: 90vw; max-width: 90vw; border-radius: 20px;">
        <q-card-section class="q-pt-none">
          <div class="text-h6 q-mt-sm">Pet Schedule Details</div>
          <div class="row">
            <q-select
              class="col-12 col-md-6 q-pa-xs"
              v-model="scheduleForm.pet"
              :options="petsOption"
              label="Pet To Schedule"
              dense
              outlined
              :options-dense="true"
            />
            <q-select
              class="col-12 col-md-6 q-pa-xs"
              v-model="scheduleForm.reasonOfVisit"
              :options="schedTypeOpt"
              label="Reason of visit"
              dense
              outlined
              :options-dense="true"
            />
            <q-input
              type="date" 
              dense 
              v-model="scheduleForm.scheduleDate" 
              outlined 
              label="Date" 
              class="col-12 col-md-6 q-pa-xs" 
            />
            <q-input
              type="textarea" 
              dense 
              v-model="scheduleForm.remarks" 
              outlined 
              label="Remarks / Complains" 
              class="col-12 col-md-6 q-pa-xs" 
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="red" flat label="Cancel" @click="closeSchedForm" />
          <q-btn color="deep-purple" flat label="Submit" @click="saveScheduleToFirebase" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import createDocument from '../../firebase/firebase-create';
import getQueryWithFilter from '../../firebase/firebase-query';
import listDocuments from '../../firebase/firebase-list';
import getDetailsDocument from '../../firebase/firebase-get';
import { LocalStorage } from 'quasar';


export default {
  name: 'DashboardNoteComponent',
  data() {
    return {
      scheduleList: [],
      petListDog: [],
      userData: {},

      openScheduleForm: false,
      schedTypeOpt: ["Vaccine", "Checkup", "Followup", "Deworm", "Grooming", "Consultation"],
      scheduleForm: {
        pet: "",
        reasonOfVisit: "", //Vaccine, Checkup, Followup, Deworm, Consultation
        scheduleDate: "",
        remarks: "",
        status: "pending"
      },

      openPetForm: false,
      petForm: {
        petName: "",
        dateOfBirth: "",
        breed: "",
        weight: "",
        gender: "",
        type: "dog"
      },
      petList: [],
      petType: "dog",
      sexOption: ["Female", "Male"],
      overviewList: [
        {
          color: 'bg-red-2',
          icon: 'vaccines',
          iconBg: 'red-5',
          count: '0',
          label: 'Health',
          captions: 'All registered user in the app',
          captionColor: 'text-blue-14',
          action: () => { return false }
        },
        {
          color: 'bg-green-2',
          icon: 'event',
          iconBg: 'green-5',
          count: '0',
          label: 'Schedule',
          captions: 'All user subcribed in the app',
          captionColor: 'text-blue-14',
          action: () => { this.openScheduleForm = true }
        },
        {
          color: 'bg-blue-2',
          icon: 'history',
          iconBg: 'blue-5',
          count: '$ 0.00',
          label: 'History',
          captions: 'Today Subs. and Top-ups',
          captionColor: 'text-blue-14',
          action: () => { return false }
        },
        {
          color: 'bg-orange-2',
          icon: 'help_center',
          iconBg: 'orange-5',
          count: '$ 0.00',
          label: 'Help',
          captions: 'Subscription and Top-ups',
          captionColor: 'text-blue-14',
          action: () => { return false }
        },
      ]
    };
  },
  computed: {
    filteredPetList(){
      let myPetList = [...this.petListDog]
      return myPetList.filter(el => {
        return el.type === this.petType
      })
    },
    petsOption(){
      let myPetList = [...this.petListDog]
      return myPetList.map(el => {
        let obj = {
          value: el.id,
          label: el.petName,
        }
        return obj
      })
    }
  },
  created(){
    this.getUserDetails()
    this.fetchSearchList()
    this.fetchScheduleList()
  },
  methods: {
    moment,
    async fetchScheduleList(){
      try {
        const user = LocalStorage.getItem('user')
        const userId = user ? user.uid : null
        const res = await getQueryWithFilter(`petSchedule/${userId}/list`, 'status', 'pending')
        console.log(res)
        this.scheduleList = res
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
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
    closePetForm(){
      this.petList = []
      this.openPetForm = false
    },
    closeSchedForm(){
      this.scheduleForm = {
        pet: "",
        reasonOfVisit: "", //Vaccine, Checkup, Followup, Deworm, Consultation
        scheduleDate: "",
        remarks: "",
        status: "pending"
      }
      this.openScheduleForm = false
    },
    addPetDetails(){
      this.petList.push(this.petForm)
      this.petForm = {
        petName: "",
        dateOfBirth: "",
        breed: "",
        weight: "",
        gender: "",
        type: "dog"
      }
    },
    generateAge(ageVal){
      var today = new Date();
      var birthDate = new Date(ageVal);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      console.log(today.getMonth())
      console.log(birthDate.getMonth())
      console.log(today, age, m)
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
        age--;
      }

      return ageVal;
    },
    async fetchSearchList(){
      try {
        const user = LocalStorage.getItem('user')
        const userId = user ? user.uid : null
        const res = await listDocuments(`userPets/${userId}/list`)
        this.petListDog = res;
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
    async saveToFirebase() {
      try {
        const user = LocalStorage.getItem('user');
        const userId = user ? user.uid : '';

        await this.petList.forEach(element => {
          createDocument(`userPets/${userId}/list`, element);
        });
        
        this.fetchSearchList()
        this.closePetForm()
      } catch (error) {
        this.$q.notify({
          message: 'Error saving data',
          color: 'negative',
        });
      }
    },
    async saveScheduleToFirebase() {
      try {
        const user = LocalStorage.getItem('user');
        const userId = user ? user.uid : '';
        this.scheduleForm.ownerId = userId

        createDocument(`petSchedule/${userId}/list`, this.scheduleForm);
        
        this.fetchScheduleList()
        this.closeSchedForm()
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
.my-card{
    border-radius: 15px;
    box-shadow: 0px 0px 3px -2px !important;
}
.my-card-item{
  border-radius: 20px;
}
.my-card-schedule{
  background-image: url(/imgs/icons/paw.png);
  background-position: 110% 6px;
  border-radius: 13px;
  background-size: 35%;
  background-repeat: no-repeat;
  background-color: antiquewhite;
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
  color: white;
  padding-left: 25px;
  padding-right: 25px;
  background: rgb(0,177,250);
  background: linear-gradient(44deg, rgb(1 98 223) 12%, rgba(149, 45, 253, 1) 83%);
}
.singleImgOpcity{
  opacity: 0.4;
}

.formBG-dog{
  background: url(/imgs/icons/dog.png) no-repeat;
  background-position: 110% 6px;
  border-radius: 13px;
  background-size: 35%;
  background-repeat: no-repeat;
  background-color: antiquewhite;
}
.formBG-cat{
  background: url(/imgs/icons/cat.png) no-repeat;
  background-position: 110% 6px;
  border-radius: 13px;
  background-size: 35%;
  background-repeat: no-repeat;
  background-color: antiquewhite;
}
</style>
