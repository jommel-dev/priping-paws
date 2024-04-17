<template>
    <div class="row">
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <span class="text-h4 text-bold">Dashboard</span>
            <q-separator />
        </div>
        <!-- Users Count Overview -->
        <div class="col-12 col-xs-12 col-sm-12 col-md-8 q-pa-sm">
            <q-card
                flat
                class="my-card bg-white"
            >
                <q-card-section>
                    <span class="text-h6 text-bold">User's Overview</span><br/>
                    <span class="text-caption text-grey">User count & Subscription summary</span><br/>

                    <div class="row">
                        <div
                            v-for="(item, idx) in overviewList"
                            :key="idx"
                            class="col-3 col-xs-12 col-sm-3 col-md-3 q-pa-xs"
                        >
                            <q-card
                                flat
                                class="my-card-item "
                                :class="item.color"
                            >

                                <q-card-section>
                                    <q-avatar
                                        size="md"
                                        :color="item.iconBg"
                                        text-color="white"
                                        :icon="item.icon"
                                    />
                                    <br/>
                                    <span class="text-bold text-h6 text-blue-grey-9" >{{item.count}}</span>
                                    <br/>
                                    <span class="text-subtitle text-blue-grey-9" >{{item.label}}</span>
                                    <br/>
                                    <span class="text-caption ellipsis" :class="item.captionColor" >{{item.captions}}</span>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </div>
        <!-- Undecided card -->
        <div class="col-12 col-xs-12 col-sm-12 col-md-4 q-pa-sm">
            <q-card
                flat
                class="my-card bg-white"
                style="height: 231px; max-height: 231px;"
            >
                <q-card-section>
                    <span class="text-h6 text-bold">User's Character Consumptions</span><br/>
                    <span class="text-caption text-grey">Top Users</span><br/>

                    <q-list bordered>
                        <q-item v-for="contact in offline" :key="contact.id" clickable v-ripple>
                            <q-item-section avatar>
                                <q-avatar size="md">
                                    <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                                </q-avatar>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label>{{ contact.name }}</q-item-label>
                                <q-linear-progress :value="contact.wordUsed" color="warning" class="q-mt-sm" />

                            </q-item-section>

                            <q-item-section side>
                                <span class="text-overline">{{`${contact.wordCount} / ${contact.wordLimit}`}}</span>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-card>
        </div>

        <!-- Table List of Users Subscribed on App -->
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <!-- Table -->
            <q-card
                flat
                class="my-card bg-white"
            >
                <q-card-section>
                    <q-table
                        flat bordered
                        title="Patient Schedule"
                        :rows="rows"
                        :columns="columns"
                        row-key="name"
                        :filter="filter"
                        :selected-rows-label="getSelectedString"
                        selection="multiple"
                        v-model:selected="selected"
                    >
                        <template v-slot:top-right>
                            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                            </q-input>
                        </template>
                        <template v-slot:body-cell-action="props">
                            <q-td :props="props">
                               <q-btn flat round color="black" icon="more_vert">
                                    <q-menu>
                                        <q-list style="min-width: 100px">
                                            <q-item clickable @click="openExtendLimit(props.row.id)" v-close-popup>
                                              <q-item-section>Extend Subscription</q-item-section>
                                            </q-item>
                                            <q-item
                                                v-if="props.row.topUpActive"
                                                clickable
                                                @click="cancelExtend(props.row.id)"
                                                v-close-popup
                                            >
                                              <q-item-section>Cancel Extension</q-item-section>
                                            </q-item>
                                            <q-item clickable @click="openAdjustLimit(props.row.id)" v-close-popup>
                                              <q-item-section>Adjust Count Balance</q-item-section>
                                            </q-item>
                                            <q-item clickable @click="fetchListOfAdminLogs(props.row.id, 'admin-action')" v-close-popup>
                                              <q-item-section>Admin Logs</q-item-section>
                                            </q-item>
                                            <q-item clickable @click="fetchListOfAdminLogs(props.row.id, 'transaction')" v-close-popup>
                                              <q-item-section>Subscription Logs</q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-menu>
                               </q-btn>
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>
            </q-card>
        </div>

        <!-- Adjust dialog -->
        <q-dialog v-model="openAdjust" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Adjust Character Cound Limit</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-input dense v-model="adjustedLimit" autofocus />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Confirm" @click="adjustUserLimit" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="openExtend" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Extend users limit?</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <q-input dense v-model="adjustedUsed" label="Limit" autofocus />
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Confirm" @click="adjustUserLimitUsed" />
                </q-card-actions>
            </q-card>
        </q-dialog>

      <q-dialog v-model="openLogs">
        <q-layout view="Lhh lpR fff"  container class="bg-white text-dark">
          <q-header class="bg-primary">
            <q-toolbar>
              <q-toolbar-title>Action Log Details</q-toolbar-title>
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>

          <q-page-container >
            <q-page padding>
              <!-- timeline -->
              <div v-if="logDetails.length >= 1">
                <q-timeline color="secondary">
                  <q-timeline-entry
                    v-for="(item, key) in logDetails"
                    :key="key"
                    :title="item.id"
                    :subtitle="moment(item.timeStamp).format('YYYY-MM-DD h:s A')"
                    color="primary"
                    :icon="item.type === 'internal' ? 'ads_click' : 'credit_card'"
                    :body="item.actionTaken"
                  />
                </q-timeline>
              </div>

            </q-page>
          </q-page-container>
        </q-layout>
      </q-dialog>

    </div>
