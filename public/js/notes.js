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
                populateNotes(profileItem);
            })
            
        } else {
            // if not logged in, navigate back to login page.
            window.location = 'index.html';
        };
    });
};

function populateNotes(data) {
    var container = document.querySelector(".tilesC");
    for (item in data) {
        container.innerHTML += (`<div class="tileC info">
            <h3 class="is-family-sans-serif has-text-weight-bold">${data[item].mentalnotes}</h3>
            </div>`)
        container.innerHTML += (`<div class="tileC info">
            <h3 class="is-family-sans-serif has-text-weight-bold">${data[item].physicalnotes}</h3>
            </div>`)
    }
}