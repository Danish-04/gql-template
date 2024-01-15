import { fromPairs } from 'lodash'
import { Resolvers } from '../generated/graphql'
import UserModel from '../models/UserModel'

const userResolver: Resolvers = {

    Query: {
        getUsers: async () => {
            return [
                {
                    id: 1,
                    fullname: "Danish",
                    username: "danish123",
                    password: "1234",
                },
            ]
        },
        getUser: async (_, { username, password }) => {
            const user = UserModel.findOne({ username, password })
            if (user) {
                return user
            }
            else {
                return null
            }

        },

    },
    Mutation: {

        createUser: async (_, { form }) => {
            const user = UserModel.create(form)
            if (user) {
                return user
            }
            else {
                return null
            }


        },

        updateUser: async (_, { uid, form }) => {
            const user = UserModel.findOneAndUpdate({ uid }, form)
            if (user) {
                return user
            }
            else {
                return null
            }

        },

        deleteUser: async (_, { uid }) => {
            const user = UserModel.findOneAndDelete({ uid })
            return user
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