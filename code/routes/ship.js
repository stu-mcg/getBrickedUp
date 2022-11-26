const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

	// TODO: Get order id
    let orderId =req.query.orderId;
          
	// TODO: Check if valid order id
    
    res.write("<h1>Shipment information</h1>");
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            

            let getId = "SELECT orderId FROM ordersummary WHERE orderId=@orderId";
            let checkId = await pool.request().input("orderId", orderId).query(getId);
            
            if(checkId.recordset.length == 0){
                res.write("<h2>Invalid ID</h2>");
                res.end();
                return
            }
           // TODO: Start a transaction
            const transaction = new sql.Transaction(pool);



            await transaction.begin()
            
            
            // sql to retrieve quantities and productid
            let getInventory= "SELECT p.productId as pid, p.quantity as q1, i.quantity as q2 FROM orderproduct as p, productInventory as i WHERE p.orderId = @orderId AND p.productId = i.productId AND i.warehouseId = 1";
            let query = await new sql.Request(transaction).input("orderId", orderId).query(getInventory);
            
            //shipment creation.
            let description = "OrderId: "+ orderId;
            let createShip = "INSERT INTO shipment (shipmentDate, shipmentDesc, warehouseId) VALUES (GETDATE(), @description, 1)";

            await new sql.Request(transaction).input("description", description).query(createShip);

            for(i=0; i<query.recordset.length;i++){
                let orderAmount = query.recordset[i].q1;
                let invAmount = query.recordset[i].q2;
                let pid = query.recordset[i].pid;
                if(orderAmount <= invAmount){
                    let newQ = invAmount - orderAmount;
                    res.write(`<h2>Order Product: ${pid} Quantity: ${orderAmount} Previous inventory: ${invAmount} New inventory: ${newQ}</h2>`);
                    let removal = "UPDATE productInventory SET quantity = @newQ WHERE productId= @productId";
                    await new sql.Request(transaction).input("newQ", newQ).input("productId", pid).query(removal);

                    //remove from inv
                }else{
                    transaction.rollback()
                    res.write(`<h1>Shipment not done. Insufficient inventory for product id: ${pid}</h2>`)
                    res.end()
                    return
                    
                }
            }
            transaction.commit()
            res.end()
            

	   	// TODO: Retrieve all items in order with given id
	   	// TODO: Create a new shipment record.
	   	// TODO: For each item verify sufficient quantity available in warehouse 1.
	   	// TODO: If any item does not have sufficient inventory, cancel transaction and rollback. Otherwise, update inventory for each item.
	   		
 
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
