import {
  authSlice,
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout
} from "../../../../src/store/auth/authSlice";
import {
  authenticatedState,
  initialState,
  notAuthenticatedState
} from "../../fixtures/authState";
import { testUserCredentials } from "../../fixtures/testUser";

describe("authSlice test", () => {
  test("should return the initial state", () => {
    expect(authSlice.getInitialState()).toEqual(initialState);
  });

  test("should log in", () => {
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    expect(state).toEqual({
      status: "authenticated",
      user: testUserCredentials,
      errorMessage: undefined
    });
  });

  test("should log out", () => {
    const state = authSlice.reducer(authenticatedState, onLogout());
    expect(state).toEqual(notAuthenticatedState);
  });

  test("should log out with errorMessage", () => {
    const errorMessage = "This was an error";
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    expect(state).toEqual({
      ...notAuthenticatedState,
      errorMessage
    });
  });

  test("should clear the error message", () => {
    const errorMessage = "This was an error";
    const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
    const newState = authSlice.reducer(state, clearErrorMessage());
    expect(newState).toEqual(notAuthenticatedState);
  });

  test("should checking", () => {
    const state = authSlice.reducer(authenticatedState, onChecking());
    expect(state).toEqual(initialState);
  });
});
