/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
const path = require ('path')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));

// Connecting our CSS to the main hbs: referenced from https://stackoverflow.com/questions/46116175/how-to-add-stylescss-and-js-to-handlebar-files

PORT = 51598;


// Database
var db = require("./database/db-connector.js");

// Handlebars
var exphbs = require('express-handlebars');
const { query } = require('express');
app.engine('.hbs', exphbs.engine({
    extname: ".hbs"
}));
app.set('view engine', '.hbs');

/*
    ROUTES for getting pages
*/
app.get("/", (req,res)=> {
    let queryCustomers = "Select * from Customers"
    db.pool.query(queryCustomers, function(error, rows, fields) {
        res.render('index.hbs', {data: rows})
    })
})

app.get("/customer", (req,res)=> {
    // console.dir(req.body)
    let queryCustomers = "Select customerID, email as Email, firstName as 'First_Name', lastName as 'Last_Name', phone as 'Phone' from Customers"
    // console.log(queryCustomers)
    db.pool.query(queryCustomers, function(error, rows, fields) {
        res.render('customer.hbs', {data: rows})
        // console.log(rows)
    })
})

// USES DYNAMIC DROPDOWN
// Referenced from: how to implement dynamic dropdown menus:
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
app.get("/product", (req,res) => {
    let data = req.body
    let queryProducts = "Select * from Products"
    // db.pool.query (queryProducts, function (error, rows, fields) {
    //     res.render ('products.hbs', {data: rows})
    // })

    let queryConsoles = `SELECT * from Consoles;`;
    let queryVideoGame = `SELECT * from Video_Games;`;
    // console.log(data)
    // console.log(query1)
    // console.log(queryConsoles)

    // ADDS THE CONSOLE ID NAME FOR THE DROPDOWN MENU
    db.pool.query(queryProducts, (error,rows) => {
        let productsTable = rows;
        // console.log(productsTable)
        // console.log(productsTable)
        // console.log(`rows: ${consoleTag}`)
        // console.dir(rows)
       

        db.pool.query(queryConsoles, (error, rows) => {
            let consoleName = rows;

            let consoleNameMap = {}
            consoleName.map(names => {
                let consoleid = parseInt(names.consoleID);
                // console.log(consoleNameMap)
                consoleNameMap[consoleid] = names['name'];
                // console.log(names)

            })

            db.pool.query(queryVideoGame, (error,rows) => {
                let gameName = rows;
                // console.log(gameName)
                
                // Create the videogame object variable
                let videoGameMap = {}
                gameName.map(names => {

                    // Get the INT values for the videogame ID for mapping use
                    let videogameid = parseInt(names.videogameID);
                    // console.log(videogameid)

                    videoGameMap[videogameid] = names['title']
                    // console.log(`testing ${videoGameMap[videogameid]}`)
                })
                return res.render('products', {data: productsTable, consoleName: consoleName, gameName: gameName})
            })

            
        })
    })
})


app.get("/videogame", (req,res) => {
    let queryVideogame = "SELECT * FROM Video_Games"
    db.pool.query (queryVideogame, function (error, rows, fields) {
        res.render('videogame.hbs', {data: rows})
    })
})

app.get("/console", (req,res) => {
    let queryConsole = "SELECT * FROM Consoles"
    db.pool.query(queryConsole, function(error, rows, fields) {
        res.render("console.hbs", {data:rows})
    })
})

