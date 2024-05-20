from flask import Flask, jsonify, send_from_directory, abort
import os
import json
from process_json import process_data

app = Flask(__name__)

# Путь к каталогам
DIETS_DIR = 'diets'
CATALOG_DIR = 'catalog'

# Список файлов в каталоге catalog
catalog_files = [
    "BakeryProducts.json",
    "DairyProducts.json",
    "Dressings.json",
    "FishAndSeafood.json",
    "Fruits.json",
    "HerbsAndSpices.json",
    "MeatProducts.json",
    "Sweets.json",
    "Vegetables.json"
]

@app.route('/api/data', methods=['GET'])
def get_data():
    """Возвращает содержимое файла data.json из каталога diets."""
    data_file_path = os.path.join(DIETS_DIR, 'data.json')
    try:
        with open(data_file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        abort(404, description="File not found")
    except json.JSONDecodeError:
        abort(400, description="Error decoding JSON")

@app.route('/api/catalog', methods=['GET'])
def list_catalog():
    """Возвращает список JSON файлов в каталоге catalog."""
    return jsonify(catalog_files)

@app.route('/api/catalog/<filename>', methods=['GET'])
def get_catalog_file(filename):
    """Возвращает содержимое указанного JSON файла из каталога catalog."""
    if not filename.endswith('.json'):
        abort(400, description="Invalid file type")
    try:
        return send_from_directory(CATALOG_DIR, filename)
    except FileNotFoundError:
        abort(404, description="File not found")

@app.route('/api/catalog/all', methods=['GET'])
def get_all_catalog_files():
    """Возвращает содержимое всех JSON файлов из каталога catalog."""
    all_data = {}
    for file in catalog_files:
        file_path = os.path.join(CATALOG_DIR, file)
        if not os.path.exists(file_path):
            abort(404, description=f"File {file} not found at path {file_path}")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                file_data = json.load(f)
                all_data[file] = file_data
        except FileNotFoundError:
            abort(404, description=f"File {file} not found")
        except json.JSONDecodeError:
            abort(400, description=f"Error decoding JSON from file {file}")
    return jsonify(all_data)

@app.route('/api/processed_data', methods=['GET'])
def get_processed_data():
    """Возвращает обработанные данные диеты и каталога."""
    data_file = 'diets/data.json'
    catalog_dir = 'catalog'
    
    matched_products = process_data(data_file, catalog_dir)
    
    return jsonify(matched_products)

if __name__ == '__main__':
    app.run(debug=True)
