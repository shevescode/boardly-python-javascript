export const htmlTemplates = {
    board: 1,
    card: 2
}

export function htmlFactory(template) {
    switch (template) {
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
    let details_tag = document.createElement('details');
    let summary_tag = document.createElement('summary');
    details_tag.classList.add('toggle-board')
    details_tag.setAttribute('data-board-id', board.id);
    summary_tag.innerText = board.title;
    details_tag.appendChild(summary_tag);
    return details_tag;
    // return `<div class="board-container">
    //             <div class="board" data-board-id=${board.id}>${board.title}</div>
    //             <button class="toggle-board-button" data-board-id="${board.id}">Show Cards</button>
    //         </div>`;
}

function cardBuilder(card) {
    let card_div = document.createElement('div');
    card_div.classList.add('card')
    card_div.setAttribute('data-card-id', card.id);
    card_div.innerText = card.title;
    return card_div;
}

