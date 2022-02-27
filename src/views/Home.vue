<template>
  <div id="home">
    <v-card width="90vw">
      <v-card-title class="d-flex justify-space-around">
        <span
          v-for="day in availableDates"
          :key="day.selector"
          @click="selectedDate = day.selector"
          :style="
            selectedDate === day.selector
              ? 'color: orange; font-weight: bolder'
              : ''
          "
        >
          {{ day.display }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-list v-if="!loading && this.devs">
          <template v-for="dev in devs">
            <v-list-group :key="dev.id">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="d-flex justify-center text-h5 pb-2">
                    {{ dev.name }}
                    <v-icon
                      class="ml-4"
                      @click.stop="setOut(dev.id, $event)"
                      color="warning"
                      :disabled="today !== selectedDate"
                    >
                      mdi-account-arrow-right-outline
                    </v-icon>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action
                  v-if="!out[dev.id] && done[dev.id]"
                  style="position: absolute"
                >
                  <v-icon color="success" large> mdi-check </v-icon>
                </v-list-item-action>
                <v-list-item-action
                  v-if="out[dev.id]"
                  style="position: absolute"
                >
                  <v-icon color="error" large> mdi-close </v-icon>
                </v-list-item-action>
              </template>
              <v-list-item-content
                v-if="dev.notes[selectedDate]"
                class="d-flex flex-column justify-space-around"
              >
                <v-text-field
                  v-model="dev.notes[selectedDate].yesterday"
                  label="Yesterday"
                  style="width: 50%"
                  :disabled="selectedDate !== today"
                />
                <v-text-field
                  v-model="dev.notes[selectedDate].today"
                  label="Today"
                  style="width: 50%"
                  :disabled="selectedDate !== today"
                />
                <v-text-field
                  v-model="dev.notes[selectedDate].blockers"
                  label="Blockers"
                  style="width: 50%"
                  append-outer-icon="mdi-cancel"
                  @click:append-outer="noBlockers(dev.id)"
                  :disabled="selectedDate !== today"
                />
              </v-list-item-content>
            </v-list-group>
            <v-divider :key="dev.id + 'd'" />
          </template>
        </v-list>
        <v-progress-linear v-if="loading" color="purple" indeterminate />
        <v-card-actions class="d-flex justify-center">
          <v-btn
            v-if="!loading"
            color="primary"
            @click="save"
            :disabled="devs[1].notes[today].id !== undefined"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "Home",
  data: () => ({
    dayjs,
    devs: {},
    selectedDate: "",
    today: dayjs().format("MM/DD"),
    loading: false,
    availableDates: [],
  }),
  async beforeMount() {
    this.loading = true;

    let day = dayjs();

    while ([0, 6].includes(day.day())) {
      day = day.subtract(1, "day");
    }

    this.selectedDate = day.format("MM/DD");

    const activeDevs = await this.$api.getActiveDevs();
    activeDevs.forEach((dev) => {
      this.$set(this.devs, dev.id, {
        notes: {},
        ...dev,
      });
    });
    const previousNotes = await this.$api.getPreviousNotes();
    previousNotes.forEach((note) => {
      this.$set(
        this.devs[note.dev_id].notes,
        dayjs(note.date).format("MM/DD"),
        note
      );
    });
    for (const id in this.devs) {
      if (!this.devs[id].notes[this.today]) {
        this.$set(this.devs[id].notes, this.today, {
          yesterday: "",
          today: "",
          blockers: "",
        });
        continue;
      }

      if (this.devs[id].notes[this.today].today === "OUT") {
        this.$set(this.devs[id], "out", true);
      }
    }
    this.setAvailableDates();
    this.loading = false;
  },
  methods: {
    noBlockers(id) {
      this.devs[id].notes[this.selectedDate].blockers = "N/A";
    },
    setOut(id) {
      const status = this.out[id] ? "" : "OUT";
      this.devs[id].notes[this.selectedDate].yesterday = status;
      this.devs[id].notes[this.selectedDate].today = status;
      this.devs[id].notes[this.selectedDate].blockers = status;
    },
    async save() {
      this.loading = true;
      const data = Object.values(this.devs).map((dev) => {
        return {
          ...dev.notes[this.today],
          dev_id: dev.id,
          date: dayjs().hour(0).minute(0).second(0).format(),
        };
      });
      const response = await this.$api.saveNotes(data);
      if (response.length !== data.length) {
        console.error("Something went wrong, not all data saved!");
      } else {
        response.forEach((res) => {
          this.$set(this.devs[res.dev_id].notes, this.today, res);
        });
      }
      this.loading = false;
    },
    setAvailableDates() {
      let day = dayjs().add(1, "day");
      for (let i = 0; i < 6; i++) {
        day = day.subtract(1, "day");
        if (day.day() === 0) {
          // Sunday
          day = day.subtract(2, "day");
        }
        if (day.day() === 6) {
          // Saturday
          day = day.subtract(1, "day");
        }
        this.availableDates.push({
          display: day.format("dddd MM/DD"),
          selector: day.format("MM/DD"),
        });
        Object.keys(this.devs).forEach((dev) => {
          if (!this.devs[dev].notes[day.format("MM/DD")]) {
            this.$set(this.devs[dev].notes, day.format("MM/DD"), {
              yesterday: "",
              today: "",
              blockers: "",
            });
          }
        });
      }
      this.availableDates = this.availableDates.reverse();
    },
  },
  computed: {
    done() {
      const doneStatus = {};
      for (let id in this.devs) {
        const { yesterday, today, blockers } =
          this.devs[id].notes[this.selectedDate];
        doneStatus[id] = ![yesterday, today, blockers].includes("");
      }
      return doneStatus;
    },
    out() {
      const outStatus = {};
      for (let id in this.devs) {
        const { yesterday, today, blockers } =
          this.devs[id].notes[this.selectedDate];
        outStatus[id] = [yesterday, today, blockers].every(
          (el) => el === "OUT"
        );
      }
      return outStatus;
    },
  },
};
</script>

<style scoped>
#home {
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
