import { AuthenticationError } from "apollo-server-express";
import { User } from "../models/User.js"
import { signToken } from "../utils/auth.js"

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

            const correctPassword = await user.isCorrectPassword(password);
            // returns error if password is incorrect
            if (!correctPassword) {
                throw new AuthenticationError("Incorrect Login info");
            }
            // if user and password are both correct they are given a web token
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { bookData }, context) => {
            // If the user is logged in
            if (context.user) {
                // Looks fo the user object and adds the saved book to the savedBooks array
                const updateUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );

                return updateUser;
            }

            throw new AuthenticationError("Please Login or Signup");
        },

        removeBook: async (parent, { bookId }, context) => {
            // If the user is logged in
            if (context.user) {
                // Grabs the user and removed the bookId, removing the book from savedBooks
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError("Please Login or Signup");
        },
    },
};
