import argon2 from 'argon2'
import { Resolvers } from '../generated/graphql'
import UserModel from '../models/UserModel'
import { NotFoundError, BadUserInputError, InternalServerError, ErrorHandler } from '../helpers/errors/ErrorHandler'
const userResolver: Resolvers = {

    Query: {
        getUsers: async () => {
            const users = UserModel.find()
            return users
        },
        getUser: async (_, { username, password }) => {
            try {
                if (!username || !password) throw new BadUserInputError("Please provide username and password")
                const user = await UserModel.findOne({ username, password })
                if (!user) throw new NotFoundError("User not found")
                return {
                    __typename: "User",
                    ...user.toObject()
                }
            } catch (error) {
                return ErrorHandler.handle(error)
            }

        },

        getUserOrPost: async (_, { id }) => {
            try {
                if (!id) throw new BadUserInputError("Please provide id")
                const user = await UserModel.findOne({ uid: id })
                if (user) return {
                    __typename: "User",
                    ...user.toObject()
                }

                return {
                    __typename: "Post",
                    id: 1,
                    title: "Wings of fire",

                }

            } catch (error) {
                return ErrorHandler.handle(error)
            }
        }

    },

    Mutation: {

        createUser: async (_, { form }) => {
            try {
                if (!form.username || !form.password) throw new BadUserInputError("Please provide username and password")
                const hashedPassword = await argon2.hash(form.password)
                const user = UserModel.create({ ...form, password: hashedPassword })
                return user
            }
            catch (error) {
                return ErrorHandler.handle(error)
            }

        },
        updateUser: async (_, { uid, form }) => {
            try {
                if (!uid) throw new BadUserInputError("Please provide uid")

                const user = await UserModel.findOneAndUpdate({ uid }, { ...form }, { new: true })

                if (!user) throw new NotFoundError("User not found")
                return {
                    __typename: "User",
                    ...user.toObject()
                }

            }
            catch (error) {
                return ErrorHandler.handle(error)
            }

        },

        deleteUser: async (_, { uid }) => {
            try {
                if (!uid) throw new BadUserInputError("Please provide uid")
                const user = UserModel.findOneAndDelete({ uid })
                return user
            }
            catch (error) {
                return ErrorHandler.handle(error)
            }

        }

    },
    User: {
        Posts: async () => {
            return [
                {
                    id: 1,
                    title: "Kuch nahi",
                    body: "Khaali",
                    createdAt: "2021-01-01 10:00:00",
                }
            ]
        }
    }
}
export default userResolver