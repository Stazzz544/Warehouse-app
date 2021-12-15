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
		workplace: document.querySelector('#workplace'),
		surname: document.querySelector('#surname'),
		name: document.querySelector('#name'),
		patronymic: document.querySelector('#patronymic'),
		structuralSubdivision: document.querySelector('#structuralSubdivision'),
		workNumber: document.querySelector('#workNumber'),
		profession: document.querySelector('#profession'),
		dateOfStartInCompany: document.querySelector('#dateOfStartInCompany'),
		dateOfChangeProfession: document.querySelector('#dateOfChangeProfession'),
		newProfessionInfo: document.querySelector('#newProfessionInfo'),
		gender: document.querySelector('#gender'),
		height: document.querySelector('#height'),
		clothingSize: document.querySelector('#clothingSize'),
		shoeSize: document.querySelector('#shoeSize'),
		headgearSize: document.querySelector('#headgearSize'),
		gasMaskSize: document.querySelector('#gasMaskSize'),
		respiratorSize: document.querySelector('#respiratorSize'),
		sizeOfMittens: document.querySelector('#sizeOfMittens'),
		gloveSize: document.querySelector('#gloveSize'),
		deliveryOfThings: document.querySelector('#deliveryOfThings'),
	}
}

function getAllFieldFromEditCard(){
	return {
		workplace: document.querySelector('#getWorkplace'),
		surname: document.querySelector('#getSurname'),
		name: document.querySelector('#getName'),
		patronymic: document.querySelector('#getPatronymic'),
		structuralSubdivision: document.querySelector('#getStructuralSubdivision'),
		workNumber: document.querySelector('#getWorkNumber'),
		profession: document.querySelector('#getPofession'),
		dateOfStartInCompany: document.querySelector('#getDateOfStartInCompany'),
		dateOfChangeProfession: document.querySelector('#getDateOfChangeProfession'),
		newProfessionInfo: document.querySelector('#getNewProfessionInfo'),
		gender: document.querySelector('#getGender'),
		height: document.querySelector('#getHeight'),
		clothingSize: document.querySelector('#getClothingSize'),
		shoeSize: document.querySelector('#getShoeSize'),
		headgearSize: document.querySelector('#getHeadgearSize'),
		gasMaskSize: document.querySelector('#getGasMaskSize'),
		respiratorSize: document.querySelector('#getRespiratorSize'),
		sizeOfMittens: document.querySelector('#getSizeOfMittens'),
		gloveSize: document.querySelector('#getGloveSize'),
		deliveryOfThings: document.querySelector('#getDeliveryOfThings'),
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
	const normContainers = getDataFromTableOfnorms()

	const newWorker = {
		id: Date.now(),

		workplace: allFields.workplace.textContent,
		surname: allFields.surname.value,
		name: allFields.name.value,
		patronymic: allFields.patronymic.value,
		structuralSubdivision: allFields.structuralSubdivision.value,
		workNumber: allFields.workNumber.value,
		profession: allFields.profession.value,
		dateOfStartInCompany: allFields.dateOfStartInCompany.value,
		dateOfChangeProfession: allFields.dateOfChangeProfession.value,
		newProfessionInfo: allFields.newProfessionInfo.value,
		gender: allFields.gender.textContent,
		height: allFields.height.value,
		clothingSize: allFields.clothingSize.textContent,
		shoeSize: allFields.shoeSize.textContent,
		headgearSize: allFields.headgearSize.textContent,
		gasMaskSize: allFields.gasMaskSize.textContent,
		respiratorSize: allFields.respiratorSize.textContent,
		sizeOfMittens: allFields.sizeOfMittens.textContent,
		gloveSize: allFields.gloveSize.textContent,
		deliveryOfThings: allFields.deliveryOfThings.value,
		normContainers: normContainers,
	}

	const staff = state.company.staff
	staff.push(newWorker) //пушим в локальный стэйт

	set(ref(db, `company/staff`), staff) //код добавления в базу локального стэйта
   console.log(allFields)
	clearAllFieldsInForm(allFields) // чистим поля формы
	getAllDataFromBase()// получаем всю дату из базы
	showStaffsOnPage() // выводим наш стафф на страницу в бар
}

//---------------SHOW STAFFS DATA IN SIDEBAR--------------

function showStaffsOnPage() {
	const out = document.querySelector('.list__out');
	out.innerHTML = '';
	const staff = state.company.staff;
	
	
	staff.forEach(e => {
		let patronymic;
		if(e.patronymic[0]) patronymic = e.patronymic[0] + '.';
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
	const json = JSON.stringify(state.company.staff)
	const staff =  JSON.parse(json)

	// const sortedSurnamesArr = staff.map( e => e.surname)
	// sortedSurnamesArr.sort()

	staff.sort((a,b) => {
		const personDataA = a.surname + a.name + a.patronymic;
		const personDataB = b.surname + b.name + b.patronymic;
		return personDataA > personDataB ? 1 : -1;
	})

	staff.forEach(item => {
		let patronymic = item.patronymic[0];
		if(patronymic)patronymic += '.';
		else patronymic = '';

		out.innerHTML += ` 
		<div class='list__items' firm='${item.workplace}' id='${item.id}'>
			<div class='list__item'> ${item.surname} ${item.name[0]}. ${patronymic}</div>
			<img class='list__item-icon'></img>
		</div>
		`
	})
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
		document.querySelector('#getEmployeeInfo').setAttribute('employee-id', parentId)

		const wishCard = state.company.staff.find(e => e.id == parentId)
		
		const allFields = getAllFieldFromEditCard();
		allFields.workplace.textContent = wishCard.workplace;
		allFields.surname.value = wishCard.surname;
		allFields.name.value = wishCard.name;
		allFields.patronymic.value = wishCard.patronymic;
		allFields.structuralSubdivision.value = wishCard.structuralSubdivision;
		allFields.workNumber.value = wishCard.workNumber;
		allFields.profession.value = wishCard.profession;
		allFields.dateOfStartInCompany.value = wishCard.dateOfStartInCompany;
		allFields.dateOfChangeProfession.value = wishCard.dateOfChangeProfession;
		allFields.newProfessionInfo.value = wishCard.newProfessionInfo;
		allFields.gender.textContent = wishCard.gender;
		allFields.height.value = wishCard.height;
		allFields.clothingSize.textContent = wishCard.clothingSize;
		allFields.shoeSize.textContent = wishCard.shoeSize;
		allFields.headgearSize.textContent = wishCard.headgearSize;
		allFields.gasMaskSize.textContent = wishCard.gasMaskSize;
		allFields.respiratorSize.textContent = wishCard.respiratorSize;
		allFields.sizeOfMittens.textContent = wishCard.sizeOfMittens;
		allFields.gloveSize.textContent = wishCard.gloveSize;
		allFields.deliveryOfThings.value = wishCard.deliveryOfThings;

		//переключаем на показ найденной карточки при клике на сотрудника слева
		document.querySelector('#makeNewCard').classList.remove('active')
		document.querySelector('#selfCard').classList.remove('active')
		document.querySelector('#showReadyCard').classList.add('active')
		document.querySelector('#getEmployeeInfo').classList.add('active')
	}
}


async function editExistStaffCardAndReplaceItInFirebase(){
	//все поля с карточки
	const state = await getAllDataFromBase()

	const allField = getAllFieldFromEditCard()

	const parentElement = document.querySelector('#getEmployeeInfo');
	const parentId = parentElement.getAttribute('employee-id')//получили id карточки
	const allEmployees = state.company.staff;//получили всех рабочих



	allEmployees.forEach(elem => { //изменяем поля в объекте рабочего
		if(elem.id == parentId){
			elem.workplace = allField.workplace.textContent;
			elem.surname = allField.surname.value;
			elem.name = allField.name.value;
			elem.patronymic = allField.patronymic.value;
			elem.structuralSubdivision = allField.structuralSubdivision.value;
			elem.workNumber = allField.workNumber.value;
			elem.profession = allField.profession.value;
			elem.dateOfStartInCompany = allField.dateOfStartInCompany.value;
			elem.dateOfChangeProfession = allField.dateOfChangeProfession.value;
			elem.newProfessionInfo = allField.newProfessionInfo.value;
			elem.gender = allField.gender.textContent;
			elem.height = allField.height.value;
			elem.clothingSize = allField.clothingSize.textContent;
			elem.shoeSize= allField.shoeSize.textContent ;
			elem.headgearSize = allField.headgearSize.textContent;
			elem.gasMaskSize = allField.gasMaskSize.textContent;
			elem.respiratorSize = allField.respiratorSize.textContent;
			elem.sizeOfMittens = allField.sizeOfMittens.textContent;
			elem.gloveSize = allField.gloveSize.textContent;
			elem.deliveryOfThings = allField.deliveryOfThings.value;
		}
	})

	const staff = state.company.staff
	set(ref(db, `company/staff`), staff)
	showStaffsOnPage()
}

function deleteExistStaffCard(){

	const parentElement = document.querySelector('#getEmployeeInfo');
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



const tableWrapper = document.querySelector('#normsTable');
document.querySelector('#addFieldsToNorms').onclick = tableOfnorms
tableOfnorms()//first start

function tableOfnorms(){
	
	tableWrapper.innerHTML +=`
		<div class="self-card__norm-grid-container created-norm-grid-container" id='${Date.now()}'>
			<input class="self-card__norm-grid-item input name"></input>
			<input class="self-card__norm-grid-item input typeNorms" type='number'></input>
			<input class="self-card__norm-grid-item input measure"></input>
			<input class="self-card__norm-grid-item input picsForYear" type='number'></input>
		</div>
	`
}

function getDataFromTableOfnorms(){
	const normsContainers = document.querySelectorAll('.created-norm-grid-container');
	const arrNormContainers = [];
	normsContainers.forEach(normsContainer => {
		arrNormContainers.push({
			id: normsContainer.getAttribute('id'),
			name: normsContainer.querySelector('.name').value,
			typeNorms: normsContainer.querySelector('.typeNorms').value,
			measure: normsContainer.querySelector('.measure').value,
			picsForYear: normsContainer.querySelector('.picsForYear').value,
		})
	})
	return arrNormContainers
}
