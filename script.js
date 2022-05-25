'use strict';

let buttonAnotherList = document.querySelector('.add-another-list');
let listAfterClicking = document.querySelector('.list-after-clicking');
let listTextArea = document.querySelector('.list-text-area');
let buttonAddList = document.querySelector('.add-list');
let allLists = document.querySelector('.all-lists');
let buttonCloseList = document.querySelector('.close-list');
let modal = document.querySelector('.modal');
let closeModal = document.querySelector('.close-modal');
let modalText = document.querySelector('.modal-text');
let archiveCard = document.querySelector('.archive-card');
let descriptionTextArea = document.querySelector('.description-text-area');
let saveDescription = document.querySelector('.save-description');
let cancelDescription = document.querySelector('.cancel-description');
let activityTextArea = document.querySelector('.activity-text-area');
let saveActivity = document.querySelector('.save-activity');
let cancelActivity = document.querySelector('.cancel-activity');
let allActives = document.querySelector('.all-actives');

let lists = [];
let cards = [];

let movedCard;
let afterCard;
let movedCardID;
let afterCardID;
let listToID;

// Всплывающее окно добавления колонки
function listOpenAfterClicking() {
    listAfterClicking.style.display = "block";
    buttonAnotherList.style.display = "none";
    listTextArea.value = '';
    listTextArea.focus();
}

// Добавление колонки
const addList = () => {
    if (listTextArea.value !== '') {
        let itemList = {
            id: Date.now(),
            text: listTextArea.value,
        };
        lists.push(itemList);
        listAfterClicking.style.display = "none";
        buttonAnotherList.style.display = "flex";
        localStorage.setItem('listsStorage', JSON.stringify(lists));
        listTextArea.value = '';
        renderList();
    }   
};

// Рендер колонок
const renderList = () => {
    let renderlist = '';
    lists.forEach((item) => {
        renderlist
            += `<div class="new-list" data-id=${item.id}>
                    <div class="head">
                        <div class="head-text head-text-color" contenteditable="true">${item.text}
                        </div>
                        <div class="menu-drop-list">
                            <button class="open-menu-list">
                            </button>
                            <div class="menu-list">
                                <button class="menu-add-a-card menu-part">Add a card
                                </button>
                                <button class="menu-delete-all-cards menu-part">Delete all cards
                                </button>
                                <button class="menu-delete-list menu-part">Delete list
                                </button>
                                <button class="menu-copy-all-cards menu-part">Copy list
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="all-cards">
                    </div>
                    <div class="card">
                        <button class="add-a-card">
                            <div class="plus-box">
                                <div class="plus">
                                </div>
                            </div>
                            <div class="card-plus-text">
                                Add a card
                            </div>
                        </button>
                        <div class="card-after-clicking">
                            <textarea class="card-text-area" placeholder="Enter a title for the card">
                            </textarea>
                            <button class="add-card">Add card
                            </button>
                            <button class="close-card">
                            </button>
                        </div>
                    </div>
                </div>`;
    });
    allLists.innerHTML = renderlist;

    let allNewList = allLists.querySelectorAll('.new-list');
    let allHeadText = allLists.querySelectorAll('.head-text');
    let allAddACard = allLists.querySelectorAll('.add-a-card');
    let allAddCard = allLists.querySelectorAll('.add-card');
    let allCloseCard = allLists.querySelectorAll('.close-card');
    let allMenuAddACard = allLists.querySelectorAll('.menu-add-a-card');
    let allMenuDeleteAllCards = allLists.querySelectorAll('.menu-delete-all-cards');
    let allMenuDeleteList = allLists.querySelectorAll('.menu-delete-list');
    let allMenuCopyAllCards = allLists.querySelectorAll('.menu-copy-all-cards');

    allNewList.forEach((item) => {
        item.addEventListener('dragover', dragOver);
    });
    allNewList.forEach((item) => {
        item.addEventListener('dragend', dragEnd);
    });
    allHeadText.forEach((item) => {
        item.addEventListener('focusout', redactListName);
    });
    allAddACard.forEach((item) => {
        item.addEventListener('click', cardOpenAfterClicking);
    });
    allAddCard.forEach((item) => {
        item.addEventListener('click', addCard);
    });
    allCloseCard.forEach((item) => {
        item.addEventListener('click', closeCardNow);
    });
    allMenuAddACard.forEach((item) => {
        item.addEventListener('click', cardOpenFromMenu);
    });
    allMenuDeleteAllCards.forEach((item) => {
        item.addEventListener('click', deleteAllCardsThis);
    });
    allMenuDeleteList.forEach((item) => {
        item.addEventListener('click', deleteList);
    });
    allMenuCopyAllCards.forEach((item) => {
        item.addEventListener('click', copyAllCards);
    });
    refreshCards();
}

