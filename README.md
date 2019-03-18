# Inventory Management
## Prerequisite
    Express
    MongoDB
    Export DB named inventory and create two collections named Category and Products.
    A Category has following fields :
    {
        category_id: Number, 
        category_name: String, 
        child_categories: [String]
    }

    A product has follwing fields:
    {
        product_id: Number,
        product_name: String,
        product_category:[String]
        product_price: Number
    }