app.get ("/invoiceproduct", (req,res) => {
    let data= req.body
    let queryInvoiceproduct = "SELECT IP.invoiceProductID,IP.invoiceID,P.productID,COALESCE(VG.title, CO.name) AS productNameOrConsoleName FROM Invoices_has_Products IP JOIN Products P ON IP.productID = P.productID LEFT JOIN Video_Games VG ON P.videogameID = VG.videogameID LEFT JOIN Consoles CO ON P.consoleID = CO.consoleID;"
    let query1 = "SELECT P.productID, COALESCE(C.name, VG.title) AS consoleOrGameName FROM Products P LEFT JOIN Consoles C ON P.consoleID = C.consoleID LEFT JOIN Video_Games VG ON P.videogameID = VG.videogameID;"
    let query3="SELECT invoiceID FROM Invoices;"
    db.pool.query(queryInvoiceproduct, (error, rows) => {
        let iptable=rows;
        let productnameMap={}
        db.pool.query(query1, (error,rows)=>{
            let productname = rows;
            productname.map(names=>{
                let productid = parseInt(names.productID);
                productnameMap[productid]=names['name'];
            })
            db.pool.query(query3,(error,rows)=>{
                let invoiceTable = rows
                return res.render('invoiceproduct',{data:iptable, productname: productname, invoiceTable:invoiceTable})
            })
                    
        })
        
    })
})

app.get('/invoice', (req,res)=> {

    let data = req.body
    let queryInvoice = "SELECT Invoices.invoiceID, Customers.customerID, CONCAT(Customers.firstName,' ',Customers.lastName) as 'Name', Invoices.orderDate, Invoices.totalPrice FROM Invoices LEFT JOIN Customers on Invoices.customerID=Customers.customerID;"


    let queryCustomer = `SELECT * from Customers;`


    // ADDS THE CONSOLE ID NAME FOR THE DROPDOWN MENU
    db.pool.query(queryInvoice, (error,rows) => {
        let invoiceTable = rows;

       

        db.pool.query(queryCustomer, (error, rows) => {
            
            let customerName = rows;
            
            let customerNameMap = {}
            customerName.map(names => {
                let customerid = parseInt(names.customerID);
                 //console.log(consoleNameMap)
                customerNameMap[customerid] = names['firstName'];
                // console.log(names)
            })
            return res.render('invoice', {data: invoiceTable, customerName: customerName})
            // NOT SURE IF NEEDED. ADDS AN EXTRA COLUMN TO THE QUERY
            // consoleTag = consoleTag.map(consoles => {
            //     return Object.assign(consoles, {name: consoleNameMap[consoles.name]})
            // })
        })
    })
})


// EXTRA // PRIVACY POLICY AND TERMS OF SERVICE
app.get("/privacy-policy", (req,res) => {
    res.render('privacy-policy')
})

app.get('/terms-of-service', (req,res) => {
    res.render('terms-of-service')
})



// /////////////////////////////////////////////////////////////////////////////////
// CUSTOMER ADD, DELETE, EDIT
// /////////////////////////////////////////////////////////////////////////////////

// ///////////////////////
// ADDING CUSTOMER
// ///////////////////////
app.post ('/add-customer', (req,res) => {
    let data = req.body;
    // console.log(data)
    // console.dir(data)

    // If phone number is not an int, change NaN to NULL value
    let phone = parseInt(data.phone)
    if (isNaN(phone)) {
        console.log(phone)
        phone = "NULL"
    }


    queryCustomer = `INSERT INTO Customers (email, firstName, lastName, phone) VALUES ('${data["input-email"]}','${data["input-firstname"]}', '${data["input-lastname"]}', '${data["input-phone"]}')`;
    db.pool.query(queryCustomer, (error, rows, fields) => { 
        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            // If there was no error, perform a SELECT * on bsg_people
            queryCustomer2 = `SELECT * from Customers;`;
            db.pool.query(queryCustomer2, function(error, rows, fields) {
                
                // If there was an error on the second query, send a 400
                // console.log(rows[2])
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.redirect("/customer")
                }
            })
        }
    })
})

