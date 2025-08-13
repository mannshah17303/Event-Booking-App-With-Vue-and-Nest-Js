<script setup lang="ts">
import { useStore } from "vuex";
import router from "../router/routes";
import { computed, ref, watch } from "vue";
import { VueSpinner } from "vue3-spinners";
import axios from "axios";

const store = useStore();

const showEventDetails = (id: number) => {
  router.push(`/events/${id}`);
};

const currentUser = computed(() => store.state.loggedInUser);

const spinnerLoading = computed(() => store.state.isLoading);

const filteredEvents = ref<any>([]);

const fetchFavorites = async (userId: number) => {
  const response = await axios.get(
    `${import.meta.env.VITE_FAVORITES}/getAllFavoriteEvents`,
    {
      params: {
        userId,
      },
      withCredentials: true,
    }
  );
  filteredEvents.value = response.data.data;
};
watch(
  currentUser,
  (user) => {
    if (user?.user_id) {
      fetchFavorites(user.user_id);
    }
  },
  { immediate: true }
);
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
    v-for="favorite in filteredEvents"
  >
    <v-col cols="12">
      <v-card
        color="surface-variant"
        :key="favorite.event.event_id"
        :image="favorite.event.image_url"
        style="min-height: 50vh; background-size: cover; overflow: hidden"
        @click="showEventDetails(favorite.event.event_id)"
      >
        <v-card-title style="display: flex">
          <strong>{{ favorite.event.event_title }}</strong>
        </v-card-title>
        <v-card-subtitle>
          <strong>{{ favorite.event.event_description }}</strong>
        </v-card-subtitle>
        <v-card-subtitle class="mt-3">
          <strong>{{ favorite.event.event_location }}</strong>
        </v-card-subtitle>
        <v-card-subtitle class="mt-3">
          <strong>₹{{ favorite.event.price }}</strong>
        </v-card-subtitle>
      </v-card>
    </v-col>
  </v-row>
  <v-card v-else class="text-center justify-between mt-5"
    >No Favorite Events Available</v-card
  >
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
