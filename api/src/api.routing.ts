import express from 'express';
import { Config } from './config/config.js';
import {ChatAppController} from './controllers/rooms.controller.js';
import path from 'path';
export class ApiRouting {
  public static baseRoute = Config.BaseRoute;
  public static Register(app: express.Express) {
    app.use(ApiRouting.baseRoute + ChatAppController.route, new ChatAppController().router);
    console.log("__direname", path.join(path.resolve() + '/../client/build/'))
    app.use( express.static(path.join(path.resolve() + '/../client/build/')));
    app.get('/ping', (req, res) => {
      res.send('Pong')
    });
  }
}
