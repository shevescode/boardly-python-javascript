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
    user_id = None
    if 'user_id' in session:
        user_id = session['user_id']
    """
    All the boards
    """
    return queries.get_boards(user_id)


@app.route("/api/boards/<int:board_id>/data/")
def get_board_data(board_id: int):
    """
    Get all columns, column order and cards
    :param board_id: id of the parent board
    """
    if user_has_board_access(board_id):
        return jsonify(queries.get_board_data(board_id))
    else:
        return jsonify({"status": "access_denied"}), 403


@app.route("/api/boards/new", methods=["POST"])
@json_response
def create_new_board():
    """
    New board creation
    """
    title = request.json['title']

    user_id = None
    if 'user_id' in session:
        user_id = session['user_id']

    if title == "":
        return {'status': 'empty_title'}
    elif user_id:
        new_board_data = queries.create_new_board(title)
        queries.make_board_private(new_board_data['id'], user_id)
        new_board_data['private'] = True
        return new_board_data
    else:
        return queries.create_new_board(title)


@app.route("/api/columns/new", methods=["POST"])
def create_new_column():
    """
    New board creation
    """
    title = request.json['title']
    board_id = request.json['board_id']

    if title == "":
        return jsonify({'status': 'empty_title'})
    else:
        if user_has_board_access(board_id):
            return jsonify(queries.create_new_column(title, board_id))
        else:
            return jsonify({"status": "access_denied"}), 403


@app.route("/api/card/new", methods=["POST"])
def create_new_card():
    """
    New card creation
    """
    title = request.json['title']
    board_id = request.json['board_id']
    column_id = request.json['column_id']

    if title == "":
        return {'status': 'empty_title'}
    else:
        if user_has_board_access(board_id):
            return jsonify(queries.create_new_card(title, board_id, column_id))
        else:
            return jsonify({"status": "access_denied"}), 403


@app.route("/api/board/updateTitle", methods=["PUT"])
def update_board_title():
    """
    Updates board title
    """
    title = request.json['title']
    board_id = request.json['id']

    if title == "":
        return jsonify({'status': 'empty_title'})
    else:
        if user_has_board_access(board_id):
            return jsonify(queries.update_board_title(title, board_id))
        else:
            return jsonify({"status": "access_denied"}), 403


@app.route("/api/column/updateTitle", methods=["PUT"])
def update_column_title():
    """
    Updates board title
    """
    column_id = request.json['column_id']
    board_id = request.json['board_id']
    title = request.json['title']

    if title == "":
        return jsonify({'status': 'empty_title'})
    else:
        if user_has_board_access(board_id):
            return jsonify(queries.update_column_title(title, board_id, column_id))
        else:
            return jsonify({"status": "access_denied"}), 403


@app.route("/api/card/updateTitle", methods=["PUT"])
def update_card_title():
    """
    Updates card title
    """
    board_id = request.json['board_id']
    card_id = request.json['card_id']
    title = request.json['title']

    if title == "":
        return jsonify({'status': 'empty_title'})
    else:
        if user_has_board_access(board_id):
            return jsonify(queries.update_card_title(title, board_id, card_id))
        else:
            return jsonify({"status": "access_denied"}), 403


@app.route("/api/card/updatePosition", methods=["PUT"])
def update_card_position():
    """
    Updates card title
    """
    board_id = request.json['boardId']
    new_column_id = request.json['new_column_id']
    old_column_id = request.json['old_column_id']
    card_id = request.json['card_id']
    new_card_order = request.json['new_card_order']
    old_card_order = request.json['old_card_order']

    if user_has_board_access(board_id):
        return jsonify(queries.update_card_position(board_id, new_column_id, old_column_id,
                                                    card_id, new_card_order, old_card_order))
    else:
        return jsonify({"status": "access_denied"}), 403


@app.route("/api/board/delete", methods=["DELETE"])
def delete_board():
    """
    Removes column from board
    """
    board_id = request.json['board_id']

    if user_has_board_access(board_id):
        return jsonify(queries.delete_board(board_id))
    else:
        return jsonify({"status": "access_denied"}), 403


@app.route("/api/column/deleteColumn", methods=["PUT"])
def delete_column():
    """
    Removes column from board
    """
    board_id = request.json['board_id']
    column_id = request.json['column_id']

    if user_has_board_access(board_id):
        return jsonify(queries.delete_column(board_id, column_id))
    else:
        return jsonify({"status": "access_denied"}), 403


@app.route("/api/card/deleteCard", methods=["DELETE"])
def delete_card():
    """
    Removes card from column
    """
    board_id = request.json['board_id']
    card_id = request.json['card_id']

    if user_has_board_access(board_id):
        return jsonify(queries.delete_card(board_id, card_id))
    else:
        return jsonify({"status": "access_denied"}), 403


def user_has_board_access(board_id):
    user_id = None
    if 'user_id' in session:
        user_id = session['user_id']

    return queries.get_user_board_access(board_id, user_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
