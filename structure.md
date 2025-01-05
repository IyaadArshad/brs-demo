Assuming I am a computer parts store and I need a BRS for things like ordering parts, managing inventory, and tracking sales etc.

There is a database with tables:
- Parts
- Orders
- Sellers
- Customers
- Sales

Each table has fields- 

parts:
- Name (string) (no validation logic)
- Price (float) (no validation logic)
- Quantity (int) (no validation logic)

orders:
- OrderID (int) (no duplicates)
- SellerID (int) (relational key to Sellers)
- PartID (int) (relational key to Parts)
- Quantity (int) (no validation logic)
- Date (date) (no validation logic)
- Price (float) (no validation logic)

sellers:
- SellerID (int) (no duplicates)
- Name (string) (no validation logic)
- Address (string) (no validation logic)
- Phone (string) (no validation logic)

customers:
- CustomerID (int) (no duplicates)
- Name (string) (no validation logic)
- Address (string) (no validation logic)
- Phone (string) (no validation logic)

sales:
- SaleID (int) (no duplicates)
- PartID (int) (relational key to Parts)
- CustomerID (int) (relational key to Customers)
- Quantity (int) (no validation logic)
- Date (date) (no validation logic)
- Price (float) (no validation logic)