import vo from "../data/update-vo.json";
import { makeTimeline, type VoFile } from "../timeline";
import { UPDATE_SCRIPT } from "./script";

/**
 * The update's frames, timed like the teaser: from its own ElevenLabs take
 * (src/data/update-vo.json), or estimated from the text until one exists.
 */
const timeline = makeTimeline(UPDATE_SCRIPT, vo as VoFile);

export const HAS_VOICE = timeline.HAS_VOICE;
export const VO_AUDIO = timeline.VO_AUDIO;
export const TOKENS = timeline.TOKENS;
export const DURATION = timeline.DURATION;
export const SCENE = timeline.SCENE;
export const cue = timeline.cue;
