import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { AppRouter } from "../../src/router/AppRouter";

jest.mock("../../src/hooks/useAuthStore");
jest.mock("../../src/calendar", () => ({
  CalendarPage: () => <h1>Calendar Page</h1>
}));

describe("AppRouter test", () => {
  const mockCheckAuthToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Should show the load screen and call the checkAuthToken", () => {
    //que diga cargando y que la funcion del  useEffect
    //haya sido llamada
    useAuthStore.mockReturnValue({
      status: "checking",
      checkAuthToken: mockCheckAuthToken
    });
    const { getByText } = render(<AppRouter />);
    expect(getByText("Cargando...")).toBeTruthy();
    waitFor(() => expect(checkAuthToken).toHaveBeenCalled());
  });

  test("should show the login if the user is not authenticated", () => {
    useAuthStore.mockReturnValue({
      status: "not-authenticated",
      checkAuthToken: mockCheckAuthToken
    });
    const { container, getByText } = render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    //screen.debug();
    expect(getByText("Ingreso")).toBeTruthy();
    expect(container).toMatchSnapshot();
    expect(getByText("Registro")).toBeTruthy();
  });

  test("should show the calendar if the user is authenticated", () => {
    useAuthStore.mockReturnValue({
      status: "authenticated",
      checkAuthToken: mockCheckAuthToken
    });
    render(
      <MemoryRouter>
        <AppRouter />
      </MemoryRouter>
    );
    expect(screen.getByText("Calendar Page")).toBeTruthy();
  });
});
