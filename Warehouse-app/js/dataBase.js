//https://console.firebase.google.com/u/0/project/warehouse-f3e5b/database/warehouse-f3e5b-default-rtdb/data

// Import the functions you need from the SDKs you need
import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
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

import {
	getDatabase,
	ref,
	get,
	set,
	child,
	update,
	remove
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const db = getDatabase();


//-----------------self-card-------------------

const name = document.querySelector('#name');
const surname = document.querySelector('#surname');
const patronymic = document.querySelector('#patronymic');

const workplace = document.querySelector('#workplace');
const workNumber = document.querySelector('#workNumber');
const profession = document.querySelector('#profession');
const dateOfStartInCompany = document.querySelector('#dateOfStartInCompany');


//btn
document.querySelector('#saveSelfCard').onclick = addNewPersonCardToFirebase; //btn
document.querySelector('#getSelfCard').onclick = showPersonDataOnPage; //btn



//---------------GET ALL DATA FROM FIREBASE (inicialization)-----------------

function getAllDataFromBase() { //получение данных из базы
	const dbref = ref(db);

	return get(child(dbref, "/"))
	.then(data => {
		console.log('data.val()', data.val())
		if (data.val() != null) return data.val();
		else return inicialState; //если данных нет - присваеваем каркас из store
	})
}

firstStartApp()

async function firstStartApp(){
	state = await getAllDataFromBase()// асинхронная функция (возвращать ничего не нужно)
	showPersonDataOnPage()//  синхронная функция, выполнить после асинхронной
}


//-----------------ADD NEW PERSON CARD TO FIREBASE ------------------

function addNewPersonCardToFirebase() {
	getAllDataFromBase()
	
	const newWorker = {
		id: Date.now(),
		name: name.value,
		surname: surname.value,
		patronymic: patronymic.value,
		workplace: workplace.value,
		workNumber: workNumber.value,
		profession: profession.value,
		dateOfStartInCompany: dateOfStartInCompany.value,
		clothes: {
			boots: '',
			jacket: '',
		}
	}

	const staff = state.company.abz.staff

	staff.push(newWorker) //пушим в локальный стэйт

	console.log('staff', staff)
	console.log('state', state)

	set(ref(db, "company/abz/staff"), staff) //код добавления в базу локального стэйта

	clearFields(name, //чистим поля в инпутах
		surname,
		patronymic,
		workplace,
		workNumber,
		profession,
		dateOfStartInCompany)

	getAllDataFromBase()// получаем всю дату из базы
	showPersonDataOnPage() // выводим наш стафф на страницу
}



function showPersonDataOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = ''
	const staff = state.company.abz.staff;
	console.log(staff)
	
	staff.forEach(e => {
		out.innerHTML += `
		<div class='list__items' id='${e.id}'>
			<div class='list__item'>${e.name} ${e.surname}</div>
			<img class='list__item-icon'></img>
		</div>
		`
	})
}




function clearFields(...args) {
	args.forEach(e => e.value = '')
}