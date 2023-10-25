import { Router } from "express";
import passport from "passport";
import { birthday } from "../middlewares/birthdate.middleware.js";
import { UserManagerDB } from "../dao/db/user_managerDB.js";
import { generateToken } from "../utils.js";
// import { isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

const userManagerDB = new UserManagerDB();


router.post('/login', passport.authenticate('login', {failureRedirect: 'failLogin', session: false} ), async( req, res ) => {
    // console.log( req.body )
    // if ( !req.user ) {
    //     return res.status(400).send({ status: 'error', error: 'Invalid Credentials' })
    // }
    const user = req.user;
    const accessToken = generateToken( user );
    // console.log(req.user)
    // req.session.user = {
        //     first_name: req.user.first_name,
        //     last_name: req.user.last_name,
        //     email: req.user.email,
        //     age: req.user.age,
        //     role: req.user.role
        // };
    res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
 
})

router.get('/failLogin', ( req, res ) => res.render('errors/errorAuth',{error: 'Bad Request, try again with a correct email or password'}))



router.post('/register', birthday , passport.authenticate('register', {failureRedirect: 'failRegister', session: false} ),  async( req, res ) => {
    res.redirect('/')
})
router.get('/failRegister', ( req, res ) => {
    console.log(req.authInfo)
    
    return res.render('errors/errorAuth',{error: 'Email already exist'})
})


router.get('/logout', ( req, res ) => {

    // req.session.destroy( err => {
    //     if(err) {
    //         return res.status(500).send({error: err})
    //     }else res.redirect('/');
    // })
    

    return res.clearCookie('jwt-coder').redirect('/')
})


router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }), (req, res)  => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/', session: false }), async( req, res ) => {
    const user = req.user;
    const accessToken = generateToken( user );
    res.cookie('jwt-coder', accessToken, { signed: true }).redirect('/products')
    // req.session.user = req.user;
    // req.session.user.role = 'user'
})

export default router; 