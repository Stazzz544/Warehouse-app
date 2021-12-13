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
const app = initializeApp(firebaseConfig);  //???????????????????????????????????????????

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

async function firstStartApp(){
	state = await getAllDataFromBase()// асинхронная функция
	showStaffsOnPage()// синхронная функция, выполнить после асинхронной
}

firstStartApp()

//================listeners of events==============
document.querySelector('#saveSelfCard').onclick = addNewPersonCardToFirebase; //add btn
//---------------------------------------------------
document.querySelector('#editSelfCard').onclick = () => editOrDeleteBtn('.modal-edit', editExistStaffCardAndReplaceItInFirebase);
//---------------------------------------------------
document.querySelector('#delSelfCard').onclick = () => editOrDeleteBtn('.modal-delete', deleteExistStaffCard);
//---------------------------------------------------
//show card when you click to the name of person
document.querySelector('#listOfstaff').onclick = showCompliteCard;
//---------------------------------------------------
// sort list by alphabet
document.querySelector('.list__sort-alphabet').onclick = showSortedStaffsOnPage;
// sort list by data
document.querySelector('.list__sort-data').onclick = showStaffsOnPage;

//GET ALL FIELDS FUNCTIONS


function getAllFieldFromNewCard(){
	return {
		name: document.querySelector('#name'),
		surname: document.querySelector('#surname'),
		patronymic: document.querySelector('#patronymic'),
		workplace: document.querySelector('#workplace'),
		workNumber: document.querySelector('#workNumber'),
		profession: document.querySelector('#profession'),
		dateOfStartInCompany: document.querySelector('#dateOfStartInCompanyGot'),
	}
}

function getAllFieldFromEditCard(){
	return {
		name: document.querySelector('#nameGot'),
		surname: document.querySelector('#surnameGot'),
		patronymic: document.querySelector('#patronymicGot'),
		workplace: document.querySelector('#workplaceGot'),
		workNumber: document.querySelector('#workNumberGot'),
		profession: document.querySelector('#professionGot'),
		dateOfStartInCompany: document.querySelector('#dateOfStartInCompanyGot'),
	}
}

function clearAllFieldsInForm(obj) { //очищает поля в форме
	for(let key in obj) {obj[key].value = '';}
}


//управляет подтверждающими модалками при редактировании или удалении карточек
function editOrDeleteBtn(nameOfModal, DelOrEditFunc) {
	const modal = document.querySelector(nameOfModal);
	const modalBtnYes = modal.querySelector('.modal-confirm__button-yes');
	const modalBtnNo = modal.querySelector('.modal-confirm__button-no');

	modal.classList.add('active')

	modalBtnNo.addEventListener('click', () => modal.classList.remove('active'))
	modalBtnYes.addEventListener('click', () => {
		DelOrEditFunc()
		modal.classList.remove('active')
	})
}

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




//-----------------ADD NEW PERSON CARD TO FIREBASE ------------------
async function addNewPersonCardToFirebase() {
	await getAllDataFromBase()//получаем последние изменения в базе перед отправкой новой карточки. Это нужно если параллельно кто-то уже внёс изменения в код и мы его теперь не перезатрём.
	const allFields = getAllFieldFromNewCard()
	
	const newWorker = {
		id: Date.now(),
		name: allFields.name.value,
		surname: allFields.surname.value,
		patronymic: allFields.patronymic.value,
		workplace: allFields.workplace.textContent,
		workNumber: allFields.workNumber.value,
		profession: allFields.profession.value,
		dateOfStartInCompany: allFields.dateOfStartInCompany.value,
		clothes: {
			boots: '',
			jacket: '',
		}
	}

	const staff = state.company.staff
	staff.push(newWorker) //пушим в локальный стэйт

	set(ref(db, `company/staff`), staff) //код добавления в базу локального стэйта

	clearAllFieldsInForm(allFields) // чистим поля формы
	getAllDataFromBase()// получаем всю дату из базы
	showStaffsOnPage() // выводим наш стафф на страницу
}

//---------------SHOW STAFFS DATA IN SIDEBAR--------------

function showStaffsOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = '';
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


function showSortedStaffsOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = '';
	const staff = state.company.staff;

	const sortedSurnamesArr = staff.map( e => e.surname)
	sortedSurnamesArr.sort()

	for(let sortedSurname of sortedSurnamesArr) {
		for(let item of staff) {
			if (sortedSurname == item.surname) {
				let patronymic = item.patronymic[0];
				if(patronymic)patronymic += '.';
				else patronymic = '';

				out.innerHTML += ` 
				<div class='list__items' firm='${item.workplace}' id='${item.id}'>
					<div class='list__item'> ${item.surname} ${item.name[0]}. ${patronymic}</div>
					<img class='list__item-icon'></img>
				</div>
				`
			}
		}
	}
}


//------------show full info about one staff------------------
function showCompliteCard(e) {
	const target = e.target;

	if (target.classList.contains('list__item')) {
		const collectionOfListItem = document.querySelectorAll('.list__item')
		toggleClassActive(collectionOfListItem ,target)

		//ищем id в атрибуте
		const parentId = target.closest('.list__items').getAttribute('id')

		//устанавливаем карте атрибут для возможности последующего удаления или редактирования карты и отправки в базу. По этому атрибуту будем искать совпадение в state
		document.querySelector('#employeeInfo').setAttribute('employee-id', parentId)

		const wishCard = state.company.staff.find(e => e.id == parentId)
		
		const allFields = getAllFieldFromEditCard();
		allFields.name.value = wishCard.name;
		allFields.surname.value = wishCard.surname;
		allFields.patronymic.value = wishCard.patronymic;
		allFields.workplace.textContent = wishCard.workplace;
		allFields.workNumber.value = wishCard.workNumber;
		allFields.profession.value = wishCard.profession;
		allFields.dateOfStartInCompany.value = wishCard.dateOfStartInCompany;

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

	const allField = getAllFieldFromEditCard()

	const parentElement = document.querySelector('#employeeInfo');
	const parentId = parentElement.getAttribute('employee-id')//получили id карточки
	const allEmployees = state.company.staff;//получили всех рабочих

	allEmployees.forEach(elem => { //изменяем поля в объекте рабочего
		if(elem.id == parentId){
			elem.name = allField.name.value;
			elem.surname = allField.surname.value;
			elem.patronymic = allField.patronymic.value;
			elem.workplace = allField.workplace.textContent;
			elem.workNumber = allField.workNumber.value;
			elem.profession = allField.profession.value;
			elem.dateOfStartInCompany = allField.dateOfStartInCompany.value;
		}
	})

	const staff = state.company.staff
	set(ref(db, `company/staff`), staff)
	showStaffsOnPage()
}

function deleteExistStaffCard(){

	const parentElement = document.querySelector('#employeeInfo');
	const parentId = parentElement.getAttribute('employee-id')//получили id карточки
	const allEmployees = state.company.staff;

	//фильтруем state, удаоляем оттуда карточку
	const newStaffList = allEmployees.filter(e => e.id != parentId)
	state.company.staff = newStaffList//заменяем поля в state
	set(ref(db, `company/staff`), newStaffList)//отправляем в базу новый state

	const allFields = getAllFieldFromEditCard() //получаем все поля формы
	clearAllFieldsInForm(allFields) //очищаем все поля формы

	showStaffsOnPage() //обновляем список
}