<template>
  <q-page>
    <div class="row q-pa-xl" style="height: 60vh;">
      <div class="col col-xs-12 col-sm-12 col-md-12">
        <span class="text-h2 text-bold">PRIMPPING <span class="text-orange">PAWS</span></span>
        <q-carousel
          v-model="slide"
          swipeable
          animated
          navigation
          padding
          autoplay
          control-color="primary"
          control-type="outline"
          navigation-position="bottom"
          height="300px"
          ref="carousel"
          class="transparentBG text-black rounded-borders"
        >
          <q-carousel-slide name="care" class="fit row wrap justify-between items-start content-start">
            <div class="col-8 q-pt-xl">
              <span class="text-h5 text-grey-8">We care for your <span class="text-grey-9">PETS!</span></span><br/>
              <span class="text-caption">Pets are just like your children; they make your life awesome. <br/> They are an angel in disguise on earth, brightening your day in every way possible.</span>
            </div>
            <div class="col-4">
              <img
                width="70%"
                src="/imgs/care.svg"
              >
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="schedule" class="fit row wrap justify-between items-start content-start">
            <div class="col-8 q-pt-xl">
              <span class="text-h5 text-grey-8">You can reserve a <span class="text-grey-9">SCHEDULE!</span></span><br/>
              <span class="text-caption">Shedule your pets vaccine, check up, and walk-in visit. <br/> Make Time For Yourself, Don't Delay, Schedule Today.</span>
            </div>
            <div class="col-4">
              <img
                width="70%"
                src="/imgs/schedule.svg"
              >
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="friendly" class="fit row wrap justify-between items-start content-start">
            <div class="col-8 q-pt-xl">
              <span class="text-h5 text-grey-8">Our clinic is a pet <span class="text-grey-9">FRIENDLY</span> environment!</span><br/>
              <span class="text-caption">You can trust your pets to us because pets deserve the best, Always. <br/> Where Purr-fect Moments Happen Daily.</span>
            </div>
            <div class="col-4">
              <img
                width="70%"
                src="/imgs/friendly.svg"
              >
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-4 q-pa-sm">
        <q-card
          flat
          class="my-card bg-white"
        >
          <q-card-section>
            <q-icon name="pets" size="xl" color="red" /><br/>
            <span class="text-h6 text-bold">Pet Owner</span><br/>
            <span class="text-caption text-grey">You can login as a pet owner to check the record of your pets and check the appointment of vaccines.</span><br/>
            <q-btn
              to="/member/login"
              rounded
              color="red"
              text-color="white"
              icon="face"
              class="q-mt-sm"
              label="Get Login"
            />
            <br/>
          </q-card-section>
        </q-card>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-4 q-pa-sm">
        <q-card
          flat
          class="my-card bg-white"
        >
          <q-card-section>
            <q-icon name="vaccines" size="xl" color="green" /><br/>
            <span class="text-h6 text-bold">Clinical User</span><br/>
            <span class="text-caption text-grey">This is only for the Primpping Paws Employee and Doctors.</span><br/>
            <q-btn
              to="/admin/login"
              rounded
              color="green"
              text-color="white"
              icon="login"
              class="q-mt-sm"
              label="Login"
            />
            <br/>
          </q-card-section>
        </q-card>
      </div>
      <div class="col col-xs-12 col-sm-12 col-md-4 q-pa-sm">
        <q-card
          flat
          class="my-card bg-white"
        >
          <q-card-section>
            <q-icon name="event" size="xl" color="primary" /><br/>
            <span class="text-h6 text-bold">Appointment</span><br/>
            <span class="text-caption text-grey">Schedule and Check an appointment for your Pets Vaccination, Check up.</span><br/>
            <q-btn
              to="/member/schedule"
              rounded
              color="primary"
              text-color="white"
              icon="schedule_send"
              class="q-mt-sm"
              label="Get Appointed"
            />
            <br/>
          </q-card-section>
        </q-card>
      </div>

      <div class="col col-xs-12 col-sm-12 col-md-12 q-pt-lg">
        <span class="text-caption text-grey">By selecting on the above choices you will redirect on each pages that contains an action.</span><br/>
      </div>

      <div class="col col-xs-12 col-sm-12 col-md-12 q-pt-lg">
        <q-separator ></q-separator>
      </div>

      <div class="col col-xs-12 col-sm-12 col-md-12 q-pt-lg">
        <span class="text-h4">Announcements</span><br/>
      </div>

      <div
        v-for="(item, index) in announcements"
        :key="index"
        class="col col-xs-12 col-sm-12 col-md-4 q-pa-md"
      >
        <q-card class="my-card" flat bordered>
          <q-img :src="item.image" />

          <q-card-section>
            <q-chip
              color="primary"
              text-color="white"
              :icon="item.subject.icon"
              class="absolute"
              style="top: 0; right: 12px; transform: translateY(-50%);"
            >
              {{item.subject.label}}
            </q-chip>
            <div class="row no-wrap items-center">
              <div class="col text-h6 text-black ellipsis">
                {{item.title}}
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="text-subtitle1 text-black" v-html="item.content"></div>
            <div class="text-caption text-grey">
              {{`By ${item.createdBy}`}}・{{item.tags.join(', ')}}
            </div>
            <!-- <div class="col-auto text-grey text-caption q-pt-md row no-wrap items-center">
              <q-icon name="event" /> {{item.createdDate}}
            </div> -->
          </q-card-section>
        </q-card>
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
    this.$refs.carousel.$el.children[1].children[0].classList.remove("flex-center")
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
</style>
