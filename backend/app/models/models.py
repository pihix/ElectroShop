from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Float, ARRAY, Enum, DateTime
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False, unique=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_active = Column(Boolean, server_default="True", nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)

    # New column for role
    role = Column(Enum("admin", "user", name="user_roles"), nullable=False, server_default="user")

    # Relationship with commandes (orders)
    commandes = relationship("Commande", back_populates="user")

    # Relationship many-to-many with products (via gérer)
    # Un utilisateur peut gérer plusieurs produits (si admin)
    produits_geres = relationship("Product", back_populates="gestionnaire", foreign_keys="Product.gestionnaire_id")


class Commande(Base):
    __tablename__ = "commandes"

    id = Column(Integer, primary_key=True, nullable=False, unique=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    date_commande = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)
    statut = Column(Enum("en_attente", "confirmee", "expediee", "livree", "annulee", name="statut_commande"), 
                   nullable=False, server_default="en_attente")
    total_amount = Column(Float, nullable=False, default=0.0)

    # Relationship with user
    user = relationship("User", back_populates="commandes")

    # Relationship with ligne commandes
    lignes_commande = relationship("LigneCommande", back_populates="commande")


class LigneCommande(Base):
    __tablename__ = "lignes_commande"

    id = Column(Integer, primary_key=True, nullable=False, unique=True, autoincrement=True)
    commande_id = Column(Integer, ForeignKey("commandes.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    prix_unitaire = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    # Relationship with commande and product
    commande = relationship("Commande", back_populates="lignes_commande")
    product = relationship("Product", back_populates="lignes_commande")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, nullable=False, unique=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)

    # Relationship with products (un produit appartient à une catégorie)
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, nullable=False, unique=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)  # Changed to Float for better precision
    discount_percentage = Column(Float, nullable=False, default=0.0)
    rating = Column(Float, nullable=False, default=0.0)
    stock = Column(Integer, nullable=False, default=0)
    brand = Column(String, nullable=False)
    thumbnail = Column(String, nullable=False)
    images = Column(ARRAY(String), nullable=False)
    is_published = Column(Boolean, server_default="True", nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text("NOW()"), nullable=False)

    # Relationship with category (un produit appartient à une catégorie)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    category = relationship("Category", back_populates="products")

    # Relationship with gestionnaire (un utilisateur peut gérer plusieurs produits)
    gestionnaire_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    gestionnaire = relationship("User", back_populates="produits_geres", foreign_keys=[gestionnaire_id])

    # Relationship with lignes commande (un produit peut être dans plusieurs commandes)
    lignes_commande = relationship("LigneCommande", back_populates="product")
