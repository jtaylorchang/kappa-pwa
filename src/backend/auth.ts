import {
  ENDPOINTS,
  METHODS,
  TResponseData,
  makeRequest,
  makeAuthorizedRequest,
  pass,
  fail,
  TBlame
} from '@backend/backend';
import { deviceId, sleep } from '@services/utils';
import { validate, USERNAME, EMAIL, PASSWORD } from '@backend/validators';
import { getBatch, deleteBatch } from '@services/secureStorage';
import { log } from '@services/logService';

export interface TGoogleUser {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  photoUrl: string;
}

export const initialGoogleUser: TGoogleUser = {
  email: '',
  familyName: '',
  givenName: '',
  id: '',
  photoUrl: ''
};

export interface TUser {
  _id: string;
  sessionToken: string;
  email: string;
  familyName: string;
  givenName: string;
  role?: string;
  privileged?: boolean;
}

export const initialUser: TUser = {
  _id: '',
  sessionToken: '',
  role: '',
  privileged: false,

  email: '',
  familyName: '',
  givenName: ''
};

export const incompleteUser: TUser = {
  _id: '',
  sessionToken: '',
  email: '',
  familyName: '',
  givenName: ''
};

export interface TUserResponse {
  sessionToken: string;
  _id: string;
  email: string;
  familyName: string;
  givenName: string;
  role?: string;
  privileged?: boolean;
}

export const purge = async () => {
  return deleteBatch('user', initialUser);
};

export interface TSignInPayload {
  email: string;
  idToken: string;
}

interface TSignInRequestResponse {
  sessionToken: string;
  user: TUserResponse;
}

interface TSignInResponse extends TResponseData {
  data?: {
    user: TUserResponse;
  };
}

export const signIn = async (payload: TSignInPayload): Promise<TSignInResponse> => {
  const body: {
    user: {
      email: string;
    };
    idToken: string;
  } = {
    user: {
      email: payload.email
    },
    idToken: payload.idToken
  };

  const response = await makeRequest<TSignInRequestResponse>(ENDPOINTS.SIGN_IN, METHODS.SIGN_IN, {
    body
  });

  log('Sign in response', response);

  if (!response.success || response.code === 500) {
    return fail({}, 'problem connecting to server');
  } else if (response.code !== 200) {
    if (response.code === 401) {
      return fail({}, 'your netid was not recognized');
    }

    return fail({}, '');
  }

  return {
    success: true,
    data: {
      user: {
        ...response.data.user,
        sessionToken: response.data.sessionToken
      }
    }
  };
};
