import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt"
import { UserRepository } from "../Repository/User-Repository";
import * as Uuid from "uuid";
import { UserHelper } from "./../Helpers/User-Helper";

import { User } from "../Models/User";
import { People } from "../Models/People";
import { Plan } from "../Models/Plan";

const repository = new UserRepository()
const userHelper = new UserHelper()

export class UserController {
    constructor() {}    
    
    public async getAll(request: Request, response: Response, next: NextFunction) {
        try {
            await repository.getAll().then(data => response.json(data));
        } catch (err) {
          next(err);
        }
    }

    public async getOne(request: Request, response: Response, next: NextFunction) {
        const _id = request.params._id
        const user = await repository.getOne(_id)
        response.json(user)
    }

    public async create(request: Request, response: Response, next: NextFunction) {

        const exist = await userHelper.exists(request.body.userName)
        try {
            if(exist) {
                throw "User already exist";
            }

            const people = await People.build<People>({
                address: request.body.people.address,
                addressNumber: request.body.people.addressNumber,
                country: request.body.people.country,
                id: Uuid(),
                name: request.body.people.name,
                phone: request.body.people.phone,
                state: request.body.people.state,
            })
    
            const user = await User.build<User>({
                PeopleId: people.get({plain: true}).id,
                PlanId: request.body.PlanId,
                active: false,
                id: Uuid(),
                password: bcrypt.hashSync(request.body.password, 10),
                people,
                userName: request.body.userName,
            }, {
                include: [People]
            })
            
            await repository.create(user, next, response)
            response.json(true)
        } catch (err) {
          response.json(err)
          next(err);
        }
    }

    public async update(request: Request, response: Response, next: NextFunction) {
        const _id = request.params._id
        const exist = await userHelper.exists(request.body.userName)
        try {
            if(exist) {
                throw "User already exist";
            }

            let userUpdate = await repository.getOne(_id)
            if(request.body.PlanId) { userUpdate.PlanId = request.body.PlanId }
            if(request.body.password) { userUpdate.password = bcrypt.hashSync(request.body.password, 10)}
            if(request.body.userName) { userUpdate.userName = request.body.userName }

            if(request.body.people.address) { userUpdate.people.address = request.body.people.address }
            if(request.body.people.addressNumber) { userUpdate.people.addressNumber = request.body.people.addressNumber }
            if(request.body.people.country) { userUpdate.people.country = request.body.people.country }
            if(request.body.people.name) { userUpdate.people.name = request.body.people.name }
            if(request.body.people.phone) { userUpdate.people.phone = request.body.people.phone }
            if(request.body.people.state) { userUpdate.people.state = request.body.people.state }


            await repository.update(_id, userUpdate, next).then(data => response.json(data));
            
        } catch (err) {
             response.json(err)
             next(err);
        }
    }

    public async delete(request: Request, response: Response, next: NextFunction) {
        const _id = request.params._id

        const user = await repository.delete(_id, next)
        response.json(user)
    }
}