import { User } from "./../Models/User";

export class UserHelper {

  public exists = async (_name) => {
    const user: any = await User.findOne({
        where: {
            userName: { $like: `%${_name}%`},
        }
    })
    return user
  }

}
