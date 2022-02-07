export let dataHandler = {
    getBoards: async function () {
        const response = await apiGet("/api/boards");
        return response;
    },
    getBoardDataById: async function (boardId) {
        const response = await apiGet(`/api/boards/${boardId}/data/`);
        return response;
    },
    createNewBoard: async function (payload) {
        const response = await apiPost(`/api/boards/new`, payload);
        logResponseStatus(response)
        return response;
    },
    createNewColumn: async function (payload) {
        const response = await apiPost(`/api/columns/new`, payload);
        logResponseStatus(response)
        return response;
    },
    createNewCard: async function (payload) {
        const response = await apiPost(`/api/card/new`, payload);
        logResponseStatus(response)
        return response;
    },
    changeBoardName: async function (payload) {
        const response = await apiPut(`/api/board/updateTitle`, payload)
        logResponseStatus(response)
        return response
    },
    changeColumnName: async function (payload) {
        const response = await apiPut(`/api/column/updateTitle`, payload)
        logResponseStatus(response)
        return response
    },
    changeCardName: async function (payload) {
        const response = await apiPut(`/api/card/updateTitle`, payload)
        logResponseStatus(response)
        return response
    },
    changeCardPosition: async function (payload) {
        const response = await apiPut(`/api/card/updatePosition`, payload)
        return response
    },
    deleteBoard: async function (payload) {
        const response = await apiDelete(`/api/board/delete`, payload)
        return response
    },
    deleteColumn: async function (payload) {
        const response = await apiPut(`/api/column/deleteColumn`, payload)
        return response
    },
    deleteCard: async function (payload) {
        const response = await apiDelete(`/api/card/deleteCard`, payload)
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
    }
}

function logResponseStatus(response){
    if (response['status'] === 'empty_title') {
        console.error('Server received empty title!');
    } else if (response['status'] === 'id_change') {
        console.info('Default column name change -> generated new column.');
    }
}

