//https://console.firebase.google.com/u/0/project/warehouse-f3e5b/database/warehouse-f3e5b-default-rtdb/data

 // Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAAun4IZER424YFKNgNVd3ywBDl6IAVn0o",
	authDomain: "warehouse-f3e5b.firebaseapp.com",
	databaseURL: "https://warehouse-f3e5b-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "warehouse-f3e5b",
	storageBucket: "warehouse-f3e5b.appspot.com",
	messagingSenderId: "112129220225",
	appId: "1:112129220225:web:6da07457b58bac564cb780"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, get, set, child, update, remove} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const db = getDatabase();


  //-----------------self-card-------------------

const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const patronymic = document.querySelector('#patronymic');

const workplace = document.querySelector('#workplace');
const workNumber = document.querySelector('#workNumber');
const profession = document.querySelector('#profession');
const dateOfStartInCompany = document.querySelector('#dateOfStartInCompany');

const saveSelfCardBtn = document.querySelector('#saveSelfCard');

//-----------------insert func ------------------

function insertData() {
	set(ref(db, "workers/" + workNumber.value), {
		name: name.value,
		surname: surname.value,
		patronymic: patronymic.value,
		workplace: workplace.value,
		workNumber: workNumber.value,
		profession: profession.value,
		dateOfStartInCompany: dateOfStartInCompany.value,
		clothes: ['sds','sdf','12222', 22]
	})
}

saveSelfCardBtn.onclick = insertData


//---------------get data-----------------


function selectData(){
	const dbref = ref(db);
	get(child(dbref, "workers")).then(data=>console.log(data.val()))

}
selectData()
//console.log(selectData())
;

//функция для подключения webp
function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});