// Отмена создания колонки
function closeListNow() {
    listTextArea.value = '';
    listAfterClicking.style.display = "none";
    buttonAnotherList.style.display = "flex";
}

// Редактирование заголовка колонки
function redactListName() {
    let tempId = this.closest('.new-list');
    let id = Number(tempId.dataset.id);
    let index = lists.findIndex(item => item.id === Number(id));
    lists[index].text = this.textContent;
    localStorage.setItem('listsStorage', JSON.stringify(lists));
}

// Всплывающее окно добавления карточки
function cardOpenAfterClicking() {
    this.style.display = "none";
    this.parentNode.childNodes[3].style.display = "block";
    this.parentNode.childNodes[3].childNodes[1].value = '';
    this.parentNode.childNodes[3].childNodes[1].focus();
}

// Добавление карточки
function addCard() {
    if (this.parentNode.childNodes[1].value !== '') {
        let tempId = this.closest('.new-list');
        let parentId = Number(tempId.dataset.id);
        let itemCard = {
            id: Date.now(),
            text: this.parentNode.childNodes[1].value,
            parentid: parentId,
            description: '',
            activity: [],
        };
        cards.push(itemCard);
        this.parentNode.style.display = "none";
        this.parentNode.parentNode.childNodes[1].style.display = "flex";
        localStorage.setItem('cardsStorage', JSON.stringify(cards));
        this.parentNode.childNodes[1].value = '';
        renderCard(itemCard.id, itemCard.text, itemCard.parentid, itemCard.description, itemCard.activity);
    }
};

// Рендер карточек
function renderCard (id, text, parentid) {
    let index = lists.findIndex(item => item.id === parentid);
    let spaceForCards = allLists.childNodes[index].childNodes[3];
    let cardDone = document.createElement('div');
    cardDone.classList.add('card-done');
    cardDone.dataset.parentid = parentid;
    cardDone.dataset.id = id;
    cardDone.setAttribute('draggable', true);
    spaceForCards.append(cardDone);

    let menuDropCard = document.createElement('div');
    menuDropCard.classList.add('menu-drop-card');
    cardDone.append(menuDropCard);

    let buttonOpenMenuCard = document.createElement('button');
    buttonOpenMenuCard.classList.add('open-menu-card');
    menuDropCard.append(buttonOpenMenuCard);

    let menuCard = document.createElement('div');
    menuCard.classList.add('menu-card');
    menuDropCard.append(menuCard);

    let menuEditCard = document.createElement('button');
    menuEditCard.classList.add('menu-edit-card', 'menu-part');
    menuEditCard.textContent = "Edit";
    menuCard.append(menuEditCard);

    let menuDeleteCard = document.createElement('button');
    menuDeleteCard.classList.add('menu-delete-card', 'menu-part');
    menuDeleteCard.textContent = "Delete";
    menuCard.append(menuDeleteCard);

    let cardName = document.createElement('div');
    cardName.classList.add('card-name');
    cardName.setAttribute('contenteditable', true);
    cardName.textContent = text;
    cardDone.append(cardName);

    let allCardName = allLists.querySelectorAll('.card-name');
    let allMenuEditCard = allLists.querySelectorAll('.menu-edit-card');
    let allMenuDeleteCard = allLists.querySelectorAll('.menu-delete-card');

    cardDone.addEventListener('dragstart', dragStart);
    allCardName.forEach((item) => {
        item.addEventListener('focusout', redactCardName);
    });
    allMenuEditCard.forEach((item) => {
        item.addEventListener('click', openModalWindow);
    });
    allMenuDeleteCard.forEach((item) => {
        item.addEventListener('click', deleteCard);
    });
}

