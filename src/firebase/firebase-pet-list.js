import { db } from './index.js'
import listDocuments from './firebase-list';
import { query, where, getDocs, collection } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const petListDocuments = async (collectionName) => {
  return new Promise(async (resolve, reject) => {
    // Loading.show()

    try {
      const userProfilesRef = collection(db, "userProfile");
      const userQ = await query(userProfilesRef, where("userType", "==", "client"))
      const petLists = await getDocs(userQ).then(async (querySnapshot) => {
        let userList = []
        let petList = []

        querySnapshot.forEach(async (doc) => {
          userList.push({ id: doc.id, ...doc.data() })
        })

        for (const doc in userList) {
          let pets = await listDocuments(`userPets/${userList[doc].id}/list`)
          petList.push(...pets.map((el) => {
            let obj = {
              label: el.petName,
              value: el.id,
              ownerId: userList[doc].id
            }

            return obj
          }))
        }
        
        return petList
      })

      resolve(petLists)
      // getDocs(collection(db, collectionName)).then((querySnapshot) => {
      //   const documents = []
      //   querySnapshot.forEach((document) => {
      //     documents.push({ id: document.id, ...document.data() })
      //   })
      //   Loading.hide()
      //   resolve(documents)
      // })
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

export default petListDocuments