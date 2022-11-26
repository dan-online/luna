import { getModelForClass, modelOptions } from '@typegoose/typegoose';
import { ObjectType } from 'type-graphql';
import { getMongo } from '../../utils/mongo';
import { BaseUser } from './BaseUser';

@ObjectType()
@modelOptions({ options: { customName: 'academic' }, existingConnection: getMongo(), schemaOptions: { timestamps: true, autoIndex: true } })
export class AcademicSchema extends BaseUser {}

export const AcademicModel = getModelForClass(AcademicSchema);