// Отмена создания карточки
function closeCardNow() {
    this.parentNode.style.display = "none";
    this.parentNode.parentNode.childNodes[1].style.display = "flex";
    this.parentNode.childNodes[1].value = '';
}

// Редактирование текста карточки
function redactCardName() {
    let tempId = this.parentNode;
    let id = Number(tempId.dataset.id);
    let index = cards.findIndex(item => item.id === Number(id));
    cards[index].text = this.textContent;
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
}

// Создание карточки из меню
function cardOpenFromMenu() {
    this.parentNode.parentNode.parentNode.parentNode.childNodes[5].childNodes[1].style.display = "none";
    this.parentNode.parentNode.parentNode.parentNode.childNodes[5].childNodes[3].style.display = "block";
}

// Удаление всех карточек в колонке
function deleteAllCardsThis() {
    let tempId = this.closest('.new-list');
    let parentId = Number(tempId.dataset.id);
    cards = cards.filter((item) => item.parentid !== parentId);
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    renderList();
}

// Удаление колонки
function deleteList() {
    let tempId = this.closest('.new-list');
    let id = Number(tempId.dataset.id);
    let parentId = id;
    cards = cards.filter((item) => item.parentid !== parentId);
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    let index = lists.findIndex(item => item.id === Number(id));
    lists.splice(index, 1);
    localStorage.setItem('listsStorage', JSON.stringify(lists));
    renderList();
}

// Копирование всех карточек в новую колонку
function copyAllCards() {
    let tempId = this.closest('.new-list');
    let id = Number(tempId.dataset.id);
    let parentId = id;
    let cardsCopy = cards.filter((item) => item.parentid === parentId);
    let index = lists.findIndex(item => item.id === Number(id));
    let indexCopy = index + 1;
    let cloneList = Object.assign({}, lists[index]);
    lists.splice(indexCopy, 0, cloneList);
    lists[indexCopy].id = Date.now();
    let cloneCards = JSON.parse(JSON.stringify(cardsCopy));
    for (let i = 0; i < cloneCards.length; i++) {
        cloneCards[i].parentid = lists[indexCopy].id;
        cloneCards[i].id = Date.now() + setTimeout(() => 1);
    }
    cards = cards.concat(cloneCards);
    localStorage.setItem('listsStorage', JSON.stringify(lists));
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    renderList();
}

// Удаление карточки
function deleteCard() {
    let tempId = this.closest('.card-done');
    let id = Number(tempId.dataset.id);
    let index = cards.findIndex(item => item.id === Number(id));
    cards.splice(index, 1);
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    renderList();
}

// Открывает модальное окно
function openModalWindow() {
    modal.style.display = "block";
    let tempId = this.closest('.card-done');
    let id = Number(tempId.dataset.id);
    let index = cards.findIndex(item => item.id === Number(id));
    modalText.textContent = cards[index].text;
    modal.dataset.index = index;
    if (cards[index].description !== '') {
        descriptionTextArea.value = cards[index].description;
    } else {
        descriptionTextArea.value = '';
    }
    activityTextArea.textContent = '';
    allActives.innerHTML = '';
    if (cards[index].activity !== null) {
        for (let k = 0; k <cards[index].activity.length; k++) {
            renderActive(cards[index].activity[k].id, cards[index].activity[k].active);
        }
    }
}

// Редактирование текста карточки в модальном окне
function redactCardNameInModal(e) {
    let index = modal.dataset.index;
    cards[index].text = modalText.textContent;
    if (modalText.textContent !== '') {
        localStorage.setItem('cardsStorage', JSON.stringify(cards));
        renderList();
    } else {
        modalText.focus();
    }
}

// Закрыть модальное окно
function closeModalWindow() {
    modal.style.display = "none";
}

// Архивация (удаление) карточки из открытого состояния
function archiveCardInModal() {
    let index = modal.dataset.index;
    cards.splice(index, 1);
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    renderList();
    closeModalWindow();
}

// При фокусе в "Описании" появляются кнопки "Сохранить" и "Отмена"
function redactDescription() {
    saveDescription.style.display = "inline-block";
    cancelDescription.style.display = "inline-block";
}

// Сохранить описание
function saveDescriptionInModal() {
    let index = modal.dataset.index;
    cards[index].description = descriptionTextArea.value;
    saveDescription.style.display = "none";
    cancelDescription.style.display = "none";
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    renderList();
}

