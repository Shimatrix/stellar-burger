import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected
} from '@reduxjs/toolkit';

import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { RootState } from '../store';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const sliceName = 'user';

const enum StatusRequest {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed'
}

export type UserDto = {
  email: string;
  name: string;
};

export interface TUserState {
  isAuth: boolean;
  data: UserDto | null;
  statusRequest: StatusRequest;
  error?: string | null | undefined;
}

const initialState: TUserState = {
  isAuth: false,
  data: null,
  statusRequest: StatusRequest.Idle,
  error: null
};

export const checkUserAuth = createAsyncThunk<UserDto, void>(
  `${sliceName}/checkUserAuth`,
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    } finally {
      dispatch(authCheck());
    }
  }
);

export const registerUser = createAsyncThunk<UserDto, TRegisterData>(
  `${sliceName}/registerUser`,
  async (dataUser, { rejectWithValue }) => {
    const data = await registerUserApi(dataUser);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    setCookie('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const loginUser = createAsyncThunk<UserDto, TLoginData>(
  `${sliceName}/loginUser`,
  async (dataUser, { rejectWithValue }) => {
    const data = await loginUserApi(dataUser);
    if (!data?.success) {
      return rejectWithValue(data);
    }
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk<UserDto, Partial<UserDto>>(
  `${sliceName}/updateUser`,
  async (userData, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  `${sliceName}/logoutUser`,
  async (_, { dispatch }) => {
    await logoutApi().then(() => {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch(logout());
    });
  }
);

export const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuth = true;
    },
    logout: (state) => {
      state.isAuth = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.data = action.payload;
        state.statusRequest = StatusRequest.Success;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.statusRequest = StatusRequest.Success;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.statusRequest = StatusRequest.Success;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuth = false;
        state.data = null;
        state.statusRequest = StatusRequest.Idle;
      })
      .addMatcher(isPending, (state) => {
        state.statusRequest = StatusRequest.Loading;
      })
      .addMatcher(isRejected, (state) => {
        state.statusRequest = StatusRequest.Failed;
      });
  }
});

export const { authCheck, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
export const getUser = (state: RootState) => state.user.data;
export const getIsAuthChecked = (state: RootState) =>
  state.user.statusRequest !== StatusRequest.Idle;
export const getRegisteredUser = (state: RootState) => state.user.data;
export const getLoggedInUser = (state: RootState) => {
  const user = state.user.data;
  const isAuth = state.user.isAuth;

  return isAuth ? user : null;
};
