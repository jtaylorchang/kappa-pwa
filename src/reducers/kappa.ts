import {
  TEvent,
  TAttendanceUserDict,
  TExcuseUserDict,
  TRecords,
  TDirectory,
  TEventDateDict,
  TEventDict,
  TUserEventDict
} from '@backend/kappa';
import {
  getEventById,
  mergeRecords,
  separateByDate,
  separateByEmail,
  getUserByEmail,
  separateByEventId,
  getMandatoryEvents,
  getMissedMandatory,
  getTypeCount,
  mergeEvents,
  mergeEventDates
} from '@services/kappaService';
import { TUser } from '@backend/auth';

export const GET_EVENTS = 'GET_EVENTS';
export const GET_EVENTS_SUCCESS = 'GET_EVENTS_SUCCESS';
export const GET_EVENTS_FAILURE = 'GET_EVENTS_FAILURE';

export const GET_DIRECTORY = 'GET_DIRECTORY';
export const GET_DIRECTORY_SUCCESS = 'GET_DIRECTORY_SUCCESS';
export const GET_DIRECTORY_FAILURE = 'GET_DIRECTORY_FAILURE';

export const GET_ATTENDANCE = 'GET_ATTENDANCE';
export const GET_ATTENDANCE_SUCCESS = 'GET_ATTENDANCE_SUCCESS';
export const GET_ATTENDANCE_FAILURE = 'GET_ATTENDANCE_FAILURE';

export const SELECT_EVENT = 'SELECT_EVENT';
export const UNSELECT_EVENT = 'UNSELECT_EVENT';

export const SELECT_USER = 'SELECT_USER';
export const UNSELECT_USER = 'UNSELECT_USER';

export const EDIT_NEW_EVENT = 'EDIT_NEW_EVENT';
export const EDIT_EXISTING_EVENT = 'EDIT_EXISTING_EVENT';
export const CANCEL_EDIT_EVENT = 'CANCEL_EDIT_EVENT';
export const SAVE_EDIT_EVENT = 'SAVE_EDIT_EVENT';
export const SAVE_EDIT_EVENT_SUCCESS = 'SAVE_EDIT_EVENT_SUCCESS';
export const SAVE_EDIT_EVENT_FAILURE = 'SAVE_EDIT_EVENT_FAILURE';

export interface TKappaState {
  gettingEvents: boolean;
  getEventsError: boolean;
  getEventsErrorMessage: string;

  gettingDirectory: boolean;
  getDirectoryError: boolean;
  getDirectoryErrorMessage: string;

  gettingAttendance: boolean;
  getAttendanceError: boolean;
  getAttendanceErrorMessage: string;

  events: TEventDict;
  eventsByDate: TEventDateDict;
  mandatoryEvents: TEventDict;
  missedMandatory: TUserEventDict;
  records: TRecords;
  directory: TDirectory;

  eventsSize: number;
  gmCount: number;
  selectedEventId: string;
  selectedEvent: TEvent;

  directorySize: number;
  selectedUserEmail: string;
  selectedUser: TUser;

  editingEventId: string;
  savingEvent: boolean;
  saveEventError: boolean;
  saveEventErrorMessage: string;
}

const initialState: TKappaState = {
  gettingEvents: false,
  getEventsError: false,
  getEventsErrorMessage: '',

  gettingDirectory: false,
  getDirectoryError: false,
  getDirectoryErrorMessage: '',

  gettingAttendance: false,
  getAttendanceError: false,
  getAttendanceErrorMessage: '',

  events: {},
  eventsByDate: {},
  mandatoryEvents: {},
  missedMandatory: {},
  records: {
    attended: {},
    excused: {}
  },
  directory: {},

  eventsSize: 0,
  gmCount: 0,
  selectedEventId: '',
  selectedEvent: null,

  directorySize: 0,
  selectedUserEmail: '',
  selectedUser: null,

  editingEventId: '',
  savingEvent: false,
  saveEventError: false,
  saveEventErrorMessage: ''
};

