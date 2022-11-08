const FirebaseUtils = require("../utils/firebase_utils");
const db = FirebaseUtils.db
const FIRESTORE = FirebaseUtils.firestore


/**
 * Insert document into collection
 * @param collection
 * @param data
 * @returns {Promise<number>} 200 / 500
 */
async function createDocument(collection, data) {
    try {
        const docRef = await FIRESTORE.addDoc(FIRESTORE.collection(db, collection), data);
        console.log("Document written with ID: ", docRef.id);
        return 200
    } catch (e) {
        console.error("Error adding document: ", e);
        return 500
    }
}

/**
 * Get documents from database in JSON format
 * @param collection - collection name in db
 * @param query - query for searching, can be empty
 * @returns {Promise<{}>} json results
 */
async function get(collection, query) {
    const collectionRef = FIRESTORE.collection(db, collection)
    let search = collectionRef
    if (query.length !== 0) {
        search = FIRESTORE.query(collectionRef, FIRESTORE.where(...query))
    }

    const resJSONArr = []
    const querySnapshot = await FIRESTORE.getDocs(search);
    querySnapshot.forEach((doc) => {
        const newData = doc.data() 
        newData["id"] = doc.id
        resJSONArr.push(newData)
    });

    return resJSONArr
}

/**
 * 
 * @param {*} collection 
 * @param {*} id 
 * @returns 
 */
async function getByID(collection, id) {
    const docRef = FIRESTORE.doc(db, collection, id);
    const docSnap = await FIRESTORE.getDoc(docRef);
    if (!docSnap.exists()){
        console.log(`item does not exist with id: ${id}`);
        return 500
    }
    return docSnap.data()
}




/**
 * Updates document from db
 * @param collection
 * @param id
 * @param updateData
 * @returns {Promise<number>} 200 / 500
 */
async function updateDocument(collection, id, updateData) {
    const docRef = FIRESTORE.doc(db, collection, id);
    const docSnap = await FIRESTORE.getDoc(docRef);
    if (!docSnap.exists()){
        console.log("No documents found to update")
    }

    try {
        await FIRESTORE.updateDoc(docRef, updateData);
        console.log("Document updated with ID: ", docRef.id);
        return 200
    } catch (e){
        console.error("Error updating document: ", e);
        return 500
    }
}


module.exports = {createDocument, get, getByID, updateDocument}