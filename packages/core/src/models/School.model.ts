import { getModelForClass, prop } from '@typegoose/typegoose';

class SchoolClass {
  @prop()
  public name?: string;
}

export const SchoolModel = getModelForClass(SchoolClass);
