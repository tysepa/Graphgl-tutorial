import dotenv from "dotenv";
dotenv.config();
import 'reflect-metadata'
import express from 'express'
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from "apollo-server-core";
import{ resolvers } from "./resolvers"


async function bootstrap(){
    //Build the schema
    const schema = await buildSchema({
        resolvers,
        // authChecker
    })

    //Init express
    const app = express()
    app.use(cookieParser())
    //Create the apollo server
    const server = new ApolloServer({
        schema,
        context:(ctx) =>{
            console.log(ctx)
            return ctx
        },
        plugins:[
            process.env.NODE_ENV === 'production' ?
            ApolloServerPluginLandingPageProductionDefault() :
            ApolloServerPluginLandingPageGraphQLPlayground()

        ],
    });
    await server.start()
    //await server.start()
    server.applyMiddleware({app})
    //apply middle to server
    app.listen({port: 4000 }, ()=>{
        console.log("App is listening on http://localhost:4000")
    });
    //app.listen on express server
    //connect to db
}

bootstrap();