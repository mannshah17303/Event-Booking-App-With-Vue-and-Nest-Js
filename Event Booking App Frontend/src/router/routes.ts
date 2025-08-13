import { createRouter, createWebHistory } from "vue-router";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import EventCard from "../views/EventCard.vue";
import store from "../store/eventStore";
import axios from "axios";
import EventDetail from "../components/EventDetail.vue";
import MyBookings from "../components/MyBookings.vue";
import Favorites from "../components/Favorites.vue";
import Calendar from "../components/Calendar.vue";
import Tickets from "../components/Tickets.vue";
import Account from "../components/Account.vue";

const checkAuth = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_USERS}/current-user`, {
      withCredentials: true,
    });
    store.commit("SET_LOGGED_IN_USER", res.data.user);
    return res.data.user;
  } catch (err) {
    store.commit("CLEAR_LOGGED_IN_USER");
    return null;
  }
};

const routes = [
  {
    path: "/",
    component: Login,
    beforeEnter: async (_to: any, _from: any, next: any) => {
      const user = await checkAuth();
      if (user) {
        next({
          path: "/events",
        });
      } else {
        next();
      }
    },
  },
  {
    path: "/register",
    component: Register,
    beforeEnter: async (_to: any, _from: any, next: any) => {
      const user = await checkAuth();
      if (user) {
        next({
          path: "/events",
        });
      } else {
        next();
      }
    },
  },
  { path: "/events", component: EventCard },
  { path: "/events/:id", component: EventDetail },
  {
    path: "/my-bookings",
    component: MyBookings,
  },
  {
    path: "/tickets/:id",
    component: Tickets,
  },
  {
    path: "/favorites",
    component: Favorites,
  },
  { path: "/events/calendar", component: Calendar },
  { path: "/account", component: Account },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
