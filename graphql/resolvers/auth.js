const User = require('../../models/user');
const bcrypt = require("bcrypt");

module.exports = {
    createUser: async args => {
        try {
            const user = await User.findOne({ email: args.userInput.email });
            if (user) {
                throw new Error('User Already exists');
            }
            const hashedPass = await bcrypt.hash(args.userInput.password, 12);
            const user_1 = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hashedPass
            });
            const result = await user_1.save();
            return { ...result._doc, _id: result.id, password: null };
        }
        catch (err) {
            throw err;
        }
    }
}