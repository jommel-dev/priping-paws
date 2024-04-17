<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class=" bg-transparent text-black no-box-shadow no-shadow">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-space />
        <!-- <q-toolbar-title><q-icon name="translate" size="1.5em" /><span class="text-h5 text-bold q-ml-md"> The Grammar<span class="text-orange">APP</span></span></q-toolbar-title> -->
        <q-btn flat dense @click="logout" v-close-popup>sign out</q-btn>
      </q-toolbar>
    </q-header>

    <!-- Drawer Side Menu -->
    <q-drawer
      show-if-above
      v-model="drawer"
      side="left"
      class="q-pa-md bg-transparent"
    >
      <!-- Profile -->
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-icon name="translate" size="1.5em" /> -->
          <span class="text-h5 text-bold q-ml-md text-red">Primpping <span class="text-deep-purple-7">Paws</span></span>
        </q-toolbar-title>
      </q-toolbar>
      <q-separator />
      <q-toolbar>
        <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
        </q-avatar>
        <span class="q-ml-md">
          {{displayName}}
        </span>
      </q-toolbar>

      <q-separator />
      <div class="q-mt-md">
        <q-list >
        <SideNav
          v-for="link in linksList"
          :key="link.title"
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
  {
    title: 'Dashboard',
    icon: 'space_dashboard',
    link: 'admindashboard'
  },
  // {
  //   title: 'Manage Users',
  //   icon: 'manage_accounts',
  //   link: 'users'
  // },
  {
    title: 'Patients',
    icon: 'pets',
    link: 'patients'
  },
  {
    title: 'Announcement',
    icon: 'campaign',
    link: 'users'
  },
  {
    title: 'Settings',
    icon: 'settings',
    link: 'users'
  },

]

export default {
  name: 'MainLayout',
    setup () {
    return {
      drawer: ref(false),
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
        this.$router.push('/')
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
