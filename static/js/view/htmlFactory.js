export const htmlTemplates = {
    button: 0,
    board: 1,
    card: 2,
    textField: 3,
    // column: 4
}

export const buttonTypes = {
    newBoardBtn: "+New Board",
    submitBtn: "Submit"
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.button:
            return buttonBuilder
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        case htmlTemplates.textField:
            return textFieldBuilder
        // case htmlTemplates.column:
        //     return columnBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board, width) {
    let button_tag = document.createElement('button');
    let div_board_tag = document.createElement('div');
    let div_row_tag = document.createElement('div');

    button_tag.innerText = board.title;
    button_tag.classList.add('btn', 'btn-primary', 'board-title', `col-${width}`);
    button_tag.setAttribute('type', 'button');
    button_tag.id = `data-${board.id}`
    button_tag.setAttribute('data-board-id', `${board.id}`)
    button_tag.setAttribute('data-toggle',"collapse");
    button_tag.setAttribute('data-target',`#collapse${board.id}`);
    button_tag.setAttribute('aria-expanded', "false");
    button_tag.setAttribute('aria-controls',`collapse${board.id}`);

    div_board_tag.classList.add("collapse", "board-collapse");
    div_board_tag.id = `collapse${board.id}`;
    div_board_tag.setAttribute('data-board-id', board.id);

    div_row_tag.classList.add('row');
    div_row_tag.id = `data-${board.id}`
    div_row_tag.appendChild(button_tag);
    div_row_tag.appendChild(div_board_tag);

    return div_row_tag;
}

function cardBuilder(card) {
    let card_div = document.createElement('div');
    card_div.classList.add('card');
    card_div.setAttribute('data-card-id', card.id);
    card_div.innerText = card.title;
    return card_div;
}

function buttonBuilder(name, button_style, button_class) {
    let button_tag = document.createElement('button');
    button_tag.innerText = name;
    button_tag.classList.add('btn', button_style, button_class);

    switch (name) {
        case buttonTypes.newBoardBtn:
            button_tag.setAttribute('type', 'button');
            button_tag.classList.add('col-12')
            return button_tag;
        case buttonTypes.submitBtn:
            button_tag.classList.add('col-1')
            button_tag.setAttribute('type', 'submit');
            return button_tag;
    }
}

function textFieldBuilder(defaultText, formWidth, textWidth) {
    let formTag = document.createElement('form');
    let inputTag = document.createElement('input');
    formTag.id = 'changeTitleForm'
    formTag.classList.add('newBoardTitleForm', 'form-inline', `col-${formWidth}`)
    formTag.setAttribute('action', "")
    formTag.setAttribute('onsubmit', `return false`)
    inputTag.classList.add('form-control', `col-${textWidth}`);
    inputTag.setAttribute('type', 'text');
    inputTag.setAttribute('placeholder', defaultText);
    inputTag.id = 'newBoardTitle';

    formTag.appendChild(inputTag);

    return formTag;
}
//
// function columnBuilder(column) {
//     let column_div = document.createElement('div');
//     column_div.classList.add('column');
//     column_div.setAttribute('data-column-id', column.id);
//     column_div.innerText = column.title;
//     return column_div;
// }

