const mongoose  = require('mongoose');

const mongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO); // Removed options object
        console.log("MongoDB Connected...");
        
        // Fetch food items
        const foodItemsCollection = mongoose.connection.db.collection("food_items");
        const data = await foodItemsCollection.find({}).toArray();

        // Fetch food categories
        const foodCategoryCollection = mongoose.connection.db.collection("foodCategory");
        const catData = await foodCategoryCollection.find({}).toArray();

        // Set global variables
        global.food_items = data;
        global.foodCategory = catData;

    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
};

// Call the mongoDB function to execute it
module.exports = mongoDB;
