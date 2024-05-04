const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const filterInput = document.getElementById('filter');
const clearBtn = document.getElementById('clear');
const formBtn = document.querySelector('button');
let isEditMode = false;

// Functions
function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToNode(item));
}

function onAddItemClick(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if (itemInput.value.length === 0) {
    alert('Please enter an item to add to list');
    return;
  }

  // check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
    formBtn.style.background = '#333';
    formBtn.innerHTML = `
  <i class="fa-solid fa-plus"></i> Add Item`;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('Item already exists');
      return;
    }
  }

  addItemToNode(newItem);
  addItemToStorage(newItem);
}

function addItemToNode(item) {
  const li = document.createElement('li');
  li.innerText = item;

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add item to the list
  itemList.appendChild(li);

  checkUI();
  // clear input field
  itemInput.value = '';
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
  checkUI();
}

function checkIfItemExists(item) {
  let itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function removeItem(item) {
  item.remove();
  removeFromStorage(item.textContent);
}

function setItemToEdit(item) {
  isEditMode = true;
  document
    .querySelectorAll('li')
    .forEach((item) => item.classList.remove('edit-mode'));
  itemInput.value = item.textContent;
  item.classList.add('edit-mode');
  formBtn.style.background = 'green';
  formBtn.innerHTML = `
  <i class="fa-solid fa-pen"></i> Update Item`;
}

function clearList() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  localStorage.removeItem('items');
  checkUI();
}

function checkUI() {
  if (itemList.children.length === 0) {
    filterInput.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    filterInput.style.display = 'block';
    clearBtn.style.display = 'block';
  }
}

function filterList(e) {
  const val = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll('li');
  for (let item of listItems) {
    if (item.textContent.toLowerCase().indexOf(val) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  }
}

// Local storage
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function addItemToStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  if (itemsFromStorage.indexOf(item) === -1) {
    itemsFromStorage.push(item);
  } else {
    itemsFromStorage = itemsFromStorage;
  }
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function removeFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((li) => li !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Event Listeners
itemForm.addEventListener('submit', onAddItemClick);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearList);
filterInput.addEventListener('input', filterList);
window.addEventListener('DOMContentLoaded', displayItems);
checkUI();
