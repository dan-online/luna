import { getModelForClass, prop } from '@typegoose/typegoose';
import { z } from 'zod';
import { nameRegex } from '../../utils/regex';

export class UserSchema {
  @prop({ validate: (input: string) => z.string().min(3).max(120).regex(nameRegex).parse(input) })
  public name?: string;
}

export const UserModel = getModelForClass(UserSchema);
