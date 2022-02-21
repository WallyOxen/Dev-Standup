<template>
  <div id="home">
    <v-card>
      <v-card-title class="d-flex justify-center">
        {{ dayjs(new Date()).format("dddd MM/DD") }}
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
                      @click.stop="out(dev.id)"
                      color="warning"
                    >
                      mdi-account-arrow-right-outline
                    </v-icon>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action
                  v-if="!devs[dev.id].out && done[dev.id]"
                  style="position: absolute"
                >
                  <v-icon color="success" large> mdi-check </v-icon>
                </v-list-item-action>
                <v-list-item-action
                  v-if="devs[dev.id].out"
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
                  v-if="dayjs().day() !== 4"
                />
                <v-text-field
                  v-model="dev.notes[selectedDate].today"
                  label="Today"
                  style="width: 50%"
                />
                <v-text-field
                  v-model="dev.notes[selectedDate].blockers"
                  label="Blockers"
                  style="width: 50%"
                  append-outer-icon="mdi-cancel"
                  @click:append-outer="noBlockers(dev.id)"
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
    selectedDate: dayjs().format("MM/DD"),
    today: dayjs().format("MM/DD"),
    loading: false,
  }),
  async beforeMount() {
    this.loading = true;
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
    this.loading = false;
  },
  methods: {
    noBlockers(id) {
      this.devs[id].notes[this.selectedDate].blockers = "N/A";
    },
    out(id) {
      const status = this.devs[id].out ? "" : "OUT";
      this.devs[id].notes[this.selectedDate].yesterday = status;
      this.devs[id].notes[this.selectedDate].today = status;
      this.devs[id].notes[this.selectedDate].blockers = status;
      this.$set(this.devs[id], "out", !this.devs[id].out);
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
  },
  computed: {
    done() {
      const doneStatus = {};
      for (let id in this.devs) {
        const { yesterday, today, blockers } = this.devs[id].notes[this.today];
        doneStatus[id] = ![yesterday, today, blockers].includes("");
      }
      return doneStatus;
    },
  },
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
