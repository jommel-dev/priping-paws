<template>
       <q-container class="q-pa-md example-column-row-width flex justify-center items-center">
          <div class="column  flex justify-center items-center" style="height: 10vh; width: 40%;">
            <div class="col-8 text-center text-body1 flex justify-center items-center">
              <div class="center-div flex justify-center">
                <p class="text-h3 text-indigo-10">THis is our pricing</p>
                <span >Go beyond grammar. Choose a plan to ensure everything you write is clear, engaging, and polished.</span>
              </div>  
            </div>
          </div>
        </q-container>
                    <!-- test plans -->
                    <div class="flex flex-center column">
                      <div class="text-h6">Pricing</div>
                      <div class="row bg-blue-grey-2" style="min-height: 400px; width: 80%; padding: 24px;">
                        <div id="parent" class="fit row wrap justify-center items-start content-start" style="overflow: hidden;">
                          <div class=" bg-grey-6" style="overflow: auto; min-width: 300px; max-width: 300px;">
                            <q-card class="no-border-radius">
                              <q-card-section>
                                Child #1
                              </q-card-section>
                            </q-card>
                          </div>
                        <div class=" bg-grey-6" style="overflow: auto; min-width: 300px; max-width: 300px;">
                          <q-card class="no-border-radius">
                            <q-card-section>
                              Child #2
                            </q-card-section>
                          </q-card>
                        </div>
                        <div class=" bg-grey-6" style="overflow: auto; min-width: 300px; max-width: 300px;">
                          <q-card class="no-border-radius">
                            <q-card-section>
                              Child #3
                            </q-card-section>
                          </q-card>
                        </div>
                        </div>
                      </div>
                    </div>
</template>
<script>
export default {
    
}
</script>
<style >
.card-pricing {
  width:50%;
}
</style>