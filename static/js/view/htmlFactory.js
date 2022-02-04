export const htmlTemplates = {
    board: 0,
    column: 1,
    card: 2,
    button: 3,
    rowForm: 4,
    placeholder: 5,
    zone: 6
}

export const buttonTypes = {
    newBoardBtn: "+Add New Board",
    newColumnBtn: "+Add New Column",
    newCardBtn: "+Add New Card",
    submitBtn: "Submit",
    settingsBtn: "Settings",
    showBoardBtn: "Show board",
    boardNameBtnGroup: "Board Name Group",
    columnNameBtnGroup: "Column Name Group",
    cardNameBtnGroup: "Card Name Group"
}

export const zoneTypes = {
    cardDropZone: "Card Drop Zone",
    columnDropZone: "Column Drop Zone",
    cardHoverHalfZoneTop: "Half Card Hover Area Top",
    cardHoverHalfZoneBottom: "Half Card Hover Area Bottom"
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.column:
            return columnBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.button:
            return buttonBuilder
        case htmlTemplates.rowForm:
            return rowFormBuilder
        case htmlTemplates.placeholder:
            return placeholderBuilder
        case htmlTemplates.zone:
            return zoneBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(boardId) {
    const boardContainer = document.createElement('div');
    const boardCollapsibleContainer = document.createElement('div');
    const boardColumnContainer = document.createElement('div');

    boardContainer.id = `board-${boardId}-container`
    boardContainer.classList.add('bg-secondary', 'border-secondary', 'board-container', 'my-5')
    boardContainer.appendChild(boardCollapsibleContainer);
    boardContainer.setAttribute('data-board-id', boardId);
    boardContainer.setAttribute('data-element-type', 'board-container')

    boardCollapsibleContainer.id = `board-${boardId}-collapsible-container`;
    boardCollapsibleContainer.classList.add("collapse", "board-collapsible-container");
    boardCollapsibleContainer.setAttribute('data-board-id', boardId);
    boardCollapsibleContainer.appendChild(boardColumnContainer);

    boardColumnContainer.id = `board-${boardId}-column-container`;
    boardColumnContainer.classList.add('hstack', 'overflow-auto', 'board-column-container');
    boardContainer.setAttribute('data-board-id', boardId);

    return boardContainer;
}

function columnBuilder(boardId, columnId) {
    const columnContainer = document.createElement('div');
    const cardsContainer = document.createElement('div');
    const addCardBtnWrapper = document.createElement('div');

    columnContainer.id = `board-${boardId}-column-${columnId}-container`;
    columnContainer.classList.add('card', 'card-body', 'column-container', 'text-light', 'bg-dark',
                                  'bg-antracite', 'mx-1', 'my-1', 'px-2', 'py-2', 'shadow', 'rounded');
    columnContainer.setAttribute('aria-hidden', 'false');
    columnContainer.setAttribute('data-element-type', 'column-container')
    columnContainer.setAttribute('data-board-id', boardId);
    columnContainer.setAttribute('data-column-id', columnId);
    columnContainer.appendChild(cardsContainer);
    columnContainer.appendChild(addCardBtnWrapper);

    cardsContainer.id = `board-${boardId}-column-${columnId}-card-container`;
    cardsContainer.classList.add('cards-container','overflow-auto');
    cardsContainer.setAttribute('data-board-id', boardId);
    cardsContainer.setAttribute('data-column-id', columnId);

    addCardBtnWrapper.id = `board-${boardId}-column-${columnId}-add-new-card-button-wrapper`
    addCardBtnWrapper.classList.add('card', 'text-light', 'bg-dark', 'bg-antracite', 'mx-2', 'my-1', 'add-card-btn');
    addCardBtnWrapper.setAttribute('data-create-content', "true")

    return columnContainer;
}

function cardBuilder(boardId, columnId, cardId) {
    const cardContainer = document.createElement('div');
    cardContainer.id = `board-${boardId}-column-${columnId}-card-${cardId}-container`
    cardContainer.classList.add('card', 'card-body', 'card-container', 'text-dark', 'bg-light', 'mx-2', 'my-3', 'px-2', 'py-2', 'shadow', 'rounded');
    cardContainer.setAttribute('aria-hidden', 'false');
    cardContainer.setAttribute('data-element-type', 'card-container');
    cardContainer.setAttribute('data-board-id', boardId);
    cardContainer.setAttribute('data-column-id', columnId);
    cardContainer.setAttribute('data-card-id', cardId);
    return cardContainer;
}

function buttonBuilder(type, buttonStyle, buttonClass, parentId, name) {
    const button = document.createElement('button');
    button.classList.add('btn', buttonStyle, buttonClass);

    switch (type) {
        case buttonTypes.newBoardBtn:
            button.id = 'add-new-board-button';
            button.innerText = buttonTypes.newBoardBtn;
            button.classList.add('col-12', 'board-name');
            button.setAttribute('data-element-type', 'board-name')
            button.setAttribute('type', 'button');
            return button;

        case buttonTypes.newColumnBtn:
            const addColBtnWrapper = document.createElement('div');
            addColBtnWrapper.id = `board-${parentId}-add-column`;
            addColBtnWrapper.classList.add('card', 'text-light', 'bg-dark', 'bg-antracite', 'mx-1', 'my-1', 'add-column-btn');
            addColBtnWrapper.setAttribute('data-create-content', "true");
            addColBtnWrapper.appendChild(button);

            button.id = `board-${parentId}-add-new-column-button`;
            button.innerText = buttonTypes.newColumnBtn;
            button.classList.add('column-name');
            button.setAttribute('data-element-type', 'column-name')
            button.setAttribute('type', 'button');
            return addColBtnWrapper;

        case buttonTypes.newCardBtn:
            button.id = `board-${parentId[0]}-column-${parentId[1]}-add-new-card-button`;
            button.innerText = buttonTypes.newCardBtn;
            button.classList.add('card-name');
            button.setAttribute('data-element-type', 'card-name')
            button.setAttribute('type', 'button');
            return button;

        case buttonTypes.submitBtn:
            button.innerText = buttonTypes.submitBtn;
            button.setAttribute('data-parent-id', parentId);
            button.setAttribute('type', 'submit');
            return button;

        case buttonTypes.settingsBtn:
            const dropDownWrapper = document.createElement('div');
            const dropDownMenu = document.createElement('ul');
            const menuListItem1 = document.createElement('li');
            const menuListItem2 = document.createElement('li');
            const listActionRename = document.createElement('a');
            const listActionDelete = document.createElement('a');
            const icon = document.createElement('i');

            let parentIdPrefix = ""
            if (parentId.length >= 1) {
                parentIdPrefix += `board-${parentId[0]}`;
                if (parentId.length >= 2) {
                    parentIdPrefix += `-column-${parentId[1]}`
                    if (parentId.length === 3) {
                        parentIdPrefix += `-card-${parentId[2]}`
                    }
                }
            }


            dropDownWrapper.classList.add('d-flex', 'dropdown', 'align-content-center');
            dropDownWrapper.appendChild(button);
            dropDownWrapper.appendChild(dropDownMenu);

            dropDownMenu.classList.add('dropdown-menu', 'bg-warning');
            dropDownMenu.setAttribute('aria-labelledby', `settings-${parentIdPrefix}-container`);
            dropDownMenu.appendChild(menuListItem1);
            dropDownMenu.appendChild(menuListItem2);

            menuListItem1.appendChild(listActionRename);
            menuListItem2.appendChild(listActionDelete);

            listActionRename.id = `change-${parentIdPrefix}-name`
            listActionRename.classList.add("dropdown-item");
            listActionRename.setAttribute('data-target-id', `${parentIdPrefix}-name`)
            listActionRename.onclick = function () {return false}
            listActionRename.href = "#";
            listActionRename.innerHTML = "Rename";

            listActionDelete.id = `delete-${parentIdPrefix}-container`
            listActionDelete.classList.add("dropdown-item");
            listActionDelete.setAttribute('data-target-id', `${parentIdPrefix}-container`);
            listActionDelete.setAttribute("onclick" ,"return false");
            listActionRename.onclick = function () {return false}
            listActionDelete.href = "#";
            listActionDelete.innerHTML = "Delete";

            button.id = `settings-${parentIdPrefix}`
            button.classList.add('dropdown-toggle', 'caret-off')
            button.setAttribute('type', 'button');
            button.setAttribute('data-bs-toggle','dropdown')
            button.setAttribute('aria-expanded', 'false')
            button.appendChild(icon);

            icon.classList.add('bi', 'bi-gear-fill', buttonClass);

            return dropDownWrapper

        case buttonTypes.showBoardBtn:
            button.innerHTML = name;
            button.id = `board-${parentId}-name`;
            button.classList.add('btn-block');
            button.setAttribute('type', 'button');
            button.setAttribute('data-board-id', parentId);
            button.setAttribute('data-bs-toggle',"collapse");
            button.setAttribute('data-bs-target',`#board-${parentId}-collapsible-container`);
            button.setAttribute('aria-expanded', "false");
            button.setAttribute('aria-controls',`board-${parentId}-collapsible-container`);
            button.setAttribute('data-element-type', buttonClass)
            return button

        case buttonTypes.boardNameBtnGroup:
            const boardNameGroup = document.createElement('div');
            const showBoardButton = buttonBuilder(buttonTypes.showBoardBtn,
                                                'btn-secondary',
                                                'board-name',
                                                [parentId],
                                                name)
            const settingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                                'btn-secondary',
                                                'btn-size-medium',
                                                [parentId])
            boardNameGroup.id = `board-${parentId}-btn-group`;
            boardNameGroup.classList.add("btn-group", 'd-flex', 'bg-secondary');
            boardNameGroup.setAttribute('data-board-id', parentId);
            boardNameGroup.setAttribute( 'role',"group")
            boardNameGroup.appendChild(showBoardButton);
            boardNameGroup.appendChild(settingsButton);
            return boardNameGroup;

        case buttonTypes.columnNameBtnGroup:
            const colNameGroup = document.createElement('div')
            const nameWrapper = document.createElement('div')
            const colSettingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                    'btn-antracite',
                                    'btn-size-medium',
                                    [parentId[0], parentId[1]])

            colNameGroup.id = `board-${parentId[0]}-column-${parentId[1]}-btn-group`;
            colNameGroup.classList.add("btn-group", 'd-flex');
            colNameGroup.setAttribute('data-board-id', parentId[0]);
            colNameGroup.setAttribute('data-status-column-id', parentId[1])
            colNameGroup.setAttribute('role', "group")
            colNameGroup.appendChild(nameWrapper);
            colNameGroup.appendChild(colSettingsButton);

            nameWrapper.id = `board-${parentId[0]}-column-${parentId[1]}-name`
            nameWrapper.classList.add('card-text', 'column-name', 'flex-grow-1', 'hstack');
            nameWrapper.setAttribute('data-board-id', parentId[0]);
            nameWrapper.setAttribute('data-status-column-id', parentId[1])
            nameWrapper.setAttribute('data-element-type', 'column-name')

            return colNameGroup

        case buttonTypes.cardNameBtnGroup:
            const cardNameGroup = document.createElement('div')
            const cardNameWrapper = document.createElement('div')
            const cardSettingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                    'btn-light',
                                    'btn-size-small',
                                    [parentId[0], parentId[1], parentId[2]])

            cardNameGroup.id = `board-${parentId[0]}-column-${parentId[1]}-card-${parentId[2]}-btn-group`;
            cardNameGroup.classList.add("btn-group", 'd-flex');
            cardNameGroup.setAttribute('data-board-id', parentId[0]);
            cardNameGroup.setAttribute('data-column-id', parentId[1]);
            cardNameGroup.setAttribute('data-card-id', parentId[2])
            cardNameGroup.setAttribute('role', "group")
            cardNameGroup.appendChild(cardNameWrapper);
            cardNameGroup.appendChild(cardSettingsButton);

            cardNameWrapper.id = `board-${parentId[0]}-column-${parentId[1]}-card-${parentId[2]}-name`;
            cardNameWrapper.classList.add('card-text', 'card-name', 'flex-grow-1', 'hstack', 'mb-0');
            cardNameWrapper.setAttribute('data-board-id', parentId[0]);
            cardNameWrapper.setAttribute('data-column-id', parentId[1])
            cardNameWrapper.setAttribute('data-card-id', parentId[2])
            cardNameWrapper.setAttribute('data-element-type', 'card-name')

            return cardNameGroup

        default:
            console.error("Undefined button: " + type)
            return () => { return "" }
    }
}

