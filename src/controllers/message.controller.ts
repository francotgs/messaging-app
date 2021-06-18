import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Message} from '../models';
import {MessageRepository} from '../repositories';

export class MessageController {
  constructor(
    @repository(MessageRepository)
    public messageRepository : MessageRepository,
  ) {}

  @post('/messages')
  @response(200, {
    description: 'Message model instance',
    content: {'application/json': {schema: getModelSchemaRef(Message, {
      title: 'NewMessage',
      exclude: ['id', 'date'],
    })}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {
            title: 'NewMessage',
            exclude: ['id'],
          }),
        },
      },
    })
    message: Omit<Message, 'id'>,
  ): Promise<Message> {
    return this.messageRepository.create(message);
  }

  @get('/messages/count')
  @response(200, {
    description: 'Message model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Message) where?: Where<Message>,
  ): Promise<Count> {
    return this.messageRepository.count(where);
  }

  @get('/messages')
  @response(200, {
    description: 'Array of Message model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Message, {includeRelations: true}),
        },
      },
    },
  })
  async find(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  @get('/conversations')
  @response(200, {
    description: 'Array of Message model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Message, {includeRelations: true}),
        },
      },
    },
  })
  async findConversation(
    @param.query.number('senderId') senderId: number,
    @param.query.number('receiverId') receiverId: number,
  ): Promise<Message[]> {
    return this.messageRepository.find(this.messageRepository.filterMessages(senderId, receiverId));
  }

  @patch('/messages')
  @response(200, {
    description: 'Message PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {partial: true}),
        },
      },
    })
    message: Message,
    @param.where(Message) where?: Where<Message>,
  ): Promise<Count> {
    return this.messageRepository.updateAll(message, where);
  }

  @get('/messages/{id}')
  @response(200, {
    description: 'Message model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Message, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Message, {exclude: 'where'}) filter?: FilterExcludingWhere<Message>
  ): Promise<Message> {
    return this.messageRepository.findById(id, filter);
  }

  @patch('/messages/{id}')
  @response(204, {
    description: 'Message PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {partial: true}),
        },
      },
    })
    message: Message,
  ): Promise<void> {
    await this.messageRepository.updateById(id, message);
  }

  @put('/messages/{id}')
  @response(204, {
    description: 'Message PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() message: Message,
  ): Promise<void> {
    await this.messageRepository.replaceById(id, message);
  }

  @del('/messages/{id}')
  @response(204, {
    description: 'Message DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.messageRepository.deleteById(id);
  }
}
