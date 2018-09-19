import { sequelize } from "../sequelize";
import { Transaction } from "sequelize";

import { User } from "../Models/User";
import { People } from "../Models/People";
import { Plan } from "../Models/Plan";


export class UserRepository {

    constructor(){ }

    public async getAll(){
        const user: User[] = await User.findAll<User>({
            include:[People, Plan]
          });
        return user
    }

    public async getOne(_id){
        const user: User = await User.findOne<User>({
            include:[People, Plan],
            where:{id: _id}
          });
        return user
    }

    public async searchNameUser(_name) {
        const user: any = await User.findOne({
            limit: 20,
            where: {
                userName: { $like: `%${_name}%`},
            }
        })
        return user
    }

    public async create(user, next, response) {
        let newUser
        sequelize.transaction(async (t: Transaction) => {
            try {
                newUser = await user.save({transaction: t})
            } catch(err) {
                t.rollback();
                next(err);
            }
        })
        return newUser
    }

    public async update(_id, user, next) {
        sequelize.transaction(async (t: Transaction) => {
            try {
                await user.people.save({transaction: t})
                const updatedUser = await user.save({transaction: t})
                return updatedUser
            } catch (err) {
                t.rollback();
                console.log("----------------------", err)
                next(err);
            }
        })
    }

    public async delete(_id, next) {
        const user = await User.findOne({
            include:[People],
            where: { id: _id },
          }) as User
      
          user.people.destroy()
          .then((deletedUser) => {
            return deletedUser;
          })
          .catch((err) => {
            next(err);
          });
    }
}