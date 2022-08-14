export const initialState = {
    user: null,
    newMessage: {
        message: "abc",
        name: "",
        messageType: "",
        timestamp: ""
    },
    icon: "https://avatars.dicebear.com/api/human/$%7Bseed%7D.svg"
}

export const actionTypes = {
    SET_USER: "SET_USER",
    NEW_MESSAGE: "NEW_MESSAGE",
    SET_ICON: "SET_ICON"
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
        case actionTypes.SET_ICON:
            return {
                ...state,
                icon: action.icon
            }
        default:
            return state
    }
}

export default reducer