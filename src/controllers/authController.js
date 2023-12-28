import { isValidPassword, createHash, generateToken } from "../utilis/utils.js";
import UserDTO from "../dto/user.dto.js";
import { userPasswordModel } from "../models/UserPassword.js";
import { UserService } from "../repositories/index.js";
export default class AuthController {
  //!REGISTER
  registerUser = (req, res) => res.redirect("/");
  failRegister = (req, res) =>
    res.render("errors/errorAuth", { error: "Email already exist" });

  //!LOGIN
  loginUser = (req, res) => {
    const user = new UserDTO(req.user);
    const accessToken = generateToken(user);
    return res
      .cookie("jwt-coder", accessToken, { signed: true })
      .redirect("/products");
  };
  failLogin = (req, res) =>
    res.render("errors/errorAuth", {
      error: "Bad Request, try again with a correct email or password",
    });

  //!CHANGEPASSWORD
  changePassword = async( req, res ) => {
    const password = req.body.password;
    const token = req.body.token;

    const userPDB = await userPasswordModel.findOne({ token })
    if( !userPDB ) return res.json({ status: 'error', error: 'There was a mistake' });
    const email = userPDB.email;
    
    const user = await UserService.getByEmail( email )
    
    const isSamePass = isValidPassword( user, password )
    if( isSamePass ) return res.json({ status: 'error', error: 'You can not put the same password try again' });
  
    const newPassword = createHash( password )

    const isUpdated = await UserService.update( email, { password: newPassword } )
    if( !isUpdated ) return res.json( { status: 'error', message: 'The data you want to change is not found in our model' } )

    await userPasswordModel.deleteOne({token})
    
    res.json( { status: 'success', message: 'Your password just been change' } )
  }

  //!USER PREMIUM
  premium = async( req, res ) => {
    console.log( req.user )
    const { email } = req.user;
    const updateUser = await UserService.update(email, { role: 'premium' })
    res.json({'siu': 33})
  }

  //!USER STANDAR
  standar = async( req, res ) => {
    console.log( req.user )
    const { email } = req.user;
    const updateUser = await UserService.update(email, { role: 'user' })
    res.json({'siu': 33})
  }
  
  //!GITHUBLOGIN
  loginGithub = (req, res) => {};
  githubCallback = async (req, res) => {
    const user = req.user;
    const accessToken = generateToken(user);
    return res
      .cookie("jwt-coder", accessToken, { signed: true })
      .redirect("/products");
  };

  //!LOGOUT
  logout = (req, res) => res.clearCookie("jwt-coder").redirect("/");
}
