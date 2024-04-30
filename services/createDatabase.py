import sqlite3

# Connect to SQLite database
db = sqlite3.connect('TaskTitan.sqlite')

# Create tables if they do not exist
db.execute('''
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT,
    password TEXT
)
''')

db.execute('''
CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE,
    status TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
)
''')

db.execute('''
CREATE TABLE IF NOT EXISTS notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    task_id INTEGER,
    title TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(task_id)
)
''')

# Cursor to execute SQL commands
cursor = db.cursor()

# Insert sample users
cursor.execute('''
    INSERT INTO users(username, email, password)
    VALUES('john_doe', 'john.doe@example.com', 'securepassword123')
''')

cursor.execute('''
    INSERT INTO users(username, email, password)
    VALUES('jane_doe', 'jane.doe@example.com', 'anothersecure123')
''')

# Insert sample tasks
cursor.execute('''
    INSERT INTO tasks(user_id, title, description, due_date, status)
    VALUES((SELECT user_id FROM users WHERE username='john_doe'), 'Task 1', 'Description for Task 1', '2024-05-01', 'Pending')
''')

cursor.execute('''
    INSERT INTO tasks(user_id, title, description, due_date, status)
    VALUES((SELECT user_id FROM users WHERE username='jane_doe'), 'Task 2', 'Description for Task 2', '2024-05-02', 'Completed')
''')

# Insert sample notes
cursor.execute('''
    INSERT INTO notes(user_id, task_id, title, content)
    VALUES((SELECT user_id FROM users WHERE username='john_doe'), (SELECT task_id FROM tasks WHERE title='Task 1'), 'Note 1', 'Content for Note 1')
''')

# Commit changes and close the connection
db.commit()
db.close()
