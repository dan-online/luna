import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { z } from 'zod';
import { mongooseConnection } from '../../utils/mongo';
import { nameRegex } from '../../utils/regex';

@modelOptions({ existingConnection: mongooseConnection })
export class UserSchema {
  @prop({ validate: (input: string) => z.string().min(3).max(120).regex(nameRegex).parse(input) })
  public name?: string;
}

export const UserModel = getModelForClass(UserSchema);
