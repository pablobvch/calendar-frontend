import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import * as ReactRedux from "react-redux";
import calendarApi from "../../src/api/calendarApi";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store/auth/authSlice";
import {
  authenticatedState,
  initialState,
  notAuthenticatedState
} from "../mocks/fixtures/authState";
import { testUserCredentials } from "../mocks/fixtures/testUser";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer
    },
    preloadedState: {
      auth: { ...initialState }
    }
  });
};

describe("useAuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test("should return the default values", () => {
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    expect(result.current).toEqual({
      ...initialState,
      checkAuthToken: expect.any(Function),
      //Por ahora no hace falta probar esto, ya se va a probar luego
      startLogin: expect.any(Function),
      startLogout: expect.any(Function),
      startRegister: expect.any(Function)
    });
  });

  test("should startLogin log in properly", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.startLogin(testUserCredentials);
    });

    const { errorMessage, user, status } = result.current;
    expect({ errorMessage, user, status }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: { name: "test", uid: "6328b9e0ef894deb4fccadc7" }
    });
    expect(localStorage.getItem("token")).toEqual(expect.any(String));
    expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String));
  });

  test("should startLogin log in with errors", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.startLogin({
        email: "fake@mail.com",
        password: "fakePa$$word"
      });
    });

    const { errorMessage, user, status } = result.current;

    expect({ errorMessage, user, status }).toEqual({
      errorMessage: expect.any(String),
      user: {},
      status: "not-authenticated"
    });
    expect(localStorage.getItem("token")).toBe(null);
    expect(localStorage.getItem("token-init-date")).toBe(null);
    waitFor(() => expect(result.current.errorMessage).toBe(undefined));
  });

  test("should startRegister sign up an user", async () => {
    const newUser = {
      email: "algo@email.com",
      password: "123456",
      name: "Test User 2"
    };

    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        ok: true,
        uid: "123456",
        name: "Test User 2",
        token: "Token"
      }
    });

    await act(async () => {
      await result.current.startRegister({
        registerName: newUser.name,
        registerEmail: newUser.email,
        registerPassword: newUser.password
      });
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: { name: "Test User 2", uid: "123456" }
    });

    spy.mockRestore();
  });

  test("startRegister should fail", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.startRegister({
        registerName: testUserCredentials.name,
        registerEmail: testUserCredentials.email,
        registerPassword: testUserCredentials.password
      });
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: "There is an user with this email",
      status: "not-authenticated",
      user: {}
    });
  });

  test("checkAuthToken should fail if there is no token", async () => {
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual(notAuthenticatedState);
  });

  test("checkAuthToken should fail if there is no token", async () => {
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual(notAuthenticatedState);
  });

  test("should checkAuthToken log in the token", async () => {
    const { data } = await calendarApi.post("/auth", testUserCredentials);
    localStorage.setItem("token", data.token);
    const mockStore = getMockStore({ ...initialState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: {
        name: "test",
        uid: "6328b9e0ef894deb4fccadc7"
      }
    });
  });

  test("startLogout should logout", async () => {
    localStorage.setItem("token", "ABCToken");
    localStorage.setItem("token-init-date", "123456789");
    const mockStore = getMockStore({ ...authenticatedState });

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <ReactRedux.Provider store={mockStore}>{children}</ReactRedux.Provider>
      )
    });

    await act(async () => {
      await result.current.startLogout();
    });
    const { errorMessage, status, user } = result.current;
    expect({ errorMessage, status, user }).toEqual(notAuthenticatedState);

    //expect(localStorage.getItem("token")).toBe(null);
    //expect(localStorage.getItem("token-init-date")).toBe(null);
  });
});
