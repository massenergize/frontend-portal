export const DEFAULT_STATE = "DEFAULT_STATE";
export const IS_DONE = "IS_DONE";
export const IS_IN_TODO = "IS_IN_TODO";
export const NO_AUTH = "NO_AUTH";
export const TODO = "TODO_PROPS" 
export const DONE = "DONE_IT_PROPS";

/**
 * --- STRUCTURE DEFINITION ----- 
 *  IS_DONE: { --- When the action is done 
    TODO_PROPS: { ----- What should the @TODO Button look like ????
      ...DEFAULT_CASE_PROPS,
      className : "cam-btn-defaults cam-gray-btn",
      text : "To Do",
    },
    DONE_IT_PROPS: { ----- What should the @DONE Button look like ???
      ...DEFAULT_CASE_PROPS, 
      className : "cam-btn-defaults cam-orange-btn",
      text: "Done"
    
    },
  },
 */
export const CASE_PROPS = {
  DEFAULT_STATE: {
    TODO_PROPS: { ...DEFAULT_CASE_PROPS , 
      text: "To Do", 
      className: "cam-btn-defaults"
      
    },
    DONE_IT_PROPS: { ...DEFAULT_CASE_PROPS, 
      text: "Done", 
      className : "cam-btn-defaults"
    },
  },
  IS_DONE: {
    TODO_PROPS: { ...DEFAULT_CASE_PROPS,
      className : "cam-btn-defaults cam-gray-btn",
      text : "To Do",
    },
    DONE_IT_PROPS: { ...DEFAULT_CASE_PROPS, 
      className : "cam-btn-defaults cam-orange-btn",
      text: "Done"
    
    },
  },
  IS_IN_TODO: {
    TODO_PROPS: { ...DEFAULT_CASE_PROPS, 
    
    },
    DONE_IT_PROPS: { ...DEFAULT_CASE_PROPS },
  },
  NO_AUTH: {
    TODO_PROPS: { ...DEFAULT_CASE_PROPS },
    DONE_IT_PROPS: { ...DEFAULT_CASE_PROPS },
  },
};

const DEFAULT_CASE_PROPS = {
  hasPopover: true,
  popoverText: "This is the default popover text",
  className: "some-me-classes",
  style: {},
  _function: null,
  text:"Default Button"
};
