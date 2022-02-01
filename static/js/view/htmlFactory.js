export const htmlTemplates = {
    button: 0,
    board: 1,
    column: 2,
    card: 3,
    rowForm: 4
}

export const buttonTypes = {
    newBoardBtn: "+Add New Board",
    newColumnBtn: "+Add New Column",
    submitBtn: "Submit",
    settingsBtn: "Settings",
    showBoardBtn: "Show board",
    boardTitleBtnGroup: "Board Title Group",
    columnTitleBtnGroup: "Column Title Group",
    cardTitleBtnGroup: "Card Title Group"
}

export const columnTypes = {
    templateColumn: "Column template",
    placeholderColumn: "Column with placeholders",
    loadedColumn: "Column with data"
}

export const cardTypes = {
    templateCard: "Card template",
    placeholderCard: "Card placeholder",
    loadedCard: "Card with data"
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.button:
            return buttonBuilder
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.column:
            return columnBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.rowForm:
            return rowFormBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(boardData) {
    const boardContainer = document.createElement('div');
    const boardContent = document.createElement('div');
    const boardColumnContainer = document.createElement('div');

    const titleBtnGroup = buttonBuilder(buttonTypes.boardTitleBtnGroup,
                                        'secondary',
                                        'board-title',
                                        boardData.id,
                                        boardData.title)

    boardColumnContainer.id = `board-${boardData.id}-column-container`
    boardColumnContainer.classList.add('hstack', 'overflow-auto', 'board-column-container')

    boardContent.id = `collapse${boardData.id}`;
    boardContent.classList.add("collapse", "board-collapse");
    boardContent.setAttribute('data-board-id', boardData.id);
    boardContent.appendChild(boardColumnContainer);

    console.log(boardColumnContainer)

    for (const i in boardData['statuses']){
        const statusColumnId = boardData['statuses'][i];
        const columnPlaceholder = columnBuilder(columnTypes.placeholderColumn, statusColumnId, boardData.id);
        const cardPlaceholder1 = cardBuilder(cardTypes.placeholderCard, 1, statusColumnId, boardData.id);
        const cardPlaceholder2 = cardBuilder(cardTypes.placeholderCard, 2, statusColumnId, boardData.id);
        boardColumnContainer.appendChild(columnPlaceholder);
        boardColumnContainer.children[i].children[0].appendChild(cardPlaceholder1);
        boardColumnContainer.children[i].children[0].appendChild(cardPlaceholder2);
    }

    boardContainer.id = `board-container-${boardData.id}`
    boardContainer.classList.add('bg-secondary', 'border-secondary', 'board-container', 'my-5')
    boardContainer.appendChild(titleBtnGroup);
    boardContainer.appendChild(boardContent);
    boardContainer.setAttribute('data-board-id', boardData.id);

    return boardContainer;
}

function buttonBuilder(type, buttonStyle, buttonClass, parentId, name) {
    const button = document.createElement('button');
    button.classList.add('btn', buttonStyle, buttonClass);

    switch (type) {
        case buttonTypes.newBoardBtn:
            button.id = 'add-new-board-button';
            button.innerText = buttonTypes.newBoardBtn;
            button.setAttribute('data-element-type', 'board-title')
            button.setAttribute('type', 'button');
            button.classList.add('col-12', 'board-title');
            return button;

        case buttonTypes.newColumnBtn:
            const addColBtnWrapper = document.createElement('div');
            addColBtnWrapper.id = `add-board-${parentId}-column`
            addColBtnWrapper.classList.add('card', 'text-light', 'bg-dark', 'bg-antracite', 'mx-1', 'my-1', 'add-column-btn');
            addColBtnWrapper.appendChild(button);
            addColBtnWrapper.setAttribute('data-create-content', "true")
            button.id = `add-new-board-${parentId}-column-button`;
            button.innerText = buttonTypes.newColumnBtn;
            button.setAttribute('data-element-type', 'column-title')
            button.setAttribute('type', 'button');
            return addColBtnWrapper;

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

            icon.classList.add('bi', 'bi-gear-fill');
            button.id = `settings-${parentId}`
            button.classList.add('dropdown-toggle', 'caret-off')
            button.setAttribute('type', 'button');
            button.setAttribute('data-target-id', parentId);
            button.setAttribute('data-bs-toggle','dropdown')
            button.setAttribute('aria-expanded', 'false')
            button.appendChild(icon);

            listActionRename.id = `rename-${parentId}`
            listActionRename.classList.add("dropdown-item");
            listActionRename.setAttribute('data-target-id', parentId)
            listActionRename.href = "#";
            listActionRename.innerHTML = "Rename";

            listActionDelete.id = `delete-${parentId}`
            listActionDelete.classList.add("dropdown-item");
            listActionDelete.setAttribute('data-target-id', parentId)
            listActionDelete.href = "#";
            listActionDelete.innerHTML = "Delete";

            menuListItem1.appendChild(listActionRename);
            menuListItem2.appendChild(listActionDelete);

            dropDownMenu.classList.add('dropdown-menu', 'bg-warning');
            dropDownMenu.setAttribute('aria-labelledby', `settings-${parentId}`);
            dropDownMenu.appendChild(menuListItem1);
            dropDownMenu.appendChild(menuListItem2);

            dropDownWrapper.classList.add('d-flex', 'dropdown', 'align-content-center');
            dropDownWrapper.appendChild(button);
            dropDownWrapper.appendChild(dropDownMenu);

            return dropDownWrapper

        case buttonTypes.showBoardBtn:
            button.innerHTML = name;
            button.id = `board-title-${parentId}`;
            button.classList.add('btn-block');
            button.setAttribute('type', 'button');
            button.setAttribute('data-board-id', parentId);
            button.setAttribute('data-bs-toggle',"collapse");
            button.setAttribute('data-bs-target',`#collapse${parentId}`);
            button.setAttribute('aria-expanded', "false");
            button.setAttribute('aria-controls',`collapse${parentId}`);
            button.setAttribute('data-element-type', buttonClass)
            return button

        case buttonTypes.boardTitleBtnGroup:
            const showBoardButton = buttonBuilder(buttonTypes.showBoardBtn,
                                                'btn-secondary',
                                                'board-title',
                                                parentId,
                                                name)

            const settingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                                'btn-secondary',
                                                'btn-size-medium',
                                                `board-title-${parentId}`)

            const btnGroup = document.createElement('div');
            btnGroup.classList.add("btn-group", 'd-flex', 'bg-secondary');
            btnGroup.setAttribute('data-board-id', parentId);
            btnGroup.setAttribute( 'role',"group")
            btnGroup.appendChild(showBoardButton);
            btnGroup.appendChild(settingsButton);
            return btnGroup;

        case buttonTypes.columnTitleBtnGroup:
            const colTittleGroup = document.createElement('div')
            const titleWrapper = document.createElement('div')
            const colSettingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                    'btn-antracite',
                                    'btn-size-medium',
                                    `board-${parentId[0]}-column-${parentId[1]}-title`)

            titleWrapper.id = `board-${parentId[0]}-column-${parentId[1]}-title`
            titleWrapper.classList.add('card-text', 'column-title', 'h5', 'flex-grow-1', 'hstack', 'mb-0');
            titleWrapper.setAttribute('data-board-id', parentId[0]);
            titleWrapper.setAttribute('data-status-column-id', parentId[1])
            titleWrapper.setAttribute('data-element-type', 'column-title')

            colTittleGroup.classList.add("btn-group", 'd-flex');
            colTittleGroup.setAttribute('data-board-id', parentId[0]);
            colTittleGroup.setAttribute('data-status-column-id', parentId[1])
            colTittleGroup.setAttribute('role', "group")
            colTittleGroup.appendChild(titleWrapper);
            colTittleGroup.appendChild(colSettingsButton);

            return colTittleGroup

        case buttonTypes.cardTitleBtnGroup:
            const cardTittleGroup = document.createElement('div')
            const cardTitleWrapper = document.createElement('div')
            const cardSettingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                    'btn-light',
                                    'btn-size-small',
                                    `board-${parentId[0]}-column-${parentId[1]}-card-${parentId[2]}-title`)

            cardTitleWrapper.id = `board-${parentId[0]}-column-${parentId[1]}-card-${parentId[2]}-title`;
            cardTitleWrapper.classList.add('card-text', 'card-title', 'flex-grow-1', 'hstack', 'mb-0');
            cardTitleWrapper.setAttribute('data-board-id', parentId[0]);
            cardTitleWrapper.setAttribute('data-column-id', parentId[1])
            cardTitleWrapper.setAttribute('data-card-id', parentId[1])
            cardTitleWrapper.setAttribute('data-element-type', 'card-title')

            cardTittleGroup.classList.add("btn-group", 'd-flex');
            cardTittleGroup.setAttribute('data-board-id', parentId[0]);
            cardTittleGroup.setAttribute('data-column-id', parentId[1]);
            cardTittleGroup.setAttribute('data-card-id', parentId[1])
            cardTittleGroup.setAttribute('role', "group")
            cardTittleGroup.appendChild(cardTitleWrapper);
            cardTittleGroup.appendChild(cardSettingsButton);

            return cardTittleGroup

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

    input.id = `new-title-${parent.id}`;
    input.classList.add('form-control', elementClass);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', defaultText);
    if (parent.dataset.createContent === 'true'){
        form.id = `set-${elementClass}-form-${parent.id}`;
    } else {
        input.setAttribute('value', defaultText);
        form.id = `change-${elementClass}-form-${parent.id}`;
    }

    form.classList.add(`new-${elementClass}-form`);
    form.setAttribute('action', "");
    form.setAttribute('onsubmit', `return false`);

    inputWrapper.classList.add('input-group');
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(submitBtn);
    form.appendChild(inputWrapper);

    return form;
}

