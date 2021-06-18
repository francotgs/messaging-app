import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Message,
  User,
} from '../models';
import {MessageRepository} from '../repositories';

export class MessageUserController {
  constructor(
    @repository(MessageRepository)
    public messageRepository: MessageRepository,
  ) { }

  @get('/messages/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Message',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Message.prototype.id,
  ): Promise<User> {
    return this.messageRepository.user(id);
  }
}
