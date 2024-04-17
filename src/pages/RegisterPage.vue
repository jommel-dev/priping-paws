<template>
  <q-page class="q-pa-xl">
    <q-btn
      to="/"
      rounded
      outline
      color="primary"
      icon="arrow_back"
      label="Back to Home"
      dense
      class="q-pl-md q-pr-md"
    /><br/><br/>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Account Information"
        icon="settings"
        :done="step > 1"
      >
        <div class="row">
          <div class="col-12 q-pa-xs">
            <span class="text-title">Owner & Account Details</span>
            <q-separator />
          </div>
          <q-input v-model="stepForm.lastName" outlined label="Last Name" name="Last Name" class="col-12 col-md-3 q-pa-xs" />
          <q-input v-model="stepForm.firstName" outlined label="First Name" name="First Name" class="col-12 col-md-3 q-pa-xs" />
          <q-input v-model="stepForm.middleName" outlined label="Middle Name" name="Middle Name" class="col-12 col-md-3 q-pa-xs" />
          <q-input v-model="stepForm.suffix" outlined label="Suffix" name="Suffix" class="col-12 col-md-3 q-pa-xs" />
          <q-input v-model="stepForm.email" outlined label="Email" name="Email" class="q-pa-xs col-12 col-md-6" />
          <q-input v-model="stepForm.contactNumber" outlined label="Telephone / Contact Number" name="contactNumber" class="col-12 col-md-6 q-pa-xs" />
          <q-input v-model="stepForm.password" outlined label="Password" name="password" type="password" class="q-pa-xs col-12 col-md-6" />
          <q-input v-model="stepForm.confirmPassword" outlined label="Confirm Password" name="confirm password" type="password" class="q-pa-xs col-12 col-md-6" />
          <div v-if="passError" class="col-12 q-pa-xs">
            <q-banner inline-actions rounded class="bg-red text-white">
              <template v-slot:avatar>
                <q-icon name="info" color="white" />
              </template>
              Make sure your password is correct on the confirmation
            </q-banner>
          </div>
          <div class="col-12 q-pa-xs q-mt-md">
            <span class="text-title">Other Information</span>
            <q-separator />
          </div>
          <q-input v-model="stepForm.address" outlined label="Address" name="Address" type="textarea" maxlength="500" counter class="col-12 col-md-12 q-pa-xs" />
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Pet Details"
        icon="mdi-dog"
        :done="step > 2"
      >

      </q-step>

      <q-step
        :name="3"
        title="Summary"
        icon="mdi-monitor-eye"
      >
        <div class="row">
          <div class="col-12 q-pa-xs">
            <span class="text-title">Owner & Account Details</span>
            <q-separator />
          </div>
          <div class="col-12 q-pa-xs">
            <span class="text-title">Email: <strong>{{ stepForm.email || "N/A" }}</strong></span><br/>
            <span class="text-caption text-grey"><q-icon name="info" /> This will serve as your login to the site to check your Pet Details and Record</span>
          </div>

          <div class="col-6 q-pa-xs">
            <span class="text-title text-bold">{{ `${stepForm.lastName || "--" }, ${stepForm.firstName || "--" } ${stepForm.suffix}, ${stepForm.middleName || "--"}` }}</span><br/>
            <span class="text-caption text-grey">Account Name</span>
          </div>
          <div class="col-6 q-pa-xs">
            <span class="text-title text-bold">{{ `${stepForm.contactNumber}`  || "N/A"}}</span><br/>
            <span class="text-caption text-grey">Account Contact</span>
          </div>
          <div class="col-12 q-pa-xs">
            <span class="text-title text-bold">{{ stepForm.address || "N/A" }}</span><br/>
            <span class="text-caption text-grey">Address</span>
          </div>


          <div class="col-12 q-pa-xs">
            <span class="text-title">Pet Details</span>
            <q-separator />
          </div>
          <div class="col-12 q-pa-xs">
            Coming Soon
          </div>
        </div>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="step < 3" @click="$refs.stepper.next()"
            :disabled="enableContinue"
            color="primary"
            label="Continue"
          />
          <q-btn
            v-if="step === 3"
            @click="completeRegistration"
            color="primary"
            label="Submit"
          />
          <q-btn
            v-if="step > 1"
            flat color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>

<script>
import moment from 'moment';
import { defineComponent } from 'vue';
import register from '../firebase/firebase-register';
import createDocument from '../firebase/firebase-create';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  data(){
    return {
      text: '',
      passError: false,
      step: 1,
      stepForm:{
        firstName: "",
        lastName: "",
        middleName: "",
        suffix: "",
        email: "",
        password: "",
        confirmPassword: "",
        contactNumber: "",
        address: ""
      },
      petForm: {
        petName: "",
        age: ""
      },
      petList: []
    }
  },
  computed: {
    enableContinue(){
      let res = true;

      if(this.step === 1){
        let checkItemVal = 0;
        let unvalidate = "contactNumber,suffix,middleName"
        for(const obj in this.stepForm){
          if(
            this.stepForm[obj] === "" &&
            !unvalidate.includes(obj)
          ){
            checkItemVal += 1
          }
        }

        res = checkItemVal > 1;
      }

      return res
    }
  },
  watch: {
    "stepForm.confirmPassword": function(){
      this.validateConfirmPass()
    },
    "stepForm.password": function(){
      this.validateConfirmPass()
    },
  },
  created(){},
  methods: {
    moment,
    async completeRegistration(){
      try {
        register(this.stepForm).then((res) => {
          if(res){
            this.$router.push('/dashboard')
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    validateConfirmPass(){
      if(this.stepForm.password !== "" || this.stepForm.confirmPassword !== ""){
        this.passError = this.stepForm.password !== this.stepForm.confirmPassword
      } else {
        this.passError = false
      }
    }
  }
})
</script>

<style scoped>
.transparentBG{
  background: transparent !important;
}
.my-card{
  border-radius: 15px;
  box-shadow: 0px 0px 3px -2px !important;
}
</style>
