import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Message,
} from '../models';
import {UserRepository} from '../repositories';

export class UserMessageController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/messages', {
    responses: {
      '200': {
        description: 'Array of User has many Message',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Message)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Message>,
  ): Promise<Message[]> {
    return this.userRepository.messages(id).find(filter);
  }

  @post('/users/{id}/messages', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Message)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {
            title: 'NewMessageInUser',
            exclude: ['id'],
            optional: ['senderId']
          }),
        },
      },
    }) message: Omit<Message, 'id'>,
  ): Promise<Message> {
    return this.userRepository.messages(id).create(message);
  }

  @patch('/users/{id}/messages', {
    responses: {
      '200': {
        description: 'User.Message PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {partial: true}),
        },
      },
    })
    message: Partial<Message>,
    @param.query.object('where', getWhereSchemaFor(Message)) where?: Where<Message>,
  ): Promise<Count> {
    return this.userRepository.messages(id).patch(message, where);
  }

  @del('/users/{id}/messages', {
    responses: {
      '200': {
        description: 'User.Message DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Message)) where?: Where<Message>,
  ): Promise<Count> {
    return this.userRepository.messages(id).delete(where);
  }
}
