const userList = document.getElementById('userList');
const searchInput = document.getElementById('searchInput');
const setMaxButton = document.getElementById('setMaxButton');

let maxProgress = 100; // Default maximum progress value

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD8WeKUUhwt17U_4LcLahDHvch1ZxFAFd0",
    authDomain: "instagram-commenter.firebaseapp.com",
    projectId: "instagram-commenter",
    storageBucket: "instagram-commenter.appspot.com",
    messagingSenderId: "784942483737",
    appId: "1:784942483737:web:fbfe7036405c4884b0dd88"
};

firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Function to display users from Firestore
function displayUsersFromFirestore() {
    userList.innerHTML = '';

    const searchTerm = searchInput.value.toLowerCase();

    // Reference to the Firestore collection where user data is stored
    const usersCollection = db.collection('users');

    usersCollection.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const user = doc.data();

                // Ensure the progress stays within the 0-maxProgress range
                const progress = Math.min(Math.max(user.progress, 0), maxProgress);

                if (user.name.toLowerCase().includes(searchTerm) || searchTerm === '') {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="user-details">
                            <span class="user-name">${user.name}</span>
                            <span class="comment-score">Comment Score: ${user.progress}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progress * (100 / maxProgress)}%">
                            </div>
                        </div>
                    `;
                    userList.appendChild(li);
                }
            });
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
        });
}


// Initial display
displayUsersFromFirestore();

// Listen for changes in the search input
searchInput.addEventListener('input', displayUsersFromFirestore);


// Function to check if the user has scrolled to the bottom of the page
function isAtBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight;
}

// Function to reload the page when the user scrolls to the bottom
function reloadOnScroll() {
    if (isAtBottom()) {
        location.reload();
    }
}

// Listen for the scroll event
window.addEventListener('scroll', reloadOnScroll);
