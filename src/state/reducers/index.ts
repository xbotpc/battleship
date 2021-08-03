import { combineReducers } from "redux";
import playback from './playbackReducer';

export const rootReducer = combineReducers({ playback })