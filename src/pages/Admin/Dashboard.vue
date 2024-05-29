<template>
    <div class="row q-pa-md">
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-mb-md">
            <span class="text-h4 text-bold">Today's Schedule</span>
            <q-btn 
                v-if="this.userData.userType !== 'admin'"
                @click="openWalkInModal" 
                class="float-right" 
                label="Add Walk In" 
                size="md" 
                flat 
                color="primary" 
                icon="add_circle" 
            />
            <q-separator />
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
                </span><br>
                <span class="text-center">
                    <q-btn 
                        @click="fetchSearchList" 
                        label="Reload List" 
                        size="md" 
                        flat 
                        no-caps
                        color="primary" 
                        icon="refresh" 
                    />
                </span>
            </div>

            <q-card
                v-for="(item, key) in scheduleList"
                class="my-card-schedule shadow-5 q-mb-md"
                @click="openSchedModal(item)"
                :key="key"
            >
                <q-card-section class="">
                    <q-icon  name="vaccines" size="md" color="primary" /> 
                    <label class="text-h6 q-ml-sm">{{`${item.pet.label}'s ${item.reasonOfVisit}`}}</label><br/><br/>
                    <q-icon name="schedule" size="xs" color="primary" />
                    <span class="text-caption q-ml-sm" >
                    {{item.visitType.toUpperCase()}} - {{moment(item.scheduleDate).format('dddd LL')}}
                    </span>
                </q-card-section>
            </q-card>
        </div>
        <div class="col col-xs-12 col-sm-12 col-md-12 q-mt-md">
            <q-separator />
            Other staffs
        </div>

        <q-dialog
            v-model="openScheduleForm"
        >
            <q-card style="width: 90vw; max-width: 90vw; border-radius: 20px;">
                <q-tabs
                    v-model="schedTab"
                    class="text-primary"
                    inline-label
                >
                    <q-tab name="details" icon="info_outline" label="Checkup Details" />
                    <q-tab name="history" icon="history" label="Pet History" />
                </q-tabs>
                <q-tab-panels v-model="schedTab" animated>
                    <q-tab-panel name="details">
                        <q-card-section class="q-pt-none">
                            <div class="text-h6 q-mt-sm">
                                Pet Details
                                <q-separator />
                            </div>
                                
                            <div class="row">
                                <!-- Details Part -->
                                <div class="col-6 col-md-6 q-pa-xs">
                                <label class="text-bold text-h6"> Name: {{selectSched.pet.label}}</label>
                                </div>
                                <div class="col-6 col-md-6 q-pa-xs">
                                <label class="text-bold text-h6"> Breed: {{selectSched.details.breed}}</label>
                                </div>
                                <div class="col-6 col-md-6 q-pa-xs">
                                <label class="text-bold text-h6"> Birth Date: <q-icon name="today" size="xs" color="primary" /> {{selectSched.details.dateOfBirth}}</label>
                                </div>
                                <div class="col-6 col-md-6 q-pa-xs">
                                    <label class="text-bold text-h6"> 
                                    Gender:
                                    <q-icon 
                                        :name="selectSched.details.gender === 'Male' ? 'male' : 'female'" 
                                        size="xs" 
                                        :color="selectSched.details.gender === 'Male' ? 'primary' : 'red'" 
                                    /> 
                                    {{selectSched.details.gender}}
                                </label>
                                </div>
                                <div class="col-6 col-md-6 q-pa-xs">
                                <label class="text-bold text-h6"> Weigth: <q-icon name="scale" size="xs" color="primary" /> {{selectSched.details.weight}}</label>
                                </div>
                                
                            </div>
                            <div class="text-h6 q-mt-sm">
                                Schedule Details
                                <q-separator />
                            </div>
                            <div class="row">
                                <!-- Details Part -->
                                <div class="col-12 col-md-12 q-pa-xs">
                                <label class="text-h6  text-blue-grey-10"> <span class="text-bold  text-black">Reason of Visit:</span> {{selectSched.reasonOfVisit || "N/A"}}</label>
                                </div>
                                <div class="col-12 col-md-12 q-pa-xs">
                                <label class="text-h6 text-blue-grey-10"> <span class="text-bold text-black">Remarks:</span> {{selectSched.remarks || "N/A"}}</label>
                                </div>
                                
                                
                            </div>
                            <div class="text-h6 q-mt-sm">Checkup Details</div>
                            <div class="row">
                                <!-- Doctor Fill Up -->
                                <q-input
                                    dense 
                                    v-model="selectSched.checkUpDetails.weight" 
                                    outlined 
                                    label="Current Weight" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    dense 
                                    v-model="selectSched.checkUpDetails.heartRate" 
                                    outlined 
                                    label="Heart Rate" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    dense 
                                    v-model="selectSched.checkUpDetails.respiratory" 
                                    outlined 
                                    label="Respiratory" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    dense 
                                    v-model="selectSched.checkUpDetails.temperature" 
                                    outlined 
                                    label="Temperature" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="selectSched.checkUpDetails.history" 
                                    outlined 
                                    label="History" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="selectSched.checkUpDetails.findings" 
                                    outlined 
                                    label="Findings" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="selectSched.checkUpDetails.diagnosis" 
                                    outlined 
                                    label="Diagnosis" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="selectSched.checkUpDetails.treatment" 
                                    outlined 
                                    label="Treatment" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="selectSched.checkUpDetails.recommendation" 
                                    outlined 
                                    label="Recommendation" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                            </div>
                        </q-card-section>

                        <q-card-actions align="right" class="bg-white text-teal">
                            <q-btn color="red" flat label="Cancel" @click="closeSchedForm" />
                            <q-btn color="deep-purple" flat label="Submit" @click="sendToCashier" />
                        </q-card-actions>
                    </q-tab-panel>
                    <q-tab-panel name="history">
                        <q-card-section class="q-pt-none">
                            <q-timeline layout="dense" color="primary">
                                <q-timeline-entry
                                    v-for="(item, key) in historyList"
                                    :title="item.reasonOfVisit"
                                    :subtitle="item.scheduleDate"
                                    side="left"
                                    :key="key"
                                    :color="item.status == 'done' ? 'green' : ''"
                                    :icon="item.status == 'done' ? 'done_all' : 'pending_actions'"
                                >
                                    <div>
                                        {{item.recommendation}}
                                    </div>
                                </q-timeline-entry>
                            </q-timeline>
                        </q-card-section>
                    </q-tab-panel>
                </q-tab-panels>
                
            </q-card>
        </q-dialog>

        <q-dialog
            v-model="openPaymentForm"
        >
            <q-card style="width: 90vw; max-width: 90vw; border-radius: 20px;">
                <q-card-section class="q-pt-none">
                    <div class="text-h6 q-mt-sm">
                        Pet Details
                        <q-separator />
                    </div>

                    <div class="row">
                        <!-- Details Part -->
                        <div class="col-6 col-md-6 q-pa-xs">
                        <label class="text-bold text-h6"> Name: {{selectSched.pet.label}}</label>
                        </div>
                        <div class="col-6 col-md-6 q-pa-xs">
                        <label class="text-bold text-h6"> Breed: {{selectSched.details.breed}}</label>
                        </div>
                        <div class="col-6 col-md-6 q-pa-xs">
                        <label class="text-bold text-h6"> Birth Date: <q-icon name="today" size="xs" color="primary" /> {{selectSched.details.dateOfBirth}}</label>
                        </div>
                        <div class="col-6 col-md-6 q-pa-xs">
                            <label class="text-bold text-h6"> 
                            Gender:
                            <q-icon 
                                :name="selectSched.details.gender === 'Male' ? 'male' : 'female'" 
                                size="xs" 
                                :color="selectSched.details.gender === 'Male' ? 'primary' : 'red'" 
                            /> 
                            {{selectSched.details.gender}}
                        </label>
                        </div>
                        <div class="col-6 col-md-6 q-pa-xs">
                        <label class="text-bold text-h6"> Weigth: <q-icon name="scale" size="xs" color="primary" /> {{selectSched.details.weight}}</label>
                        </div>

                    </div>
                    <div class="text-h6 q-mt-sm">
                        Schedule Details
                        <q-separator />
                    </div>
                    <div class="row">
                        <!-- Details Part -->
                        <div class="col-12 col-md-12 q-pa-xs">
                        <label class="text-h6  text-blue-grey-10"> <span class="text-bold  text-black">Reason of Visit:</span> {{selectSched.reasonOfVisit || "N/A"}}</label>
                        </div>
                        <div class="col-12 col-md-12 q-pa-xs">
                        <label class="text-h6 text-blue-grey-10"> <span class="text-bold text-black">Remarks:</span> {{selectSched.remarks || "N/A"}}</label>
                        </div>


                    </div>
                    <q-stepper
                        v-model="step"
                        ref="stepper"
                        color="primary"
                        animated
                        class="shadow-0 q-mt-md"
                    >
                        <q-step
                            :name="1"
                            title="Payment"
                            icon="settings"
                            :done="step > 1"
                        >
                            <div class="row">
                                <!-- Doctor Fill Up -->
                                <q-input
                                    dense 
                                    v-model="transacForm.details.amount" 
                                    outlined
                                    label="Amount" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    dense 
                                    v-model="transacForm.details.cashOnhand" 
                                    outlined 
                                    label="Cash On Hand" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    dense 
                                    v-model="transacForm.details.change" 
                                    disable
                                    outlined 
                                    label="Change" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    dense 
                                    v-model="transacForm.details.invoiceNumber" 
                                    outlined 
                                    label="Invoice Number" 
                                    class="col-6 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="transacForm.details.billItems" 
                                    outlined 
                                    label="Item Prescription" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                            </div>
                        </q-step>
                        <q-step
                            :name="2"
                            title="Schedule"
                            icon="settings"
                            :done="step > 2"
                        >
                            <div class="row">
                                <q-select
                                    class="col-12 col-md-6 q-pa-xs"
                                    v-model="transacForm.newSchedule.reasonOfVisit"
                                    :options="schedTypeOpt"
                                    label="Reason of visit"
                                    dense
                                    outlined
                                    :options-dense="true"
                                />
                                <q-input
                                    type="date" 
                                    dense 
                                    v-model="transacForm.newSchedule.scheduleDate" 
                                    outlined 
                                    label="Date" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                                <q-input
                                    type="textarea" 
                                    dense 
                                    v-model="transacForm.newSchedule.remarks" 
                                    outlined 
                                    label="Remarks / Complains" 
                                    class="col-12 col-md-6 q-pa-xs" 
                                />
                            </div>
                        </q-step>
                    </q-stepper>
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn color="red" flat label="Cancel" @click="closePaymentForm" />
                    <q-space />
                    <q-btn
                        v-if="step < 2" 
                        @click="$refs.stepper.next()"
                        color="primary"
                        label="Continue"
                    />
                    <q-btn
                        v-if="step > 1"
                        flat color="primary"
                        @click="$refs.stepper.previous()"
                        label="Back"
                        class="q-ml-sm"
                    />
                    <q-btn v-if="step === 2" color="deep-purple" flat label="Submit" @click="completeTransaction" />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Walk IN Form -->
        <q-dialog
            v-model="openWalkInForm"
        >
            <q-card style="width: 90vw; max-width: 90vw; border-radius: 20px;">
                <q-card-section class="q-pt-none">
                    <div class="text-h6 q-mt-sm">Pet Schedule Details</div>
                    <div class="row">
                        <q-select
                            class="col-12 col-md-6 q-pa-xs"
                            v-model="walkInForm.pet"
                            :options="petsOption"
                            label="Pet To Schedule"
                            dense
                            outlined
                            use-input
                            use-chips
                            @filter="filterFn"
                            :options-dense="true"
                        />
                        <q-select
                            class="col-12 col-md-6 q-pa-xs"
                            v-model="walkInForm.reasonOfVisit"
                            :options="schedTypeOpt"
                            label="Reason of visit"
                            dense
                            outlined
                            :options-dense="true"
                        />
                        <q-input
                            type="textarea" 
                            dense 
                            v-model="walkInForm.remarks" 
                            outlined 
                            label="Remarks / Complains" 
                            class="col-12 col-md-6 q-pa-xs" 
                        />
                    </div>
                    <div class="row">
                        <q-input
                            dense 
                            v-model="walkInForm.weight" 
                            outlined 
                            label="Current Weight" 
                            class="col-6 col-md-6 q-pa-xs" 
                        />
                        <q-input
                            dense 
                            v-model="walkInForm.heartRate" 
                            outlined 
                            label="Heart Rate" 
                            class="col-6 col-md-6 q-pa-xs" 
                        />
                        <q-input
                            dense 
                            v-model="walkInForm.respiratory" 
                            outlined 
                            label="Respiratory" 
                            class="col-6 col-md-6 q-pa-xs" 
                        />
                        <q-input
                            dense 
                            v-model="walkInForm.temperature" 
                            outlined 
                            label="Temperature" 
                            class="col-6 col-md-6 q-pa-xs" 
                        />
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn color="red" flat label="Cancel" @click="closeWalkInForm" />
                    <q-btn color="deep-purple" flat label="Submit" @click="saveScheduleToFirebase" />
                </q-card-actions>
            </q-card>
            </q-dialog>
    </div>
