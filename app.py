from flask import Flask, render_template, jsonify
import requests
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/fetch_data', methods=['GET'])
def fetch_data():
    response = requests.get('http://localhost:5000/api/processed_data')
    data = response.json()
    return jsonify(data)

@app.route('/get_images', methods=['GET'])
def get_images():
    media_dir = os.path.join(app.static_folder, 'media')
    images = [f for f in os.listdir(media_dir) if f.endswith('.jpg')]
    return jsonify(images)

if __name__ == '__main__':
    app.run(port=5001, debug=True)
