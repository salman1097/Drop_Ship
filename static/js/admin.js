// Admin Panel JavaScript

// Handle Add Product Form Submission
async function handleProductSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa("admin:securepass123")}`
            },
            body: JSON.stringify({
                fields: data
            })
        });
        
        if (response.ok) {
            alert("Product added successfully!");
            window.location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error adding product: ${errorData.detail || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error adding product. Please try again.");
    }
}

// Handle Delete Product
async function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Basic ${btoa("admin:securepass123")}`
            }
        });
        
        if (response.ok) {
            alert("Product deleted successfully!");
            window.location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error deleting product: ${errorData.detail || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error deleting product. Please try again.");
    }
}

// Handle Edit Product
async function editProduct(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`, {
            headers: {
                "Authorization": `Basic ${btoa("admin:securepass123")}`
            }
        });
        
        if (response.ok) {
            const product = await response.json();
            // Populate edit form
            document.getElementById("editProductId").value = productId;
            document.getElementById("editProductName").value = product.fields.Name || "";
            document.getElementById("editProductCategory").value = product.fields.Category || "";
            document.getElementById("editProductPrice").value = product.fields.Price || "";
            document.getElementById("editProductDescription").value = product.fields.Description || "";
            document.getElementById("editProductImage").value = product.fields.Image || "";
            
            // Show edit modal
            const editModal = new bootstrap.Modal(document.getElementById("editProductModal"));
            editModal.show();
        } else {
            const errorData = await response.json();
            alert(`Error loading product: ${errorData.detail || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error loading product details. Please try again.");
    }
}

// Handle Edit Form Submission
async function handleEditSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const productId = document.getElementById("editProductId").value;
    
    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa("admin:securepass123")}`
            },
            body: JSON.stringify({
                fields: data
            })
        });
        
        if (response.ok) {
            alert("Product updated successfully!");
            window.location.reload();
        } else {
            const errorData = await response.json();
            alert(`Error updating product: ${errorData.detail || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error updating product. Please try again.");
    }
}

// Initialize event listeners when document is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Add form submit handlers
    const addForm = document.getElementById("productForm");
    if (addForm) {
        addForm.addEventListener("submit", handleProductSubmit);
    }
    
    const editForm = document.getElementById("editProductForm");
    if (editForm) {
        editForm.addEventListener("submit", handleEditSubmit);
    }
});
