<template>
    <div class="row">
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <span class="text-h4 text-bold">Users Management</span>
            <q-separator />
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-card>
                <q-card-section>
                    For Filter Purpose 
                </q-card-section>
            </q-card>
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 q-pa-sm">
            <q-card>
                <q-card-section>
                    Table
                </q-card-section>
            </q-card>
        </div>

    </div>
</template>
  
<script>
import moment from 'moment';
import getDashboardDetails from '../../firebase/firebase-dashboard';
import updateDocument from '../../firebase/firebase-update';
import getDetailsDocument from '../../firebase/firebase-get';
import getQueryFilterMultiple from '../../firebase/firebase-query-multiple';

export default {
    name: 'PageAdminDashboard',
    data: () => {
        return {
            // dialog controls
            openExtend: false,
            openAdjust: false,
            selectedId: null,
            adjustedLimit: 0,
            adjustedUsed: 0,

            filterList: [
                // {
                //     filterField: "userType",
                //     operator: "==",
                //     filterValue: "client",
                // },
                // {
                //     filterField: "userType",
                //     operator: "==",
                //     filterValue: "admin",
                // },
                {
                    filterField: "userType",
                    operator: "==",
                    filterValue: "cashier",
                },
            ],
            filterUnsub: "",
            rows: [],
            rowsUnsubs: [],
            selected: [],
        }
    },
    created(){
        this.fetchSearchList();
    },
    methods:{
        async fetchSearchList(){
            try {
                const res = await getQueryFilterMultiple("userProfile", this.filterList)
                console.log(res)
            } catch (error) {
                this.$q.notify({
                message: 'Error on fetching list',
                color: 'negative',
                });
            }
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
                    label: 'Word Count Balance',
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