</template>

<script>
import moment from 'moment';
import getDashboardDetails from '../../firebase/firebase-dashboard';
import updateDocument from '../../firebase/firebase-update';
import createDocument from '../../firebase/firebase-create';
import getDetailsDocument from '../../firebase/firebase-get';
import getQueryWithFilter from '../../firebase/firebase-query';

export default {
    name: 'PageAdminDashboard',
    data: () => {
        return {
            // dialog controls
            openExtend: false,
            openAdjust: false,
            openLogs: false,
            selectedId: null,
            adjustedLimit: 0,
            adjustedUsed: 0,
            logDetails: [],

            filter: "",
            filterUnsub: "",
            rows: [],
            rowsUnsubs: [],
            selected: [],
            offline: [
                {
                    id: 5,
                    name: 'Brunhilde Panswick',
                    email: 'bpanswick4@csmonitor.com',
                    wordUsed: 0.7,
                    wordLimit: 50000,
                    wordCount: 35000
                }, {
                    id: 6,
                    name: 'Winfield Stapforth',
                    email: 'wstapforth5@pcworld.com',
                    wordUsed: 0.5,
                    wordLimit: 50000,
                    wordCount: 25000
                }, {
                    id: 7,
                    name: 'Winfield DFFStapforth',
                    email: 'wstapforth5@pcworld.com',
                    wordUsed: 0.4,
                    wordLimit: 50000,
                    wordCount: 20000
                }
            ],
            overviewList: [
                {
                    color: 'bg-red-2',
                    icon: 'people',
                    iconBg: 'red-5',
                    count: '0',
                    label: 'Users',
                    captions: 'All registered user in the app',
                    captionColor: 'text-blue-14',
                },
                {
                    color: 'bg-green-2',
                    icon: 'verified',
                    iconBg: 'green-5',
                    count: '0',
                    label: 'Subscribed',
                    captions: 'All user subcribed in the app',
                    captionColor: 'text-blue-14',
                },
                {
                    color: 'bg-orange-2',
                    icon: 'paid',
                    iconBg: 'orange-5',
                    count: '$ 0.00',
                    label: 'Total Sales',
                    captions: 'Subscription and Top-ups',
                    captionColor: 'text-blue-14',
                },
                {
                    color: 'bg-brown-2',
                    icon: 'credit_card',
                    iconBg: 'brown-5',
                    count: '$ 0.00',
                    label: 'Todays Sales',
                    captions: 'Today Subs. and Top-ups',
                    captionColor: 'text-blue-14',
                },
            ]
        }
    },
    created(){
        this.fetchSearchList();
    },
    methods:{
      moment,
      async fetchListOfAdminLogs(id, document){
        try {
          const res = await getQueryWithFilter(`audit-logs/${id}/${document}`)
          this.logDetails = res;

          this.openLogs = true
          console.log(res)
        } catch (error) {
          this.$q.notify({
            message: 'Error on fetching list',
            color: 'negative',
          });
        }
      },
        async fetchSearchList(){
            try {
                const res = await getDashboardDetails()

                this.overviewList[0].count = res.overView.allUsers
                this.overviewList[1].count = res.overView.subscribed
                // table
                this.rows = res.subscribedList
                this.rowsUnsubs = res.notSubscribeList
            } catch (error) {
                this.$q.notify({
                message: 'Error on fetching list',
                color: 'negative',
                });
            }
        },
        // Global Create Docs
        async insertAuditLog(document, data, id){
          createDocument(`audit-logs/${id}/${document}`, data);
        },
        manualyPaid(id){
            this.$q.dialog({
                title: 'Manually Paid Subscribed',
                message: 'Would you like to take this action to manually paid the user?',
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
                        isSubscribed: true,
                        limitUsed: 0,
                        limit: 50000,
                        topUpUsed: 0,
                        topUpLimit: 0,
                        topUpActive: false,
                        topUpDate: '',
                        subscribeDate: moment().format()
                    }
                    // update the users
                    updateDocument(`userProfile`, id, payload)

                    // Logs
                    const dataToSave = {
                      actionTaken: "Manually subscribe user because of error issue on payment process",
                      timeStamp: moment().format(),
                      type: "internal",
                      snapShot: {
                        response: payload
                      }
                    };
                    this.insertAuditLog("admin-action", dataToSave, id)

                    this.fetchSearchList()
                } catch (error) {
                    this.$q.notify({
                        message: 'Error saving data',
                        color: 'negative',
                    });
                }
            })
        },
        openAdjustLimit(id){
            this.selectedId = id;

            this.openAdjust = true
        },
        openExtendLimit(id){
            this.selectedId = id;

            this.openExtend = true
        },
        async adjustUserLimit(){
            this.$q.dialog({
                title: 'Adjust User Limit',
                message: 'Would you like to take this action?',
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
                    const res = await getDetailsDocument(`userProfile`, this.selectedId)
                    let payload = {
                        limit: this.adjustedLimit,
                        limitUsed: 0,
                        totalLimitUsed: 0 - Number(res.topUpUsed),
                        totalLimit: Number(this.adjustedLimit) + Number(res.topUpLimit)
                    }
                    // update the users
                    updateDocument(`userProfile`, this.selectedId, payload)

                    // Logs
                    const dataToSave = {
                      actionTaken: `Adjust the users limit from ${res.limit} to ${this.adjustedLimit}`,
                      timeStamp: moment().format(),
                      type: "internal",
                      snapShot: {
                        response: payload
                      }
                    };
                    this.insertAuditLog("admin-action", dataToSave, this.selectedId)


                    this.openAdjust = false
                    this.selectedId = null
                    this.fetchSearchList()
                } catch (error) {
                    this.$q.notify({
                        message: 'Error saving data',
                        color: 'negative',
                    });
                }
            })
        },

        async adjustUserLimitUsed(){
            this.$q.dialog({
                title: 'Extend User Limit',
                message: 'Would you like to take this action?',
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
                    const res = await getDetailsDocument(`userProfile`, this.selectedId)
                    let payload = {
                        topUpActive: true,
                        topUpLimit: this.adjustedUsed,
                        topUpDate: moment().format(),
                        totalLimit: Number(this.adjustedUsed) + Number(res.limit)
                    }
                    // update the users
                    updateDocument(`userProfile`, this.selectedId, payload)

                    // Logs
                    const dataToSave = {
                      actionTaken: `Extends the users limit to ${this.adjustedUsed}`,
                      timeStamp: moment().format(),
                      type: "internal",
                      snapShot: {
                        response: payload
                      }
                    };
                    this.insertAuditLog("admin-action", dataToSave, this.selectedId)

                    this.openExtend = false
                    this.selectedId = null
                    this.fetchSearchList()
                } catch (error) {
                    this.$q.notify({
                        message: 'Error saving data',
                        color: 'negative',
                    });
                }
            })
        },
        async cancelExtend(id){
            this.$q.dialog({
                title: 'Cancel Extension',
                message: 'Would you like to take this action?',
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
                    const res = await getDetailsDocument(`userProfile`, id)
                    let payload = {
                        topUpActive: false,
                        topUpLimit: 0,
                        topUpUsed: 0,
                        topUpDate: "",
                        totalLimit: Number(res.limit),
                        totalLimitUsed: Number(res.limitUsed),
                    }
                    // update the users
                    updateDocument(`userProfile`, id, payload)

                    // Logs
                    const dataToSave = {
                      actionTaken: `Cancel the extension`,
                      timeStamp: moment().format(),
                      type: "internal",
                      snapShot: {
                        response: payload
                      }
                    };
                    this.insertAuditLog("admin-action", dataToSave, this.selectedId)

                    this.fetchSearchList()
                } catch (error) {
                    this.$q.notify({
                        message: 'Error saving data',
                        color: 'negative',
                    });
                }
            })
        },
    },
    computed:{
        columns(){
            return  [
                {
                    name: 'name',
                    required: true,
                    label: 'Subscriber Name',
                    align: 'left',
                    field: row => row,
                    format: val => `${val.firstName} ${val.lastName}`,
                    sortable: true
                },
                {
                    name: 'subscribeDate',
                    required: true,
                    label: 'Subscribe Date',
                    align: 'left',
                    field: row => row.subscribeDate,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'subscribeType',
                    required: true,
                    label: 'Subscription Type',
                    align: 'left',
                    field: row => `${row.subscribeType}, ${row.topUpActive ? 'Top-up':''}`,
                    format: val => `${val}`,
                    sortable: true
                },
                {
                    name: 'wordCount',
                    required: true,
                    label: 'Standard',
                    align: 'left',
                    field: row => row,
                    format: val => `${val.limit}`,
                    sortable: true
                },
                {
                    name: 'wordCount',
                    required: true,
                    label: 'Top Up',
                    align: 'left',
                    field: row => row,
                    format: val => `${val.topUpLimit}`,
                    sortable: true
                },
                {
                    name: 'wordCount',
                    required: true,
                    label: 'Total Generated Usage',
                    align: 'left',
                    field: row => row,
                    format: val => `${val.totalLimitUsed}`,
                    sortable: true
                },
                {
                    name: 'wordCount',
                    required: true,
                    label: 'Character Balance',
                    align: 'left',
                    field: row => row,
                    format: val => `${(val.totalLimit - val.totalLimitUsed)}`,
                    sortable: true
                },
                {
                    name: 'action',
                    label: 'Action',
                    align: 'left'
                },

            ]
        }
    }
}
</script>

<style scoped>
.my-card{
    border-radius: 15px;
    box-shadow: 0px 0px 3px -2px !important;
}
.my-card-item{
    border-radius: 10px;
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
