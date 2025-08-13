<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { VueSpinner } from "vue3-spinners";
import { useStore } from "vuex";
import router from "../router/routes";
import axios from "axios";
import { toast } from "vue3-toastify";

const store = useStore();

const filteredEvents = computed(() => store.getters.getAllEvents);
const currentUser = computed(() => store.state.loggedInUser);
const showRedColorInFavoriteEvents: any = ref([]);
watch(
  currentUser,
  async (newUser) => {
    if (!newUser) return;
    const response = await axios.get(
      `${import.meta.env.VITE_FAVORITES}/showRedColorInFavoriteEvents`,
      {
        params: { userId: newUser.user_id },
        withCredentials: true,
      }
    );
    showRedColorInFavoriteEvents.value = response.data.data;
  },
  { immediate: true }
);

const isFavorite = (eventId: number) => {
  if (!showRedColorInFavoriteEvents.value) return false;
  return showRedColorInFavoriteEvents.value.some(
    (fav: any) => fav.event.event_id === eventId
  );
};
const spinnerLoading = computed(() => store.state.isLoading);

const showEventDetails = (id: number) => {
  router.push(`/events/${id}`);
};

const vFadeIn = {
  mounted(el: HTMLElement, binding: { value: number }) {
    const delay = binding.value || 0;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, delay);
  },
};

const toggleHeart = (id: number, event: { stopPropagation: () => void }) => {
  event.stopPropagation();
  const index = showRedColorInFavoriteEvents.value.findIndex(
    (fav: any) => fav.event.event_id === id
  );
  if (index !== -1) {
    showRedColorInFavoriteEvents.value.splice(index, 1);
    store.dispatch("removeFavorite", id);
  } else if (currentUser.value === null) {
    toast.error("No user available! please login!");
  } else {
    showRedColorInFavoriteEvents.value.push({
      favorite_id: "",
      user: {
        user_id: currentUser.value.user_id,
      },
      event: {
        event_id: id,
      },
    });
    store.dispatch("addFavorite", id);
  }
};
</script>

<template>
  <div class="flex w-[100%] justify-between"></div>
  <div v-if="spinnerLoading" class="spinner-overlay">
    <VueSpinner
      size="50"
      color="black"
      class="flex justify-between align-middle"
    />
  </div>

  <v-row
    v-else-if="filteredEvents.length > 0"
    v-for="(event, index) in filteredEvents"
    :key="event.event_id"
  >
    <v-col cols="12">
      <v-card
        class="event-card"
        v-fade-in="index * 100"
        @click="showEventDetails(event.event_id)"
      >
        <div class="image-wrapper">
          <v-img
            :src="event.image_url"
            class="background-image"
            cover
            height="50vh"
          />
          <div class="card-content">
            <v-card-title style="display: flex">
              <strong>{{ event.event_title }}</strong>
              <i
                @click="toggleHeart(event.event_id, $event)"
                :class="
                  isFavorite(event.event_id)
                    ? 'mdi mdi-heart text-red-500'
                    : 'mdi mdi-heart'
                "
              ></i>
            </v-card-title>
            <v-card-subtitle>
              <strong>{{ event.event_description }}</strong>
            </v-card-subtitle>
            <v-card-subtitle class="mt-3">
              <strong>{{ event.event_location }}</strong>
            </v-card-subtitle>
            <v-card-subtitle class="mt-3">
              <strong>₹{{ event.price }}</strong>
            </v-card-subtitle>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>

  <v-card v-else class="text-center justify-between mt-5">
    No Events Available
  </v-card>
</template>

<style scoped>
.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper {
  position: relative;
  height: 50vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(8px);
  z-index: 0;
}

.card-content {
  position: relative;
  z-index: 1;
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
}
.mdi-heart {
  margin-left: auto;
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
  background-color: #3b82f6; /* blue */
  color: white;
  border-color: #3b82f6;
}
</style>
