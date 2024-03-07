const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json())
const bcrypt = require('bcrypt')
const MY_SECRET_TOKEN = "MY_SECRET_TOKEN"

const jwt = require("jsonwebtoken");

const dbPath = path.join(__dirname, "myDB.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(8081, () => {
      console.log("Server Running at http://localhost:8081/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();





app.post("/register", async (request, response) => {
    const { name, mail, password } = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const selectUserQuery = `SELECT * FROM user WHERE username = '${name}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      const createUserQuery = `
        INSERT INTO 
          user (username, email, registered_date, encrypted_password) 
        VALUES 
          (
            '${name}', 
            '${mail}',
            '${new Date()}', 
            '${hashedPassword}'
          )`;
      const dbResponse = await db.run(createUserQuery);
      const newUserId = dbResponse.lastID;
      response.send(`Created new user with ${newUserId}`);
    } else {
      response.status = 400;
      response.send("User already exists");
    }
  });



  app.post("/login", async (request, response) => {
    const {username, password } = request.body;
    const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      //* checking weather the entered user exist or not
      response.status(400).send({ error_msg: "Invalid User" });
    } else {
      //* comparing passwords.
      const isPasswordMatched = await bcrypt.compare(password, dbUser.encrypted_password);
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        //* generating a token from payload.
        const jwtToken = jwt.sign(payload, MY_SECRET_TOKEN);
        response.status(200).send({ jwt_token: jwtToken }); //* sending response to client
       
        
      } else {
        response.status(400).send({ error_msg: "Invalid Password" });
      }
    }
  });

  const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      //* if client failed to send token. client is not eligible to interact with db
      response.status(400).send({ jwt_token: "Invalid JWT Token" });
    } else {
      //* comparin jwt token
      jwt.verify(jwtToken, MY_SECRET_TOKEN, async (error, payload) => {
        if (error) {
          //* if jwt token not matches,the same status will be sent to client
          response.status(400).send({ jwt_token: "Invalid JWT Token" });
        } else {
          //* this block will execuit only when provided jwt token is valid
          request.username = payload.username; //* middleware functions can share information using request object. here am sending current user identity(email) to next middleware/handler function
          console.log(request.username)
          next();
        }
      });
    }
  };



  app.post("/add-recipe",authenticateToken, async (request, response) => {
    const {title, description, ingredients,instructions,image_url} = request.body;
    const selectUserQuery = `SELECT * FROM user WHERE username = '${request.username}'`;
    const dbUser = await db.get(selectUserQuery);
    console.log(dbUser)
    if (dbUser != undefined) {
      const createUserQuery = `
      INSERT INTO 
      receipe (title, description, ingredients, instructions, added_by, image_url) 
    VALUES 
      (
        '${title}',
        '${description}',
        '${ingredients}', 
        '${instructions}',
        ${dbUser.id},
        '${image_url}'
      )
    `;
    console.log('sjsaf')
      const dbResponse = await db.run(createUserQuery);
      console.log(dbResponse)
      const newUserId = dbResponse.lastID;
      response.send(`Posted with ${newUserId}`);
    } else {
      response.status = 400;
      response.send("Failed to post");
    }
  });


  app.get("/get-recipe",authenticateToken, async (request, response) => {

    const {  mail} = request.body;
    const selectUserQuery = `SELECT * FROM user WHERE email = '${mail}'`;
    const dbUser = await db.get(selectUserQuery);
    // console.log(request.email,'mail')
    console.log(dbUser,'ddd')
    if (dbUser != undefined) {
      const getUserQuery = `
        SELECT * FROM
          receipe WHERE added_by = '${dbUser.id}'`
      const dbResponse = await db.all(getUserQuery);
      console.log(dbResponse,'get recepie')
      response.send(dbResponse);
    } else {
      response.status = 400;
      response.send("Failed to Load");
    }
  });

  app.put("/update-recipe",authenticateToken, async (request, response) => {
    const { receip_id,title, description , ingredients ,instructions,image_url } = request.body;
    const selectUserQuery = `SELECT * FROM user WHERE username = '${request.username}'`;
    const dbUser = await db.get(selectUserQuery);

    if (dbUser != undefined) {
      const updateUserQuery = `
        UPDATE
          receipe SET title='${title}', description='${description}', ingredients='${ingredients}',instructions='${instructions}',image_url='${image_url}'
         
          WHERE receip_id = '${receip_id}'`
      const dbResponse = await db.run(updateUserQuery);
      console.log(dbResponse,'get recepie')
      response.send(`Posted with ${dbUser.id}`);
    } else {
      response.status = 400;
      response.send("Failed to post");
    }
  });

  app.delete("/delete-recipe",authenticateToken, async (request, response) => {
    const { receip_id} = request.body;
    const selectUserQuery = `SELECT * FROM user WHERE username = '${request.username}'`;
    const dbUser = await db.get(selectUserQuery);
    
   
    if (dbUser != undefined) {
      const deleteUserQuery = `
        DELETE FROM
          receipe 
          WHERE receip_id = '${receip_id}' AND added_by = ${dbUser.id}`
      const dbResponse = await db.run(deleteUserQuery);
      console.log(dbResponse,'')
      response.send(`Deleted Successfully ${dbUser.id}`);
    } else {
      response.status = 400;
      response.send("Failed to Delete");
    }
  });







