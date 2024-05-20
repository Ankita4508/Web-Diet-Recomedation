import os
import json
import difflib

def fetch_json_from_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise FileNotFoundError(f"File {file_path} not found")
    except json.JSONDecodeError:
        raise ValueError(f"Error decoding JSON from file {file_path}")

def extract_diet_products_by_day(data):
    diet_products_by_day = {}

    for day, meals in data.items():
        if day not in diet_products_by_day:
            diet_products_by_day[day] = []
        for meal, details in meals.items():
            for dish, dish_details in details.items():
                for ingredient, ingredient_details in dish_details['ingredients'].items():
                    product_info = {
                        "name": ingredient,
                        "type": ingredient_details['type of product']
                    }
                    diet_products_by_day[day].append(product_info)
    
    return diet_products_by_day

def extract_catalog_products(data):
    catalog_products = {}

    for file_name, category_data in data.items():
        category = category_data['category']
        products = category_data['products']
        
        if category not in catalog_products:
            catalog_products[category] = []
        
        for product in products:
            catalog_products[category].append(product)
    
    return catalog_products

def create_diet_vectors(diet_products_by_day):
    diet_vectors = {}
    for day, products in diet_products_by_day.items():
        diet_vectors[day] = products
    return diet_vectors

def create_catalog_vectors(catalog_products):
    catalog_vectors = {}
    for category, products in catalog_products.items():
        catalog_vectors[category] = []
        for product in products:
            vector = f"{product['name']} {product['description']} {product['rating']}"
            catalog_vectors[category].append(vector)
    return catalog_vectors

def find_best_match(product, category, catalog_vectors):
    if category not in catalog_vectors:
        return None
    matches = difflib.get_close_matches(product, catalog_vectors[category], n=1, cutoff=0.1)
    return matches[0] if matches else None

def create_matched_products(diet_vectors, catalog_vectors):
    matched_products = {}
    for day, products in diet_vectors.items():
        matched_products[day] = []
        for product_info in products:
            product_name = product_info["name"]
            product_type = product_info["type"]
            best_match = find_best_match(product_name, product_type.capitalize(), catalog_vectors)
            if best_match:
                matched_products[day].append(best_match)
            else:
                # Если не найдено совпадение, добавляем первый товар из категории
                if product_type.capitalize() in catalog_vectors and catalog_vectors[product_type.capitalize()]:
                    matched_products[day].append(catalog_vectors[product_type.capitalize()][0])
    return matched_products

def process_data(data_file, catalog_dir):
    diet_data = fetch_json_from_file(data_file)
    catalog_data = {}

    for file_name in os.listdir(catalog_dir):
        if file_name.endswith('.json'):
            file_path = os.path.join(catalog_dir, file_name)
            catalog_data[file_name] = fetch_json_from_file(file_path)

    diet_products_by_day = extract_diet_products_by_day(diet_data)
    catalog_products = extract_catalog_products(catalog_data)
    
    diet_vectors = create_diet_vectors(diet_products_by_day)
    catalog_vectors = create_catalog_vectors(catalog_products)
    
    matched_products = create_matched_products(diet_vectors, catalog_vectors)
    
    return matched_products
