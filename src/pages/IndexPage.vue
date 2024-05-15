<template>
  <q-page class="q-pa-sm">
    <q-img
      width="50%"
      src="/imgs/logo1.png"
    />
    
    <q-icon class="float-right q-mt-sm" size="md" flat round color="deep-purple" name="circle_notifications">
      <q-badge floating color="red" rounded />
    </q-icon>
    
    <div class="row">
      <div class="col col-xs-12 col-sm-12 col-md-12">
        <q-img
          src="/imgs/icons/healthy.png"
        />
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-12 q-pa-sm">
        <!-- <span class="text-h4 text-bold">PRIMPPING <span class="text-orange">PAWS</span></span> -->
        <span class="text-h5">We care for your <span class="text-bold">PETS!</span></span><br/>
        <span class="text-caption">
          Pets are just like your children; they make your life awesome. <br/> 
          They are an angel in disguise on earth, brightening your day in every way possible.
        </span>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-12 text-center q-pt-lg">
        <q-btn
          to="/member/register"
          rounded
          text-color="white"
          icon="flag_circle"
          class="q-pa-sm bgPrimping"
          label="Get Started"
        /><br/><br/>
        <span class="">
          Already have an account? 
          <span class="text-bold"><a href="/member/login">Login Here!</a></span>
        </span>
      </div>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment';
import { defineComponent } from 'vue';
import getAnnouncements from '../firebase/firebase-announcement';

export default defineComponent({
  name: 'PageIndex',
  components: {},
  data(){
    return {
      text: '',
      slide: "care",
      announcements: []
    }
  },
  mounted(){
    // this.$refs.carousel.$el.children[1].children[0].classList.remove("flex-center")
  },
  created(){
    this.fetchAnnouncements();
  },
  methods: {
    moment,
    async fetchAnnouncements(){
      try {
        const res = await getAnnouncements()
        this.announcements = res.list;
      } catch (error) {
        this.$q.notify({
          message: 'Error on fetching list',
          color: 'negative',
        });
      }
    },
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
.bgPrimping {
  color: white;
  padding-left: 25px;
  padding-right: 25px;
  background: rgb(0,177,250);
  background: linear-gradient(44deg, rgb(1 98 223) 12%, rgba(149, 45, 253, 1) 83%);
}
.formBG-dog{
  background: url(/imgs/icons/dog.png) no-repeat;
  background-position: 177% 146px;
  background-color: white;
  border-radius: 20px;
}
</style>
