<template>
  <section class="panel panel-log">
    <div class="panel-heading">
      <div>
        <p class="panel-label">Events</p>
        <h2>Session log</h2>
      </div>
      <button id="clear-log-button" class="button button-ghost" type="button" @click="portalActions.clearLog()">
        Clear log
      </button>
    </div>
    <pre id="event-log" class="event-log" aria-live="polite">{{ portalView.eventLogText }}</pre>
  </section>
</template>

<script setup lang="ts">
import { portalActions, portalView } from '../view-model';
</script>
