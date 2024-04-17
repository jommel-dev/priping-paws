<template>
  <q-layout view="lHh Lpr lff">

    <q-drawer
      v-model="drawer"
      show-if-above
      class="bg-deep-purple-7"
      :width="400"
      :breakpoint="400"
    >
      <!-- <q-btn
        size="xl"
        color="white"
        text-color="primary"
        round
        unelevated
        class="drawerBtn drawerBtnImg"
      /> -->
      <q-btn
        to="/"
        round
        unelevated
        size="xl"
        class="drawerBtn"
      >
        <q-avatar size="70px">
          <img src="/imgs/logo2.png">
        </q-avatar>
      </q-btn>
      <div class="drawerImg">
        <q-img src="/imgs/background2.svg" />
      </div>
      <div class="text-center text-white">
        <span class="text-h5 text-bold">Welcome!</span><br/><br/>
        <span class="text-caption q-pa-md">Trust your pet's health to a reliable clinic. Regular check-ups, vaccination, and emergency care ensure their well-being. Choose quality veterinary services.</span><br/><br/>

        <q-icon name="horizontal_rule" />
        <q-icon name="horizontal_rule" size="xl" />
        <q-icon name="horizontal_rule" />
        <br/>
        <span class="text-caption q-pa-md">doesn't have an account?</span><br/>
        <q-btn
          to="/member/register"
          rounded
          color="info"
          text-color="white"
          icon="flag_circle"
          class="q-mt-sm"
          label="Get Started"
        />
      </div>

    </q-drawer>

    <!-- content -->
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {LocalStorage} from 'quasar'
import LoginModal from 'src/components/Modals/LoginModal.vue'

export default {
    name: 'MainApp',
    components: {
        LoginModal
    },
    data(){
        return {
            showLogin: true,
            menuSelected: 'home',
            contacts: [
              {
                icon: 'contact_phone',
                iconColor: 'orange',
                title: 'Call',
                value: '(0987) 654 3214',
              },
              {
                icon: 'schedule',
                iconColor: 'blue',
                title: 'Powered By',
                value: 'OpenAI',
              },
              {
                icon: 'location_on',
                iconColor: 'red',
                title: 'Address',
                value: 'Lorem Ipsum Address Sample Test',
              },
            ]
        }
    },
    async created () {
        this.checkUserSession()
    },
    methods: {
        checkUserSession () {
            const user = LocalStorage.getItem('user')

            if(user || user !== null){
                this.$router.push('/dashboard')
            } else {
                this.$router.push('/')
            }
        },
        showLoginModal(){
            this.showLogin = true
        },
        closeModal(){
            this.showLogin = false
        },
    }
}
</script>

<style scoped>
.drawerImg{
  position: relative;
  margin-top: 40%;
  padding: 30px;
}
.drawerBtnImg {
  background: url('/imgs/logo1.png');
}
.drawerBtn{
  position: absolute;
  top: 10%;
  right: -35px;
}
</style>

