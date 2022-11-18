import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { UserSchema } from './User.model';

export class SchoolSchema {
  @prop()
  public name?: string;

  @prop({ ref: () => UserSchema })
  public owner?: Ref<UserSchema>;
}

export const SchoolModel = getModelForClass(SchoolSchema);
