const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// jwt token generator function with RSA256
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// check if user exist and return his object base on provided email
const userExistByEmail = async (email) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        return user ? user : false;

    }
    catch (error) {
        console.log(error)
    }

};

// check if user exist and return his object base on provided ID
const userExistByID = async (id) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        return user ? user : false;

    }
    catch (error) {
        console.log(error)
    }
}


// create new user
const register = async (fname, lname, email, password) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const user = await prisma.user.create({
            data: {
                fname: fname,
                lname: lname,
                email: email.toLowerCase(),
                password: hashedPassword,
            },
        });

        if (user) {
            return {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
                token: generateToken(user.id)
            }
        }

    } catch (error) {
        console.log(error);
    }
};

const login = async (email, password) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return {
                    id: user.id,
                    fname: user.fname,
                    lname: user.lname,
                    email: user.email,
                    token: generateToken(user.id)
                }
            }
        }

    }
    catch (error) {
        console.log(error);
    }
}


// confirm user email
const confirm = async (id) => {
    try {

        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                confirmed: true,
            },
        });

        return user ? true : false;

    }
    catch (error) {
        console.log(error)
    }
}

const validatePassword = async (passedOldPassword, loadedPassword) => {
    try {
        const isMatch = await bcrypt.compare(passedOldPassword, loadedPassword);
        return isMatch;
    }
    catch (error) {
        console.log(error);
    }
}

const changePassword = async (id, password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                password: hashedPassword,
            },
        });
        
        return user ? true : false;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = {
    userExistByEmail,
    register,
    login,
    userExistByID,
    confirm,
    validatePassword,
    changePassword
}

