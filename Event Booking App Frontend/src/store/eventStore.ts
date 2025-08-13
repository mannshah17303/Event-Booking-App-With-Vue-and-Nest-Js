import axios from "axios";
import { toast } from "vue3-toastify";
import { createStore, Store } from "vuex";
import router from "../router/routes";

interface Event {
  event_id: number;
  event_date: Date;
  event_title: string;
  event_location: string;
  event_description: string;
  price: string;
  image_url: string;
  ratings: number;
}

interface State {
  events: Event[];
  isLoading: boolean;
  loggedInUser: any | null;
}

const store: Store<State> = createStore({
  state: {
    events: [],
    isLoading: true,
    loggedInUser: null,
  },
  mutations: {
    SET_EVENT(state: State, events: Event[]) {
      state.events = events;
    },
    SET_LOGGED_IN_USER(state: State, user: any) {
      state.loggedInUser = user;
    },
    SPINNER_LOADING_VALUE(state: State, loading: boolean) {
      state.isLoading = loading;
    },
    CLEAR_LOGGED_IN_USER(state: State) {
      state.loggedInUser = null;
    },
    EDITED_DATA(state: State, editedData: any) {
      state.loggedInUser = editedData;
      toast.success("Edited successful", {
        position: "top-right",
        autoClose: 3000,
      });
    },
  },
  actions: {
    loadEvents({ commit }, events: Event[]) {
      commit("SET_EVENT", events);
    },
    async fetchFullUserData({ commit }) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_USERS}/current-user`,
          {
            withCredentials: true,
          }
        );
        const user = res.data.user;
        commit("SET_LOGGED_IN_USER", user);
      } catch (error) {
        const currentPath = router.currentRoute.value.path;
        const publicRoutes = ["/", "/register", "/events"];
        if (!publicRoutes.includes(currentPath)) {
          toast.error("Token expired. Please login again", {
            position: "top-right",
            autoClose: 1000,
          });
          router.push("/");
        }
      }
    },
    async addFavorite({ state }, event_id: number) {
      await axios.post(
        `${import.meta.env.VITE_FAVORITES}/addFavorite`,
        { event_id, currentUserId: state.loggedInUser.user_id },
        {
          withCredentials: true,
        }
      );
    },
    async removeFavorite({ state }, event_id: number) {
      await axios.post(
        `${import.meta.env.VITE_FAVORITES}/removeFavorite`,
        { event_id, currentUserId: state.loggedInUser.user_id },
        {
          withCredentials: true,
        }
      );
    },
    async addBooking({}, bookedEvent: any) {
      await axios.post(
        `${import.meta.env.VITE_BOOKINGS}/addBooking`,
        bookedEvent,
        {
          withCredentials: true,
        }
      );

      toast.success("Event Booked successfully", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    async cancelBooking({}, bookingToRemove: number) {
      await axios.delete(
        `${import.meta.env.VITE_BOOKINGS}/removeBooking/${bookingToRemove}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Your booking has been successfully canceled!", {
        position: "top-right",
        autoClose: 3000,
      });
    },
    async ratings({ state }, rating: { eventId: number; star: number }) {
      await axios.post(
        `${import.meta.env.VITE_BOOKINGS}/updateRatings`,
        { rating, currentUserId: state.loggedInUser.user_id },
        {
          withCredentials: true,
        }
      );
    },
    async editUserData(
      { commit },
      editedData: {
        user_id: string;
        updatedUser: { name: string; email: string; role: string };
      }
    ) {
      const response = await axios.put(
        `${import.meta.env.VITE_USERS}/update/${editedData.user_id}`,
        editedData.updatedUser,
        {
          withCredentials: true,
        }
      );
      commit("EDITED_DATA", response.data.data);
    },
  },
  getters: {
    getAllEvents: (state: State) => {
      return state.events || [];
    },
  },
});

export default store;
