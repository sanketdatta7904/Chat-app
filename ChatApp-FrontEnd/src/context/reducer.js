export const initialState = {
    user: null,
    newMessage: {
        message: "abc",
        name: "",
        messageType: "",
        timestamp: ""
    }
}

export const actionTypes = {
    SET_USER: "SET_USER",
    NEW_MESSAGE: "NEW_MESSAGE"
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user
            }
        case actionTypes.NEW_MESSAGE:
            return {
                ...state,
                newMessage: action.newMessage
            }
        default:
            return state
    }
}

export default reducer