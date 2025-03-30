require("dotenv").config()
const { Router } = require("express")
const bcrypt = require("bcryptjs")
const {validationResult} = require("express-validator")
const User = require("../models/user")
const router = Router()
const {registerValidators} = require("../utils/validator")

router.get("/login",async(req, res)=>{
    res.render("auth/login",{
        title: "Authotrisation",
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get("/logout",async(req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/auth/login")
    })
    
})

router.post("/login", async(req, res)=>{
    try{
        const {email, password} = req.body
        const candidate = await User.findOne({email})
        
        if(candidate){
            const areSame = await bcrypt.compare(password, candidate.password)

            if(areSame){
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err=>{
                    if(err){    
                        throw err
                    }
                    res.redirect("/")
                })
            }else{
                req.flash('loginError', 'Incorrect password')   
                res.redirect("/auth/login")
            }
        }else{
            req.flash('loginError', 'User with this email does not exist') 
            res.redirect("/auth/login")
        }
    }catch(e){
        console.log(e)
    }
})

router.post("/register", registerValidators, async(req, res)=>{
    try{
        const{email,password, name} = req.body

        const errors = validationResult(req)
        if(!errors.isEmpty()) { 
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect("/auth/login#register")
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            name, 
            password: hashedPassword, 
            cart: {items: []}
            })
            await user.save();
            res.redirect("/auth/login");
    }catch(e){
        console.log(e)
    }
})


module.exports = router