from functools import wraps
from flask import jsonify


def json_response(func):
    """
    Converts the returned dictionary into a JSON response
    :param func:
    :return:
    """
    @wraps(func)
    def decorated_function(*args, **kwargs):
        return jsonify(func(*args, **kwargs))

    return decorated_function


def convert_to_dict_list(real_dict_array: list) -> list:
    new_list = []
    for element in real_dict_array:
        new_dict = {}
        for key in element:
            new_dict[key] = element[key]
        new_list.append(new_dict)

    return new_list
