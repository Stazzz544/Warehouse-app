import { auth, app, db } from '../app.js'
import { getAuth,
			createUserWithEmailAndPassword, 
			signInWithEmailAndPassword, 
			updateProfile,
			browserLocalPersistence,
			setPersistence,
			signOut,
			onAuthStateChanged
} from "firebase/auth";




export function regisration(startApp) {
	const formData = getFieldsRegistrationForm()

	if(!/^[^@]+@\w+(\.\w+)+\w$/.test(formData.email)){
		formData.outField.textContent = 'Неккоретно введено поле Email'
 		return false
	} else if (formData.password.length < 6) {
		formData.outField.textContent = 'Длина пароля должна быть не менее шести символов'
		return false
	} else if(formData.name.length < 3) {
		formData.outField.textContent = 'Имя должно быть не короче трёх символов'
		return false
	}

	createUserWithEmailAndPassword(auth, formData.email, formData.password)
	.then((userCredential) => {
	  // Signed in 
	  
	  const user = userCredential.user;
	  console.log('user created')
	  formData.authForm.classList.remove('active')
	})
	.then(() => {
		updateUserProfile(formData.name);
		startApp(formData.name);
		//showUserAndLogout(user.displayName)
	})
	.catch((error) => {
	  const errorCode = error.code;
	  const errorMessage = error.message;
	  console.log('errorCode: ', errorCode);
	  console.log('errorMessage: ', errorMessage);
	});
	
}

async function updateUserProfile(userName) {
	await updateProfile(auth.currentUser, {
		displayName: userName
	 }).then(() => {
		console.log('user name established as ' + userName)
	 }).catch((error) => {
		console.log(error)
	 });
}

export function login(startApp) {
	const email = document.querySelector('#email').value;
	const password = document.querySelector('#password').value;
	const authForm = document.querySelector('.auth')

	const auth = getAuth();
		setPersistence(auth, browserLocalPersistence)
		.then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password)
	 .then((userCredential) => {
		// Signed in 
		const user = userCredential.user;
		authForm.classList.remove('active')
		startApp()
		//showUserAndLogout(user.displayName)
		// ...
	 })
	 .catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
	 });
  })
  .catch((error) => {
    // Handle Errors here.
	 console.log(error.code)
	 console.log(error.message)
  });

	
}

export function logout() {
	signOut(auth).then(() => {
		console.log('login succesfull')
	 }).catch((error) => {
		console.log('logout error: ', error)
	 });
}




//=======================current user

export function getUserProfile(){
	const user = auth.currentUser;
	let displayName = user.displayName;
	let email = user.email;
	let photoURL = user.photoURL;
	let emailVerified = user.emailVerified;
	let uid = user.uid;

	if (user !== null) {
		
		displayName = user.displayName;
		email = user.email;
		photoURL = user.photoURL;
		emailVerified = user.emailVerified;
		uid = user.uid;
	//============================
		user.providerData.forEach((profile) => {
			console.log("Sign-in provider: " + profile.providerId);
			console.log("  Provider-specific UID: " + profile.uid);
			console.log("  Name: " + profile.displayName);
			console.log("  Email: " + profile.email);
			console.log("  Photo URL: " + profile.photoURL);
		});
	}
	console.log(user)
	return displayName
}

function getFieldsRegistrationForm(){
	return  {
		name:document.querySelector('#userName').value,
		email:document.querySelector('#email').value,
	 	password:document.querySelector('#password').value,
	 	outField:document.querySelector('.auth__out'),
	 	authForm:document.querySelector('.auth'),
	}
}


export function showUserAndLogout(userName){
	const out = document.querySelector('.navigation__plug')
	out.innerHTML = `
	<div class="navigation__plug-username">${userName}</div>
	<div class="navigation__plug-logout">
		<button class="navigation__plug-logout-btn" id="logout">Выйти</button>
	</div>
	`;
	document.querySelector('#logout').addEventListener('click', () => {
		logout();
		location.reload();
	})
}

export function autoLoginUser(startApp){
	

	onAuthStateChanged(auth, (user) => {
		if (user) {
			getUserProfile()
			startApp();
			const formData = getFieldsRegistrationForm();
			formData.authForm.classList.remove('active');
		} else {
			console.log('no user')
		}
	});
}