// ///////////////////////
// EDIT CUSTOMER
// ///////////////////////
app.put('/update-customer', function(req,res,next){
    let data = req.body;
    
    let customer_ID = parseInt(data.customerID);
    let emailAddress = data.email;
    let first_Name = data.firstName;
    let last_Name = data.lastName;
    let phoneNum = data.phone;
    
    
    let queryUpdateCustomer = `UPDATE Customers SET email="${emailAddress}", firstName="${first_Name}", lastName="${last_Name}", phone="${phoneNum}" WHERE customerID = ${customer_ID};`;
    let selectCustomer = `SELECT * FROM Customers WHERE customerID = ?`
    
        // Run the 1st query
        db.pool.query(queryUpdateCustomer, [customer_ID, emailAddress,first_Name,last_Name, phoneNum], function(error, rows, fields){
            if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
    
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectCustomer, [customer_ID], function(error, rows, fields) {
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
    })}); 

// ///////////////////////
// DELETE CUSTOMER
// ///////////////////////
app.delete('/delete-customer', function(req,res,next){    
    
    // console.logging for debugging. Goal was to try and get the id# from the customerID and parsing the # properly to get the int value. 
    
    // console.log("Deleting ID")                                                            
    let data = req.body;
    // console.log(req.body['id'])
    // console.log(`this is data: ${data}`)
    let customerID = data['id']
    // console.log(`here is customerID: ${data['id']}`)
    let deleteCustomer = `delete from Customers where customerID = ?`;
    
    
          // Run the 1st query
          db.pool.query(deleteCustomer, [customerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomer, [customerID], function(error, rows, fields) {
          
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
  })});



// /////////////////////////////////////////////////////////////////////
// VIDEO GAME ADD, DELETE, EDIT
// ////////////////////////////////////////////////////////////////////

app.post("/add-videogame", (req,res) => {
    let data = req.body

    queryVideoGame = `INSERT INTO Video_Games (title, genre, releaseDate, description) 
    VALUES ('${data["input-title"]}', '${data["input-genre"]}', '${data["input-releasedate"]}', '${data["input-description"]}');`

    db.pool.query(queryVideoGame, (error, rows, fields) => {
        if (error) {
            console.log(400)
            res.sendStatus(400)
        }
        else {
            queryVideoGame2 = `Select videogameID, title, genre, DATE_FORMAT(releaseDate, "%d-%m-%y") AS releaseDate from Video_Games`
            db.pool.query(queryVideoGame2, (error, rows, fields) => {
                if (error) {
                    console.log(400)
                    res.sendStatus(400)
                }
                else {
                    res.redirect("/videogame")
                }
            })
        }
    })
})
// ///////////////////////
// DELETE VIDEOGAME
// ///////////////////////
app.delete("/delete-videogame", (req,res,next) => {
    let data = req.body
    let videogameID = data['id']
    // console.log(videogameID)
    let deleteVideoGame = `delete from Video_Games where videogameID = ?`

    db.pool.query(deleteVideoGame, [videogameID], (error, rows, fields) => {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            db.pool.query(deleteVideoGame, [videogameID], (error, rows, fields) => {
                if (error) {
                    console.log(error)
                }
                else {
                    res.sendStatus(204)
                }
            })
        }
    })
})
// ///////////////////////
// UPDATE VIDEOGAME
// ///////////////////////
app.put("/update-videogame", (req,res) => {
    let data = req.body
    // console.log(data)

    let videogameID = data['videogameID'];
    // console.log(`ID ${videogameID}`)
    let title = data.title
    // console.log(title)
    let genre = data.genre
    let releaseDate = data.releaseDate
    let description = data.description

    let queryVideoGame = `UPDATE Video_Games SET title = "${title}", genre ="${genre}", releaseDate = "${releaseDate}", description = "${description}" where videogameID = ${videogameID};`;
    let selectVideoGame = `Select videogameID, title, genre, DATE_FORMAT(releaseDate, "%d-%m-%y") AS releaseDate from Video_Games where videogameID = ${videogameID}`
    
    db.pool.query(queryVideoGame, [videogameID, title, genre, releaseDate, description], (error, rows) => {
        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else {
            db.pool.query(selectVideoGame, [videogameID], (error, rows) => {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.send(rows)
                }
            })
        }
    } )
})


