import express from "express";
import path from "path";
import { ApiRouting } from "./api.routing.js";
import cors from "cors";
import mongoose from "mongoose";
import _ from "lodash";
import { Config } from "./config/config.js";
// import pusher from "pusher"
import Pusher from "pusher";

// const requestIp = require('request-ip');
class App {
  public express: express.Express;
  // public routePrv: Routes = new Routes();

  constructor() {
    this.database();
    this.express = express();
    this.middleware();
    this.initializeControllers();
  }

  /**
   * database connection
   */
  private async database() {
    const connectionUrl = Config.mongo.connectionUrl;
    // mongoose.connect(connectionUrl, {
    //     autoIndex: true,
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // })

    async function run() {
      // 4. Connect to MongoDB
      mongoose.connect(connectionUrl, () => {
        console.log("connected to database");
      });
      const db = mongoose.connection;
      const pusher = new Pusher(Config.pusher);
      db.once("open", () => {
        console.log("DB Watch started");
        const roomCollection = db.collection("rooms");
        const roomStream = roomCollection.watch([], {
          fullDocument: "updateLookup",
        });
        roomStream.on("change", (change: any) => {
          const roomDetails = change.fullDocument;
          let res: any = {};
          let mongoEvent = "";
          if (change.operationType === "insert") {
            res = {};
            mongoEvent = "create";
            pusher.trigger("rooms", "inserted", {
              name: roomDetails.name,
              _id: roomDetails._id,
              mongoEvent: mongoEvent,
              messages: res,
            });
          } else if (change.operationType === "update") {
            if (
              _.get(change, ["updateDescription", "updatedFields", "messages"])
            ) {
              let newMessage = _.get(change, [
                "updateDescription",
                "updatedFields",
                "messages",
              ]);
              res = newMessage[0];
            } else {
              res = _.get(change, ["updateDescription", "updatedFields"], {});

              res = Object.values(res)[0];
            }
            mongoEvent = "update";
            pusher.trigger("rooms", "updated", {
              name: roomDetails.name,
              _id: roomDetails._id,
              mongoEvent: mongoEvent,
              messages: res,
            });
          } else if (change.operationType === "delete") {
            res = {};
            mongoEvent = "delete";
            pusher.trigger("rooms", "deleted", {
              _id: change.documentKey._id,
            });
          }
        });
      });
    }
    run().catch((err) => console.log(err));
  }

  /**
   * http(s) request middleware
   */
  private middleware(): void {
    const corsOption = {
      credentials: true,
      exposedHeaders: ["x-auth-token"],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      origin: true,
    };
    this.express.use(cors(corsOption));
    this.express.use(express.urlencoded());
    this.express.use(express.json());
    // this.express.use(requestIp.mw())
    this.express.use((err, req, res, next) => {
      console.log(err.toString());
      next();
    });
  }

  /**
   * app environment configuration
   */
  // private setEnvironment(): void {
  //   // dotenv.config({ path: ".env" });
  //   global['__viewDir__'] = __dirname + '/views';
  // }

  /**
   * API main routes
   */
  private initializeControllers() {
    this.InitRoute();
    this.express.use("*", (req, res) => {
      res.status(404).send({ error: `\/${req.baseUrl}\/ doesn't exist` });
    });
  }

  private InitRoute() {
    ApiRouting.Register(this.express);
  }
}

export default new App().express;
