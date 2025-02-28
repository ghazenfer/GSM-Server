const UserModel = require("../models/User.model");



model.exports.CreateUser = async(
    {firstname , lastname , email,password}
)=>{
    if(!firstname || !lastname || !email || password ){
        throw new Error("All fields are required");
    }
    const user=UserModel.create({
        username:{
            firstname,
            lastname
        },
        email,
        password
    })
    return user;
}