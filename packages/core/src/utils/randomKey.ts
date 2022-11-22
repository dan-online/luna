import { Types } from 'mongoose';

export const randomKey = () => new Types.ObjectId().toString();
