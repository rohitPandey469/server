import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const SECRET = process.env.SECRET || "SECRET";

  try {
    const token = req?.headers?.authorization.split(" ")[1];
    let decodeData = jwt.verify(token, SECRET);
    if(!decodeData){
        return res.status(404).json({message:"Unathorized"})
    }
    req.userId = decodeData?.id;
    next();
  } catch (err) {
    console.log(err);
  }
};

export default auth;