// ///////////////////////////////////////////////////////////////////////////
// INVOICE ADD, DELETE, EDIT 
// ///////////////////////////////////////////////////////////////////////////

app.post("/add-invoice", (req,res) => {
    let data = req.body
    
    queryInvoice = `INSERT INTO Invoices (customerID, orderDate, totalPrice) VALUES ('${data["input-customerid"]}','${data["input-date"]}', '${data["input-price"]}');`
    db.pool.query(queryInvoice, (error, rows, fields) => {
        if (error) {
            console.log(400)
            res.sendStatus(400)
        }
        else {
            queryInvoice2 = `Select * from Invoices;`
            db.pool.query(queryInvoice2, (error, rows, fields) => {
                if (error) {
                    console.log(400)
                    res.sendStatus(400)
                }
                else {
                    res.redirect("/invoice")
                }
            })
        }
    })
})


// ///////////////////////
// DELETE INVOICE
// ///////////////////////
app.delete("/delete-invoice", function(req,res,next) {
    let data = req.body
    let invoiceID = data['id']
    // console.log(consoleID)
    let deleteInvoice = `delete from Invoices where invoiceID = ?`;
    let selectInvoice = `SELECT * from Invoices where invoiceID = ?`;

    db.pool.query(deleteInvoice, [invoiceID], (error,rows,fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            db.pool.query(selectInvoice, [invoiceID], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.sendStatus(204)
                }
            })
        
        }
        
})});

// ///////////////////////
// EDIT INVOICE
// ///////////////////////
app.put('/update-invoice', function(req,res,next){
    let data = req.body;
    
    let invoice_ID = parseInt(data.invoiceID);
    // let customer_ID = parseInt(data.customerID);
    let orderDate = data.orderDate;
    let totalPrice = data.totalPrice;
    
    
    let queryUpdateInvoice = `UPDATE Invoices SET orderDate="${orderDate}", totalPrice="${totalPrice}" WHERE invoiceID = ${invoice_ID};`;
    let selectInvoice = `SELECT * FROM Invoices WHERE invoiceID = ?`
    
        // Run the 1st query
        db.pool.query(queryUpdateInvoice, [invoice_ID, orderDate,totalPrice], function(error, rows, fields){
            if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
    
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectInvoice, [invoice_ID], function(error, rows, fields) {
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
    })}); 


// ///////////////////////////////////////////////////////////////////////////////////
// PRODUCT SECTION ADD, DELETE, EDIT
// ///////////////////////////////////////////////////////////////////////////////////

// ///////////////////////
// ADD PRODUCT
// ///////////////////////

app.post("/add-product", (req,res) => {
    let data = req.body
    console.log(data['input-price'])
    console.log(data['input-consoleid'])
    console.log(data['input-videogameid'])
    
    // Conditional to change query for products if console id is Null
    if (data['input-consoleid'] == 'null'){
        queryInvoice = `INSERT INTO Products (price, consoleID, videogameID) VALUES ('${data["input-price"]}', ${null}, '${data["input-videogameid"]}');`;
    }
    // Conditional to change query for products if the videogameID is null
    else if (data['input-videogameid'] == 'null') {
        queryInvoice = `INSERT INTO Products (price, consoleID, videogameID) VALUES ('${data["input-price"]}', '${data["input-consoleid"]}', ${null});`;
    }
    else {
        queryInvoice = `INSERT INTO Products (price, consoleID, videogameID) VALUES ('${data["input-price"]}', '${data["input-consoleid"]}', '${data["input-videogameid"]}');`;
    }

    db.pool.query(queryInvoice, (error, rows, fields) => {
        if (error) {
            console.log(`ERROR IN FIELD ${400}`)
            res.sendStatus(400)
        }
        else {
            queryInvoice2 = `Select * from Products`
            db.pool.query(queryInvoice2, (error, rows, fields) => {
                if (error) {
                    console.log(400)
                    res.sendStatus(400)
                }
                else {
                    res.redirect("/product")
                }
            })
        }
    })
})

            // ///////////////////////
            // DELETE PRODUCT
            // ///////////////////////
app.delete("/delete-product", function(req,res,next) {
    let data = req.body
    let productID = data['id']
    // console.log(consoleID)
    let deleteProduct = `delete from Products where productID = ?`;
    let selectProduct = `SELECT * from Products where productID = ?`;

    db.pool.query(deleteProduct, [productID], (error,rows,fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            db.pool.query(selectProduct, [productID], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.sendStatus(204)
                }
            })
        
        }
        
})});

            // ///////////////////////
            // UPDATE PRODUCT
            // ///////////////////////

