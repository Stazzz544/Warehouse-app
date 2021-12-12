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







//================listeners of events==============
document.querySelector('#saveSelfCard').onclick = addNewPersonCardToFirebase; //btn
//document.querySelector('#delSelfCard').onclick = addNewPersonCardToFirebase; //in process

//btn for edit card
document.querySelector('#editSelfCard').addEventListener('click', () => {
	const modal = document.querySelector('.modal-edit');
	const modalBtnYes = document.querySelector('.modal-edit__button-yes');
	const modalBtnNo = document.querySelector('.modal-edit__button-no');

	modal.classList.add('active')

	modalBtnNo.addEventListener('click', () => modal.classList.remove('active'))
	modalBtnYes.addEventListener('click', () => {
		editExistStaffCardAndReplaceItInFirebase()
		modal.classList.remove('active')
	})
});


//show card when you click to the name of person
document.querySelector('#listOfstaff').onclick = showCompliteCard;


//-----------------self-card-------------------

//---------------GET ALL DATA FROM FIREBASE (inicialization)-----------------

function getAllDataFromBase() { //получение данных из базы
	const dbref = ref(db);

	return get(child(dbref, "/"))
	.then(data => {
		if (data.val() != null){ 
			state = data.val();
			state.company.staff = state.company.staff.filter((e) => e != null)
			return state
		} else {return inicialState;} //если данных нет - присваеваем каркас из store
	})
}

firstStartApp()

async function firstStartApp(){
	state = await getAllDataFromBase()// асинхронная функция
	showStaffsOnPage()// синхронная функция, выполнить после асинхронной
}


//-----------------ADD NEW PERSON CARD TO FIREBASE ------------------

async function addNewPersonCardToFirebase() {
	await getAllDataFromBase()//получаем последние изменения в базе перед отправкой новой карточки. Это нужно если параллельно кто-то уже внёс изменения в код и мы его теперь не перезатрём.

	const name = document.querySelector('#name');
	const surname = document.querySelector('#surname');
	const patronymic = document.querySelector('#patronymic');
	const workplace = document.querySelector('#workplace');
	const workNumber = document.querySelector('#workNumber');
	const profession = document.querySelector('#profession');
	const dateOfStartInCompany = document.querySelector('#dateOfStartInCompany');
	
	const newWorker = {
		id: Date.now(),
		name: name.value,
		surname: surname.value,
		patronymic: patronymic.value,
		workplace: workplace.textContent,
		workNumber: workNumber.value,
		profession: profession.value,
		dateOfStartInCompany: dateOfStartInCompany.value,
		clothes: {
			boots: '',
			jacket: '',
		}
	}

	const staff = state.company.staff
	staff.push(newWorker) //пушим в локальный стэйт

	set(ref(db, `company/staff`), staff) //код добавления в базу локального стэйта

	clearFields(name, //чистим поля в инпутах
		surname,
		patronymic,
		workplace,
		workNumber,
		profession,
		dateOfStartInCompany)

	getAllDataFromBase()// получаем всю дату из базы
	showStaffsOnPage() // выводим наш стафф на страницу
}

//---------------SHOW STAFFS DATA IN SIDEBAR--------------

function showStaffsOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = ''
	const staff = state.company.staff;
	
	
	staff.forEach(e => {
		let patronymic = e.patronymic[0];
		if(patronymic)patronymic += '.';
		else patronymic = '';

		//вывод ФИО сотрудников в сайдбар
		out.innerHTML += ` 
		<div class='list__items' firm='${e.workplace}' id='${e.id}'>
			<div class='list__item'> ${e.surname} ${e.name[0]}. ${patronymic}</div>
			<img class='list__item-icon'></img>
		</div>
		`
	})
}


function clearFields(...args) {
	args.forEach(e => e.value = '')
}


//------------show full info about one staff------------------


function showCompliteCard(e) {
	const target = e.target;

	if (target.classList.contains('list__item')) {
		const collectionOfListItem = document.querySelectorAll('.list__item')
		toggleClassActive(collectionOfListItem ,target)

		//get fields from card
		const name = document.querySelector('#nameGot');
		const surname = document.querySelector('#surnameGot');
		const patronymic = document.querySelector('#patronymicGot');
		const workplace = document.querySelector('#workplaceGot');
		const workNumber = document.querySelector('#workNumberGot');
		const profession = document.querySelector('#professionGot');
		const dateOfStartInCompany = document.querySelector('#dateOfStartInCompanyGot');

		//ищем id в атрибуте
		const parentId = target.closest('.list__items').getAttribute('id')
		console.log(parentId)

		//устанавливаем карте атрибут для возможности последующего удаления или редактирования карты и отправки в базу. По этому атрибуту будем искать совпадение в state
		document.querySelector('#employeeInfo').setAttribute('employee-id', parentId)

		//document.querySelector('.employee-info').setAttribute(parentId)

		const wishCard = state.company.staff.find(e => e.id == parentId)
		console.log(wishCard)

		name.value = wishCard.name;
		surname.value = wishCard.surname;
		patronymic.value = wishCard.patronymic;
		workplace.textContent = wishCard.workplace;
		workNumber.value = wishCard.workNumber;
		profession.value = wishCard.profession;
		dateOfStartInCompany.value = wishCard.dateOfStartInCompany;



		//переключаем на показ найденной карточки при клике на сотрудника слева
		document.querySelector('#makeNewCard').classList.remove('active')
		document.querySelector('#selfCard').classList.remove('active')
		document.querySelector('#showReadyCard').classList.add('active')
		document.querySelector('#employeeInfo').classList.add('active')
	}
}




async function editExistStaffCardAndReplaceItInFirebase(){
	//все поля с карточки
	const state = await getAllDataFromBase()

	const name = document.querySelector('#nameGot');
	const surname = document.querySelector('#surnameGot');
	const patronymic = document.querySelector('#patronymicGot');
	const workplace = document.querySelector('#workplaceGot');
	const workNumber = document.querySelector('#workNumberGot');
	const profession = document.querySelector('#professionGot');
	const dateOfStartInCompany = document.querySelector('#dateOfStartInCompanyGot');

	const parentElement = document.querySelector('#employeeInfo');
	const parentId = parentElement.getAttribute('employee-id')//получили id карточки
	const allEmployees = state.company.staff;//получили всех рабочих


	allEmployees.forEach(elem => { //изменяем поля в объекте рабочего
		if(elem.id == parentId){
			elem.name = name.value;
			elem.surname = surname.value;
			elem.patronymic = patronymic.value;
			elem.workplace = workplace.textContent;
			elem.workNumber = workNumber.value;
			elem.profession = profession.value;
			elem.dateOfStartInCompany = dateOfStartInCompany.value;
		}
	})


	const staff = state.company.staff
	set(ref(db, `company/staff`), staff)
	showStaffsOnPage()
}