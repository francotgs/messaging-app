import {repository} from '@loopback/repository';
import {User} from '../models';
import {UserRepository} from '../repositories';

export class AuthService{
  constructor(
    @repository(UserRepository)
    public userRepositroy: UserRepository
  ){

  }


  async Identify(username: string, password: string): Promise<User | false>{
    let user = await this.userRepositroy.findOne({where:{username:username}})
    if(user){
      if(user.password == password){
        return user;
      }
    }
    return false;
  }
}