app.put ('/update-product', (req,res,next) => {
    let data = req.body
    // console.log(data)
    let productID = data["productID"];
    // console.log(productID)
    let price = data["price"]
    console.log(price)

    let queryProductUpdate = `UPDATE Products SET price="${price}" where productID = "${productID}";`;
    let selectProduct = `SELECT * from Products where productID = ?`

    db.pool.query(queryProductUpdate, [productID, price], (error, rows, fields) => {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            db.pool.query(selectProduct, [productID], (error, rows, fields) => {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.send(rows)
                }
            })
        }
    })
})


// //////////////////////////////////////////////////////////////////////////////////////////////
// CONSOLE SECTION FOR ADD, DELETE, EDIT
// //////////////////////////////////////////////////////////////////////////////////////////////

            // ///////////////////////
            // Add Consoles
            // ///////////////////////
app.post('/add-console', (req,res) => {
    let data = req.body


    queryConsole = `INSERT INTO Consoles (name, manufacturer, releaseDate, description) 
                    VALUES ("${data["input-name"]}", "${data["input-manufacturer"]}", "${data["input-releasedate"]}", "${data["input-description"]}")`;

    db.pool.query(queryConsole, (error, rows, fields) => {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            queryConsole2 = `SELECT * from Consoles;`;
            db.pool.query(queryConsole2, (error, rows, fields) => {
                if (error) {
                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.redirect("/console")
                }
            })
        }
    })

})
                // /////////////////////////////
                // UPDATE CONSOLE SECTION //
                // ////////////////////////////
app.put ('/update-console', (req,res,next) => {
    let data = req.body
    // console.log(data)
    let consoleID = data["consoleID"];
    // console.log(consoleID)
    let name = data.name
    let manufacturer = data.manufacturer
    let releaseDate = data.releaseDate
    let description = data.description

    let queryConsoleUpdate = `UPDATE Consoles SET name="${name}", manufacturer="${manufacturer}", releaseDate="${releaseDate}", description="${description}" WHERE consoleID = ${consoleID};`;
    let selectConsole = `SELECT * from Consoles where consoleID = ?`

    db.pool.query(queryConsoleUpdate, [consoleID, name, manufacturer, releaseDate, description], (error, rows, fields) => {
        if (error) {
            console.log(error)
            res.sendStatus(400)
        }
        else {
            db.pool.query(selectConsole, [consoleID], (error, rows, fields) => {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.send(rows)
                }
            })
        }
    })
})

        // ///////////////////////
        // DELETE CONSOLE
        // ///////////////////////
app.delete("/delete-console", function(req,res,next) {
    let data = req.body
    let consoleID = data['id']
    // console.log(consoleID)
    let deleteConsole = `delete from Consoles where consoleID = ?`;
    let selectConsole = `SELECT * from Consoles where consoleID = ?`;

    db.pool.query(deleteConsole, [consoleID], (error,rows,fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            db.pool.query(selectConsole, [consoleID], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    res.sendStatus(204)
                }
            })
        
        }
        
})});

