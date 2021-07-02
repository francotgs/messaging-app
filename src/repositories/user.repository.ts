import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, Filter, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Message} from '../models';
import {MessageRepository} from './message.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly messages: HasManyRepositoryFactory<Message, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('MessageRepository') protected messageRepositoryGetter: Getter<MessageRepository>,
  ) {
    super(User, dataSource);
    this.messages = this.createHasManyRepositoryFactoryFor('messages', messageRepositoryGetter,);
  }

  filterUsers(): Filter<User> {
    return {
      fields: {
        username:true,
        id: true
      }
    }
  }
}
