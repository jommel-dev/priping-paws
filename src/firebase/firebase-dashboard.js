import { db } from './index.js'
import getQuerySchedWithFilter from './firebase-query-schedule.js';
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const getDashboardDetails = async (data) => {
  return new Promise(async (resolve, reject) => {
    Loading.show()

    try {

        // Checking users
        const userProfilesRef = collection(db, "userProfile");
        const userQ = await query(userProfilesRef, where("userType", "==", "client"))
        const usersDashboard = await getDocs(userQ).then(async (querySnapshot) => {
          let userList = []
          let schedList = []

          querySnapshot.forEach(async (doc) => {
            userList.push({ id: doc.id, ...doc.data() })
          })

          for (const doc in userList) {
            let scheds = await getQuerySchedWithFilter(`petSchedule/${userList[doc].id}/list`, "status", data.scheduleStatus, "scheduleDate", data.currDate)
            schedList.push(...scheds)
          }
          
          return {
            userList,
            schedList
          }
        })
        
        Loading.hide()
        resolve(usersDashboard)
    } catch (err) {
      Loading.hide()
      Notify.create({
        type: 'negative',
        message: err.message
      })
      console.log(err)
      reject(err.message)
    }
  })
}

export default getDashboardDetails
