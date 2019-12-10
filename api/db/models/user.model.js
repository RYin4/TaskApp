const mongoose = require('mongoose')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

//random string as jwt secret
const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

const userScehma = new mongooseSchema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    //array of objects
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Number,
            requried: true
        }
    }]
})

//override the default JSON methods
UserScehma.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    //omit the password and session
    return _.omit(userObject, ['password', 'sessions'])
}

UserScehma.methods.generateAccessAuthToken = function() {
    const user = this
    return new promise((resolve, reject) => {
        //create JSON web token and return that 
        jwt.sign({ _id: user._id.toHexString()}, jwtSecret, { expiresIn: "15m "}, (err, token) => {
            if (!err) {
                resolve(token)
            } else {
                reject()
            }
        })
    })
}

UserScehma.methods.generateRefreshAuthToken = function() {
    return new promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err) {
                let token = buf.toString('hex')
                return resolve(token)
            }
        })
    })
}

UserScehma.methods.createSession = function() {
    let user = this
    return user.generateRefreshAuthToken().then((refreshToken) => {
        return saveSessionToDatabase(user, refreshToken)
    }).then((refreshToken) => {
        return refreshToken
    }).catch((e) => {
        return promise.reject('Failed to save session to database. \n' + e)
    })
}


//helper methods
let saveSessionToDatabase = (user, refreshToken) => {
    //save session to database
    return new promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime()
        //takes user doc and push to session array
        user.session.push({ 'token': refreshToken, expiresAt})

        user.save().then(() => {
            return resolve(refreshToken)
        }).catch((e) => {
            reject(e)
        })
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}