from flask import Flask, render_template, url_for, request, redirect, session, jsonify, make_response, Response
from dotenv import load_dotenv
from datetime import timedelta, datetime
from util import json_response
import bcrypt
import data_manager
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = "super secret key"
app.permanent_session_lifetime = timedelta(days=5)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


# TODO - remove this?
@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/data/")
@json_response
def get_board_data(board_id: int):
    """
    Get all columns, column order and cards
    :param board_id: id of the parent board
    """
    return queries.get_board_data(board_id)


@app.route("/api/boards/new", methods=["POST"])
def create_new_board():
    """
    New board creation
    """
    title = request.json['title']

    if title == "":
        return Response(status=422)
    else:
        return jsonify(queries.create_new_board(title))


@app.route("/api/columns/new", methods=["POST"])
def create_new_column():
    """
    New board creation
    """
    title = request.json['title']
    board_id = request.json['board_id']

    if title == "":
        return Response(status=422)
    else:
        return jsonify(queries.create_new_column(title, board_id))


@app.route("/api/card/new", methods=["POST"])
def create_new_card():
    """
    New card creation
    """
    title = request.json['title']
    board_id = request.json['board_id']
    column_id = request.json['column_id']

    if title == "":
        return Response(status=422)
    else:
        return jsonify(queries.create_new_card(title, board_id, column_id))


@app.route("/api/board/updateTitle", methods=["PUT"])
def update_board_title():
    """
    Updates board title
    """
    title = request.json['title']
    board_id = request.json['id']

    if title == "":
        return Response(status=422)
    else:
        queries.update_board_title(title, board_id)
        return Response(response=b'{"ok": "ok"}', status=200)


@app.route("/api/column/updateTitle", methods=["PUT"])
def update_column_title():
    """
    Updates board title
    """
    column_id = request.json['column_id']
    board_id = request.json['board_id']
    title = request.json['title']

    if title == "":
        return Response(status=422)
    else:
        data = queries.update_column_title(title, board_id, column_id)
        return data


@app.route("/api/card/updateTitle", methods=["PUT"])
def update_card_title():
    """
    Updates card title
    """
    card_id = request.json['card_id']
    title = request.json['title']

    if title == "":
        return Response(status=422)
    else:
        data = queries.update_card_title(title, card_id)
        return data


@app.route("/api/board/delete", methods=["DELETE"])
def delete_board():
    """
    Removes column from board
    """
    board_id = request.json['board_id']

    queries.delete_board(board_id)
    return Response(response=b'{"ok": "ok"}', status=200)


@app.route("/api/column/deleteColumn", methods=["PUT"])
def delete_column():
    """
    Removes column from board
    """
    column_id = request.json['column_id']
    board_id = request.json['board_id']

    queries.delete_column(board_id, column_id)
    return Response(response=b'{"ok": "ok"}', status=200)


@app.route("/api/card/deleteCard", methods=["DELETE"])
def delete_card():
    """
    Removes card from column
    """
    card_id = request.json['card_id']

    queries.delete_card(card_id)
    return Response(response=b'{"ok": "ok"}', status=200)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
