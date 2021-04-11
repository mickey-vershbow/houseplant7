// Import Schema and Model
const {Schema, model} = require("../db/connection")
// The Image Schema
const Plant = new Schema({
    url: String,
    name: String,
    description: String,
    petsafe: String,
    origin: String,
})
// The User Schema
const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    plants: [Plant],
}, {timestamps: true})
// The User Model
const User = model("User", UserSchema)
// Export the User Model
module.exports = User
