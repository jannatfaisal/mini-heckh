
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp,doc,  updateDoc,deleteDoc,getDocs , setDoc  , arrayUnion, arrayRemove , deleteField ,orderBy,query ,where ,onSnapshot,} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCj4cgWB84F2KSReQYI18aMraaLs1PHSss",
  authDomain: "sign-up-4dc9f.firebaseapp.com",
  projectId: "sign-up-4dc9f",
  storageBucket: "sign-up-4dc9f.firebasestorage.app",
  messagingSenderId: "412516384144",
  appId: "1:412516384144:web:a1125e20b0c8e7dce58715",
  measurementId: "G-QW5MH80Z92"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


const db = getFirestore(app);


const profilePhotoImg = document.getElementById("profilePhotoImg");
profilePhotoImg.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png';
const profilePhotoInput = document.getElementById("profilePhotoInput");

profilePhotoImg.addEventListener("click", () => {
  profilePhotoInput.click();
});

profilePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    profilePhotoImg.src = reader.result;
  };
  reader.readAsDataURL(file);
});

let backgroundImg = "";


function selectImg(src, event) {
  backgroundImg = src;
  const bgImg = document.getElementsByClassName('bg-img');


  for (let i = 0; i < bgImg.length; i++) {
    bgImg[i].className = "bg-img";
  }


  event.target.className += " selectedImg";
}


document.addEventListener("DOMContentLoaded", () => {
  const imageElements = document.querySelectorAll(".bg-img");

  imageElements.forEach((img) => {
    img.addEventListener("click", (event) => {
     
      const src = img.src;
      selectImg(src, event);
    });
  });
});


async function post() {
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const currentTime = new Date().toLocaleTimeString();
  const email = localStorage.getItem("userEmail");
  const profilePhotoImg = document.getElementById("profilePhotoImg");  
  const backgroundImg = "images/3.jfif"; 
  
  if (title.value.trim() && description.value.trim()) {
    const postContainer = document.getElementById("postContainer");
    const postElement = document.createElement("div");
    postElement.classList.add("card", "p-2", "mb-2");
    postElement.dataset.id = Date.now(); 

    postElement.innerHTML = `
      <div class="card-header d-flex">
          <img class="profile-photo" src="${profilePhotoImg.src}" />
          <div class="name-time d-flex flex-column">
              ${email}
              <div class="time">${currentTime}</div>
          </div>
      </div>
      <div style="background-image: url(${backgroundImg})" class="card-body">
          <blockquote class="blockquote mb-0">
              <p class="post-title">${title.value}</p>
              <footer class="blockquote-footer post-description">${description.value}</footer>
          </blockquote>
      </div>
      <div class="card-footer d-flex justify-content-end">
          <button type="button" class="ms-2 btn btn-warning editBtn">Edit</button>
          <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
      </div>
    `;

    postContainer.appendChild(postElement);

 


 
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        title: title.value,
        description: description.value,
        time: serverTimestamp(),
        backgroundImage: backgroundImg
      });
      console.log("Post successfully added to Firestore");
      console.log("Post successfully added to Firestore with ID: ", docRef.id);
      postElement.dataset.id = docRef.id; 
    } catch (error) {
      console.error("Error adding post: ", error);
    }
   
   title.value = "";
   description.value = "";
  } else {
    Swal.fire({
      title: "Empty Post",
      text: "Can't publish post without Title or Description",
      icon: "warning",
    });
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const postContainer = document.getElementById("postContainer");
  fetchPostsFromFirestore(postContainer);
  if (postContainer) {
    postContainer.addEventListener("click", (event) => {
   
      if (event.target.classList.contains("editBtn")) {
        const postElement = event.target.closest(".card");
        editPost(postElement); 
      }

      if (event.target.classList.contains("deleteBtn")) {
        const postElement = event.target.closest(".card");
        deletePost(postElement);  
      }
    });
  } else {
    console.error("postContainer not found");
  }
});

