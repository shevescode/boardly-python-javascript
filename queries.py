import data_manager

_DEFAULT_COLUMNS = "{1, 2, 3, 4}"


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ORDER BY id DESC 
        ;
        """
    )


def create_new_board(title):
    new_board_id = data_manager.execute_insert(
        """
        INSERT INTO boards (title, statuses)
        VALUES (%(title)s, %(def_cols)s)
        RETURNING id
        """
        , {"title": title, "def_cols": _DEFAULT_COLUMNS})

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE id = %(new_board_id)s
        """
        , {"new_board_id": new_board_id})


def create_new_column(title, board_id):
    new_column_id = data_manager.execute_insert(
        """
        INSERT INTO statuses (title)
        VALUES (%(title)s)
        RETURNING id
        """
        , {"title": title})

    data_manager.execute_update(
        """
        UPDATE boards
        SET statuses = array_append(statuses, %(new_column_id)s)
        WHERE id=%(board_id)s
        """
        , {"new_column_id": new_column_id, "board_id": board_id})

    return data_manager.execute_select(
        """
        SELECT * FROM statuses
        WHERE id = %(new_column_id)s
        """
        , {"new_column_id": new_column_id})


def update_board_title(title, board_id):
    data_manager.execute_update(
        """
        UPDATE boards
        SET title = (%(title)s)
        WHERE id=%(id)s
        """
        , {"title": title, "id": board_id})


def get_board_column_titles(board_column_order):
    return data_manager.execute_select(
        """
        SELECT *
        FROM statuses
        WHERE id = ANY(%(board_column_order)s::int[])
        """
        , {"board_column_order": board_column_order})


def get_board_column_order(board_id):
    return data_manager.execute_select(
        """
        SELECT statuses 
        FROM boards WHERE id = %(board_id)s
        """
        , {"board_id": board_id})


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_board_data(board_id):
    board_column_ids = get_board_column_order(board_id)[0]['statuses']
    board_column_titles = get_board_column_titles(board_column_ids)
    board_cards = get_cards_for_board(board_id)

    return [board_column_ids, board_column_titles, board_cards]
