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

    const titleBtnGroup = buttonBuilder(buttonTypes.boardTitleBtnGroup,
                                        'secondary',
                                        'none',
                                        boardData.id,
                                        boardData.title)

    boardContent.id = `collapse${boardData.id}`;
    boardContent.classList.add("collapse", "board-collapse");
    boardContent.setAttribute('data-board-id', boardData.id);

    boardContainer.id = `board-container-${boardData.id}`
    boardContainer.classList.add('bg-secondary', 'border-secondary', 'board-container', 'my-5')
    boardContainer.appendChild(titleBtnGroup);
    boardContainer.appendChild(boardContent);

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

            listActionRename.classList.add("dropdown-item");
            listActionRename.href = "#";
            listActionRename.innerHTML = "Rename";

            listActionDelete.classList.add("dropdown-item");
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
    input.id = 'newBoardTitle';
    input.classList.add('form-control');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', defaultText);

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