// ////////////////////////////////////////////////////////////////////////////////////
// INVOICEPRODUCT ADD, DELETE, EDIT 
// ////////////////////////////////////////////////////////////////////////////////////


        // ///////////////////////
        // ADD INVOICEPRODUCT
        // ///////////////////////
app.post("/add-invoiceproduct", (req,res) => {
    let data = req.body
    
    queryIP = `INSERT INTO Invoices_has_Products (invoiceID, productID) VALUES ('${data["input-invoiceID"]}','${data["input-productID"]}');`
    db.pool.query(queryIP, (error, rows, fields) => {
        if (error) {
            console.log(300)
            console.log(error)
            res.sendStatus(400)
        }
        else {
            queryInvoice2 = `SELECT IP.invoiceProductID,IP.invoiceID,P.productID,COALESCE(VG.title, CO.name) AS productNameOrConsoleName FROM Invoices_has_Products IP JOIN Products P ON IP.productID = P.productID LEFT JOIN Video_Games VG ON P.videogameID = VG.videogameID LEFT JOIN Consoles CO ON P.consoleID = CO.consoleID;`
            db.pool.query(queryInvoice2, (error, rows, fields) => {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                }
                else {
                    res.redirect("/invoiceproduct")
                }
            })
        }
    })
})
        // ///////////////////////
        // DELETE INVOICEPRODUCT
        // ///////////////////////
app.delete("/delete-invoiceproduct", function(req,res,next) {
    let data = req.body
    let invoiceproductID = data['id']
    // console.log(consoleID)
    let deleteIP = `delete from Invoices_has_Products where invoiceproductID = ?`;
    let selectIP = `SELECT IP.invoiceProductID,IP.invoiceID,P.productID,COALESCE(VG.title, CO.name) AS productNameOrConsoleName FROM Invoices_has_Products IP JOIN Products P ON IP.productID = P.productID LEFT JOIN Video_Games VG ON P.videogameID = VG.videogameID LEFT JOIN Consoles CO ON P.consoleID = CO.consoleID where invoiceproductID = ?`;

    db.pool.query(deleteIP, [invoiceproductID], (error,rows,fields) => {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } 
        else {
            db.pool.query(selectIP, [invoiceproductID], (error, rows, fields) => {
                console.log(error)
                if (error) {
                    console.log(200)
                    console.log(error);
                    res.sendStatus(400);
                }
                else {
                    console.log(300)
                    res.sendStatus(204)
                }
            })
            
        }
        
})});

        // ///////////////////////
        // EDIT INVOICEPRODUCT
        // ///////////////////////
app.put('/update-invoiceproduct', function(req,res,next){
    let data = req.body;
    
    let invoiceproduct_ID = parseInt(data.invoiceProductID);
    // let customer_ID = parseInt(data.customerID);
    let invoiceID = data.invoiceID;
    let productID = data.productID;
    
    
    let queryUpdateIP = `UPDATE Invoices_has_Products SET invoiceID="${invoiceID}", productID="${productID}" WHERE invoiceProductID = ${invoiceproduct_ID};`;
    let selectIP = `SELECT IP.invoiceProductID,IP.invoiceID,P.productID,COALESCE(VG.title, CO.name) AS productNameOrConsoleName FROM Invoices_has_Products IP JOIN Products P ON IP.productID = P.productID LEFT JOIN Video_Games VG ON P.videogameID = VG.videogameID LEFT JOIN Consoles CO ON P.consoleID = CO.consoleID where invoiceProductID = ?`
    
        // Run the 1st query
        db.pool.query(queryUpdateIP, [invoiceproduct_ID, invoiceID,productID], function(error, rows, fields){
            if (error) {
    
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
    
            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectIP, [invoiceproduct_ID], function(error, rows, fields) {
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
    })}); 

app.listen(PORT, () => {
    console.log("express started on localhost" + PORT)
})