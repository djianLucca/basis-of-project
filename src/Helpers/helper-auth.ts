import * as jwt from "jwt-simple";
import * as moment from "moment";
import { User } from "./../Models/User";

const secretJwtKey = process.env.JWT_SECRET || "secretApiKey";

export class HelperAuth {

  public generateToken = (user: any): string => {
    const expires = moment().add(1, "days").valueOf();
    const roles = ""//: Permissao[] = user.perfil ? user.perfil.permissoes : [];

    const token = jwt.encode({
      exp: expires,
      id: user.id,
      roles,
      usuario: user,
    }, secretJwtKey);
    return token;
  }

  public decodedToken = (token: any): string => {
    return jwt.decode(token, secretJwtKey);
  }

  public generateShortToken = (user: any): string => {
    const expires = moment().add(30, "minutes").valueOf();
    const token = jwt.encode({
      email: user.pessoa.email,
      exp: expires,
      id: user.id,
    }, secretJwtKey);
    return token;
  }
}
