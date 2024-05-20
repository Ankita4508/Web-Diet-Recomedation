from flask import Flask, render_template, jsonify
import requests
import os

# app.py
from flask import Flask, render_template, jsonify, request
from models import db, DietCard
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.before_request
def create_tables():
    db.create_all()

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

@app.route('/add_diet', methods=['POST'])
def add_diet():
    data = request.json
    new_diet = DietCard(title=data['title'], content=data['content'])
    db.session.add(new_diet)
    db.session.commit()
    return jsonify({'message': 'Diet card added successfully', 'id': new_diet.id})

@app.route('/get_diets', methods=['GET'])
def get_diets():
    diets = DietCard.query.order_by(DietCard.id).all()  # Сортировка по id
    return jsonify([{'id': diet.id, 'title': diet.title, 'content': diet.content} for diet in diets])

@app.route('/update_diet/<int:diet_id>', methods=['PUT'])
def update_diet(diet_id):
    data = request.json
    diet = DietCard.query.get(diet_id)
    if diet:
        diet.title = data['title']
        db.session.commit()
        return jsonify({'success': True, 'message': 'Diet card updated successfully'})
    else:
        return jsonify({'success': False, 'message': 'Diet card not found'}), 404


@app.route('/delete_diet/<int:diet_id>', methods=['DELETE'])
def delete_diet(diet_id):
    diet = DietCard.query.get(diet_id)
    if diet:
        db.session.delete(diet)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Diet card deleted successfully'})
    else:
        return jsonify({'success': False, 'message': 'Diet card not found'}), 404


if __name__ == '__main__':
    app.run(port=5001, debug=True)


