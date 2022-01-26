export const htmlTemplates = {
    addBoardBtn: 0,
    board: 1,
    card: 2
}

export function htmlFactory(template) {
    switch (template) {
        case htmlTemplates.addBoardBtn:
            return addBoardButtonBuilder
        case htmlTemplates.board:
            return boardBuilder
        case htmlTemplates.card:
            return cardBuilder
        default:
            console.error("Undefined template: " + template)
            return () => { return "" }
    }
}

function boardBuilder(board) {
    let button_tag = document.createElement('button');
    let div_board_tag = document.createElement('div');
    let div_row_tag = document.createElement('div');

    button_tag.innerText = board.title;
    button_tag.classList.add('btn', 'btn-primary', 'board-title');
    button_tag.setAttribute('type', 'button');
    button_tag.setAttribute('data-board-id', board.id);
    button_tag.setAttribute('data-bs-toggle',"collapse");
    button_tag.setAttribute('data-bs-target',`#collapse${board.id}`);
    button_tag.setAttribute('aria-expanded', "false");
    button_tag.setAttribute('aria-controls',`#collapse${board.id}`);

    div_board_tag.classList.add("collapse", "board-collapse");
    div_board_tag.id = `collapse${board.id}`;
    div_board_tag.setAttribute('data-board-id', board.id);

    div_row_tag.classList.add('row');
    div_row_tag.setAttribute('data-row-id', board.id);
    div_row_tag.appendChild(button_tag);
    div_row_tag.appendChild(div_board_tag);

    return div_row_tag;
    // return `<div class="board-container">
    //             <div class="board" data-board-id=${board.id}>${board.title}</div>
    //             <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
    //         </div>`;
}

function cardBuilder(card) {
    let card_div = document.createElement('div');
    card_div.classList.add('card');
    card_div.setAttribute('data-card-id', card.id);
    card_div.innerText = card.title;
    return card_div;
}

function addBoardButtonBuilder() {
    let button_tag = document.createElement('button');
    button_tag.innerText = '+New Board'
    button_tag.classList.add('btn', 'btn-primary', 'add-board');
    button_tag.setAttribute('type', 'button');
    return button_tag;
}

