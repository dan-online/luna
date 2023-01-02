import { FastifyInstance } from 'fastify';
import { setupTests } from '../setupTests';

const RegisterUser = {
  query: `mutation Register($user: RegisterInput!) {
  register(user: $user) {
    token
  }
}`,
  variables: {
    user: {
      birthday: '2000-01-01T00:00:00.000Z',
      email: 'test@dancodes.online',
      firstName: 'Dan',
      password: 'Testing@!123',
      username: 'DanTests',
      lastName: 'Codes',
      middleName: 'Middle', // Mmmm Dan Middle Codes
      captcha: null
    }
  }
};

const LoginUser = {
  query: `mutation Login($user: LoginInput!) {
  login(user: $user) {
    token
  }
}`,
  variables: {
    user: {
      email: 'test@dancodes.online',
      password: 'Testing@!123'
    }
  }
};

const DeleteUser = {
  query: `mutation Mutation {
  deleteAccount
}`
};

describe('Luna', () => {
  let app: FastifyInstance;
  let userToken: string;

  setupTests((generatedApp) => {
    app = generatedApp;
  });

  test('GIVEN invalid user data THEN does not create user', async () => {
    const req = await app.inject({
      url: '/graphql',
      method: 'POST',
      payload: { ...RegisterUser, variables: { user: { ...RegisterUser.variables.user, email: 'test' } } }
    });

    const json = req.json();

    expect(json).toMatchObject({
      errors: [
        {
          message: 'Validation Error',
          extensions: {
            code: 'BAD_USER_INPUT',
            validationErrors: [
              {
                property: 'email',
                value: 'test',
                constraints: {
                  isEmail: 'email must be an email'
                }
              }
            ]
          }
        }
      ],
      data: null
    });
  });

  test('GIVEN no user THEN creates user', async () => {
    const req = await app.inject({
      url: '/graphql',
      method: 'POST',
      payload: RegisterUser
    });

    const json = req.json();

    expect(json).toMatchObject({
      data: {
        register: {
          token: expect.any(String)
        }
      }
    });

    userToken = json.data.register.token;
  });

  test('GIVEN user THEN login user', async () => {
    const req = await app.inject({
      url: '/graphql',
      method: 'POST',
      payload: LoginUser
    });

    const json = req.json();

    expect(json).toMatchObject({
      data: {
        login: {
          token: expect.any(String)
        }
      }
    });

    userToken = json.data.login.token;
  });

  test('GIVEN user THEN deletes user', async () => {
    const req = await app.inject({
      url: '/graphql',
      method: 'POST',
      payload: DeleteUser,
      headers: {
        authorization: `${userToken}`
      }
    });

    const json = req.json();

    expect(json).toEqual({
      data: {
        deleteAccount: true
      }
    });
  });
});
