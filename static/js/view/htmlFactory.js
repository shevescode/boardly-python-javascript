export const htmlTemplates = {
    button: 0,
    board: 1,
    card: 2,
    rowForm: 3
}

export const buttonTypes = {
    newBoardBtn: "+Add New Board",
    submitBtn: "Submit",
    settingsBtn: "Settings",
    showBoardBtn: "Show board",
    boardTitleBtnGroup: "Board Title Group"
}

export const columnTypes = {
    templateColumn: "Column template",
    loadedColumn: "Column with data",
    placeholderColumn: "Column with placeholders"
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.button:
            return buttonBuilder
        case htmlTemplates.board:
            return boardBuilder
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
                                        'none',
                                        boardData.id,
                                        boardData.title)

    boardColumnContainer.classList.add("d-flex", "overflow-auto", 'board-column-container')

    boardContent.id = `collapse${boardData.id}`;
    boardContent.classList.add("collapse", "board-collapse");
    boardContent.setAttribute('data-board-id', boardData.id);
    boardContent.appendChild(boardColumnContainer);

    for (const i in boardData['statuses']){
        const statusColumnId = boardData['statuses'][i]
        boardColumnContainer.appendChild(columnBuilder(columnTypes.placeholderColumn, statusColumnId, boardData.id));
    }


    boardContainer.id = `board-container-${boardData.id}`
    boardContainer.classList.add('bg-secondary', 'border-secondary', 'board-container', 'my-5')
    boardContainer.appendChild(titleBtnGroup);
    boardContainer.appendChild(boardContent);
    boardContainer.setAttribute('data-board-id', boardData.id);

    return boardContainer;
}

function cardBuilder(card) {
    const card_div = document.createElement('div');
    card_div.classList.add('card');
    card_div.setAttribute('data-card-id', card.id);
    card_div.innerText = card.title;
    return card_div;
}

function buttonBuilder(type, buttonStyle, buttonClass, parentId, name) {
    const button = document.createElement('button');
    button.classList.add('btn', buttonStyle, buttonClass);

    switch (type) {
        case buttonTypes.newBoardBtn:
            button.id = 'add-new-board-button';
            button.innerText = buttonTypes.newBoardBtn;
            button.setAttribute('type', 'button');
            button.classList.add('col-12');
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

            dropDownWrapper.classList.add('dropdown');
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

        default:
            console.error("Undefined button: " + type)
            return () => { return "" }
    }
}

function rowFormBuilder(defaultText, btnStyle, parent) {
    const form = document.createElement('form');
    const inputWrapper = document.createElement('div');
    const input = document.createElement('input');
    const submitBtn = buttonBuilder(buttonTypes.submitBtn,
                                    `${btnStyle}`,
                                    'submit-row-form-button',
                                    parent.id);
    input.id = `new-title-${parent.id}`;
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', defaultText);
    input.setAttribute('value', defaultText);

    form.id = 'changeTitleForm';
    form.classList.add('newBoardTitleForm');
    form.setAttribute('action', "");
    form.setAttribute('onsubmit', `return false`);

    inputWrapper.classList.add('input-group');
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(submitBtn);
    form.appendChild(inputWrapper);

    return form;
}

function columnBuilder(type, statusColumnId, boardId, name) {
    switch (type) {
        case columnTypes.templateColumn:
            const column = document.createElement('div');
            const columnBody = document.createElement('div');
            const tittleGroup = document.createElement('div')

            const settingsButton = buttonBuilder(buttonTypes.settingsBtn,
                                    'btn-antracite',
                                    'btn-size-small',
                                    `board-${boardId}-column-${statusColumnId}-title`)

            settingsButton.children[0].classList.add('disabled')

            tittleGroup.classList.add("btn-group", 'd-flex');
            tittleGroup.setAttribute('data-board-id', boardId);
            tittleGroup.setAttribute('data-status-column-id', statusColumnId)
            tittleGroup.setAttribute('role', "group")
            tittleGroup.appendChild(settingsButton);

            columnBody.id = `status-column-${statusColumnId}-body`
            columnBody.classList.add('card-body', 'column-body', 'px-2', 'py-2', "overflow-auto");
            columnBody.setAttribute('data-board-id', boardId);
            columnBody.setAttribute('data-status-column-id', statusColumnId)
            columnBody.appendChild(tittleGroup);

            column.id = `status-column-${statusColumnId}`
            column.classList.add('card', 'text-light', 'bg-dark', 'bg-antracite', 'mx-1', 'my-1', 'status-column');
            column.setAttribute('aria-hidden', 'false');
            column.setAttribute('data-board-id', boardId);
            column.setAttribute('data-status-column-id', statusColumnId)
            column.appendChild(columnBody)

            return column;

        case columnTypes.placeholderColumn:
            const templateColumn = columnBuilder(columnTypes.templateColumn, statusColumnId, boardId)
            const titleWrapper = document.createElement('div')
            const titlePlaceholder1 = document.createElement('span')
            const titlePlaceholder2 = document.createElement('span')

            titlePlaceholder1.classList.add('placeholder', 'col-6');
            titlePlaceholder2.classList.add('placeholder', 'col-3');

            titleWrapper.id = `board-${boardId}-column-${statusColumnId}-title`
            titleWrapper.classList.add('card-text', 'column-title', 'placeholder-wave', 'h5', 'flex-grow-1', 'hstack', 'mb-0');
            titleWrapper.setAttribute('data-board-id', boardId);
            titleWrapper.setAttribute('data-status-column-id', statusColumnId)
            titleWrapper.appendChild(titlePlaceholder1)
            titleWrapper.append("\u00A0");
            titleWrapper.appendChild(titlePlaceholder2)

            templateColumn.children[0].children[0].insertBefore(titleWrapper, templateColumn.children[0].children[0].children[0])

            return templateColumn;
    }
}

function boardColumnPlaceholderBuilder(statusColumnId){

}

function boardCardPlaceholderBuilder(){

}
