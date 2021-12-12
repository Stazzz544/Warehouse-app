
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




//--------------change page in main content field------------

const headerPanel = document.querySelector('header').onclick = changePage

function changePage(event){
	const target = event.target;
	const menuItems = document.querySelectorAll('.navigation__list-item');
	const contetnPages = document.querySelectorAll('.main-content__page');

	if (target.classList.contains('navigation__list-item')) {
		
		menuItems.forEach(elem => elem.classList.remove('active'))//remove active classes
		contetnPages.forEach(elem => elem.classList.remove('active'))//remove active classes

		menuItems.forEach((elem, index) => {
			if(elem === target){
				menuItems[index].classList.add('active')//add active classes
				contetnPages[index].classList.add('active')//add active classes
			}
		})
	}
}

//--------add active clear func--------

function toggleClassActive(arr, target){
	arr.forEach(e => e.classList.remove('active'));
	target.classList.add('active');
}


//===============LIBRARIES====================

//-------------- CUSTOM SELECT --------------
let select = function () {
	let selectHeader = document.querySelectorAll('.select__header');
	let selectItem = document.querySelectorAll('.select__item');

	selectHeader.forEach(item => {
		 item.addEventListener('click', selectToggle)
	});

	selectItem.forEach(item => {
		 item.addEventListener('click', selectChoose)
	});

	function selectToggle() {
		 this.parentElement.classList.toggle('is-active');
	}

	function selectChoose() {
		 let text = this.innerText,
			  select = this.closest('.select'),
			  currentText = select.querySelector('.select__current');
		 currentText.innerText = text;
		 select.classList.remove('is-active');
	}
};

select();



