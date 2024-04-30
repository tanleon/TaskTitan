import SQLite from 'react-native-sqlite-storage';
import { SERVER_URL } from '../config';

function openCallback() {
  console.log('Database OPENED');
}

function errorCallback(err) {
  console.error('SQL Error: ' + err);
}

let db = SQLite.openDatabase(
  {name: 'TaskTitan.sqlite', createFromLocation: '~TaskTitan.sqlite'},
  openCallback,
  errorCallback,
);

function handleResponse(response) {
  if (!response.ok) {
    return response.json().then(data => {
      throw new Error(`HTTP ${response.status}: ${data.message}`); // Improved error message
    });
  }
  return response.json();
}

export function signInUser(email, password) {
  return fetch(`${SERVER_URL}/api/signin`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password }),
  })
  .then(handleResponse);
}

export function insertUser(username, email, password) {
  return fetch(`${SERVER_URL}/api/users`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, email, password }),
  })
  .then(handleResponse);
}

export async function updateProfile(userData) {
  try {
      const response = await fetch(`${SERVER_URL}/api/updateProfile`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          return await response.json();
      } else {
          throw new Error("Received non-JSON response from server.");
      }
  } catch (error) {
      console.error('Error updating profile:', error);
      throw error; // Rethrow after logging to handle it in the UI
  }
}


export function getTasks(user_id) {
  return fetch(`${SERVER_URL}/api/tasks?user_id=${user_id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then(handleResponse)
  .catch(error => {
    console.error('Error fetching tasks for user ID ' + user_id + ':', error);
    throw error; // Rethrow after logging
  });
}

export function getTask(task_id) {
  return fetch(`${SERVER_URL}/api/tasks/${task_id}`, {
    method: 'GET',
  })
  .then(handleResponse);
}

export function addTask(user_id, title, description, dueDate, status = 'Pending') {
  const task = { user_id, title, description, due_date: dueDate, status };
  return fetch(`${SERVER_URL}/api/tasks`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(task),
  })
  .then(handleResponse);
}

export function updateTask(task_id, updates) {
  return fetch(`${SERVER_URL}/api/tasks/${task_id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updates),
  })
  .then(handleResponse);
}

export function deleteTask(task_id) {
  return fetch(`${SERVER_URL}/api/tasks/${task_id}`, {
    method: 'DELETE'
  })
  .then(handleResponse); // Ensure that deletion success also uses handleResponse
}

// Updated addNote function to accept an object with all required parameters
export function addNote(noteDetails) {
  return fetch(`${SERVER_URL}/api/notes`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(noteDetails)  // Passing the entire object directly
  })
  .then(handleResponse);
}

export function getNotes(user_id) {
  return fetch(`${SERVER_URL}/api/notes/${user_id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then(handleResponse);
}

export function getNotesForTask(task_id) {
  return fetch(`${SERVER_URL}/api/notes/task/${task_id}`, {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
  })
  .then(handleResponse)
  .catch(error => {
      console.error('Error fetching notes for task ID ' + task_id + ':', error);
      throw error; // Rethrow after logging
  });
}


export function getNoteById(noteId) {
  return fetch(`${SERVER_URL}/api/notes/${noteId}`, {
    method: 'GET',
  })
  .then(handleResponse);
}

export function updateNote(noteId, updates) {
  return fetch(`${SERVER_URL}/api/notes/${noteId}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updates),
  })
  .then(handleResponse);
}

export function deleteNote(noteId) {
  return fetch(`${SERVER_URL}/api/notes/${noteId}`, {
    method: 'DELETE'
  })
  .then(handleResponse); // Ensure that deletion success also uses handleResponse
}

export function deleteAllNotesForTask(task_id) {
  return fetch(`${SERVER_URL}/api/notes/delete-all/${task_id}`, {
      method: 'DELETE',
      headers: {
          'Content-Type': 'application/json',
      }
  })
  .then(handleResponse);
}

