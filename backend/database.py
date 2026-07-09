from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker

db = SQLAlchemy()

DATABASE_URI = "sqlite:///videoclub.db"