export default (state = initialState, action: any): TKappaState => {
  switch (action.type) {
    case GET_EVENTS:
      return {
        ...state,
        gettingEvents: true,
        getEventsError: false,
        getEventsErrorMessage: ''
      };
    case GET_EVENTS_SUCCESS:
      const events = separateByEventId(action.events);
      const mandatoryEvents = getMandatoryEvents(events);

      return {
        ...state,
        gettingEvents: false,
        events,
        mandatoryEvents,
        missedMandatory: getMissedMandatory(state.records, mandatoryEvents, state.directory),
        eventsByDate: separateByDate(action.events),
        eventsSize: action.events.length,
        gmCount: getTypeCount(events, 'GM')
      };
    case GET_EVENTS_FAILURE:
      return {
        ...state,
        gettingEvents: false,
        getEventsError: true,
        getEventsErrorMessage: action.error.message
      };
    case GET_DIRECTORY:
      return {
        ...state,
        gettingDirectory: true,
        getDirectoryError: false,
        getDirectoryErrorMessage: ''
      };
    case GET_DIRECTORY_SUCCESS:
      const directory = separateByEmail(action.users);

      return {
        ...state,
        gettingDirectory: false,
        directory,
        missedMandatory: getMissedMandatory(state.records, state.mandatoryEvents, directory),
        directorySize: action.users.length
      };
    case GET_DIRECTORY_FAILURE:
      return {
        ...state,
        gettingDirectory: false,
        getDirectoryError: true,
        getDirectoryErrorMessage: action.error.message
      };
    case GET_ATTENDANCE:
      return {
        ...state,
        gettingAttendance: true,
        getAttendanceError: false,
        getAttendanceErrorMessage: ''
      };
    case GET_ATTENDANCE_SUCCESS:
      const records = mergeRecords(state.records, {
        attended: action.attended,
        excused: action.excused
      });

      return {
        ...state,
        gettingAttendance: false,
        records,
        missedMandatory: getMissedMandatory(records, state.mandatoryEvents, state.directory)
      };
    case GET_ATTENDANCE_FAILURE:
      return {
        ...state,
        getAttendanceError: true,
        getAttendanceErrorMessage: action.error.message
      };
    case SELECT_EVENT:
      return {
        ...state,
        selectedEventId: action.event_id,
        selectedEvent: getEventById(state.events, action.event_id)
      };
    case UNSELECT_EVENT:
      return {
        ...state,
        selectedEventId: '',
        selectedEvent: null
      };
    case SELECT_USER:
      return {
        ...state,
        selectedUserEmail: action.email,
        selectedUser: getUserByEmail(state.directory, action.email)
      };
    case UNSELECT_USER:
      return {
        ...state,
        selectedUserEmail: '',
        selectedUser: null
      };
    case EDIT_NEW_EVENT:
      return {
        ...state,
        editingEventId: 'NEW'
      };
    case EDIT_EXISTING_EVENT:
      return {
        ...state,
        editingEventId: action.event_id,
        saveEventError: false,
        saveEventErrorMessage: ''
      };
    case CANCEL_EDIT_EVENT:
      return {
        ...state,
        editingEventId: ''
      };
    case SAVE_EDIT_EVENT:
      return {
        ...state,
        saveEventError: false,
        saveEventErrorMessage: ''
      };
    case SAVE_EDIT_EVENT_SUCCESS:
      const mergedEvents = mergeEvents(state.events, [action.event]);
      const mergedEventDates = mergeEventDates(state.eventsByDate, [action.event]);

      return {
        ...state,
        savingEvent: false,
        events: mergedEvents,
        eventsByDate: mergedEventDates
      };
    case SAVE_EDIT_EVENT_FAILURE:
      return {
        ...state,
        savingEvent: false,
        saveEventError: true,
        saveEventErrorMessage: action.error.message
      };
    default:
      return state;
  }
};
