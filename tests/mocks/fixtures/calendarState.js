export const events = [
  {
    id: 1,
    start: new Date("2022-10-21 13:00:00"),
    end: new Date("2022-10-21 15:00:00"),
    title: "Cumpleaños de Pablo",
    notes: "Hay que comprar el pastel"
  },
  {
    id: 2,
    start: new Date("2022-11-09 13:00:00"),
    end: new Date("2022-11-09 15:00:00"),
    title: "Cumpleaños de Ariel",
    notes: "Alguna nota de Ariel"
  }
];

export const initialState = {
  isLoadingEvents: true,
  events: [],
  activeEvent: null
};

export const calendarWithEventsState = {
  isLoadingEvents: false,
  events: [...events], //esto lo uso para romper referencias
  activeEvent: null
};

export const calendarWithActiveEventsState = {
  isLoadingEvents: false,
  events: [...events], //esto lo uso para romper referencias
  activeEvent: { ...events[0] } //esto lo uso para romper referencias
};
