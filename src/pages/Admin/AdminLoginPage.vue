<template>
  <q-page class="">
    <div class="row q-mb-xl q-pt-xl" style="height: 60vh;">
      <div class="col col-md-12 q-pl-xl">
        <div class="q-pa-xl">
          <span class="text-bold text-h4 q-mr-xl">Employee's Login</span><br/>
          <span class="text-caption">You can login or register from the button below.</span><br/>
          <span class="text-caption">Please keep you credentials secret</span>
        </div>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-12 flex items-center q-pa-lg">
        <div class="fit row wrap justify-center items-start content-start">
          <q-card class="q-pa-md q-mb-md" style="width: 400px; max-width: 80vw; border-radius: 10px;">
            <q-form ref="form" class="q-gutter-md q-mt-md" @submit="submitLogin">
              <q-card-section style="max-height: 60vh" class="scroll">
                  <q-input
                      outlined
                      v-model="email"
                      label="Email"
                      name="Email"
                      class="q-mb-md"
                  >
                    <template v-slot:prepend>
                        <q-icon name="email" />
                    </template>
                  </q-input>

                  <q-input
                    outlined
                    v-model="password"
                    label="Password"
                    name="password"
                    type="password"
                    class="q-mb-md"
                  >
                    <template v-slot:prepend>
                      <q-icon name="password" />
                    </template>
                  </q-input>

                  <a class="text-primary text-bold cursor-pointer">Forgot password?</a>
              </q-card-section>

              <q-card-actions>
                  <q-btn
                      type="submit"
                      label="Login"
                      :loading="btnLoading"
                      class="full-width fredoka q-mb-sm customLoginBtn"
                      @click="submitForm"
                  />
              </q-card-actions>
            </q-form>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { LocalStorage } from 'quasar'
import login from '../../firebase/firebase-login'
import getDetailsDocument from '../../firebase/firebase-get';
import swal from 'sweetalert';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  data(){
    return {
      tab: 'login',
      text: '',
      email: null,
      password: null
    }
  },
  methods: {
    async submitLogin(){
        let payload = {
            email: this.email,
            password: this.password,
        }
        await login(payload).then(async (res) => {
          let id = res.uid
          const user = await getDetailsDocument(`userProfile`, id)

          if(user.userType === "admin"){
            this.$router.push('/admin/dashboard')
          } else {
            LocalStorage.remove('user')
            swal("Unauthorized Login!", {
              icon: "warning",
              buttons: false
            });
          }
        })
    }
    // ending method
  },
})
</script>

<style scoped>
.customLoginBtn {
    color: white;
    border-radius: 20px;
    background: rgb(0,177,250);
    background: radial-gradient(circle, rgba(0,177,250,1) 0%, rgba(45,81,253,1) 91%);
}
.headStyle{
    width: 25%;
}
.backgroundHeader{
  position: absolute;
  z-index: -1;
    background: url(/imgs/background.svg) no-repeat;
    height: 60vh;
    width: 70%;
    background-position: 50% 0%;
    background-size: 50%;
    opacity: 0.3;
}
.backgroundMid{
  position: absolute;
  z-index: -1;
  background: url('/imgs/background2.svg') no-repeat;
  height: 80vh;
  width: 100%;
  background-position: 50% 60%;
  background-size: 60%;
  opacity: 0.2;
}
.footerBackground{
  height: 30vh;
}
</style>
