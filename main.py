from fastapi import FastAPI, Request, Depends, HTTPException, status
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from airtable import Airtable
import os
from typing import Dict, Any
import secrets
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Debug Airtable configuration
logger.info(f"Base ID: {os.getenv('AIRTABLE_BASE_ID')}")
logger.info(f"API Key: {os.getenv('AIRTABLE_API_KEY')[:10]}...")  # Only log first 10 chars for security

# Initialize FastAPI app
app = FastAPI(title="Drop Shipping Catalog")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize templates
templates = Jinja2Templates(directory="templates")

# Airtable Configuration
AIRTABLE_BASE_ID = os.getenv("AIRTABLE_BASE_ID", "appyz5uevIrdZayYc")
AIRTABLE_API_KEY = os.getenv("AIRTABLE_API_KEY", "pateg5rHiegeNUUKd.678f66aa4a45058f820d672f2067ca9f4ac9431fc447f8318f60d4fdf81a5c8d")
AIRTABLE_TABLE_NAME = os.getenv("AIRTABLE_TABLE_NAME", "Products")

# Log the actual values being used
logger.info(f"Using Base ID: {AIRTABLE_BASE_ID}")
logger.info(f"Using API Key: {AIRTABLE_API_KEY[:10]}...")
logger.info(f"Using Table Name: {AIRTABLE_TABLE_NAME}")

airtable = Airtable(AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, api_key=AIRTABLE_API_KEY)
# Security
security = HTTPBasic()
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "securepass123")

def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

@app.get("/")
async def home(request: Request):
    try:
        records = airtable.get_all()
        # Get unique categories for filter
        categories = set()
        for record in records:
            if "Category" in record["fields"]:
                categories.add(record["fields"]["Category"])
        return templates.TemplateResponse(
            "index.html",
            {"request": request, "products": records, "categories": sorted(list(categories))}
        )
    except Exception as e:
        logger.error(f"Error fetching products: {str(e)}")
        return templates.TemplateResponse(
            "index.html",
            {"request": request, "products": [], "categories": [], "error": "Error fetching products"}
        )

@app.get("/admin")
async def admin_panel(request: Request, username: str = Depends(verify_credentials)):
    try:
        records = airtable.get_all()
        return templates.TemplateResponse(
            "admin.html",
            {"request": request, "products": records, "username": username}
        )
    except Exception as e:
        logger.error(f"Error in admin panel: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/product/{product_id}")
async def product_detail(request: Request, product_id: str):
    try:
        product = airtable.get(product_id)
        return templates.TemplateResponse(
            "product.html",
            {"request": request, "product": product}
        )
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Product not found")

# API Endpoints for Product Management
@app.post("/api/products")
async def create_product(product: Dict[str, Any], username: str = Depends(verify_credentials)):
    try:
        logger.info(f"Creating product: {product}")
        if "fields" not in product:
            product = {"fields": product}
        record = airtable.insert(product["fields"])
        return JSONResponse(content=record, status_code=201)
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/products/{product_id}")
async def get_product(product_id: str, username: str = Depends(verify_credentials)):
    try:
        record = airtable.get(product_id)
        return JSONResponse(content=record)
    except Exception as e:
        logger.error(f"Error fetching product {product_id}: {str(e)}")
        raise HTTPException(status_code=404, detail="Product not found")

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product: Dict[str, Any], username: str = Depends(verify_credentials)):
    try:
        logger.info(f"Updating product {product_id}: {product}")
        if "fields" not in product:
            product = {"fields": product}
        record = airtable.update(product_id, product["fields"])
        return JSONResponse(content=record)
    except Exception as e:
        logger.error(f"Error updating product {product_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, username: str = Depends(verify_credentials)):
    try:
        logger.info(f"Deleting product {product_id}")
        record = airtable.delete(product_id)
        return JSONResponse(content=record)
    except Exception as e:
        logger.error(f"Error deleting product {product_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint for Render."""
    return {"status": "healthy"}
