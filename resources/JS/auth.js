/*
    Obtains all the parameters from the form and sends it to the backend by fetching
    the api call. Also updates page for user accordingly. TODO: Update user page to account dashboard
*/
function signupButton() {
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
            .then(result => {
                if (result.success) {
                    // TODO: Take to account page
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