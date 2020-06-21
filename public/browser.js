function itemTemplate(item) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${item.text}</span>
      <div>
        <button data-id="${item._id}" class="btn btn--s btn--in-cart mr-s">In Cart</button>
        <button data-id="${item._id}" class="btn btn--s btn--edit mr-s">Edit</button>
        <button data-id="${item._id}" class="btn btn--s btn--delete">Delete</button>
      </div>
    </li>
`
}

// Initial Page Load Render
let ourHTML = items.map(function(i) {
    return itemTemplate(i)
}).join('')

document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

// Create Feature
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit", function(e) {
    e.preventDefault()
    axios.post('/create-item', {text: createField.value}).then(function(response) {
        document.getElementById("item-list").insertAdjacentHTML("beforeend", itemTemplate(response.data))
        createField.value = ""
        createField.focus()
    }).catch(function() {
        console.log("Error! Please try again later!")
    })
})

document.addEventListener("click", function(e) {
    // Delete Feature
    if (e.target.classList.contains("btn--delete")) {
        axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function() {
            e.target.parentElement.parentElement.remove() 
        }).catch(function() {
            console.log("Error! Please try again later!")
        })
    }

    // Update Feature
    if (e.target.classList.contains("btn--edit")) {
        let userInput = prompt("Enter your desired text.", e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if (userInput) {
            axios.post('/update-item', {text: userInput, id: e.target.getAttribute("data-id")}).then(function() {
                e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput // it is updateing the userinterface with the new value of the edit fucntion once our database action is complete.
            }).catch(function() {
                console.log("Error! Please try again later!")
            })
        }
    }

    // Clear All Feature
    if (e.target.classList.contains("btn--clear-all")) {
        if (confirm("Did you really buy all the items?")) {
            axios.post('/clear-all-items').then(function() {
                document.getElementById("item-list").innerHTML = ""
            }).catch(function() {
                console.log("Error! Please try again later!")
            })
        }
    }
})