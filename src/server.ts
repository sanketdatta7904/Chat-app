import * as http from "http";
import App from "./app.js";
import { Config } from "./config/config.js";
import * as dotenv from "dotenv";
dotenv.config();

process.on("uncaughtException", function (err) {
  console.log(new Date().toUTCString() + "uncaughtException:", err.message);
  console.log(err.stack);
  process.exit(1);
});

class Server {
  public static port = Config.Port;
  public static bootstrap(): Server {
    if (!this.serverInstance) {
      this.serverInstance = new Server();
      return this.serverInstance;
    } else {
      return this.serverInstance;
    }
  }

  private static serverInstance: Server;
  private server: any;
  private port: number | undefined;

  public constructor() {
    this.runServer();
  }

  public getServerInstance(): any {
    return this.server;
  }

  private runServer(): void {
    this.port = this.normalizePort(Server.port || 9000);
    console.log("server started on", this.port);
    App.set("port", this.port);
    this.createServer();
  }

  private createServer() {
    this.server = http.createServer(App);
    this.server.listen(this.port);
    this.server.on("listening", () => {
      const address = this.server.address();
      const bind =
        typeof address === "string"
          ? `pipe ${address}`
          : `port ${address.port}`;
    });

    this.server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.syscall !== "listen") {
        throw error;
      }
      process.exit(1);
    });

    this.server.on("exit", (code) => {
      process.exit(code);
    });

    this.server.on("SIGTERM", (code) => {
      process.exit(code);
    });
  }

  /**
   * normalize port
   * @param {number | string} val
   * @returns {number}
   */

  private normalizePort(val: number | string): number {
    const port: number = typeof val === "string" ? parseInt(val, 10) : val;
    return port;
  }
}

export const server = Server.bootstrap();
