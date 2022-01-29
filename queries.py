import data_manager

_DEFAULT_COLUMNS = "{1, 2, 3, 4}"


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


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


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


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
