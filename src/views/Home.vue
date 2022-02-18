<template>
  <div id="home">
    <v-card>
      <v-card-title class="d-flex justify-center">
        {{ dayjs(new Date()).format("dddd MM/DD") }}
      </v-card-title>
      <v-card-text>
        <v-list>
          <template v-for="(dev, index) in devs">
            <v-list-group :key="index">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="d-flex justify-center text-h5 pb-2">
                    {{ dev.name }}
                    <v-icon
                      class="ml-4"
                      @click.stop="out(index)"
                      color="warning"
                    >
                      mdi-account-arrow-right-outline
                    </v-icon>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action
                  v-if="!devs[index].out && done[index]"
                  style="position: absolute"
                >
                  <v-icon color="success" large> mdi-check </v-icon>
                </v-list-item-action>
                <v-list-item-action
                  v-if="devs[index].out"
                  style="position: absolute"
                >
                  <v-icon color="error" large> mdi-close </v-icon>
                </v-list-item-action>
              </template>
              <v-list-item-content
                class="d-flex flex-column justify-space-around"
              >
                <v-text-field
                  v-model="dev.yesterday"
                  label="Yesterday"
                  style="width: 50%"
                  v-if="dayjs().day() !== 4"
                />
                <v-text-field
                  v-model="dev.today"
                  label="Today"
                  style="width: 50%"
                />
                <v-text-field
                  v-model="dev.blockers"
                  label="Blockers"
                  style="width: 50%"
                  append-outer-icon="mdi-cancel"
                  @click:append-outer="noBlockers(index)"
                />
              </v-list-item-content>
            </v-list-group>
            <v-divider :key="index + 'd'" />
          </template>
        </v-list>
        <v-card-actions class="d-flex justify-center">
          <v-btn
            color="primary"
            :disabled="!done.every((e) => e)"
            @click="save"
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
    previousData: [],
    devs: [
      {
        name: "Tyler",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Gerald",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Matthew",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Michael",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Kody",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Drew",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Andrew",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Ayman",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Christopher",
        yesterday: "",
        today: "",
        blockers: "",
      },
      {
        name: "Jeff",
        yesterday: "",
        today: "",
        blockers: "",
      },
    ],
  }),
  mounted() {
    this.previousData = JSON.parse(
      window.localStorage.getItem("dailyDevNotes")
    );
    if (this.previousData === null) {
      this.previousData = [];
    }
    if (this.hasTodaySaved()) {
      this.$set(
        this,
        "devs",
        this.previousData[this.previousData.length - 1].devs
      );
    }
    if (dayjs().day() === 4) {
      this.devs.forEach((dev) => (dev.yesterday = "MONDAY"));
    }
  },
  methods: {
    noBlockers(index) {
      this.devs[index].blockers = "N/A";
    },
    out(index) {
      const status = this.devs[index].out ? "" : "OUT";
      this.devs[index].yesterday = status;
      this.devs[index].today = status;
      this.devs[index].blockers = status;
      this.devs[index].out = !this.devs[index].out;
    },
    hasTodaySaved() {
      return (
        this.previousData.length > 0 &&
        this.previousData[this.previousData.length - 1].date ===
          dayjs().format("MM/DD")
      );
    },
    save() {
      if (this.hasTodaySaved()) {
        this.previousData[this.previousData.length - 1].devs = this.devs;
      } else {
        this.previousData.push({
          date: dayjs().format("MM/DD"),
          devs: this.devs,
        });
      }
      window.localStorage.setItem(
        "dailyDevNotes",
        JSON.stringify(this.previousData)
      );
    },
  },
  computed: {
    done() {
      return this.devs.map(
        (dev) => dev.yesterday !== "" && dev.today !== "" && dev.blockers !== ""
      );
    },
  },
};
</script>

<style scoped>
#home {
  height: 100%;
}
</style>
