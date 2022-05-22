import { SDK } from '@ringcentral/sdk';
import WebPhone from 'ringcentral-web-phone';
const rcsdk = new SDK({
    server: SDK.server.sandbox,
    clientId: process.env.REACT_APP_RC_CLIENT_ID,
    clientSecret: process.env.REACT_APP_RC_CLIENT_SECRET
});

const platform = rcsdk.platform();

// const login = () => {
//     // rcsdk.login({
//     //     username: process.env.REACT_APP_RC_USERNAME,
//     //     password: process.env.REACT_APP_RC_PASSWORD,
//     //     extension: process.env.REACT_APP_RC_EXTENSION,
//     //     grant_type: 'password',
//     //     access_token_ttl: 3600,
//     //     refresh_token_ttl: 604800
//     // }).then(res => {
//     //     console.log('Login response: ', JSON.stringify(res));
//     // }).catch(err => console.error(err))
//     const token = Buffer.from(process.env.REACT_APP_RC_CLIENT_ID + ':' + process.env.REACT_APP_RC_CLIENT_SECRET).toString('base64');
//     const params = {
//         username: process.env.REACT_APP_RC_USERNAME,
//         password: process.env.REACT_APP_RC_PASSWORD,
//         extension: process.env.REACT_APP_RC_EXTENSION,
//         grant_type: 'password',
//         access_token_ttl: 3600,
//         refresh_token_ttl: 604800
//     };
//     const urlParamter = Object.keys(params).map(key => key + '=' + params[key]).join('&');
//     console.log(urlParamter);
//     console.log(token);

//     fetch(`${process.env.REACT_APP_RC_BASE_URL}/restapi/oauth/token?${urlParamter}`, {
//         method: 'POST', 
//         headers: {
//             'Accept': 'application/json',
//             'Content-type': 'application/x-www-form-urlencoded',
//             'Authorization': `Basic ${token}`
//         },
//     }).then(res => {
//         if(res && res.ok && typeof(res.json) === 'function') {
//             res.json()
//         }
//     }).then(res => {
//         console.log(res)
//     }).catch(err => {
//         console.log(err)
//     })
// }

let session = null;

const configWebPhone = async () => {
    try {
        const loginResponse = await platform.login({
            username: process.env.REACT_APP_RC_USERNAME,
            password: process.env.REACT_APP_RC_PASSWORD,
        });

        const SIPRegistration = await platform
        .post('/restapi/v1.0/client-info/sip-provision', {
            sipInfo: [{transport: 'WSS'}]
        });

        const SIPResponse = await SIPRegistration.json()

        return new WebPhone(SIPResponse, { // optional
            appKey: process.env.REACT_APP_RC_CLIENT_ID,
            appName: 'call-app',
            appVersion: 1,
            uuid: (await loginResponse.json()).endpoint_id,
            logLevel: 1, // error 0, warn 1, log: 2, debug: 3
            audioHelper: {
                enabled: true, // enables audio feedback when web phone is ringing or making a call
                incoming: 'https://cdn.rawgit.com/ringcentral/ringcentral-web-phone/master/audio/incoming.ogg', // path to audio file for incoming call
                outgoing: 'https://cdn.rawgit.com/ringcentral/ringcentral-web-phone/master/audio/outgoing.ogg' // path to aduotfile for outgoing call
            },
            media: {
                remote: document.getElementById('rc-audio'),
                local: null
            }
        });
    } catch (err) {
        console.log(err);
    }
}

const makeCall = async () => {
    const webPhone = await configWebPhone();
    console.log(webPhone);
    session = webPhone.userAgent.invite('0339943426', {
        fromNumber: 'PHONE_NUMBER', // Optional, Company Number will be used as default
        homeCountryId: '1' // Optional, the value of
    });
}

const acceptIncomingCall = () => {
    if (session != null) {
        session.accept().then(res => {
            console.log(res);
        });
    }
}

const endCall = () => {
    // switch(session.state) {
    //     case SessionState.Initial:
    //     case SessionState.Establishing:
    //       if (session instanceOf Inviter) {
    //         // An unestablished outgoing session
    //         session.cancel();
    //       } else {
    //         // An unestablished incoming session
    //         session.reject();
    //       }
    //       break;
    //     case SessionState.Established:
    //       // An established session
    //       session.bye();
    //       break;
    //     case SessionState.Terminating:
    //     case SessionState.Terminated:
    //       // Cannot terminate a session that is already terminated
    //       break;
    //   }
}

export {
   makeCall
}