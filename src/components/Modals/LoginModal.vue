<template>
    <div class="q-pa-sm">
        <q-dialog persistent v-model="openModal">
            
            <q-card class="q-pa-md" style="width: 400px; max-width: 80vw; border-radius: 10px;">
                <q-tabs
                    v-model="tab"
                    dense
                    class="text-grey"
                    active-color="primary"
                    indicator-color="primary"
                    align="justify"
                >
                    <q-tab name="login" label="Login" />
                    <q-tab name="register" label="Register" />
                </q-tabs>
                <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="login" class="q-pa-none">
                        <!-- <q-card-section class="text-center">
                            <div class="text-h6">Login</div>
                        </q-card-section> -->
                        <q-form ref="form" class="q-gutter-md q-mt-md" @submit="submitLogin">
                            <q-card-section style="max-height: 60vh" class="scroll">
                                
                                <q-input
                                    dense 
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
                                    dense 
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
                    </q-tab-panel>
                    <q-tab-panel name="register" class="q-pa-none">
                        <registerForm />
                    </q-tab-panel>
                </q-tab-panels>
                
            </q-card>
        </q-dialog>
    </div>
</template>
<script>
import login from '../../firebase/firebase-login'
import getDetailsDocument from '../../firebase/firebase-get';
import registerForm from '../../pages/RegisterPage.vue'

export default{
    name: 'LoginModal',
    components: {
        registerForm
    },
    props: {
        modalStatus: {
            type: Boolean
        },
    },
    data(){
        return {
            tab: "login",
            btnLoading: false,
            openModal: true,
            email: null,
            password: null
        }
    },
    watch: {
        modalStatus(newVal){
            this.openModal = newVal
        },
        actionType: function(newVal){
            if(newVal == 'EDIT'){
                this.loadDetailsEdit();
            }
        }
    },
    methods: {
        async closeModal(){
            this.$emit('updateStatus', false);
        },
        async submitLogin(){
            let payload = {
                email: this.email,
                password: this.password,
            }
            await login(payload).then(async (res) => {
                let id = res.uid
                const user = await getDetailsDocument(`userProfile`, id)
                if(user.userType === "visitor" || user.userType === undefined){
                    this.$router.push('/dashboard')
                } else {
                    this.$router.push('/admin/dashboard')
                }
            })
        }
        // ending method
    },
    
}
</script>


<style scoped>
.drawerBtn{
    z-index: 999;
    position: absolute;
    right: 5px;
    top: 5px;
}
.customLoginBtn {
    color: white;
    border-radius: 20px;
    background: rgb(0,177,250);
    background: radial-gradient(circle, rgba(0,177,250,1) 0%, rgba(45,81,253,1) 91%);
}
</style>