function rowFormBuilder(defaultText, btnStyle, elementClass, parent) {
    const form = document.createElement('form');
    const inputWrapper = document.createElement('div');
    const input = document.createElement('input');
    const submitBtn = buttonBuilder(buttonTypes.submitBtn,
                                    `${btnStyle}`,
                                    'submit-row-form-button',
                                    parent.id);

    if (parent.dataset.createContent === 'true'){
        form.id = `set-${elementClass}-form-${parent.id}`;
    } else {
        input.setAttribute('value', defaultText);
        form.id = `change-${elementClass}-form-${parent.id}`;
    }
    form.classList.add(`new-${elementClass}-form`);
    form.setAttribute('action', "");
    form.setAttribute('onsubmit', `return false`);
    form.appendChild(inputWrapper);

    inputWrapper.classList.add('input-group');
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(submitBtn);

    input.id = `new-name-${parent.id}`;
    input.classList.add('form-control', elementClass);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', defaultText);

    return form;
}

function placeholderBuilder(){
    const nameWrapper = document.createElement('div')
    const namePlaceholder1 = document.createElement('span')
    const namePlaceholder2 = document.createElement('span')

    nameWrapper.classList.add('placeholder-wave', 'hstack', 'flex-grow-1')
    nameWrapper.appendChild(namePlaceholder1)
    nameWrapper.append("\u00A0");
    nameWrapper.appendChild(namePlaceholder2)

    namePlaceholder1.classList.add('placeholder', 'col-6');
    namePlaceholder2.classList.add('placeholder', 'col-3');

    return nameWrapper
}