document.getElementById("postBtn").addEventListener("click", (event) => {
  event.preventDefault();  
  post();  
});
async function fetchPostsFromFirestore(postContainer) {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      const postElement = document.createElement("div");
      postElement.classList.add("card", "p-2", "mb-2");
      postElement.dataset.id = doc.id; 

      postElement.innerHTML = `
        <div class="card-header d-flex">
            <img class="profile-photo" src="${postData.profilePhotoImg || 'default_profile.jpg'}" />
            <div class="name-time d-flex flex-column">
                ${postData.email || 'Anonymous'}
                <div class="time">${postData.time ? postData.time.toDate().toLocaleTimeString() : ''}</div>
            </div>
        </div>
        <div style="background-image: url(${postData.backgroundImage || 'default-background.jpg'})" class="card-body">
            <blockquote class="blockquote mb-0">
                <p class="post-title">${postData.title}</p>
                <footer class="blockquote-footer post-description">${postData.description}</footer>
            </blockquote>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <button type="button" class="ms-2 btn btn-warning editBtn">Edit</button>
            <button type="button" class="ms-2 btn btn-danger deleteBtn">Delete</button>
        </div>
      `;

      postContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error fetching posts: ", error);
  }
}

async function deletePost(postElement) {
  if (!postElement) {
    console.error('Post element not found.');
    return;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you want to delete this post?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      
      postElement.remove();

      const postId = postElement.dataset.id;

      deletePostFromFirestore(postId)
        .then(() => {
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
        })
        .catch((error) => {
          console.error("Error deleting post: ", error);
          Swal.fire('Error', 'There was an error deleting the post. Please try again later.', 'error');
        });
    }
  });
}


async function deletePostFromFirestore(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    console.log("Post deleted from Firestore");
  } catch (error) {
    console.error("Error deleting post from Firestore: ", error);
    throw error; 
  }
}


async function editPost(postElement) {
  const titleElement = postElement.querySelector(".post-title");
  const descriptionElement = postElement.querySelector(".post-description");
  const cardBody = postElement.querySelector(".card-body");

  const currentTitle = titleElement.textContent;
  const currentDescription = descriptionElement.textContent;
  const currentBackgroundImage = cardBody.style.backgroundImage.replace('url("', '').replace('")', '');

  Swal.fire({
    title: 'Edit Post',
    html: `
      <input id="swal-title" class="swal2-input" placeholder="Title" value="${currentTitle}">
      <textarea id="swal-description" class="swal2-textarea" placeholder="Description">${currentDescription}</textarea>
      <input id="swal-background" class="swal2-input" placeholder="Background Image URL" value="${currentBackgroundImage}">
    `,
    focusConfirm: false,
    preConfirm: async() => {
      const newTitle = document.getElementById('swal-title').value;
      const newDescription = document.getElementById('swal-description').value;
      const newBackgroundImage = document.getElementById('swal-background').value;

      if (newTitle && newDescription && newBackgroundImage) {
        titleElement.textContent = newTitle;
        descriptionElement.textContent = newDescription;
        cardBody.style.backgroundImage = `url(${newBackgroundImage})`;

        
        const postId = postElement.dataset.id; 

       
        updatePostInFirestore(postId, newTitle, newDescription, newBackgroundImage);
      }
    }
  });
}


