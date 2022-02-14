
const {gql} = require('apollo-server');

const  typeDefs = gql`

    type User {
        name: String
        email: String
        password: String
        register: String
    }

    type Project {
        name: String
        id: ID
    }

    type Task {
        name: String
        id: ID
        autor: User
        project: Project
        status: Boolean
    }

    type Query {
        getProjects: [Project]
    }

    input InputUser {
        name: String!
        email: String!
        password: String!
    }

    input InputAuth {
        email: String!
        password: String!
    }

    input InputProject {
        name: String!

    }

    input InputTask {
        name: String!
        project: String!
    }

    type Token {
        token: String
    }

    type Mutation {
        #projects
        createUser(input: InputUser): String
        authUser(input: InputAuth): Token
        newProject(input: InputProject): Project
        updateProject(id: ID!, input: InputProject): Project
        deleteProject(id: ID!): String

        #task
        newTask(input: InputTask): Task
        updateTask(id:ID!, input: InputTask, status: Boolean): Task 
    }
`;

module.exports = typeDefs;