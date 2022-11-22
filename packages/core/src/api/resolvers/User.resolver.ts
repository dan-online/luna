import { GraphQLError } from 'graphql';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { UserModel, UserSchema } from '../../orm';
import { LoginInput, RegisterInput } from '../inputs/User';
import { LoginOutput, RegisterOutput } from '../outputs/User';

@Resolver(() => UserSchema)
export class UserResolver {
  @Query(() => String)
  public hello(): string {
    return 'Hello World!';
  }

  @Mutation(() => RegisterOutput)
  public async register(@Arg('user') userInput: RegisterInput): Promise<RegisterOutput> {
    const newUser = new UserModel({
      email: userInput.email,
      name: userInput.name,
      birthday: userInput.birthday,
      username: userInput.username
    });

    await newUser.hashPassword(userInput.password);

    const user = await newUser.save();
    const token = await user.getToken();

    return {
      token
    };
  }

  @Mutation(() => LoginOutput)
  public async login(@Arg('user') userInput: LoginInput): Promise<LoginOutput> {
    const foundUser = await UserModel.findOne({ email: userInput.email });

    if (!foundUser) {
      throw new GraphQLError('Invalid credentials', {
        extensions: {
          code: 'FORBIDDEN'
        }
      });
    }

    const checkLogin = await foundUser.checkPassword(userInput.password);

    if (!checkLogin) {
      throw new GraphQLError('Invalid credentials', {
        extensions: {
          code: 'FORBIDDEN'
        }
      });
    }

    const token = await foundUser.getToken();

    return {
      token
    };
  }
}