// Отмена изменений в описании
function cancelDescriptionInModal() {
    let index = modal.dataset.index;
    descriptionTextArea.value = cards[index].description;
    saveDescription.style.display = "none";
    cancelDescription.style.display = "none";
}

// При фокусе в новом "Комментарии" появляются кнопки "Сохранить" и "Отмена"
function redactNewActivity() {
    saveActivity.style.display = "inline-block";
    cancelActivity.style.display = "inline-block";
}

// Добавление комментария
function addActive() {
    if (activityTextArea.value !== '') {
        let index = modal.dataset.index;
        let itemActive = {
            id: Date.now(),
            active: activityTextArea.value,
        };
        cards[index].activity.push(itemActive);
        saveActivity.style.display = "none";
        cancelActivity.style.display = "none";
        localStorage.setItem('cardsStorage', JSON.stringify(cards));
        activityTextArea.value = '';
        renderActive(itemActive.id, itemActive.active);
    }
}

// Рендер комментариев
function renderActive (id, active) {
    let activeDone = document.createElement('div');
    activeDone.classList.add('active-done');
    activeDone.dataset.id = id;
    allActives.append(activeDone);

    let activeText = document.createElement('div');
    activeText.classList.add('active-text');
    activeText.setAttribute('contenteditable', false);
    activeText.textContent = active;
    activeDone.append(activeText);

    let saveActiveDone = document.createElement('button');
    saveActiveDone.classList.add('save-active-done');
    saveActiveDone.textContent = "Save";
    activeDone.append(saveActiveDone);

    let cancelActiveDone = document.createElement('button');
    cancelActiveDone.classList.add('cancel-active-done');
    activeDone.append(cancelActiveDone);

    let editActivity = document.createElement('button');
    editActivity.classList.add('edit-activity');
    editActivity.textContent = "Edit";
    activeDone.append(editActivity);

    let sign = document.createElement('span');
    sign.classList.add('sign');
    sign.textContent = "-";
    activeDone.append(sign);

    let deleteActivity = document.createElement('button');
    deleteActivity.classList.add('delete-activity');
    deleteActivity.textContent = "Delete";
    activeDone.append(deleteActivity);

    let allEditActivity = allActives.querySelectorAll('.edit-activity');
    let allDeleteActivity = allActives.querySelectorAll('.delete-activity');
    let allSaveActiveDone = allActives.querySelectorAll('.save-active-done');
    let allCancelThisActive = allActives.querySelectorAll('.cancel-active-done');
    allEditActivity.forEach((item) => {
        item.addEventListener('click', editThisActive);
    });
    allDeleteActivity.forEach((item) => {
        item.addEventListener('click', deleteThisActive);
    })
    allSaveActiveDone.forEach((item) => {
        item.addEventListener('click', saveThisActive);
    });
    allCancelThisActive.forEach((item) => {
        item.addEventListener('click', cancelThisActive);
    });
}

// Отмена добавления комментария
function cancelNewActivity() {
    saveActivity.style.display = "none";
    cancelActivity.style.display = "none";
    activityTextArea.value = '';
}

// Редактирование комментария
function editThisActive() {
    this.parentNode.childNodes[0].setAttribute('contenteditable', true);
    this.parentNode.childNodes[0].focus();
    this.parentNode.childNodes[1].style.display = "inline-block";
    this.parentNode.childNodes[2].style.display = "inline-block";
    this.parentNode.childNodes[3].style.display = "none";
    this.parentNode.childNodes[4].style.display = "none";
    this.parentNode.childNodes[5].style.display = "none";
}

// Удалить созданный комментарий
function deleteThisActive() {
    let index = modal.dataset.index;
    let tempId = Number(this.parentNode.dataset.id);
    let indexActive = cards[index].activity.findIndex(item => item.id === Number(tempId));
    cards[index].activity.splice(indexActive, 1);
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
    this.parentNode.remove();
}

