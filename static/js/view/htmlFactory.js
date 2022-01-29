export const htmlTemplates = {
    button: 0,
    board: 1,
    card: 2,
    rowForm: 3
}

export const buttonTypes = {
    newBoardBtn: "+Add New Board",
    submitBtn: "Submit",
    boardSettingsBtn: "Settings",
    showBoardBtn: "Show board"
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
    const buttonWrapper = document.createElement('div');
    const boardContent = document.createElement('div');

    const showBoardButton = buttonBuilder(buttonTypes.showBoardBtn,
                                        'btn-secondary',
                                        'board-title',
                                        boardData.id,
                                        boardData.title)

    const settingsButton = buttonBuilder(buttonTypes.boardSettingsBtn,
                                        'btn-secondary',
                                        'icon-size-medium',
                                        boardData.id)

    boardContent.id = `collapse${boardData.id}`;
    boardContent.classList.add("collapse", "board-collapse");
    boardContent.setAttribute('data-board-id', boardData.id);

    buttonWrapper.classList.add("btn-group", 'd-flex', 'bg-secondary');
    buttonWrapper.setAttribute('data-board-id', boardData.id);
    buttonWrapper.setAttribute( 'role',"group")
    buttonWrapper.appendChild(showBoardButton);
    buttonWrapper.appendChild(settingsButton);

    boardContainer.id = `board-container-${boardData.id}`
    boardContainer.classList.add('border-secondary', 'board-container', 'my-5')
    boardContainer.appendChild(buttonWrapper);
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
            button.innerText = buttonTypes.newBoardBtn;
            button.setAttribute('type', 'button');
            button.classList.add('col-12');
            return button;

        case buttonTypes.submitBtn:
            button.innerText = buttonTypes.submitBtn;
            button.setAttribute('data-parent-id', parentId);
            button.setAttribute('type', 'submit');
            return button;

        case buttonTypes.boardSettingsBtn:
            const icon = document.createElement('i');
            button.id = `board-settings-${parentId}`
            button.classList.add('bi', 'bi-gear-fill');
            button.setAttribute('data-parent-id', parentId);
            button.appendChild(icon);
            return button

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
