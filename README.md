# Food Traceability API

This project is a Django REST Framework application designed to provide a simple and cost-effective food traceability solution for small-scale farmers. It allows for the creation of products and the tracking of their journey from farm to consumer via a scannable QR code system.

## The Problem

In local food markets, it's often difficult for consumers to know the origin and handling process of the products they buy. This project aims to solve that by providing an easy-to-use digital ledger that links a physical product to its story.

## Core Features

* **Product Registration:** Users can add new products to the system with details like name, origin, and farmer information.
* **Traceability Records:** Log entries can be added to each product to track its journey (e.g., "Harvested," "Packaged," "Shipped to Market").
* **RESTful API:** A secure and well-structured API to manage product and traceability data.


## Technologies Used

* **Backend:** Python, Django REST Framework
* **Database:** SQLite3
* **API Endpoints:**
    * `/api/products/` - For creating and listing products.
    * `/api/traces/` - For adding and viewing traceability information for a product.
* **Authentication:** Implemented using [e.g., JWT (JSON Web Tokens)] for secure API access.

## How to Run This Project

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Mallarb20000/food_traceability.git](https://github.com/Mallarb20000/food_traceability.git)
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd food_traceability
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Run database migrations:**
    ```bash
    python manage.py migrate
    ```
5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```
The API will then be accessible at `http://127.0.0.1:8000`.
