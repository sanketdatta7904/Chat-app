import express from 'express';
import { Config } from './config/config.js';
import {ChatAppController} from './controllers/rooms.controller.js';
export class ApiRouting {
  public static baseRoute = Config.BaseRoute;
  public static Register(app: express.Express) {
    app.use(ApiRouting.baseRoute + ChatAppController.route, new ChatAppController().router);
    app.get('/ping', (req, res) => {
      res.send('Pong')
    });
  }
}
