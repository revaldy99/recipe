const {selectId, insertUser} = require("../model/users")
const { v4: uuidv4 } = require('uuid');
const argon2 = require('argon2');
const { GenerateToken} = require("../helpers/token")

const UsersController = {
	register: async (req,res,next)=> {
		
		let {email,password,username} = req.body
		// let {email,username} = req.body
		if(!email || !password || !username){
			return res.status(400).json({status:400,message:'email password username is required'})
		}
		console.log('bbbbb');
		let user = await selectId(email)
		console.log('data'+user)
		
	
		
		if(user.rowCount==1){
			return res.status(400).json({status:400,message:'email already register'})
		}

		password = await argon2.hash(password)
		let data = {
			uuid: uuidv4(),
			email,
			password,
			username
		}
		console.log(data);
		
		let result = await insertUser(data)

		console.log("result" )
		console.log(result )
		
		res.status(200).json({status:200,message:'register success'})
	},
	login: async(req,res,next)=> {
		let {email,password} = req.body
		if(!email || !password) {
			return res.status(400).json({status:400,message:'email & password is required'})
		}

		let {rows,rowCount} = await selectId(email)
		// let {rows} = await selectId(email)
		let user = rows[0]

		if(rowCount==0){
			return res.status(400).json({status:400,message:'email not found, please register'})
		}

		// let isVerify = await argon2.verify(user.password,password)

		// if(!isVerify) {
		// 	return res.status(400).json({status:400,message:'wrong password'})
		// }

		delete user.password

		let token = GenerateToken(user)
		user.token = token
		
		console.log(user)
		res.status(200).json({status:200,message:'login success',data:user})
	}
}

module.exports = UsersController