import {
  calendarSlice,
  onAddNewEvent,
  onDeleteEvent,
  onLoadEvents,
  onLogoutCalendar,
  onSetActiveEvent,
  onUpdateEvent
} from "../../../../src/store/calendar/calendarSlice";
import {
  calendarWithActiveEventsState,
  calendarWithEventsState,
  events,
  initialState
} from "../../fixtures/calendarState";

describe("calendarSlice test", () => {
  test("should return the initial state", () => {
    const state = calendarSlice.getInitialState();
    expect(state).toEqual(initialState);
  });
  test("should onSetActiveEvent active the event", () => {
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onSetActiveEvent(events[0])
    );
    expect(state.activeEvent).toEqual(events[0]);
  });
  test("should onAddNewEvent add the event", () => {
    const newEvent = {
      id: 3,
      start: new Date("2022-11-09 13:00:00"),
      end: new Date("2022-11-09 15:00:00"),
      title: "Cumpleaños de BV",
      notes: "Alguna nota de BV"
    };
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onAddNewEvent(newEvent)
    );
    expect(state.events).toEqual([...events, newEvent]);
  });
  test("should onUpdateEvent update the event", () => {
    const updatedEvent = {
      id: 1,
      start: new Date("2023-12-15 16:50:00"),
      end: new Date("2023-12-15 18:50:00"),
      title: "Cumpleanios de Alaniz",
      notes: "Alaniz notes"
    };
    const state = calendarSlice.reducer(
      calendarWithEventsState,
      onUpdateEvent(updatedEvent)
    );
    expect(state.events).toContain(updatedEvent);
  });

  test("should onDeleteEvent remove the active event", () => {
    const state = calendarSlice.reducer(
      calendarWithActiveEventsState,
      onDeleteEvent()
    );
    expect(state.events).not.toContain(events[0]);
    expect(state.activeEvent).toBe(null);
  });

  test("should onLoadEvents set the events", () => {
    const state = calendarSlice.reducer(initialState, onLoadEvents(events));
    expect(state.isLoadingEvents).toBeFalsy();
    expect(state.events).toEqual(events);

    const newState = calendarSlice.reducer(state, onLoadEvents(events));
    expect(state.events.length).toBe(events.length);
  });

  test("should onLogoutCalendar clean the state", () => {
    const state = calendarSlice.reducer(
      calendarWithActiveEventsState,
      onLogoutCalendar()
    );
    expect(state).toEqual(initialState);
  });
});