async function updatePostInFirestore(postId, newTitle, newDescription, newBackgroundImage) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      title: newTitle,
      description: newDescription,
      backgroundImage: newBackgroundImage,
      time: serverTimestamp(),  
    });
    console.log("Post updated in Firestore");
  } catch (error) {
    console.error("Error updating post in Firestore: ", error);
    Swal.fire('Error', 'There was an error updating the post. Please try again later.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const logOutButton = document.getElementById("logOut");

  if (logOutButton) {
    logOutButton.addEventListener("click", () => {
      console.log("Logging out...");
      signOut(auth)
        .then(() => {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Logged out successfully!",
            showConfirmButton: false,
            timer: 3000,
          }).then(() => {
            window.location.href = "../index.html"; // Redirect after successful logout
          });
        })
        .catch((error) => {
          console.error("Error during sign out:", error);
          Swal.fire({
            icon: "error",
            title: "Logout Failed",
            text: error.message,
          });
        });
    });
  } else {
    console.error("Logout button not found");
  }
});
let deleteAccount=async()=>{
  let id = auth.currentUser.uid
  console.log(id);
  await deleteDoc(doc(db, "users", auth.currentUser.uid));
  console.log("Account Deleted");
}
let delete_btn = document.getElementById("deleteAccount")
delete_btn.addEventListener("click", deleteAccount);

const deleteFieldModal = new bootstrap.Modal(document.getElementById('deleteFieldModal'));

      document.getElementById('deleteField').addEventListener('click', () => {
          deleteFieldModal.show(); 
      });
  
     
      document.getElementById('confirmDeleteField').addEventListener('click', () => {
          const fieldName = document.getElementById('fieldToDelete').value.trim();
          if (fieldName) {
             
              deleteFieldFromFirestore(fieldName);
          } else {
              Swal.fire('Error', 'Please provide a valid field name to delete.', 'warning');
          }
      });
  
    
      async function deleteFieldFromFirestore(fieldName) {
          try {
            let id = auth.currentUser.uid
            console.log(id);
            
              const userRef = doc(db, 'users', auth.currentUser.uid); 
              await updateDoc(userRef, {
                [fieldName]: deleteField()
            });
              Swal.fire('Success', `Field "${fieldName}" deleted successfully!`, 'success');
          } catch (error) {
              console.error("Error deleting field: ", error);
              Swal.fire('Error', 'There was an issue deleting the field.', 'error');
          }
      }
      document.getElementById("saveAccountUpdates").addEventListener("click", async () => {
        console.log("Update button clicked");
        const name = document.getElementById("updateName").value;
        const number = document.getElementById("updateNumber").value;
        let ageInput = document.getElementById("ageInput").value;
        let addInterestsInput = document.getElementById("addInterestsInput").value;
        let removeInterestsInput = document.getElementById("removeInterestsInput").value;
    
        let id = auth.currentUser.uid;
        let addInterests = addInterestsInput.split(",").map(interests => interests.trim());
      let removeInterests = removeInterestsInput.split(",").map(interests => interests.trim());
        
        if (name && number) {
          try {
            const user = auth.currentUser;
            if (user) {
              console.log("User found:", user.uid); 
      
              
              const userRef = doc(db, "users", auth.currentUser.uid);
              await updateDoc(userRef, {
                name: name,
                number: number,
                age: ageInput,
                timestamp: serverTimestamp(), 
                addInterests: arrayUnion(...addInterests), 
                removeInterests: arrayRemove(...removeInterests) 
              });
              
              console.log("Account updated successfully"); 
      
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Account updated successfully!",
                showConfirmButton: false,
                timer: 3000
              });
              
             
              document.querySelector("#updateAccountModal .btn-close").click();
            } else {
              console.error("No user is currently signed in.");
            }
          } catch (error) {
            console.error("Error updating account:", error);
            Swal.fire({
              icon: "error",
              title: "Failed to update account",
              text: error.message
            });
          }
        } else {
          Swal.fire({
            icon: "warning",
            title: "Incomplete Information",
            text: "Please fill out both the name and number fields."
          });
        }
      });
      document.getElementById('chatBtn').addEventListener('click', () => {
        const chatSection = document.getElementById('chatSection');
        // Toggle visibility of the chat section
        chatSection.style.display = chatSection.style.display === 'none' ? 'block' : 'none';
      });
      
      // Function to close the chat section
      function closeChat() {
        document.getElementById('chatSection').style.display = 'none';
      }
      
  