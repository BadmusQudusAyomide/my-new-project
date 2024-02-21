const AvayaChatConfig = {
    // json Methods
    jsonMethodFileTransfer: 'newAgentFileTransfer',
    jsonMethodPing: 'pong',
    jsonMethodRequestChat: 'requestChat',
    jsonMethodRequestCloseConversation: 'closeConversation',
    jsonMethodRequestIsTyping: 'isTyping',
    jsonMethodRequestNewMessage: 'newMessage',
    jsonMethodRequestNewParticipant: 'newParticipant',
    jsonMethodRequestParticipantLeave: 'participantLeave',

    // message types
    messageTypeAck: 'acknowledgement',
    messageTypeError: 'error',
    messageTypeNotification: 'notification',

    // write response class
    writeResponseClassChatbot: 'chatbot',
    writeResponseClassResponse: 'response',
    writeResponseClassSent: 'sent',
    writeResponseClassSystem: 'system',
    writeResponseClassAgent: 'agent',

    // console meesages
    chatAvailableMsg: "The chat is available. Your estimated wait time is {0} minutes. Click the 'Live Chat' tab to open the chat",
    chatNotAvailableMsg: 'The chat is not currently available. Please try again later',
    chatPossibleMsg: "The chat is available. Click the 'Live Chat' tab to open the chat.",
    noAgentsAvailableMsg: 'No agents are currently available. Please try again later',

    // variables
    apiEndpointsDomain: '',
    routePointIdentifier: 'Sales',
    activeAgentTypeOut: null,
    agentTypingTimeout: 5000,
    attributes: ['Country.US', 'Language.English', 'LOB.Sales', 'Concern.Drive'],
    customData: {},
    leaseTime: 0,
    locale: 'en-US',
    maxNumberOfRetries: 200,
    maxWaitTime: 600,
    minAgentCount: 1,
    minWaitTime: 0,
    newMessageText: '{0} ({1}): {2}',
    noFieldLabel: 'No',
    notifyOfBarge: true,
    notifyOfObserve: false,
    onModalOpen: () => {},
    onModalClose: () => {},
    passiveAgentTypeOut: null,
    pingTimer: 5000,
    formDetails: {
        chatLiteForm: {},
        preEngagementForm: {},
        disablePrefilledInputs: false,
    },
    bypassChatBubble: false,
    priority: 5,
    tasPriority: 4,
    refreshTimeoutSeconds: 300,
    resetTimer: 5000,
    retryInterval: 3000,
    supervisorTypeOut: null,
    suppressChatbotPresence: false,
    timeBetweenMsgs: 10000,
    typeOfPage: 'Sales',
    workflowType: '',
    analyticsIsOn: false,
    sessionWasTransferred: false,
    statusCardShowTime: 10000,
    namesMaxCharCount: 50,
    isChatLite: false,
    isTriagePreChat: false,
    isEnergyPage: false,
    isWindowMinimized: false,
    capturedChatImpression: false,
    defaultWaitTime: 1,
    sendSubjectMessage: false,
    autoInitiate: false,
    modifiedChatInit: false,
    websocketResponseTimeout: 15,
    tasCallbackFormsEtaHours: 48,
    preEngagementConfig: {
        fields: [{
                type: 'InputItem',
                label: 'First name',
                attributes: {
                    name: 'firstName',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter your first name',
                },
            },
            {
                type: 'InputItem',
                label: 'Last name',
                attributes: {
                    name: 'lastName',
                    type: 'text',
                    required: false,
                    placeholder: 'Enter your last name',
                },
            },
            {
                type: 'InputItem',
                label: 'Email address',
                attributes: {
                    name: 'email',
                    type: 'email',
                    required: true,
                    placeholder: 'Enter your email address',
                },
            },
            {
                type: 'InputItem',
                label: 'Phone',
                attributes: {
                    name: 'phoneNumber',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter your phone number',
                },
            },
            {
                type: 'InputItem',
                label: 'Zip Code',
                attributes: {
                    name: 'postalCode',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter your zip code',
                },
            },
            {
                type: 'SelectItem',
                label: 'Get Tesla Updates',
                options: [{
                        label: 'Yes',
                        value: 'Yes',
                        selected: true
                    },
                    {
                        label: 'No',
                        value: 'No',
                        selected: false
                    },
                ],
                attributes: {
                    name: 'getUpdates',
                    required: true
                },
            },
        ],
        description: 'Provide your information',
        submitLabel: 'Submit',
    },
    preengagement: {
        description: 'Before we connect you with a Tesla Advisor, please provide the following information',
        contactCard: {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            getUpdates: 'Get Tesla Updates',
        },
        fields: [{
                attributes: {
                    name: 'firstName',
                    placeholder: 'Enter your first name',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'First name',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'lastName',
                    placeholder: 'Enter your last name',
                    required: 'boolFalse',
                    type: 'text',
                },
                label: 'Last name',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'email',
                    placeholder: 'Enter your email address',
                    required: 'boolTrue',
                    type: 'email',
                },
                label: 'Email address',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'phoneNumber',
                    placeholder: 'Enter your phone number',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'Phone',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'postalCode',
                    placeholder: 'Enter your zip code',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'Zip code',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'getUpdates',
                    required: 'boolTrue',
                },
                label: 'Get Tesla Updates',
                options: [{
                        label: 'Yes',
                        selected: 'boolTrue',
                        value: 'Yes',
                    },
                    {
                        label: 'No',
                        selected: 'boolFalse',
                        value: 'No',
                    },
                ],
                type: 'SelectItem',
            },
        ],
        submitLabel: 'Submit',
    },
    triageConfig: {
        chooseTopic: 'Choose Your Topic',
        chooseTopicSubtext: 'Tell us more and our customer support team will help you find the answers',
        chooseOptions: 'Select from the below options',
        teslaProducts: {
            'account-support': 'Help With Previous Purchases',
            'live-agent': 'Buying Tesla Products',
            'vehicle-upcoming-delivery': 'Questions About Delivery',
            'schedule-test-drive': {
                label: 'Schedule Test Drive',
                demoDrive: {
                    label: 'Schedule Demo Drive',
                },
            },
        },

        teslaProductsSubTopics: {
            vehicle: {
                'test-drive': 'Test Drive',
                'trade-in': 'Trade-In',
                inventory: 'Inventory',
                'vehicle-place-order': 'Placing an order',
                'vehicle-upcoming-delivery': 'Upcoming Delivery',
                'vehicle-service-support': 'Service and Support',
            },
            energy: {
                'solar-roof': 'Solar Roof',
                'solar-panels': 'Solar Panels',
                'energy-place-order': 'Placing an Order',
                'energy-service-support': 'Service and Support',
            },
        },
        energySubTopics: ['Solar Roof', 'Solar Panels', 'Placing an Order', 'Service and Support'],
        vehicleDeliveryHeading: 'Upcoming Delivery',
        vehicleDeliveryDesription: 'Go to the Tesla App for delivery timing updates and to learn about your new vehicle',
        vehicleDeliveryLoginLinkText: 'Go to Account',
        // eslint-disable-next-line no-restricted-globals
        vehicleDeliveryLoginLink: 'https://ts.la/app',
        additionalDeliveryHeading: 'Additional Resources',
        additionalDeliveryResources: {
            afterTakingDelivery: 'After Taking Delivery',
            prepareForDelivery: 'Prepare For Delivery',
            whatToExpectOnDeliveryDay: 'What to Expect on Delivery Day',
        },
        cantFindAnswer: "Can't Find Your Answer?",
        needMoreAssistance: 'I Still Need Help',
        vehicleServiceSupport: 'Service and Support',
        topicSupportSubHeading: 'Below are the most common answers',
        vehicleOwnershipLinks: {
            'Software Updates': '/support/software-updates',
            'Service Visits': '/support/service-visits',
            'Road Trips': '/trips',
            Supercharging: '/support/supercharging',
            'Full Self-Driving Subscriptions': '/support/full-self-driving-subscriptions',
            'Tesla App': '/support/tesla-app',
            Connectivity: '/support/connectivity',
            'Account Support': '/support/account-support',
        },
        // eslint-disable-next-line no-restricted-globals
        vehicleOwnershipSupportHelpLink: `https://auth.tesla.com/oauth2/v1/authorize?redirect_uri=${location.protocol}//${location.hostname}/teslaaccount/owner-xp/auth/callback&response_type=code&client_id=ownership&scope=offline_access%20email&audience=https%3A%2F%2Fownership.tesla.com%2F`,
        energyProductSupport: 'Service And Support',
        energyProductSupportLinks: {
            'Tesla Account': '/contactus?issue=energyProductSupport&issueSubcategory=accountBilling',
            Billing: '/contactus?issue=energyProductSupport&issueSubcategory=accountBilling',
            Contract: '/contactus?issue=energyProductSupport&issueSubcategory=accountBilling',
            'Maintenance & Troubleshooting': '/contactus/troubleshooting?troubleshootingGuide=diagnoseProblem',
            Scheduling: '/contactus/?issue=energyProductSupport&issueSubcategory=maintenanceTroubleshooting',
            'Tesla App': '/support/tesla-app',
            'Mobile App': '/contactus?issue=energyProductSupport&issueSubcategory=accountBilling',
            'Removal & Reinstallation': 'https://forms.office.com/pages/responsepage.aspx?id=9MUmkNCGn0u9ObfU0PtGdMOmHsmMfdVDurtXFX-pEnJUMVZSRTQ3NjZNNlU4VVQwM0tPRUJTOTVKSC4u&web=1&wdLOR=c19B3730A-E4AE-E741-833C-A67BEC1C9039',
        },
        // eslint-disable-next-line no-restricted-globals
        energySupportHelpLink: `https://auth.tesla.com/oauth2/v1/authorize?redirect_uri=${location.protocol}//${location.hostname}/teslaaccount/owner-xp/auth/callback&response_type=code&client_id=ownership`,
        teslaAccountSupport: 'Tesla Account Support',
        teslaAccountSupportLinks: {
            'Password Reset': '/support/account-support#basic-account-support',
            'Create New Account': '/support/account-support#basic-account-support',
            'Add or Remove Products': '/support/account-support#add-remove-products',
            'Car Access': '/support/account-support#car-access',
            'Account Security': '/support/account-support#account-security',
        },
        // eslint-disable-next-line no-restricted-globals
        teslaAccountSupportHelpLink: `https://auth.tesla.com/oauth2/v1/authorize?redirect_uri=${location.protocol}//${location.hostname}/teslaaccount/owner-xp/auth/callback&response_type=code&client_id=ownership&scope=offline_access%20email&audience=https%3A%2F%2Fownership.tesla.com%2F`,
        backButton: 'Back',
    },

    callBackFormConfig: {
        description: 'There are no agents currently available. Please enter your contact information and we will get back to you.',
        disclaimer: "By clicking 'Request a Callback' I agree to be contacted at the number provided and understand these calls or texts may use computer-assisted dialing or pre-recorded messages. This consent is not a condition of purchase.",
        fields: [{
                attributes: {
                    name: 'firstName',
                    placeholder: 'Enter your first name',
                    required: true,
                    type: 'text',
                },
                label: 'First Name',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'lastName',
                    placeholder: 'Enter your last name',
                    required: true,
                    type: 'text',
                },
                label: 'Last Name',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'email',
                    placeholder: 'Enter your email address',
                    required: true,
                    type: 'email',
                },
                label: 'Email',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'phoneNumber',
                    placeholder: 'Enter your phone number',
                    required: true,
                    type: 'text',
                },
                label: 'Phone',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'postalCode',
                    placeholder: 'Enter your zip code',
                    required: true,
                    type: 'text',
                },
                label: 'Zip Code',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'productInterested',
                    required: true,
                },
                label: 'Product Interest',
                options: [{
                        label: 'Model S',
                        value: 'Model S'
                    },
                    {
                        label: 'Model 3',
                        value: 'Model 3'
                    },
                    {
                        label: 'Model X',
                        value: 'Model X'
                    },
                    {
                        label: 'Model Y',
                        value: 'Model Y'
                    },
                    {
                        label: 'Solar Panels',
                        value: 'Solar Panels'
                    },
                    {
                        label: 'Solar Roof',
                        value: 'Solar Roof'
                    },
                ],
                type: 'CheckboxItem',
            },
        ],
        submitLabel: 'Request a Callback',
    },
    tasCallBackFormConfig: {
        contactCard: {
            email: 'Email',
            firstName: 'First Name',
            productInterested: 'Product Interested',
            lastName: 'Last Name',
            phone: 'Phone',
            postalCode: 'Zip code',
        },
        fields: [{
                attributes: {
                    name: 'firstName',
                    placeholder: 'Enter your first name',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'First name',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'lastName',
                    placeholder: 'Enter your last name',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'Last name',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'email',
                    placeholder: 'Enter your email address',
                    required: 'boolTrue',
                    type: 'email',
                },
                label: 'Email address',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'phone',
                    placeholder: 'Enter your phone number',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'Phone',
                type: 'InputItem',
            },
            {
                attributes: {
                    name: 'postalCode',
                    placeholder: 'Enter your zip code',
                    required: 'boolTrue',
                    type: 'text',
                },
                label: 'Zip code',
                type: 'InputItem',
            },
        ],
        submitLabel: 'Submit',
    },
};
export default AvayaChatConfig;