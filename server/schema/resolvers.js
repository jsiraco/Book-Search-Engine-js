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
        addUser: async (parent, args) => {

        },
        login: async (parent, { email, password }) => {

        },
        saveBook: async (parent, { bookData }, context) => {

        },
        removeBook: async (parent, { bookId }, context) => {

        }
    }

}
