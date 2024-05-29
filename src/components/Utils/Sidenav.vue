<template>
  <div>
    
      <q-item
        clickable
        tag="a"
        :key="title"
        v-if="checkItemUserType(children, user)"
        :to="{name: link}"
      > 
        <q-item-section
          v-if="icon"
          avatar
          class="q-pt-sm q-pb-sm q-pl-sm"
        >
          <q-avatar 
            rounded 
            class="shadow-1"
            :class="$router.currentRoute._value.name === link ? 'generatedIconDash' : 'inactiveMenuState'"
            :text-color="$router.currentRoute._value.name === link ? 'white' : 'grey-10'" 
            :icon="icon" 
            size="md" 
          />
        </q-item-section>

        <q-item-section
          class="q-pt-sm q-pb-sm q-pr-sm"
          :class="$router.currentRoute._value.name === link ? 'bordered-no-left' : ''"
        > 
          <q-item-label :class="$router.currentRoute._value.name === link ? 'text-bold text-blue' : 'grey-10'"  >{{ title }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-expansion-item
        clickable
        v-if="children.length !== 0"
        expand-separator
        :icon="icon"
        :label="title"
        :default-opened="checkSubchildOpen(children)"
      >
        <q-item
          class="q-ml-xl"
          :header-inset-level="1"
          v-for="(item, index) in children"
          :key="index"
          :to="{name: item.link}"
          clickable 
          v-close-popup
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            {{ item.title }}
          </q-item-section>
          <q-separator />
        </q-item>
      </q-expansion-item>
    
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { LocalStorage } from 'quasar'

export default defineComponent({
    name: 'SideNavigation',
    props: {
        title: {
            type: String,
            required: true
        },

        link: {
            type: String,
            default: '#'
        },

        icon: {
            type: String,
            default: ''
        },

        crumbs: {
            type: Array,
            default: [{title: '', icon: 'home', link: '/'}]
        },

        user: {
            type: String,
            default: "*"
        },

        children: {
          type: Array,
          default: []
        },
    },
    methods:{
      checkItemUserType(child, uType){
        const user = LocalStorage.getItem('userDetails')
        let show = true;
        if(uType !== "*" && user.userType !== uType){
          show = false;
        }
        
        return child.length === 0 && show
      },
      checkSubchildOpen(childs){
        // Get Current route open
        let currRoute = this.$router.currentRoute._value.name;
        let filterChild = childs.filter((el) => {
          return el.link === currRoute
        })
        return filterChild.length === 0 ? false : true;
      },
    }
})
</script>

<style scoped>
.bordered-no-right{
  border: 1px solid #80808061;
  border-right: none;
  border-radius: 10px 0px 0px 10px;
}
.bordered-no-left{
  border: 1px solid #80808061;
  border-left: none;
  border-radius: 0px 10px 10px 0px;
}
.inactiveMenuState{
  background: white;
  border: 1px solid #80808021;
}

.activeItemClass{
  background: white;
  border: 1px solid #80808061;
  border-radius: 10px;
}
.generatedIconDash{
  color: white;
  background: rgb(0,177,250);
  background: linear-gradient(122deg, rgba(0,177,250,1) 0%, rgba(149,45,253,1) 89%);
}
</style>
