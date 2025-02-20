const express = require('express');
const dotenv = require('dotenv');
const userRouter = require('./routes/CreateUser.js');
const router = require('./routes/DisplayData.js');
const mongoDb = require('./db.js');
const cors = require('cors');

dotenv.config(); 
const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Connection to Database
mongoDb();

app.listen(process.env.Port, () => {
    console.log(`Server started at PORT ${process.env.Port}`);
});

// Routes
app.use("/api", userRouter);
app.use("/api", router);
app.use("/api", require('./routes/OrderData.js'));
app.use("/api", require('./routes/GetLocation.js'));
app.use("/api", require('./routes/MyOrderData.js'));
// app.use("/api", );
