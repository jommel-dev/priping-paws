import { db } from './index.js'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const getAnnouncements = async () => {
  return new Promise(async (resolve, reject) => {
    Loading.show()
    try {
      let dasboardContent = {
        list: [],
      }
      // Checking users
      const userProfilesRef = collection(db, "announcements");
      const userQ = query(userProfilesRef, where("status", "==", 1))
      const usersDashboard = await getDocs(userQ).then((querySnapshot) => {
        let userList = []
        querySnapshot.forEach((doc) => {
          let aData = {...doc.data()}
          aData.subject = JSON.parse(aData.subject)
          aData.tags = JSON.parse(aData.tags)
          aData.createdDate = new Timestamp(aData.createdDate).toDate()
          aData.image = "/imgs/logo2.png"

          userList.push({ id: doc.id, ...aData })
        })

        dasboardContent.list = userList;
      })
      Loading.hide()
      resolve(dasboardContent)
    } catch (err) {
      // console.log(err)
      Loading.hide()
      Notify.create({
        type: 'negative',
        message: err.message
      })
      reject(err.message)
    }
  })
}

export default getAnnouncements
