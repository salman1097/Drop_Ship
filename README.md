# Drop Shipping Catalog

A modern e-commerce catalog for drop shipping products built with FastAPI and Airtable.

## Repository Information

This repository (Drop_Ship) contains a complete e-commerce catalog solution with modern UI design.

## Features

- Clean, modern UI inspired by Lululemon's design
- Mobile-responsive layout
- Product catalog with filtering capabilities
- Admin panel for product management
- Airtable integration for content management

## Local Development

1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file with your Airtable credentials:
   ```
   AIRTABLE_API_KEY=your_api_key
   AIRTABLE_BASE_ID=your_base_id
   AIRTABLE_TABLE_NAME=Products
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   ```
4. Run the development server:
   ```
   uvicorn main:app --reload
   ```
5. Visit http://localhost:8000 in your browser

## Deployment to Render

1. Create a new account on [Render](https://render.com) if you don't have one
2. Create a new Web Service
3. Connect your GitHub repository
4. Configure the service with these settings:
   - **Name**: drop-shipping-catalog (or your preferred name)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - AIRTABLE_API_KEY
   - AIRTABLE_BASE_ID
   - AIRTABLE_TABLE_NAME
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
6. Click "Create Web Service"

Render will automatically deploy your application and provide a URL to access it.

## Maintaining Your Application

### Updating Content

All product content is managed through Airtable. Log in to your Airtable account to add, edit, or remove products.

### Updating the Code

1. Make changes to your local repository
2. Commit and push to GitHub
3. Render will automatically redeploy your application

## License

MIT
