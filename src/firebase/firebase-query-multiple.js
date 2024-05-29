import { db } from './index.js'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Loading, Notify } from 'quasar'

const getQueryFilterMultiple = async (collectionPath, filterList = []) => {
  return new Promise((resolve, reject) => {
    // Loading.show()

    try {
      let q

      if (filterList.length > 0) {
        let filterValues = []
        filterList.forEach((el) => {
            filterValues.push(
                where(el.filterField, el.operator, el.filterValue)
            )
        })

        q = query(
          collection(db, collectionPath),
          ...filterValues
        )
      } else {
        q = query(collection(db, collectionPath))
      }

      getDocs(q).then((querySnapshot) => {
        const documents = []
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() })
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

export default getQueryFilterMultiple
