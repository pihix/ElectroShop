from app.routers import products, categories, users, auth, accounts, commandes, admin
from fastapi import FastAPI


description = """
Welcome to the E-commerce API! 

This API provides a comprehensive set of functionalities for managing your e-commerce platform.

Key features include:

- **Crud**
	- Create, Read, Update, and Delete endpoints.
- **Search**
	- Find specific information with parameters and pagination.
- **Auth**
	- Verify user/system identity.
	- Secure with Access and Refresh tokens.
- **Permission**
	- Assign roles with specific permissions.
	- Different access levels for User/Admin.
- **Validation**
	- Ensure accurate and secure input data.


For any inquiries, please contact:

* Github: https://github.com/ismailsaid2001
"""


app = FastAPI(
    description=description,
    title="E-commerce API for electronic products",
    version="1.0.0",
    contact={
        "name": "Ismail Said",
        "url": "https://github.com/",
    },
    swagger_ui_parameters={
        "syntaxHighlight.theme": "monokai",
        "layout": "BaseLayout",
        "filter": True,
        "tryItOutEnabled": True,
        "onComplete": "Ok"
    },
)


app.include_router(products.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(accounts.router)
app.include_router(auth.router)
app.include_router(commandes.router)
app.include_router(admin.router)
