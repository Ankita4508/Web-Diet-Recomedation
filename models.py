# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class DietCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, default=1)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.JSON, nullable=False)

    def __repr__(self):
        return f'<DietCard {self.title}>'
