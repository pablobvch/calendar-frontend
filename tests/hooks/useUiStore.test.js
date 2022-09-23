const { configureStore } = require("@reduxjs/toolkit");
const { renderHook } = require("@testing-library/react");
const { act } = require("react-dom/test-utils");
const { Provider } = require("react-redux");
const { useUiStore } = require("../../src/hooks");
const { store } = require("../../src/store/store");
const { uiSlice } = require("../../src/store/ui/uiSlice");

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer
    },
    preloadedState: {
      ui: { ...initialState }
    }
  });
};

describe("useUiStore test", () => {
  test("should return the default values", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      )
    });

    expect(result.current).toEqual({
      isDateModalOpen: false,
      closeDateModal: expect.any(Function),
      openDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function)
    });
  });

  test("should openDateModal change to true the isDateModalOpen value", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      )
    });

    const { openDateModal } = result.current;

    act(() => openDateModal());

    expect(result.current.isDateModalOpen).toBeTruthy();
  });

  test("should closeDateModal change to false the isDateModalOpen value", () => {
    const mockStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      )
    });

    const { closeDateModal } = result.current;

    act(() => closeDateModal());

    expect(result.current.isDateModalOpen).toBeFalsy();
  });

  test("should toggleDateModal change the isDateModalOpen value to true if it is false", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      )
    });

    const { toggleDateModal } = result.current;

    act(() => toggleDateModal());

    expect(result.current.isDateModalOpen).toBeTruthy();
  });

  test("should toggleDateModal change the isDateModalOpen value to false if it is true", () => {
    const mockStore = getMockStore({ isDateModalOpen: true });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      )
    });

    const { toggleDateModal } = result.current;

    act(() => toggleDateModal());

    expect(result.current.isDateModalOpen).toBeFalsy();
  });
});
