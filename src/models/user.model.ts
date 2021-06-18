import {Entity, model, property, hasMany} from '@loopback/repository';
import {Message} from './message.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    }
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @hasMany(() => Message, {keyTo: 'senderId'})
  messages: Message[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