</template>

<script>
import { LocalStorage } from 'quasar';
import moment from 'moment';
import getDashboardDetails from '../../firebase/firebase-dashboard';
import getPetDetails from '../../firebase/firebase-get-pet-details';
import getDetailsDocument from '../../firebase/firebase-get';
import getQueryWithFilter from '../../firebase/firebase-query';
import updateDocument from '../../firebase/firebase-update';
import createDocument from '../../firebase/firebase-create';
import petListDocuments from '../../firebase/firebase-pet-list';

const currDate = moment().format("YYYY-MM-DD");

export default {
    name: 'PageAdminDashboard',
    data: () => {
        return {
            userData: {},
            openScheduleForm: false,
            openWalkInForm: false,
            schedTab: "details",
            scheduleList: [],
            historyList: [],
            petsOption: [],
            petsOptionOriginal: [],
            walkInForm: {
                pet: null,
                reasonOfVisit: "", //Vaccine, Checkup, Followup, Deworm, Consultation
                scheduleDate: currDate,
                remarks: "",
                status: "pending",
                visitType: "walk-in",
                weight: "",
                heartRate: "",
                respiratory: "",
                temperature: "",
                currMonthAge: "",
            },
            selectSched: {
                pet: {
                    label:"",
                    value:"",
                },
                title: "",
                type: "",
                scheduleDate: "",
                scheduleTime: "",
                remarks: "",

                // Doc fil form
                checkUpDetails:{
                    weight: "",
                    heartRate: "",
                    respiratory: "",
                    temperature: "",
                    currMonthAge: "",
                    history: "",
                    findings: "",
                    diagnosis: "",
                    treatment: "",
                    recommendation: ""
                }
            },

            // Cashier
            step: 1,
            schedTypeOpt: ["Vaccine", "Checkup", "Followup", "Deworm", "Grooming", "Consultation"],
            openPaymentForm: false,
            transacForm: {
                newSchedule:{
                    pet: "",
                    reasonOfVisit: "", //Vaccine, Checkup, Followup, Deworm, Consultation
                    scheduleDate: "",
                    remarks: "",
                    status: "pending",
                },
                details: {
                    amount: 0,
                    invoiceNumber: "",
                    cashOnhand: 0,
                    change: 0,
                    billItems: ""
                }
            },

        }
    },
    created(){
        this.getUserDetails().then(() => {
            this.fetchSearchList();
        })
    },
    methods:{
        moment,
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
        closeSchedForm(){
            this.openScheduleForm = false
        },
        closePaymentForm(){
            this.openPaymentForm = false
        },
        async fetchSearchList(){
            try {
                let payload = {
                    currDate: moment().format('YYYY-MM-DD'),
                    scheduleStatus: this.userData.userType == 'admin' ? "pending" : "payment"
                }
                await getDashboardDetails(payload).then((res) => {
                    this.scheduleList = res.schedList
                })
            } catch (error) {
                this.$q.notify({
                    message: 'Error on fetching list',
                    color: 'negative',
                });
            }
        },
        async openWalkInModal(){
            this.$q.loading.show();
            await this.fetchAllPetsList()
            this.openWalkInForm = true
            this.$q.loading.hide();
        },
        async closeWalkInForm(){
            this.petsOption = []
            this.petsOptionOriginal = []
            this.openWalkInForm = false
        },
        async fetchAllPetsList(){
            try {
                await petListDocuments().then((res) => {
                    this.petsOption = res
                    this.petsOptionOriginal = res
                })
            } catch (error) {
                this.$q.notify({
                    message: 'Error on fetching list',
                    color: 'negative',
                });
            }
        },
        async openSchedModal(data){
            console.log(data)
            const usrType = this.userData.userType;
            const res = await getPetDetails(`userPets/${data.ownerId}/list`, data.pet.value)
            const history = await getQueryWithFilter(`petSchedule/${data.ownerId}/list`, "pet", data.pet)
            this.selectSched.details = res
            this.historyList = history
            if(usrType === "admin"){
                this.selectSched.checkUpDetails.weight = data.weight || ""
                this.selectSched.checkUpDetails.temperature = data.temperature || ""
                this.selectSched.checkUpDetails.respiratory = data.respiratory || ""
                this.selectSched.checkUpDetails.heartRate = data.heartRate || ""
                this.openScheduleForm = true
            } else {
                this.transacForm.newSchedule.pet = data.pet
                this.transacForm.newSchedule.ownerId = data.ownerId
                this.transacForm.details.billItems = data.recommendation
                this.openPaymentForm = true
            }
            
            this.selectSched = {...this.selectSched, ...data}
        },
        sendToCashier(){
            // Confirm
            this.$q.dialog({
                title: 'Submit Details',
                message: 'Would you like to proceed this application to the next step?',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(async () => {
                try {
                    let payload = {
                        ...this.selectSched.checkUpDetails,
                        oldWeight: this.selectSched.details.weight,
                        status: "payment"
                    }
                    await updateDocument(`petSchedule/${this.selectSched.ownerId}/list`, this.selectSched.id, payload).then(() => {
                        updateDocument(`userPets/${this.selectSched.ownerId}/list`, this.selectSched.pet.value, {weight: payload.weight})
                    })

                    this.fetchSearchList()
                } catch (error) {
                    this.$q.notify({
                        message: 'Error saving data',
                        color: 'negative',
                    });
                }
            })
            
        },
        completeTransaction(){
            // Confirm
            this.$q.dialog({
                title: 'Submit Details',
                message: 'Would you like to proceed this application to the next step?',
                ok: {
                    label: 'Yes'
                },
                cancel: {
                    label: 'No',
                    color: 'negative'
                },
                persistent: true
            }).onOk(async () => {
                try {
                    let payload = {
                        ...this.transacForm.details,
                        schedID: this.selectSched.id
                    }
                    // createDocument(`account-log/${userId}/notes`, payload);
                    await createDocument(
                        `transactions/${this.selectSched.ownerId}/list`, 
                        payload
                    ).then(() => {
                        updateDocument(`petSchedule/${this.selectSched.ownerId}/list`, this.selectSched.id, { status: "done" })
                        createDocument(`petSchedule/${this.selectSched.ownerId}/list`, {...this.transacForm.newSchedule});
                    });

                    this.fetchSearchList()
                    this.closePaymentForm()
                } catch (error) {
                    this.$q.notify({
                        message: 'Error saving data',
                        color: 'negative',
                    });
                }
            })
        },
        async saveScheduleToFirebase() {
            try {
                this.walkInForm.ownerId = this.walkInForm.pet.ownerId

                createDocument(`petSchedule/${this.walkInForm.ownerId}/list`, this.walkInForm);
                
                this.fetchSearchList()
                this.closeWalkInForm()
            } catch (error) {
                this.$q.notify({
                message: 'Error saving data',
                color: 'negative',
                });
            }
        },
        filterFn(val, update){
            update(() => {
                if (val === '') {
                    this.petsOption = this.petsOptionOriginal
                }
                else {
                    const needle = val.toLowerCase()
                    this.petsOption = this.petsOptionOriginal.filter(
                        v => v.label.toLowerCase().indexOf(needle) > -1
                    )
                }
            })
        }
    },
}
</script>

<style scoped>
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
.singleImgOpcity{
  opacity: 0.4;
}
.generatedDash{
  color: white;
  background: rgb(0,177,250);
  background: linear-gradient(122deg, rgb(255 251 176) 0%, rgb(0 55 255 / 61%) 89%);
}
.generatedDash2{
  color: white;
  background: rgb(0,177,250);
  background: linear-gradient(122deg, rgb(38 148 243) 0%, rgb(45 253 215 / 61%) 89%);
}
</style>
