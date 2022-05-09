import { db } from "firebase/db";
import {
  Firestore,
  collection,
  getDocs,
} from "node_modules/firebase/firestore";

async function getCities(db: Firestore) {
  const citiesCol = collection(db, "cities");
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}

export default getCities(db);
