// test logic
let saveButton = document.getElementById("saveButton");
console.log(saveButton)
saveButton.addEventListener("click", function(e) {
    e.preventDefault();
    fetch ("/me")
    // Need to get the json from the response
    .then(response => {
        return response.json();
    })
    .then(result => {
        // If the user is loggedIn from before, we can update elements appropriately
        console.log(result.loggedIn)
    })
    .catch(error => {
        console.log(error.message)
        window.alert("There was an error with the website. Please try again.")
    })
});

/*
    Obtains all the parameters from the form and sends it to the backend by fetching
    the api call. Also updates page for user accordingly. TODO: Update user page to account dashboard
*/
function signupButton() {
    console.log("test")
        // Obtains values from HTML
        var username = document.getElementById("username").value
        var pass = document.getElementById("password").value
        var confirm_pass = document.getElementById("confirm_password").value

        // Check if passwords match
        if (pass == confirm_pass) {
            let signupData = {
                Name: username,
                Password: pass
            }
            let fetchData = {
                method: "POST",
                // Converts to JSON string
                body: JSON.stringify(signupData),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8'
                })
            }
            // Now we can fetch
            fetch ("/signup", fetchData)
            // Need to get the json from the response
            .then(response => {
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    // TODO: Switch to login modal
                    location.reload()
                }
                else {
                    window.alert(result.message)
                  }
            })
            .catch(error => {
                window.alert(error.message)
            })
        } 
        else {
            // TODO: Send proper error to FE
            window.alert("Passwords do not match. Please try again.")
        }
}
/*
    Obtains all the parameters from the form and sends it to the backend by fetching
    the api call. Also updates page for user accordingly. TODO: Update user page to account dashboard
*/
function loginButton() {
    // Obtains values from HTML
    var username = document.getElementById("loginUsername").value
    var pass = document.getElementById("loginPassword").value

    let loginData = {
        Name: username,
        Password: pass
    }
    let fetchData = {
        method: "POST",
        // Converts to JSON string
        body: JSON.stringify(loginData),
        headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8'
        })
    }
    // Now we can fetch
    fetch ("/login", fetchData)
    // Need to get the json from the response
    .then(response => {
        return response.json();
      })
    .then(result => {
        if (result.success) {
            // Hides the login modal on successful signup
            $('#loginModal').modal('hide');
        }
        else {
            // TODO: Add proper FE errors
            console.log(result)
            window.alert("Incorrect password or username. Please try again.")
        }
    })
    .catch(error => {
        window.alert("Error with the website. Please try again.")

        console.log(error.message)
    })

}

console.log("343")