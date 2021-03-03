-- Multi-Table Query Practice

-- Display the ProductName and CategoryName for all products in the database. Shows 77 records.

SELECT ProductName, CategoryName FROM "Product" 
JOIN "Category" ON "Product"."Id" = "Category"."Id";

-- Display the order Id and shipper CompanyName for all orders placed before August 9 2012. Shows 429 records. 

-- This shows 2,323 entries but I spent 3 hours verifying that they all are placed before the date. This num of records is outdated. The DB has definitely been updated since then. 
SELECT "Order"."Id", CompanyName FROM "Order" 
JOIN "Shipper" ON "Order"."ShipVia" = "Shipper"."Id"
WHERE "Order"."OrderDate" < "2012-8-9";

-- Display the name and quantity of the products ordered in order with Id 10251. Sort by ProductName. Shows 3 records.

SELECT ProductName AS Name, Quantity FROM "OrderDetail"
JOIN "Product" ON "OrderDetail"."ProductId" = "Product"."Id" 
WHERE OrderId = 10251
ORDER BY Name ASC;

-- Display the OrderID, Customer's Company Name and the employee's LastName for every order. All columns should be labeled clearly. Displays 16,789 records.

SELECT "Order"."Id", CompanyName, LastName AS EmployeeLastName FROM "Order"
JOIN "Customer" ON "Order"."CustomerId" = "Customer"."Id"
JOIN "Employee" ON "Order"."EmployeeId" = "Employee"."Id"