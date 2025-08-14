<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import router from "../router/routes";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import axios from "axios";
import SearchEvent from "./SearchEvent.vue";
import Button from "../reusableComponents/Button.vue";

const store = useStore();

const currentUser = computed(() => store.state.loggedInUser);

const getAllBookingEvents = ref<any>([]);

const fetchBookings = async (userId: number) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BOOKINGS}/getAllBookingEvents`,
    {
      params: { userId },
      withCredentials: true,
    }
  );
  getAllBookingEvents.value = response.data.data;
};
watch(
  currentUser,
  (user) => {
    if (user?.user_id) {
      fetchBookings(user.user_id);
    }
  },
  { immediate: true }
);
const searchTerm = ref("");
const filteredEvents = computed(() => {
  return getAllBookingEvents.value.filter((e: any) => {
    const search = searchTerm.value.toLowerCase();
    return (
      e.event.event_title.toLowerCase().includes(search) ||
      e.event.event_location.toLowerCase().includes(search)
    );
  });
});

const removeBookedEvent = async (bookingId: string, event: Event) => {
  event.stopPropagation();
  const confirmCancelBooking = confirm(
    "Are you sure you want to cancel the booking?"
  );
  if (confirmCancelBooking) {
    await store.dispatch("cancelBooking", bookingId);
    await fetchBookings(currentUser.value.user_id);
  }
};

const maxRating = 5;

const setRating = async (eventId: number, star: number, event: Event) => {
  event.stopPropagation();
  await store.dispatch("ratings", { eventId, star });
  await fetchBookings(currentUser.value.user_id);
};

const downloadBookings = async () => {
  const doc = new jsPDF();
  let qrContent = ``;
  let adjust = 20;
  filteredEvents.value.map((data: any) => {
    qrContent += `
          Booking ID: ${data.booking_id}
          Event: ${data.event.event_title}
          Date: ${new Date(data.event.event_date).toLocaleDateString()}
          Location: ${data.event.event_location}
          Price: ${data.event.price}
          `.trim();
    doc.setFontSize(16);
    doc.text("Booking details", 20, adjust);
    doc.setFontSize(12);
    doc.text(`Event: ${data.event.event_title}`, 20, adjust + 10);
    doc.text(
      `Date: ${new Date(data.event.event_date).toLocaleDateString()}`,
      20,
      adjust + 20
    );
    doc.text(`Location: ${data.event.event_location}`, 20, adjust + 30);
    doc.text(`Price: ${data.event.price}`, 20, adjust + 40);
    adjust += 60;
  });
  const qrDataUrl = await QRCode.toDataURL(qrContent);
  doc.addImage(qrDataUrl, "PNG", 150, 35, 40, 40);
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  const bookingId = `${timestamp}-${randomString}`;
  doc.save(`${bookingId}.pdf`);
};

const showTickets = (id: number) => {
  router.push(`/tickets/${id}`);
};

const pdfDownloadTagData = {
  type: "button",
  class:
    "bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-4 rounded-xl shadow-md hover:scale-105 transition-transform mt-4 mr-4",
  spanContent: "🎫 Download Bookings",
};

const searchedValue = (term: string) => {
  searchTerm.value = term;
};
</script>

<template>
  <div class="flex w-[100%] justify-between">
    <div>
      <SearchEvent @filter-event="searchedValue" />
    </div>
    <Button @click="downloadBookings" :buttonTagData="pdfDownloadTagData" />
  </div>
  <v-row v-if="filteredEvents.length > 0" v-for="booking in filteredEvents">
    <v-col cols="12">
      <v-card
        @click="showTickets(booking.event.event_id)"
        color="surface-variant"
        :key="booking.event.event_id"
        :image="booking.event.image_url"
        style="min-height: 50vh; background-size: cover"
      >
        <div class="flex justify-between">
          <v-card-title>
            <strong>{{ booking.event.event_title }}</strong>
          </v-card-title>
          <div class="star-rating">
            <span
              v-for="star in maxRating"
              :key="star"
              @click="setRating(booking.event.event_id, star, $event)"
              :class="{ filled: star <= (booking.ratings || 0) }"
            >
              &#9733;
            </span>
            <i
              @click="removeBookedEvent(booking.booking_id, $event)"
              class="mdi mdi-close"
            ></i>
          </div>
        </div>
        <v-card-title>
          {{ booking.event.event_location }}
        </v-card-title>
        <v-card-subtitle>
          <strong>{{
            new Date(booking.event.event_date).toLocaleDateString()
          }}</strong>
        </v-card-subtitle>
        <div class="text-h5 ml-3 mt-3">
          <strong>₹{{ booking.event.price }}</strong>
        </div>
        <div class="text-h7 ml-3 mt-3">
          Payment Status:
          <strong class="text-green-500">Completed</strong>
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-card v-else class="text-center justify-between mt-5"
    >No booked events available</v-card
  >
</template>

<style scoped>
.mdi-close {
  color: red;
  font-size: 30px;
  margin-right: 12px;
}

.mdi-close:hover {
  cursor: pointer;
}

.star-rating span {
  font-size: 2em;
  cursor: pointer;
  color: #ccc;
}
.star-rating span.filled {
  color: gold;
}

.pagination {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}

button {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  user-select: none;
  border-radius: 4px;
}

button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

button.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
