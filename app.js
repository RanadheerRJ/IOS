let profile = JSON.parse(localStorage.getItem("profile"))

if (!profile){

const name = prompt("Your Name")
const email = prompt("Email")
const avatar = prompt("Avatar Image URL")

profile = {
name,
email,
avatar
}

localStorage.setItem(
"profile",
JSON.stringify(profile)
)

}

document.getElementById("name").innerHTML = profile.name

document.getElementById("email").innerHTML = profile.email

document.getElementById("avatar").src = profile.avatar