// Сохранить отредактированный комментарий
function saveThisActive() {
    let index = modal.dataset.index;
    let tempId = Number(this.parentNode.dataset.id);
    let indexActive = cards[index].activity.findIndex(item => item.id === Number(tempId));
    cards[index].activity[indexActive].active = this.parentNode.childNodes[0].textContent;
    this.parentNode.childNodes[0].setAttribute('contenteditable', false);
    this.parentNode.childNodes[1].style.display = "none";
    this.parentNode.childNodes[2].style.display = "none";
    this.parentNode.childNodes[3].style.display = "inline-block";
    this.parentNode.childNodes[4].style.display = "inline-block";
    this.parentNode.childNodes[5].style.display = "inline-block";
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
}

// Отмена изменений в комментарии
function cancelThisActive() {
    let index = modal.dataset.index;
    let tempId = Number(this.parentNode.dataset.id);
    let indexActive = cards[index].activity.findIndex(item => item.id === Number(tempId));
    this.parentNode.childNodes[0].textContent = cards[index].activity[indexActive].active;
    this.parentNode.childNodes[0].setAttribute('contenteditable', false);
    this.parentNode.childNodes[1].style.display = "none";
    this.parentNode.childNodes[2].style.display = "none";
    this.parentNode.childNodes[3].style.display = "inline-block";
    this.parentNode.childNodes[4].style.display = "inline-block";
    this.parentNode.childNodes[5].style.display = "inline-block";
}

// Перетаскивание карточек
function dragStart() {
    movedCard = this;
    movedCard.classList.add('selected');
}

function dragOver(e) {
    e.preventDefault();
    afterCard = getDragAfterElement(this, e.clientY);
    if (afterCard === undefined) {
        this.childNodes[3].append(movedCard);
    } else {
        this.children[1].insertBefore(movedCard, afterCard);
    }
};

function getDragAfterElement(container, y) {
    let draggableElements = [...container.querySelectorAll('.card-done:not(.selected)'),];
    return draggableElements.reduce(
        (closest, child) => {
            let box = child.getBoundingClientRect();
            let offset = y - box.top - box.height / 5;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        },
        { offset: Number.NEGATIVE_INFINITY }
    ).element;
};

function moveElement(movedElemID, beforeElemID, listID) {
    let movedCard;
    cards = cards.filter(item => {
        if (item.id == movedElemID) {
            item.parentid = listID;
            movedCard = item;
        } else {
            return item;
        }
    });
    if (beforeElemID === undefined) {
        cards.push(movedCard);
    } else {
        let indexCards = cards.findIndex(item => item.id === beforeElemID);
        if (indexCards != -1) {
            cards.splice(indexCards, 0, movedCard)
        }
    }
    localStorage.setItem('cardsStorage', JSON.stringify(cards));
}

function dragEnd(e) {
    if (afterCard !== undefined) {
        afterCardID = parseInt(afterCard.dataset.id);
    } else {
        afterCardID = undefined;
    }
    movedCardID = parseInt(movedCard.dataset.id);
    listToID = Number(this.dataset.id);
    movedCard.classList.remove('selected');
    moveElement(movedCardID, afterCardID, listToID);
}

// Локальное хранилище колонок
window.onload = function() {
    let rawLists = localStorage.getItem('listsStorage');
    if (rawLists != null) {
        lists = JSON.parse(rawLists);
        for (let i = 0; i < lists.length; i++) {
            renderList();
        }
    }
}

// Локальное хранилище карточек
function refreshCards() {
    let rawCards = localStorage.getItem('cardsStorage');
        if (rawCards != null) {
            cards = JSON.parse(rawCards);
            for (let j = 0; j < cards.length; j++) {
                renderCard(cards[j].id, cards[j].text, cards[j].parentid, cards[j].description, cards[j].activity);
            }
        }
}

buttonAnotherList.addEventListener('click', listOpenAfterClicking);
buttonAddList.addEventListener('click', addList);
buttonCloseList.addEventListener('click', closeListNow);
closeModal.addEventListener('click', closeModalWindow);
modalText.addEventListener('focusout', redactCardNameInModal);
archiveCard.addEventListener('click', archiveCardInModal);
descriptionTextArea.addEventListener('focus', redactDescription);
saveDescription.addEventListener('click', saveDescriptionInModal);
cancelDescription.addEventListener('click', cancelDescriptionInModal);
activityTextArea.addEventListener('focus', redactNewActivity);
saveActivity.addEventListener('click', addActive);
cancelActivity.addEventListener('click', cancelNewActivity);