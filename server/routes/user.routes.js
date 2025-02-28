const express =require("express")
const {  Register, LoginUser, LougOutUser,  updatePassword,  getUserdatils, updateUserprofile } = require("../Controllers/User.controller")
const {isAuthenticated} = require ("../middleware/Auth.middleware")


const router=express()


router.route("/register").post(Register)
router.route("/login").post(LoginUser)
router.route("/logout").get(LougOutUser)
router.route("/chandepassword").post(  isAuthenticated,  updatePassword)
router.route("/UpdateUserProfile").post(  isAuthenticated,  updateUserprofile)
router.route("/datils").get(  isAuthenticated,getUserdatils  )



module.exports=router











