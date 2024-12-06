
// _________signup work_________

import { auth, createUserWithEmailAndPassword, provider, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, db, doc, setDoc, collection, getDocs, signOut,deleteDoc, updateDoc,serverTimestamp } from "./firebase.js";


const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function () {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
});


let signup = (event) => {
	event.preventDefault();
	let email = document.getElementById("signup-email").value;
	let password = document.getElementById("signup-password").value;
	let userName = document.getElementById("user").value;
	let emailRejecs = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	let passRejecs = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

	let userData = {
		email, userName, password
	}
	// console.log(user);

	if (emailRejecs.test(email) && passRejecs.test(password)) {
		console.log("test");
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				const user = userCredential.user;
				console.log(user);
				window.location.href="d.html"
				try {
					await setDoc(doc(db, "users", user.uid), {
						email,
    					userName,
						...userData,
						uID: user.uid
					});
					console.log("document.return by with id", user.uid);
				
				} catch (e) {
					console.error("Error adding document:", e);
				}
			}),
			Swal.fire({
				icon: "success",
				title: "Successfully Signed Up",
				text: "Your account has been created successfully!",
				// confirmButtonText: "OK",
				timer: 12000,
				customClass: {
					popup: 'swal-popup', 
				  },
			  }).then(() => {
				// Redirect to another page after user clicks "OK"
				setTimeout(() => {
					window.location.href = "d.html";
				}, 20000);
				
			  })

			.catch((error) => {
				//    alert(error.code)
				console.log(error.code)

			});
	}

	else {
		// alert("invalid email or password")
		console.log("invalid");
	}

}

if (window.location.pathname !== '/update.html') {
	let signupBtn = document.getElementById("btn-s");
	signupBtn.addEventListener("click", (event) => signup(event))

}

// GOOGLE 

let google = () => {
	signInWithPopup(auth, provider)
		.then((result) => {
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;

			const user = result.user;
			console.log(user, token);
			window.location.href = "/d.html";

		}).catch((error) => {

			// console.log(error.code);

			// const errorMessage = error.message;

			const email = error.customData.email;


			const credential = GoogleAuthProvider.credentialFromError(error);
			console.log(email, credential);


		});





}

if (window.location.pathname == "/") {
	let googleBtn = document.getElementById("btn-g");
	googleBtn.addEventListener("click", google)

}

// LOGIN 

let login = (event) => {
	event.preventDefault();
	const email = document.getElementById("log-email").value;
	const password = document.getElementById("log-password").value;
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			console.log(user);
			window.location.href = "d.html";

		})
		.catch((error) => {
			console.log(error.code);
		});
	console.log("hello");
	

}

if (window.location.pathname == "/index.html") {
	let loginBtn = document.getElementById("log");
	loginBtn.addEventListener("click", (event) => login(event));

}

// FORGET password

let forget = (event) => {
	event.preventDefault();
	let forE = document.getElementById("log-email").value;

	sendPasswordResetEmail(auth, forE)
		.then(() => {
			alert(" A password email has been sign")
		})
		.catch((error) => {
			console.log(error.code);



		});
}

if (window.location.pathname == "/") {
	let forgetBtn = document.getElementById("forget");
	forgetBtn.addEventListener("click", (event) => forget(event));
	// forgetBtn.addEventListener("click",forget)

}

//sign-out

let signout = ()=>{
	
signOut(auth).then(() => {
	alert("sign out succeddfully")
	window.location.href = "/index.html"
}).catch((error) => {
 console.log(error.code);
 
});
}

if (window.location.pathname == "/d.html") {
	let logout = document.getElementById("signout")
	logout.addEventListener("click",signout)
}


const querySnapshot = await getDocs(collection(db, "users"));
querySnapshot.forEach((doc) => {
	console.log(`${doc.id} =>`,doc.data());
});

// update 

// let updateProfile=async()=>{
// 	console.log(test);

// 	let email = document.getElementById("signup-email").value;
// 	let password = document.getElementById("signup-password").value;
// console.log(auth.currentUser.uid);
// let id= auth.currentUser.uid;

// try {
// 	const docRef = doc(db,"users",id);
// 	await updateDoc(docRef,{
// 		email:email,
// 		password:password,
// 		timestamp: serverTimestamp(),
// 		class:"10th";
// 		subjects=document.getElementById("subjects");

// 	})
// } catch () {
	
// }

	
// }

// let updateBtn= document.querySelector("#up")
// updateBtn.addEventListener("click",updateProfile)


// let updateProfile = async () => {
// 	// Input fields se values le rahe hain
// 	let name = document.querySelector("#user").value; // naam ka input
// 	let age = document.querySelector("#phone").value; // age ka input
// 	let subject = document.querySelector("#subjects").value; // subject ka input
  
// 	// Collected data ko ek object mein rakhte hain
// 	let profileData = {
// 	  name: name,
// 	  age: age,
// 	  subject: subject
// 	};
  
