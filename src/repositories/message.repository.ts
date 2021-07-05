import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, Filter, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Message, MessageRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class MessageRepository extends DefaultCrudRepository<
  Message,
  typeof Message.prototype.id,
  MessageRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Message.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Message, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
  }

  filterMessages(senderId: number, receiverId: number): Filter<Message> {
    return {
      fields: {
        senderId:true,
        receiverId:true,
        content:true,
        date:true,
        isfile: true,
      },
      where: {
        or: [
          {senderId:senderId, receiverId:receiverId},
          {senderId:receiverId, receiverId:senderId}
        ]
      }
    }
  }
}
