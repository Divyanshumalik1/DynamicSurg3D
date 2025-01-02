import os
import time
from flask import Flask, render_template
from flask_socketio import SocketIO
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)
socketio = SocketIO(app)

# Set the folder to monitor
MONITORED_FOLDER = "/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/resultsjson"

class MyHandler(FileSystemEventHandler):
    def on_created(self, event):
        # Check if the event is a file creation
        if not event.is_directory:
            file_name = os.path.basename(event.src_path)
            print(f'New file created: {file_name}')
            socketio.emit('file_created', {'file_name': file_name})

# Initialize the watchdog observer
observer = Observer()
event_handler = MyHandler()
observer.schedule(event_handler, MONITORED_FOLDER, recursive=False)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Start the observer
    observer.start()
    try:
        # Start the Flask application
        socketio.run(app, host='0.0.0.0', port=5002)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
