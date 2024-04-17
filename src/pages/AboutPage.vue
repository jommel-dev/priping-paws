<template lang="">
    <q-header class="transparentGradient">
      <q-toolbar>
        <q-toolbar-title> Grammar Web App </q-toolbar-title>

        <q-btn flat to="/login">Sign In</q-btn>
      </q-toolbar>
      <q-tabs v-model="tab">
        <q-route-tab to="/" name="home" label="Home" />
        <q-route-tab to="/features" name="features" label="Features" />
        <q-route-tab to="/about" name="about" label="About" />
      </q-tabs>
    </q-header>


    <q-page-container>
        <div class="footer">
          <p class="text-h6"> this is sample footer</p>
        </div>
        <div class="footer">
          <p class="text-h6"> this is sample footer</p>
        </div>
      </q-page-container>
    
</template>
<script>
export default {
    
}
</script>
<style scoped>
.transparentGradient {
  background: rgb(222,232,255);

  color: #01094a;
}

.footer {
  border-top:2px solid black;
  height: 20vh;
}
    
</style>