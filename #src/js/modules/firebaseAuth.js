import { auth, app, db } from '../app.js'
import { getAuth,
			createUserWithEmailAndPassword, 
			signInWithEmailAndPassword, 
			updateProfile,
			browserSessionPersistence,
			setPersistence
} from "firebase/auth";


function getFieldsRegistrationForm(){
	return  {
		name:document.querySelector('#userName').value,
		email:document.querySelector('#email').value,
	 	password:document.querySelector('#password').value,
	 	outField:document.querySelector('.auth__out'),
	 	authForm:document.querySelector('.auth'),
	}
}

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
	  startApp()
	})
	.catch((error) => {
	  const errorCode = error.code;
	  const errorMessage = error.message;
	  console.log('errorCode: ', errorCode);
	  console.log('errorMessage: ', errorMessage);
	  // ..
	});
	
}

export function login(startApp) {
	const email = document.querySelector('#email').value;
	const password = document.querySelector('#password').value;
	const authForm = document.querySelector('.auth')

	const auth = getAuth();
setPersistence(auth, browserSessionPersistence)
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
		// ...
	 })
	 .catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
	 });
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

	
}

export function logout() {
	signOut(auth).then(() => {
		// Sign-out successful.
	 }).catch((error) => {
		// An error happened.
	 });
}


export function getUserProfile(){
	const user = auth.currentUser;
	if (user !== null) {

		const displayName = user.displayName;
		const email = user.email;
		const photoURL = user.photoURL;
		const emailVerified = user.emailVerified;
		const uid = user.uid;
	//============================
		user.providerData.forEach((profile) => {
			console.log("Sign-in provider: " + profile.providerId);
			console.log("  Provider-specific UID: " + profile.uid);
			console.log("  Name: " + profile.displayName);
			console.log("  Email: " + profile.email);
			console.log("  Photo URL: " + profile.photoURL);
		});
	}
}

export function updateUserProfile (){
	updateProfile(auth.currentUser, {
		displayName: "Jane Q. User", 
		//photoURL: "https://example.com/jane-q-user/profile.jpg"
	 }).then(() => {
		// Profile updated!
		// ...
	 }).catch((error) => {
		// An error occurred
		// ...
	 });
}

export function isLoginBefore(startApp) {
	
	const user = auth.currentUser;
	console.log(user)
	if (user !== null) {
		startApp();
		const formData = getFieldsRegistrationForm();
		formData.authForm.classList.remove('active');
	};
};