import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Message extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'number',
    required: true,
  })
  receiverId: number;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  date?: string;

  @belongsTo(() => User, {name: 'user'})
  senderId: number;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {
  // describe navigational properties here
}

export type MessageWithRelations = Message & MessageRelations;
