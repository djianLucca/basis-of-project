import * as express from "express";
import { UserController } from "../Controllers/User-Controller"
import { MiddlewareAuth } from "./../Middlewares/middleware-auth";

class UserRoute {
    public express: express.Application;
    public router: express.Router;
    public userController: UserController;
      public middlewareAuth: MiddlewareAuth;

    constructor() {
        this.express = express();
        this.router = express.Router();
        this.userController = new UserController();
        this.middlewareAuth = new MiddlewareAuth();
        this.middlewares();
        this.initRoutes();
    }

    private middlewares(): void {
        this.router.use(this.middlewareAuth.checkAuth);
        this.router.use(this.middlewareAuth.checkAcl);
    }

    private initRoutes(): void {
        this.router.get("/", this.userController.getAll);
        this.router.get("/:_id", this.userController.getOne);
        this.router.post("/", this.userController.create);
        this.router.put("/:_id", this.userController.update);
        this.router.delete("/:_id", this.userController.delete);
    }
}

export default new UserRoute().router;
