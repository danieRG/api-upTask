const User = require('../models/User');
const Project = require('../models/Project');
const bcryptjs = require('bcryptjs');
const jtw = require('jsonwebtoken');
const Task = require('../models/Task');
require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secret, expiresIn) => {
    const { id, email } = user;

    return jtw.sign({ id, email }, secret, { expiresIn });
}

const resolvers = {
    Query: {
        getProjects: async (_, {input}, ctx) => {
            const projects = await Project.find({autor: ctx.user.id});

            return projects;
        }

    },
    Mutation: {
        createUser: async(_, {input}) => {
            const {name, email, password} = input;

            const user = await User.findOne({email});
            
            if(user){
                throw new Error('User alrady exists');
            }

            try {

                const salt  = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);
                
                const newUser = new User(input);

                newUser.save();

                return "User created";

            } catch (error) {
                console.log(error);
            }
        },

        authUser: async(_, {input}) => {
            const {email, password} = input;
            
            const user = await User.findOne({email});
            if(!user){
                throw new Error('User no exist');
            }

            const validPass = await bcryptjs.compare(password, user.password);
           if(!validPass){
               throw new Error('Invalid password');
           }
           
           return {
               token: createToken(user, process.env.SECRET, '2hr')
           };
        },

        newProject: async(_, {input}, ctx) => {
            
            try {
                const project = new Project(input);
                project.autor = ctx.user.id;
                
                const result  = await project.save();

                return result;
            } catch (error) {
                console.log(error);
            }
        },

        updateProject: async(_, {id, input}, ctx) => {
            
            let project = await Project.findById(id);
            
            if(!project){
                throw new Error('Project not found');
            }

            if(project.autor.toString() !== ctx.user.id){
                throw new Error('User not authorized');
            }

            project = await Project.findOneAndUpdate({_id: id}, input, {new: true});

            return project;
        },

        deleteProject: async(_, {id}, ctx) => {
            const project = await Project.findById(id);

            if(!project){
                throw new Error('Project not found');
            }

            if(project.autor.toString() !== ctx.user.id){
                throw new Error('User not authorized');
            }

            await Project.findOneAndDelete({_id: id});

            return 'Project deleted';
        },

        newTask: async(_, {input}, ctx) => {
            try {
                const task = new Task(input);
                task.autor = ctx.user.id;
                const result = await task.save();

                return result;

            } catch (error) {
                console.log(error);
            }
        },
        
        updateTask: async(_, {id, input, status}, ctx) => {

            const task = await Task.findById(id);
            
            if(!task){
                throw new Error('Task not found');
            }

            if(task.autor.toString() !== ctx.user.id){
                throw new Error('User not authorized');
            }

            input.status = status;
            
            task = await Task.findOneAndUpdate({_id: id}, input, {new: true});

            return task;
        }
    }
} 

module.exports = resolvers;