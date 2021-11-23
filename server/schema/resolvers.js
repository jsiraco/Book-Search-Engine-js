import { AuthenticationError } from "apollo-server-express";
import { User } from "../models"
import { signToken } from "../utils/auth"

export const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (!context.user) {
                throw new AuthenticationError("Please Login or Signup");
            }
            const userData = await User.findOne({ _id: context.user._id })

            return userData;
        },
    },

    Mutation: {
        // Creates user
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, User };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            // returns error is user isn't found
            if (!user) {
                throw new AuthenticationError("Incorrect Login info");
            }

            const correctPw = await user.isCorrectPassword(password);
            // returns error if password is incorrect
            if (!correctPw) {
                throw new AuthenticationError("Incorrect Login info");
            }
            // if user and password are both correct they are given a web token
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {

        },
        removeBook: async (parent, { bookId }, context) => {

        }
    }

}
