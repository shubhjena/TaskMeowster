import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-cef3c-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database,"shoppingList")

let list=[]
let shoppingListEl = document.getElementById("cart")
const addBtnEl = document.getElementById("add-btn")
let inputEl = document.getElementById("input-field")

//enter key press
inputEl.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        event.preventDefault();
        addBtnEl.click();
      }
})

//adding item from input text
addBtnEl.addEventListener("click", function(){
    if(inputEl.value){
        push(shoppingListInDB,inputEl.value)
        inputEl.value = ""
        /* on updating the DB onValue is automatically called */
    }
})

//fetching from DB: automatically runs everytime we update database
onValue(shoppingListInDB,function(snapshot){
    if(snapshot.exists()){
        list = Object.entries(snapshot.val())
        render(list)
    }
    else{
        shoppingListEl.innerHTML="No items here... yet!"
    }
})

//render items to DOM
function render(itemList){
    clearShoppingListEl()
    itemList.forEach(element => {
        shoppingListEl.append(getListItem(element))
    });
}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

//add elements to the list
function getListItem (item){
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")
    newEl.textContent = itemValue

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database,`shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    return newEl
}