function columnBuilder(type, columnId, boardId, name) {
    switch (type) {
        case columnTypes.templateColumn:
            const column = document.createElement('div');
            const columnBody = document.createElement('div');
            const colTittleGroup = buttonBuilder(buttonTypes.columnTitleBtnGroup,
                                    'btn-antracite',
                                    'btn-size-medium',
                                    [boardId, columnId])

            columnBody.id = `board-${boardId}-column-${columnId}-body`
            columnBody.classList.add('card-body', 'column-body', 'px-2', 'py-2', "overflow-auto");
            columnBody.setAttribute('data-board-id', boardId);
            columnBody.setAttribute('data-column-id', columnId)
            columnBody.appendChild(colTittleGroup);

            column.id = `board-${boardId}-column-${columnId}`
            column.classList.add('card', 'text-light', 'bg-dark', 'bg-antracite', 'mx-1', 'my-1', 'status-column');
            column.setAttribute('aria-hidden', 'false');
            column.setAttribute('data-board-id', boardId);
            column.setAttribute('data-column-id', columnId)
            column.appendChild(columnBody)

            return column;

        case columnTypes.placeholderColumn:
            const placeholderColumn = columnBuilder(columnTypes.templateColumn, columnId, boardId)
            const titleWrapper = placeholderColumn.children[0].children[0].children[0]
            const settingsButton = placeholderColumn.children[0].children[0].children[1].children[0]
            const titlePlaceholder1 = document.createElement('span')
            const titlePlaceholder2 = document.createElement('span')

            titlePlaceholder1.classList.add('placeholder', 'col-6');
            titlePlaceholder2.classList.add('placeholder', 'col-3');

            settingsButton.classList.add('disabled')
            titleWrapper.classList.add('placeholder-wave')
            titleWrapper.appendChild(titlePlaceholder1)
            titleWrapper.append("\u00A0");
            titleWrapper.appendChild(titlePlaceholder2)

            return placeholderColumn;

        case columnTypes.loadedColumn:
            const loadedColumn = columnBuilder(columnTypes.templateColumn, columnId, boardId);
            const loadedTitleWrapper = loadedColumn.children[0].children[0].children[0];

            loadedTitleWrapper.innerHTML = name;

            return loadedColumn;
    }
}

