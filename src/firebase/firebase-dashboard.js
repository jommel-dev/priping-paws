import { db } from './index.js'
import { collection, query, where, getDocs   } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const getDashboardDetails = async (collectionName, uid) => {
  return new Promise(async (resolve, reject) => {
    Loading.show()

    try {
        let dasboardContent = {
            overView: {
                allUsers: 0,
                subscribed: 0,
                totalSales: 0,
                todaySales: 0,
            },
            subscribedList: [],
            notSubscribeList: []
        }

        // Checking users
        const userProfilesRef = collection(db, "userProfile");
        const userQ = query(userProfilesRef, where("userType", "==", "visitor"))
        const usersDashboard = await getDocs(userQ).then((querySnapshot) => {
            let userList = []
            querySnapshot.forEach((doc) => {
                userList.push({ id: doc.id, ...doc.data() })
            })

            dasboardContent.overView.allUsers = userList.length;
            dasboardContent.overView.subscribed = userList.filter(el => { return el.isSubscribed }).length;
            dasboardContent.subscribedList = userList.filter(el => { return el.isSubscribed });
            dasboardContent.notSubscribeList = userList.filter(el => { return !el.isSubscribed });
        })
        Loading.hide()
        resolve(dasboardContent)
    } catch (err) {
      Loading.hide()
      Notify.create({
        type: 'negative',
        message: err.message
      })
      reject(err.message)
    }
  })
}

export default getDashboardDetails