function zoneBuilder(type, size, offset, parentId) {
    switch (type) {
        case zoneTypes.cardDropZone:
            const cardDropZone = document.createElement('div');
            cardDropZone.id = `card-drop-zone`;
            cardDropZone.classList.add('bg-antracite', 'card-drop-zone', 'mx-2', 'my-3');
            cardDropZone.style.cssText = `height: ${size[1]}px`;
            return cardDropZone;

        case zoneTypes.columnDropZone:
            return null;

        case zoneTypes.cardHoverHalfZoneTop:
            const halfCardHoverAreaTop = document.createElement('div');
            halfCardHoverAreaTop.id = `card-${parentId}-hover-half-zone-top`
            halfCardHoverAreaTop.classList.add('position-absolute', 'card-hover-half-zone', 'top-zone');
            halfCardHoverAreaTop.style.cssText = `width: ${size[0]}px; height: ${size[1]}px`;
            halfCardHoverAreaTop.style.left = `${offset[0]}px`;
            halfCardHoverAreaTop.style.top = `${offset[1]}px`;
            return halfCardHoverAreaTop;

        case zoneTypes.cardHoverHalfZoneBottom:
            const halfCardHoverAreaBottom = document.createElement('div');
            halfCardHoverAreaBottom.id = `card-${parentId}-hover-half-zone-bottom`
            halfCardHoverAreaBottom.classList.add('position-absolute', 'card-hover-half-zone', 'bottom-zone');
            halfCardHoverAreaBottom.style.cssText = `width: ${size[0]}px; height: ${size[1]}px`;
            halfCardHoverAreaBottom.style.left = `${offset[0]}px`;
            halfCardHoverAreaBottom.style.top = `${size[1]+offset[1]}px`;
            return halfCardHoverAreaBottom;
    }
}