function cardBuilder(type, cardId, columnId, boardId, name) {
    switch (type) {
        case cardTypes.templateCard:
            const card = document.createElement('div');
            const cardBody = document.createElement('div');
            const cardTittleGroup = buttonBuilder(buttonTypes.cardTitleBtnGroup,
                                    'btn-light',
                                    'btn-size-small',
                                    [boardId, columnId])

            cardBody.id = `board-${boardId}-column-${columnId}-card-${cardId}-body`
            cardBody.classList.add('card-body', 'px-2', 'py-2');
            cardBody.setAttribute('data-board-id', boardId);
            cardBody.setAttribute('data-column-id', columnId)
            cardBody.setAttribute('data-card-id', cardId)
            cardBody.appendChild(cardTittleGroup);

            card.id = `board-${boardId}-column-${columnId}-card-${cardId}`
            card.classList.add('card', 'text-dark', 'bg-light', 'mx-1', 'my-1', 'card-element');
            card.setAttribute('aria-hidden', 'false');
            card.setAttribute('data-board-id', boardId);
            card.setAttribute('data-column-id', columnId)
            card.setAttribute('data-card-id', cardId)
            card.appendChild(cardBody)

            return card;

        case cardTypes.placeholderCard:
            const placeholderCard = cardBuilder(cardTypes.templateCard, cardId, columnId, boardId)
            const titleWrapper = placeholderCard.children[0].children[0].children[0]
            const settingsButton = placeholderCard.children[0].children[0].children[1].children[0]
            const titlePlaceholder1 = document.createElement('span')
            const titlePlaceholder2 = document.createElement('span')

            titlePlaceholder1.classList.add('placeholder', 'col-6');
            titlePlaceholder2.classList.add('placeholder', 'col-3');

            settingsButton.classList.add('disabled')
            titleWrapper.classList.add('placeholder-wave')
            titleWrapper.appendChild(titlePlaceholder1)
            titleWrapper.append("\u00A0");
            titleWrapper.appendChild(titlePlaceholder2)

            return placeholderCard;

        case cardTypes.loadedCard:
            const loadedCard = cardBuilder(cardTypes.templateCard, cardId, columnId, boardId);
            const loadedTitleWrapper = loadedCard.children[0].children[0].children[0];

            loadedTitleWrapper.innerHTML = name;

            return loadedCard;
    }
}
