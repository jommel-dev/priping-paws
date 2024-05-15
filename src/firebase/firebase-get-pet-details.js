import { db } from './index.js'
import { getDocs, collection } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const getPetDetails = async (collectionName, petId) => {
  return new Promise((resolve, reject) => {
    // Loading.show()

    try {
      getDocs(collection(db, collectionName)).then((querySnapshot) => {
        let documents = {}
        querySnapshot.forEach((document) => {
            if(petId === document.id){
                documents = { ...document.data() }
            }
        })
        Loading.hide()
        resolve(documents)
      })
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

export default getPetDetails