const Alexa = require('ask-sdk-core');
// i18n dependency
const i18n = require('i18next');
const languageStrings = require('./localisation');

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
       console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`-------------------------------------------------------------------------------`);
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
        console.log(`-------------------------------------------------------------------------------`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
// Additionally it will handle picking a random value if instead of a string it receives an array
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        const localisationClient = i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings,
            returnObjects: true
        });
        localisationClient.localise = function localise() {
            const args = arguments;
            const value = i18n.t(...args);
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            }
            return value;
        };
        handlerInput.t = function translate(...args) {
            return localisationClient.localise(...args);
        }
    }
};

//Interceptor to check inteface support 
// Add alexa lib to request
const interfaceSupportInterceptor = {
    process(handlerInput) {
        const { supportedInterfaces } = handlerInput.requestEnvelope.context.System.device;
        handlerInput.hasAplSupport =  !!supportedInterfaces['Alexa.Presentation.APL'];
        handlerInput.hasAudioPlayerSupport = !!supportedInterfaces['AudioPlayer'];
        handlerInput.Alexa = Alexa
    }
};


module.exports = {
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor,
    interfaceSupportInterceptor
}
