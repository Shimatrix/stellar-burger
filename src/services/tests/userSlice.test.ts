import { configureStore } from '@reduxjs/toolkit';
import { userReducer, checkUserAuth, registerUser, loginUser, updateUser, logoutUser, authCheck, logout, checkUser } from '../slices/userSlice';
import { UserDto, TUserState, StatusRequest } from '../slices/userSlice';
import { getUserApi } from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';

jest.mock('../../utils/burger-api');
jest.mock('../../utils/cookie');

const mockUser: UserDto = {
  email: 'test@example.com',
  name: 'any user'
};

const initialState: TUserState = {
  isAuth: false,
  data: null,
  statusRequest: StatusRequest.Idle,
  error: ''
};

const testFulfilled = (actionType: string, payload: any, expectState: typeof initialState) => {
  const action = { type: actionType, payload };
  const state = userReducer(initialState, action);
  expect(state).toEqual(expectState);
};

describe('userSlice', () => {
  const createTestStore = () => configureStore({
    reducer: {
      user: userReducer
    }
  });

  test('должен вернуть начальное состояние', () => {
    const store = createTestStore();
    const state = store.getState().user;
    expect(state).toEqual(initialState);
  });

  test('должен обработать checkUserAuth.fulfilled', async () => {
    (getCookie as jest.Mock).mockReturnValue('some-token');
    (getUserApi as jest.Mock).mockResolvedValueOnce({ user: mockUser });

    const store = createTestStore();
    await store.dispatch(checkUserAuth() as any);
    const state = store.getState().user;
    expect(state.isAuth).toBe(true);
    expect(state.data).toEqual(mockUser);
    expect(state.statusRequest).toEqual(StatusRequest.Success);
  });

  test('должен обработать registerUser.fulfilled', () => {
    testFulfilled(registerUser.fulfilled.type, mockUser, {
      ...initialState,
      data: mockUser,
      statusRequest: StatusRequest.Success
    });
  });

  test('должен обработать loginUser.fulfilled', () => {
    testFulfilled(loginUser.fulfilled.type, mockUser, {
      ...initialState,
      data: mockUser,
      statusRequest: StatusRequest.Success
    });
  });

  test('должен обработать updateUser.fulfilled', () => {
    testFulfilled(updateUser.fulfilled.type, mockUser, {
      ...initialState,
      data: mockUser,
      statusRequest: StatusRequest.Success
    });
  });

  test('должен обработать logoutUser.fulfilled', () => {
    testFulfilled(logoutUser.fulfilled.type, undefined, {
      ...initialState,
      isAuth: false,
      data: null,
      statusRequest: StatusRequest.Idle
    });
  });

  test('должен обработать authCheck', () => {
    const action = { type: authCheck.type };
    const state = userReducer(initialState, action);
    expect(state.isAuth).toBe(true);
  });

  test('должен обработать logout', () => {
    const action = { type: logout.type };
    const state = userReducer(initialState, action);
    expect(state.isAuth).toBe(false);
    expect(state.data).toBeNull();
  });

  test('должен обработать checkUser', () => {
    const action = { type: checkUser.type, payload: mockUser };
    const state = userReducer(initialState, action);
    expect(state.data).toEqual(mockUser);
  });
});
