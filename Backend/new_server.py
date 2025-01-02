from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO
import json
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow CORS for all routes and origins
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow CORS for WebSocket connections

# Route to serve JSON files
@app.route('/json/<path:filename>')
def send_json(filename):
    return send_from_directory('json_files', filename)

# WebSocket connection events
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('request_json')
def handle_request_json(filename):
    # Load the JSON file and emit it to the client
    file_path = os.path.join('json_files', filename)
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)
        socketio.emit('json_data', data)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
