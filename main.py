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


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/new", methods=["POST"])
def create_new_board():
    """
    New board creation
    """
    title = request.json['title']

    if title == "":
        return Response(status=499)
    else:
        return jsonify(queries.create_new_board(title))


@app.route("/api/boards/updateTitle", methods=["PUT"])
def update_board_title():
    """
    Updates board title
    """
    title = request.json['title']
    board_id = request.json['id']

    if title == "":
        return Response(status=499)
    else:
        queries.update_board_title(title, board_id)
        return Response(response=b'{"ok": "ok"}', status=200)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