// 	// Ab is object ko Firestore mein save karenge
// // 	try {
// // 	  let response = await firestore.collection("profiles").add(profileData);
// // 	  console.log("Profile updated with ID: ", response.id);
// // 	} catch (error) {
// // 	  console.error("Error updating profile: ", error);
// // 	}
// //   };
// try{
//     const washingtonRef = doc(db, "users", id);
//     await updateDoc(washingtonRef, 
//       {name,
//       number,
//       timestamp: serverTimestamp(), 
// 	  subjects:subject
// 	  catch (error) {
// 		console.error("Error updating profile: ", error);
// 		  }
// 		}
  
// 	 )}

	

// 	  let update_btn = document.querySelector("#up");
//   update_btn.addEventListener("click", updateProfile);
// }

// let updateProfile = async () => {
//     let name = document.querySelector("#user").value; // name input
//     let age = document.querySelector("#phone").value; // age input
//     let subject = document.querySelector("#subjects").value; // subject input

//     let profileData = {
//         name: name,
//         age: age,
//         subject: subject
//     };

//     try {
//         const washingtonRef = doc(db, "users", id); // Make sure 'id' is defined
//         await updateDoc(washingtonRef, {
//             name,
//             age, // Assuming you want to update age as well
//             timestamp: serverTimestamp(),
//             subjects: subject
//         });
//         console.log("Profile updated successfully");
//     } catch (error) {
//         console.error("Error updating profile: ", error);
//     }
// }



// let updateProfile = async () => {
//     // Input fields se values le rahe hain
//     let name = document.querySelector("#user").value; // naam ka input
//     let age = document.querySelector("#phone").value; // age ka input
//     let subject = document.querySelector("#subjects").value; // subject ka input

//     // Current user ka ID le rahe hain
//     let user = auth.currentUser ; // Current user ko le rahe hain
//     if (!user) {
//         console.error("User  not logged in."); // Agar user logged in nahi hai
//         return; // Function ko yahan se return kar do
//     }
//     let id = user.uid; // User ka ID le rahe hain

//     try {
//         // Firestore mein document reference le rahe hain
//         const washingtonRef = doc(db, "users", id);
        
//         // Document ko update kar rahe hain
//         await updateDoc(washingtonRef, {
//             name: name, // Name ko update kar rahe hain
//             age: age,   // Age ko update kar rahe hain
//             timestamp: serverTimestamp(), // Timestamp ko update kar rahe hain
//             subjects: subject // Subjects ko update kar rahe hain
//         });

//         console.log("Profile updated successfully"); // Success message
//     } catch (error) {
//         // Agar koi error aata hai, toh usay handle kar rahe hain
//         console.error("Error updating profile: ", error);
//     }
// }

// Update button ke click event ko handle kar rahe hain
// let update_btn = document.querySelector("#up");
// update_btn.addEventListener("click", updateProfile);


let updateProfile = async () => {
	console.log("test");
	
    // Input fields se values le rahe hain
    let name = document.querySelector("#user").value; // naam ka input
    let age = document.querySelector("#phone").value; // age ka input
    let subject = document.querySelector("#subjects").value; // subject ka input

    // Current user ka ID le rahe hain
    let user = auth.currentUser ; // Current user ko le rahe hain
    if (!user) {
        console.error("User  not logged in."); // Agar user logged in nahi hai
        return; // Function ko yahan se return kar do
    }
    
    let id = user.uid; // User ka ID le rahe hain

    try {
        // Firestore mein document reference le rahe hain
        const washingtonRef = doc(db, "users", id);
        
        // Document ko update kar rahe hain
        await updateDoc(washingtonRef, {
            name: name, // Name ko update kar rahe hain
            age: age,   // Age ko update kar rahe hain
            timestamp: serverTimestamp(), // Timestamp ko update kar rahe hain
            subjects: subject // Subjects ko update kar rahe hain
        });

        console.log("Profile updated successfully"); // Success message
    } catch (error) {
        // Agar koi error aata hai, toh usay handle kar rahe hain
        console.error("Error updating profile: ", error);
    }
}

// Update button ke click event ko handle kar rahe hain
// let update_btn = document.querySelector("#up");
// update_btn.addEventListener("click", updateProfile);


// add blog 

const addBlogBtn = document.getElementById("add-blog-btn");
const blogModal = document.getElementById("blog-modal");

// Modal ko show karne ke liye
addBlogBtn.addEventListener("click", () => {
  blogModal.style.display = "block"; // Modal visible karo
});
const blogForm = document.getElementById("blog-form");

if (!blogForm) {
  console.error("Form not found! Ensure that the form ID is correct.");
} else {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Default behavior ko block karo

    // Title aur content fetch karo
    const title = document.getElementById("blog-title").value;
    const content = document.getElementById("blog-content").value;

    if (!title || !content) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      // Firebase me data save karo
      await db.collection("blogs").add({
        title: title,
        content: content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert("Blog successfully added!");
      blogForm.reset(); // Form reset karo
      blogModal.style.display = "none"; // Modal close karo
    } catch (error) {
      console.error("Error adding blog: ", error);
    }
  });
}
