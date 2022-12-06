const ItemCtrl = (function (){
    // private
    // ItemCtrl module construct
    const Item = function (id, name, calories){
        this.id = id
        this.name = name
        this.calories = calories
    }
    // data structure
    const data = {
        items: [
            // new Item(0, 'Steak Dinner', 1200),
            // new Item(1, 'Cookie', 200),
            // new Item(2, 'Eggs', 300)
        ],
        total: 0
    }

    // public methods
    return {
        logData: function (){
            return data
        },
        getTotalCalories: function (){
            let total = 0
            data.items.forEach(function (item){
                total = total + item.calories
            })
            data.total = total
            return data.total
        },
        getItems: function (){
            return data.items
        },
        addItem: function (name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1
            } else {
                ID = 0
            }
            calories = parseInt(calories)
            const newItem = new Item(ID, name, calories)
            data.items.push(newItem)
            return newItem
        }
    }
})();

const UICtrl = (function (){
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        addBtn: '.add-btn'
    }

    return{
        populateItemList: function (items){
            let html = ''
            items.forEach(function (item){
                html += `<li class="collection-item" id="item-${item.id}">
                         <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                         <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                         </a>
                         </li>`
            })
            document.querySelector(UISelectors.itemList).innerHTML = html
        },
        showTotalCalories: function (totalCalories){
            document.querySelector('.total-calories').textContent = totalCalories
        },
        getItemInput: function (){
            const userInput = {
                name: document.querySelector('#item-name').value ,
                calories: document.querySelector('#item-calories').value
            }
            return userInput
        },
        addListItem: function (item){
            const li = document.createElement('li')
            li.id = `item-${item.id}`
            li.className = 'collection-item'
            let html = `<strong>${item.name}</strong>
                            <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`
            li.innerHTML = html
            document.querySelector('ul').insertAdjacentElement('beforeend', li)
        },
        clearInput: function (){
            document.querySelector('#item-name').value = ''
            document.querySelector('#item-calories').value = ''
        },
        getSelectors: function (){
            return UISelectors
        }
    }
})()

const StorageCtrl = (function (){
    return {
        storeItem: function (item){
            let items
            if(localStorage.getItem('items') === null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            items.push(item)
            localStorage.setItem('items', JSON.stringify(items))
        },
        getItemsFromStorage: function (){
            let items
            if(localStorage.getItem('items') === null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        }
    }
})()

const App = (function (){
    const itemAddSubmit = function (event){
        console.log('data is submited')
        const userInput = UICtrl.getItemInput()
        console.log(userInput)
        if(userInput.name !== '' && userInput.calories !== ''){
            const newItem = ItemCtrl.addItem(userInput.name, userInput.calories)
            UICtrl.addListItem(newItem)
            StorageCtrl.storeItem(newItem)
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.clearInput()
        }
        event.preventDefault()
    }

    const getItemsFromStorage = function (){
        const items = StorageCtrl.getItemsFromStorage()
        items.forEach(function (item){
            ItemCtrl.addItem(item.name, item.calories)
        })
        UICtrl.populateItemList(items)
        const totalCalories = ItemCtrl.getTotalCalories()
        UICtrl.showTotalCalories(totalCalories)
    }

    const loadEventListeners = function (){
        const UISelectors = UICtrl.getSelectors()

        document.addEventListener('DOMContentLoaded', getItemsFromStorage)
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit)
    }

    return{
        init: function (){
            loadEventListeners()
        }
    }
})(ItemCtrl, UICtrl, StorageCtrl)

App.init()