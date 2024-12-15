import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Data
import db from "./demodb.js";

// resolvers
const resolvers = {
    Query :{
        games() {
            return db.games;
        },
        game(_, args){
            return db.games.find((game) => game.id === args.id)
        },
        authors(){
            return db.authors;
        },
        author(_,args){
            return db.authors.find((author) => author.id === args.id)
        },
        reviews(){
            return db.reviews;
        },
        review(_ , args){
            return db.reviews.find((review) => review.id === args.id)
        }
    },
    Game :{
        reviews(parent){
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Author : {
        reviews(parent){
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review : {
        game(parent){
            return db.games.filter((game) => game.id === parent.game_id)
        },
        author(parent){
            return db.authors.filter((author) => author.id === parent.author_id)
        }
    },
    Mutation :{
        deleteGame(_ , args){

            db.games = db.games.filter((g) => g.id !== args.id);
            return db.games;
        },
        addGame(_,args){
            let gameObj = {
                ...args.game , 
                id : Math.floor(Math.random() * 100)
            }
            db.games.push(gameObj);
            return db.games;
        },
        updateGame(_ , args){
            let id = args.id;
            let updatedObj = args.edit;
            db.games = db.games.map((g)=> {
                if(g.id === id){
                    g = {...g , ...updatedObj};
                }
                return g;
            })
            return db.games;
        }
    }
}
// typeDefs
import { typeDefs } from "./schema.js";

// Server setup

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const {url}  = await startStandaloneServer( server , {
    listen : { port : 4000}
})


console.log(`Server ready on port 4000`);