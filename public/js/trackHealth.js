console.log("running")
let googleUserId;

window.onload = event => {
    // retains user state between html pages.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log('Logged in as: ' + user.displayName);
            googleUserId = user.uid;
            console.log(googleUserId)
            const profileRef = firebase.database().ref(`users/${googleUserId}`);
            profileRef.on("value", (snapshot) => {
                console.log("hello")
                const profileItem = snapshot.val();
            })
            
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });
};
    
const trackData = () => {
    // 1. Capture the form data
    const date = document.querySelector('#date');
    const day = document.querySelector('#day');
    const sleephours = document.querySelector('#sleephours');
    const sleepquality = document.querySelector('#sleepquality');
    const stress = document.querySelector('#stress');
    const happiness = document.querySelector('#happiness');
    const mental = document.querySelector('#mental');
    const mood = document.querySelector('#mood');
    const mentalnotes = document.querySelector('#mentalnotes');
    const pain = document.querySelector('#pain');
    const energy = document.querySelector('#energy');
    const physical = document.querySelector('#physical');
    const physicalnotes = document.querySelector('#physicalnotes');

    const data = {
        date: date.value,
        day: day.value,
        sleephours: sleephours.value,
        sleepquality: sleepquality.value,
        stress: stress.value,
        happiness: happiness.value,
        mood: mood.value,
        mental: mental.value,
        mentalnotes: mentalnotes.value,
        pain: pain.value,
        energy: energy.value,
        physical: physical.value,
        physicalnotes: physicalnotes.value
    }

    // 3. Format the data and write it to our database
    firebase.database().ref(`users/${googleUserId}`).push(data)
        // 4. Clear the form so that we can write a new note
        .then(() => {
            // Reset to default values
            date.value = "";
            day.value = "";
            sleephours.value = "";
            sleepquality.value = "";
            stress.value = "";
            happiness.value = "";
            mood.value = "";
            mental.value = "",
            mentalnotes.value = "";
            pain.value = "";
            energy.value = "";
            physical.value = "";
            physicalnotes.value = "";

            alert("tracked!")
        });
};

function signOut() {
   firebase.auth().signOut()
	
   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')  
   });
}