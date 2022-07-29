const GC = require('../constants.json')
const aplResponse = require('../apl-response')


const LaunchHandler = (handlerInput) => {
    let { responseBuilder, attributesManager } = handlerInput;
    const sessionAttributes = attributesManager.getSessionAttributes();

    let contexts = sessionAttributes.contexts || []

    let text = `Welcome to Georgia Technical Authority. GTA provides technology leadership to the state of Georgia for sound IT enterprise management, helping enable state agencies and entities with technology services.. Would you like to hear the menu option?`

    let speechText = `Welcome to Georgia Technical Authority. GTA provides technology leadership to the state of Georgia for sound IT enterprise management, helping enable state agencies and entities with technology services. Would you like to hear the menu option?`

    let repromptText = " Would you like to hear the menu option?";

    if (handlerInput.hasAplSupport) {
        let data = {
            bgImg: "https://hindoo.s3.amazonaws.com/images/background-plain3.jpg",
            title: "Hindu Temple of Atlanta",
            text: text,
            ssmlText: speechText,
            hintText: `Show Main Menu`

        }
        aplResponse.buildTextRes(responseBuilder, data)
        speechText = ''
    }

    contexts.unshift(GC.CONTEXTS.SHOW_MENU);

    sessionAttributes.contexts = contexts;
    sessionAttributes.repeatSpeech = speechText

    attributesManager.setSessionAttributes(sessionAttributes)

    return responseBuilder
        .speak(speechText)
        .reprompt(repromptText)
        .getResponse();
}

module.exports = {
    LaunchHandler
}