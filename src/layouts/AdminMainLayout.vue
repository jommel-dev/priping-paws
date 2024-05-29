<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-black no-box-shadow no-shadow">
      <q-toolbar>
        <!-- <q-btn flat @click="drawer = !drawer" round dense icon="menu" /> -->
        <span class="text-h5 text-bold q-ml-md text-red">Primping <span class="text-deep-purple-7">Paws</span></span>
        <q-space />
        
        <q-chip
          v-model="cookies"
          color="primary"
          text-color="white"
          class="q-mt-sm"
        >
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="ellipsis">
            {{ displayName }}
            <q-tooltip>{{ displayName }}</q-tooltip>
          </div>
          
        </q-chip>
        <q-btn-dropdown 
          color="deep-purple-7"
          flat
          dense
          dropdown-icon="settings"
        >
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Profile</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="logout">
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Drawer Side Menu -->
    <q-drawer
      show-if-above
      v-model="drawer"
      side="left"
      :mini="true"
      :width="200"
      :breakpoint="500"
      bordered
      mini-width="70"
      class="q-pa-md"
      style="border-radius: 0px 25px 25px 0px;"
    >
      <div class="q-mt-md">
        <q-list >
        <SideNav
          v-for="link in linksList"
          :key="link.title"
          :userType="userData.userType"
          v-bind="link"
        />
        </q-list>
      </div>
    </q-drawer>

    <!-- Content Page -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import signout from 'src/firebase/firebase-signout'
import { LocalStorage } from 'quasar'
// import listDocuments from 'src/firebase/firebase-list'
// import { defineComponent, ref } from 'vue'
import SideNav from 'components/Utils/Sidenav.vue'
import getDetailsDocument from '../firebase/firebase-get';

import { ref } from 'vue'
const linksList = [
  // All User
  {
    title: 'Dashboard',
    icon: 'calendar_month',
    link: 'admindashboard',
    user: "*"
  },

  // Doctor
  {
    title: 'Manage Clients',
    icon: 'pets',
    link: 'users',
    user: "admin"
  },

  // Cashier
  {
    title: 'Transactions',
    icon: 'manage_accounts',
    link: 'users',
    user: "admin"
  },
  {
    title: 'Inventory',
    icon: 'manage_accounts',
    link: 'users',
    user: "admin"
  },
  {
    title: 'POS',
    icon: 'point_of_sale',
    link: 'users',
    user: "admin"
  },

  // Super Admin Controls
  {
    title: 'Manage Users',
    icon: 'manage_accounts',
    link: 'users',
    user: "superadmin"
  },
  {
    title: 'Announcements',
    icon: 'campaign',
    link: 'announcements',
    user: "superadmin"
  },
  // {
  //   title: 'Manage Inventory',
  //   icon: 'vaccines',
  //   link: 'users',
  //   user: "superadmin"
  // },
  // {
  //   title: 'Settings',
  //   icon: 'settings_suggest',
  //   link: 'users',
  //   user: "superadmin"
  // },


]

export default {
  name: 'MainLayout',
    setup () {
    return {
      drawer: ref(true),
      displayName: '',
      userData: {}
    }
  },
  data () {
    return {
      linksList,
    }
  },
  components: {
    SideNav
  },
  computed: {
    filteredMenus: function () {
      return this.linksList
    },
    getId () {
      return store.getSelectedId
    }
  },
  async created () {
    this.getDisplayNameFromLocalStorage()
    this.checkUserSession()
    this.getUserDetails()
  },
  methods: {
    checkUserSession () {
      const user = LocalStorage.getItem('user')
      if(user || user !== null){
        this.$router.push('/admin/dashboard')
      } else {
        this.$router.push('/')
      }
    },
    async logout () {
      signout().then(() => {
        this.$router.push('/admin/login')
      })
    },
    getDisplayNameFromLocalStorage () {
      const user = LocalStorage.getItem('user')
      this.displayName = user ? user.displayName : null
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
  },


}
</script>
