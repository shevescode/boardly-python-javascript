from flask import jsonify
from util import convert_to_dict_list
import data_manager

_DEFAULT_COLUMNS = "{1, 2, 3, 4}"
_DEFAULT_COLUMNS_ARRAY = [1, 2, 3, 4]


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


def create_new_card(title, board_id, column_id):
    last_card_index = data_manager.execute_select(
        """
        SELECT card_order
        FROM cards
        WHERE board_id = %(board_id)s AND status_id = %(column_id)s
        ORDER BY card_order DESC 
        LIMIT 1
        """
        , {"board_id": board_id, "column_id": column_id}, False)

    if last_card_index:
        last_card_index = last_card_index['card_order']
    else:
        last_card_index = 0

    new_card_id = data_manager.execute_insert(
        """
        INSERT INTO cards (title, board_id, status_id, card_order)
        VALUES (%(title)s, %(board_id)s, %(column_id)s, %(card_order)s)
        RETURNING id
        """
        , {"title": title, "board_id": board_id, "column_id": column_id, "card_order": last_card_index + 1})

    return {"id": new_card_id, "board_id": board_id, "status_id": column_id, "title": title,
            "card_order": last_card_index}


def update_board_title(title, board_id):
    data_manager.execute_update(
        """
        UPDATE boards
        SET title = (%(title)s)
        WHERE id=%(id)s
        """
        , {"title": title, "id": board_id})


def update_column_title(title, board_id, column_id):
    if int(column_id) in _DEFAULT_COLUMNS_ARRAY:
        new_id = data_manager.execute_insert(
            """
            INSERT INTO statuses (title)
            VALUES (%(title)s)
            RETURNING id
            """
            , {"title": title})

        board_columns = data_manager.execute_update(
            """
            UPDATE boards
            SET statuses = array_replace(statuses, %(column_id)s, %(new_id)s)
            WHERE id=%(board_id)s
            RETURNING statuses
            """
            , {"column_id": column_id, "new_id": new_id, "board_id": board_id}, fetchone=True)['statuses']

        updated_cards = data_manager.execute_update(
            """
            WITH updated AS (
            UPDATE cards
            SET status_id = %(new_id)s
            WHERE board_id=%(board_id)s AND status_id = %(column_id)s
            RETURNING *)
            SELECT * 
            FROM updated 
            ORDER BY card_order   
            """
            , {"column_id": column_id, "new_id": new_id, "board_id": board_id}, fetchall=True)

        cards = convert_to_dict_list(updated_cards)
        position = board_columns.index(new_id)
        data = {'column_id': new_id, 'position': position, 'cards': cards}
        return jsonify(data)

    else:
        data_manager.execute_update(
            """
            UPDATE statuses
            SET title = (%(title)s)
            WHERE id=%(column_id)s
            """
            , {"title": title, "column_id": column_id})

        return {"status": "ok"}


def update_card_title(title, card_id):
    data_manager.execute_update(
        """
        UPDATE cards
        SET title = (%(title)s)
        WHERE id=%(card_id)s
        """
        , {"title": title, "card_id": card_id})

    return {"status": "ok"}


def update_card_position(board_id, new_column_id, old_column_id, card_id, new_card_order, old_card_order):
    data_manager.execute_update(
        """
        UPDATE cards
        SET card_order = card_order+1
        WHERE board_id=%(board_id)s AND status_id=%(new_column_id)s AND card_order>=%(new_card_order)s;
        UPDATE cards
        SET card_order = card_order-1
        WHERE board_id=%(board_id)s AND status_id=%(old_column_id)s AND card_order>%(old_card_order)s;
        UPDATE cards
        SET card_order = %(new_card_order)s, status_id = %(new_column_id)s
        WHERE id = %(card_id)s
        """
        , {"board_id": board_id, "new_column_id": new_column_id, "old_column_id": old_column_id, "card_id": card_id,
           "new_card_order": new_card_order, "old_card_order": old_card_order})

    return {"status": "ok"}


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
        ORDER BY card_order
        """
        , {"board_id": board_id})

    return matching_cards


def get_board_data(board_id):
    board_column_ids = get_board_column_order(board_id)[0]['statuses']
    board_column_titles = get_board_column_titles(board_column_ids)
    board_cards = get_cards_for_board(board_id)

    return [board_column_ids, board_column_titles, board_cards]


def delete_board(board_id):
    column_ids = data_manager.execute_select(
        """
        SELECT statuses FROM boards
        WHERE id = %(board_id)s;
        """
        , {"board_id": board_id})[0]['statuses']

    data_manager.execute_update(
        """
        DELETE FROM cards
        WHERE board_id=%(board_id)s;
        DELETE FROM boards
        WHERE id = %(board_id)s;
        """
        , {"board_id": board_id})

    column_ids = list(set(column_ids) - set(_DEFAULT_COLUMNS_ARRAY))
    data_manager.execute_delete(
        """
        DELETE FROM statuses
        WHERE id = ANY(%(column_ids)s::int[])
        """
        , {"column_ids": column_ids})


def delete_column(board_id, column_id):
    data_manager.execute_update(
        """
        UPDATE boards
        SET statuses = array_remove(statuses, %(column_id)s)
        WHERE id=%(board_id)s;
        DELETE FROM cards
        WHERE board_id=%(board_id)s AND status_id=%(column_id)s;
        """
        , {"board_id": board_id, "column_id": column_id})
    if not (int(column_id) in _DEFAULT_COLUMNS_ARRAY):

        data_manager.execute_delete(
            """
            DELETE FROM statuses
            WHERE id=%(column_id)s;
            """
            , {"board_id": board_id, "column_id": column_id})


def delete_card(card_id):
    data_manager.execute_delete(
            """
            DELETE FROM cards
            WHERE id=%(card_id)s;
            """
            , {"card_id": card_id})

