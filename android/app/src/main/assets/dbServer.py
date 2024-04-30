import sqlite3
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from argparse import ArgumentParser

DB = 'TaskTitan.sqlite'

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey!'
CORS(app)  # Enable CORS for all routes
socketio = SocketIO(app, async_mode='eventlet')

class Database:
    def __enter__(self):
        self.conn = sqlite3.connect(DB)
        self.conn.row_factory = sqlite3.Row  # Enable dictionary cursor
        return self.conn.cursor()

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.commit()
        self.conn.close()

@socketio.on('feedback')
def handle_feedback(message):
    print(f"Received feedback from TaskTitan app: {message}")
    response_message = "Feedback received successfully. Thank you for your input!"
    emit('feedback_response', response_message)

@app.route('/api/signin', methods=['POST'])
def signin():
    if not request.json or 'email' not in request.json or 'password' not in request.json:
        abort(400, "Missing email or password")
    with Database() as cursor:
        cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (request.json['email'], request.json['password']))
        user = cursor.fetchone()
    if not user:
        abort(401, "Unauthorized")
    return jsonify(dict(user)), 200

@app.route('/api/users', methods=['POST'])
def insert_user():
    if not request.json or not all(key in request.json for key in ['username', 'email', 'password']):
        abort(400, "Missing user details")
    with Database() as cursor:
        cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
                       (request.json['username'], request.json['email'], request.json['password']))
        user_id = cursor.lastrowid
    return jsonify({'id': user_id}), 201

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id')
    if not user_id:
        abort(400, "User ID is required")
    with Database() as cursor:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,))
        tasks = cursor.fetchall()
    return jsonify([dict(task) for task in tasks]), 200

@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    with Database() as cursor:
        cursor.execute('SELECT * FROM tasks WHERE task_id = ?', (task_id,))
        task = cursor.fetchone()
    if not task:
        abort(404)
    return jsonify(dict(task)), 200

@app.route('/api/tasks', methods=['POST'])
def add_task():
    if not request.json or not all(key in request.json for key in ['user_id', 'title', 'description', 'due_date', 'status']):
        abort(400, "Missing task details")
    with Database() as cursor:
        cursor.execute('INSERT INTO tasks (user_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?)', 
                       (request.json['user_id'], request.json['title'], request.json['description'], request.json['due_date'], request.json['status']))
        task_id = cursor.lastrowid
    return jsonify({'id': task_id}), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    if not request.json:
        abort(400, "Missing update data")
    updates = request.json
    with Database() as cursor:
        cursor.execute('''UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), 
                        due_date = COALESCE(?, due_date), status = COALESCE(?, status) WHERE task_id = ?''',
                       (updates.get('title'), updates.get('description'), updates.get('due_date'), updates.get('status'), task_id))
    return jsonify({'message': 'Task updated successfully'}), 200

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    with Database() as cursor:
        cursor.execute('DELETE FROM tasks WHERE task_id = ?', (task_id,))
    return jsonify({'message': 'Task deleted successfully'}), 200

@app.route('/api/notes', methods=['POST'])
def add_note():
    if not request.json or not all(key in request.json for key in ['user_id', 'task_id', 'title', 'content']):
        abort(400, "Missing note details")
    with Database() as cursor:
        cursor.execute('INSERT INTO notes (user_id, task_id, title, content) VALUES (?, ?, ?, ?)', 
                       (request.json['user_id'], request.json['task_id'], request.json['title'], request.json['content']))
        note_id = cursor.lastrowid
    return jsonify({'id': note_id}), 201

@app.route('/api/notes/task/<int:task_id>', methods=['GET'])
def get_notes_for_task(task_id):
    if not task_id:
        abort(404, "Task ID is required")
    with Database() as cursor:
        cursor.execute('SELECT * FROM notes WHERE task_id = ?', (task_id,))
        notes = cursor.fetchall()
    return jsonify([dict(note) for note in notes]), 200

@app.route('/api/notes/<int:note_id>', methods=['PUT'])
def update_note(note_id):
    if not request.json:
        abort(400, "Missing update data for note")
    updates = request.json
    with Database() as cursor:
        cursor.execute('UPDATE notes SET title = COALESCE(?, title), content = COALESCE(?, content) WHERE note_id = ?', 
                       (updates.get('title'), updates.get('content'), note_id))
    return jsonify({'message': 'Note updated successfully'}), 200

@app.route('/api/notes/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    with Database() as cursor:
        cursor.execute('DELETE FROM notes WHERE note_id = ?', (note_id,))
    return jsonify({'message': 'Note deleted successfully'}), 200

@app.route('/api/notes/delete-all/<int:task_id>', methods=['DELETE'])
def delete_all_notes_for_task(task_id):
    with Database() as cursor:
        cursor.execute('DELETE FROM notes WHERE task_id = ?', (task_id,))
    return jsonify({'message': 'All notes deleted successfully'}), 200

@app.route('/api/notes/<int:user_id>', methods=['GET'])
def get_notes_for_user(user_id):
    with Database() as cursor:
        cursor.execute('SELECT * FROM notes WHERE user_id = ?', (user_id,))
        notes = cursor.fetchall()
    return jsonify([dict(note) for note in notes]), 200

@app.route('/api/tasks/<int:user_id>', methods=['GET'])
def get_tasks_for_user(user_id):
    with Database() as cursor:
        cursor.execute('SELECT * FROM tasks WHERE user_id = ?', (user_id,))
        tasks = cursor.fetchall()
    return jsonify([dict(task) for task in tasks]), 200

@app.route('/api/updateProfile', methods=['PUT'])
def update_profile():
    data = request.get_json()
    if not data or not all(key in data for key in ['user_id', 'username', 'password']):
        abort(400, 'Missing user_id, username, or password')

    user_id = data['user_id']
    username = data['username']
    password = data['password']  # This should be hashed in production

    with Database() as cursor:
        cursor.execute('''
            UPDATE users SET username = ?, password = ?
            WHERE user_id = ?
        ''', (username, password, user_id))

    if cursor.rowcount == 0:
        abort(404, 'User not found')

    return jsonify({'message': 'Profile updated successfully'}), 200


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    socketio.run(app, host='0.0.0.0', port=args.port, debug=True)
