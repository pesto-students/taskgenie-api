const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: String,
    googleId: String,
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    password:{
        type: String,
        required: true
    }
});

//fire middleware before saving the user as we want to save hashed password
UserSchema.pre('save', async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }
    catch(error){
        next(error);
    }
});

UserSchema.methods.isValidPassword = async function(password){
    try{
        return await bcrypt.compare(password, this.password);
    }
    catch(error){
        next(error);
    }
}

const User = mongoose.model('user', UserSchema);

module.exports = User;


