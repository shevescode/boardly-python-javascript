export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getBoardDataById: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/data/`);
        return response;
    },
    getCardsByBoardId: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/cards/`);
        return response;
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: async function (payload) {
        const response = await apiPost(`/api/boards/new`, payload);
        return response;
    },
    createNewColumn: async function (payload) {
        const response = await apiPost(`/api/columns/new`, payload);
        return response;
    },
    createNewCard: async function (payload) {
        const response = await apiPost(`/api/card/new`, payload);
        return response;
    },
    changeBoardName: async function (payload) {
        const response = await apiPut(`/api/board/updateTitle`, payload)
        return response
    },
    changeColumnName: async function (payload) {
        const response = await apiPut(`/api/column/updateTitle`, payload)
        return response
    },
    deleteBoard: async function (payload) {
        const response = await apiDelete(`/api/board/delete`, payload)
        return response
    },
    deleteColumn: async function (payload) {
        const response = await apiPut(`/api/column/deleteColumn`, payload)
        return response
    }
};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.status === 200) {
        return response.json();
    }
}

async function apiPost(url, payload) {
    let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 499) {
        console.error('Server received empty title!')
        return 'error'
    }
}

async function apiDelete(url, payload) {
    let response = await fetch(url, {
        method: "DELETE",
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 498) {
        return 'error: board not found in database'
    }
}

async function apiPut(url, payload) {
    let response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.status === 200) {
        return response.json();
    } else if (response.status === 499) {
        console.error('Server received empty title!')
        return 'error'
    }
}

