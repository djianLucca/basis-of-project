import * as bcrypt from "bcrypt"
import { NextFunction, Request, Response } from "express"
import * as HttpStatus from "http-status"
// import * as winston from "winston";
import { HelperAuth } from "../Helpers/helper-auth"
import { ICustomRequest } from "../Interfaces/custom-request"
import { IError } from "../Interfaces/error"
import { People } from "./../Models/People"
import { User } from "./../Models/User"
import { Plan } from "../Models/Plan";

const helperAuth = new HelperAuth();

const secretJwtKey = process.env.JWT_SECRET || "secretApiKey"
export class AuthController {
  // public logger: winston.LoggerInstance;

  // tslint:disable-next-line:no-empty
  constructor() {

  }

  public token(request: Request, response: Response, next: NextFunction): void {
    const userName = request.body.userName;
    const passWord = request.body.passWord;
    console.log("-----------", userName, passWord)
    if (!userName || !passWord) {
      const err: IError = { message: "Faltando usuário ou senha", status: HttpStatus.BAD_REQUEST };
      return next(err);
    } else {
      User.findOne<User>({
        include:[People, Plan],
        where: {
          active: true,
        },
      })
      .then(async (usuarioRetornado: User) => {
        if (usuarioRetornado) {

          if (bcrypt.compareSync(passWord, usuarioRetornado.password)) {
            const token = helperAuth.generateToken(usuarioRetornado);

            const data: any = {
              UsuarioId: usuarioRetornado.id,
              nome: usuarioRetornado.people.name,
              perfil: usuarioRetornado.plan ? usuarioRetornado.plan.name : "",
              // PerfilId: usuarioRetornado.perfil ? usuarioRetornado.perfil.id : "",
            };

            response.json({
              data,
              token,
            });

          } else {
            const err: IError = { message: "Usuário ou senha incorretos", status: 403 };
            return next(err);
          }
        } else {
          response.json("Usuário ou senha inválidos");
        }
      })
      .catch((error: any) => {
        console.log(error);
        next(error);
      });
    }
  }

  public refreshToken(request: ICustomRequest, response: Response, next: NextFunction): void {
    const idUsuarioLogado = request.decoded.id;
    if (!idUsuarioLogado) {
      const err: IError = { message: "Não foi possível identificar o usuário", status: HttpStatus.BAD_REQUEST };
      return next(err);
    } else {
      User.findOne<User>({
        include: [{
          model: Plan,
        },
        {
          model: People,
        }],
        where: { id: idUsuarioLogado },
      })
      .then((usuarioRetornado: User) => {
        const token = helperAuth.generateToken(usuarioRetornado);
        response.json({
          data: {
            nome: usuarioRetornado.people.name,
            perfil: usuarioRetornado.plan.name,
          },
          token,
        });
      })
      .catch((error) => {
        next(error);
      });
    }
  }
}
