const itemList = document.getElementById('item-list')
const itemForm = document.getElementById('item-form')
const itemPrice = document.getElementById('item-price')
const itemDescription = document.getElementById('item-description')
const itemName = document.getElementById('item-name')

function fetchItems(){
    fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(addItems)
}

function addItems(response){
    response.data.forEach( item => {
        addItemToDom(item)
         })
}

function addItemToDom(item){
    itemList.innerHTML += `
    <div id="item-${item.id}">
        <li>
        $<span class="price">${item.attributes.price}</span>
        <strong class="name">${item.attributes.name}</strong>:
        <span class="description">${item.attributes.description}</span>
        </li>
        <button class="delete" data-id="${item.id}">Delete</button>
        <button class="update" data-id="${item.id}">Update</button>
        </div>`
}

function handleFormSubmit(e){
    e.preventDefault()

    let newItemObj = {
        name: itemName.value,
        description: itemDescription.value,
        price: itemPrice.value
    }

    let configObj = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(newItemObj)
    }

    //pessimistic rendering
    fetch('http://localhost:3000/items', configObj)
    .then(res => res.json())
    .then(json => {
        addItemToDom(json.data)
    })

    itemForm.reset()
}

function addUpdateItemFields(itemId){
    let item = document.querySelector(`#item-${itemId} li`)
    let price = item.querySelector('.price').innerText
    let description = item.querySelector('.description').innerText
    let name = item.querySelector('strong').innerText


    let updateForm = `
    <input type="number" value="${price}" name="price" id="update-price-${itemId}" min="0" step=".01">
    <input type="text" name="name" value="${name}" id="update-name-${itemId}">
    <input type="text" name="description" value="${description}" id="update-description-${itemId}">
    `

    let formDiv = document.createElement('div')
    formDiv.id = `update-form-${itemId}`
    formDiv.innerHTML = updateForm
    item.append(formDiv)
}

function sendPatchRequest(itemId){

    const updateItemPrice = document.getElementById(`update-price-${itemId}`)
    const updateItemDescription = document.getElementById(`update-description-${itemId}`)
    const updateItemName = document.getElementById(`update-name-${itemId}`)

    let itemObj = {
        name: updateItemName.value,
        description: updateItemDescription.value,
        price: updateItemPrice.value
    }

    let configObj = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify(itemObj)
    }

    fetch(`http://localhost:3000/items/${itemId}`, configObj)
    .then(res => res.json())
    .then(response => updateItemOnDom(response.data))
    // remove form

    let form = document.getElementById(`update-form-${itemId}`)
    form.remove()
}

function updateItemOnDom(item){
    let liItem = document.querySelector(`#item-${item.id} li`)
    liItem.querySelector('.price').innerText = item.attributes.price
    liItem.querySelector('.description').innerText = item.attributes.description
    liItem.querySelector('strong').innerText = item.attributes.name
}

function deleteItem(id){
// remove from db
    let configObj = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    }

    fetch(`http://localhost:3000/items/${id}`, configObj)
    .then(res => res.json())
    .then(json => {
        alert(json.message)
    })


// remove from dom
// optimistic rendering
    let item = document.getElementById(`item-${id}`)
    item.remove()
}

function handleListClick(e){
   if (e.target.className === "delete"){
       let id = e.target.dataset.id
        deleteItem(id)
   } else if(e.target.className === 'update'){
        let itemId = e.target.dataset.id
        e.target.className = "save"
        e.target.innerText = "Save"
        addUpdateItemFields(itemId)
    } else if(e.target.className === 'save'){
        let itemId = e.target.dataset.id
        e.target.className = "update"
        e.target.innerText = "Update"
        sendPatchRequest(itemId)
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchItems()
    itemForm.addEventListener('submit', handleFormSubmit)
    itemList.addEventListener('click', handleListClick)
})