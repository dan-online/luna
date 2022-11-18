import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { mongooseConnection } from '../../utils/mongo';
import { UserSchema } from './User.model';

@modelOptions({ existingConnection: mongooseConnection })
export class SchoolSchema {
  @prop()
  public name?: string;

  @prop({ ref: () => UserSchema })
  public owner?: Ref<UserSchema>;
}

export const SchoolModel = getModelForClass(SchoolSchema);
