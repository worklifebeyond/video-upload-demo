import {
    UPLOAD_REQUEST,
    UPLOAD_FAILURE,
    UPLOAD_SUCCESS,
} from '../constants/Upload'

import {
    showNotification,
} from './NotificationActions'

const request = require('superagent-bluebird-promise');

let mediaId = '';

export function uploadFile(file) {

    return dispatch => {
        dispatch({type: UPLOAD_REQUEST});

        return request.post('https://us-central1-wlb-prod.cloudfunctions.net/generate_video_manifest')
            .set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFlNTU1N2E4LWIyZDAtNGFmNy1iNTFhLTI0MjZiY2VkMGVlZCIsInVzZXJuYW1lIjoiaGVuZHJhcGVybWFuYS5tQGdtYWlsLmNvbSIsImVtYWlsIjoiaGVuZHJhcGVybWFuYS5tQGdtYWlsLmNvbSIsImlhdCI6MTU1NTg1MTA2NSwiZXhwIjoxNTU1ODY1NDY1fQ.AR52oM68Kryp5-DTl8vg02RQfXhKGYfc1DrvUjEGUftWfbDQwlIhSR8W_9qvdcg4ULrwBcG40oR34ykMuBcXRxLpMJ5dFlsKXEhhS4Mjs9ao97Suh9T-exn6_dbWNscNJugKyu9NRgq1mqbTrUtx__87NE_Ax1YqfrtBbMO7kc7bpm_S6obmk1k4sCnOLkAD3CwCy3x0Svwv5rq8pJbdk9xhxpPX8lvDlU-chv82tMSJQuM_XzM_FAO6XHugjibWvZy95aa9ozmiUG86CK1LrEluNmFrxB0SS_3_33p_Je5EBz3gbSV_HBQrLSwdExokVQGO3qTXP4FMm1JvYd6CZLAeTKLcEqm3yugsfbMdV3l7eVoSTWu-pK-CTgNPQuNlXye-B0FfjuxfCY3Ums1Cj8sD42MJlxudsrYpOMbCDl5aH3XKi6FFc3HRd5rwPdVnYd4JIPyt3WgctEhZymiEs1uZKWL8Eo0EZJjjcAbnvCWfwacY3ZDZAh6zLuiKK33P0hA3EyLkEuN5ctqc5mD1XnXZpPT-WA5qQjVwDxjAfJHMx8XEfec4O1-bGBdoVyyotvuQPWvmYaY0zRnq66c0lWlBc3hW_0gk_9dEeq5z8mUWB9D2XBc8as21554IY2wB8MmspTmxM5L79qHS7fQJU6v1T95-yUQetzJos9yFyTo')
            .send({'title': 'Another Test', 'description': 'Media', 'format': 'video/mp4'})
            .then(res => {
                if (!res.ok) {
                    dispatch({type: UPLOAD_FAILURE});
                    dispatch(showNotification({
                        status: 'err',
                        text: 'something going wrong',
                    }))
                } else {
                    const data = JSON.parse(res.text);
                    /*dispatch({
                        type: UPLOAD_SUCCESS,
                        data,
                    });*/

                    const path = data.media.key;
                    mediaId = path;
                    const url = data.link.protocol + '://' + data.link.address + '/' + path;

                    let q = {
                        AWSAccessKeyId: data.link.query.AWSAccessKeyId,
                        Expires: data.link.query.Expires,
                        Signature: data.link.query.Signature,
                    };

                    return request.put(url)
                        .query(q)
                        .send(file)

                }
            })
            .then(res => {
                console.log(res);
                dispatch({
                    type: UPLOAD_SUCCESS,
                    data: {media_id: mediaId},
                });

                dispatch(showNotification({
                    status: 'ok',
                    text: `File uploaded. Key: ${mediaId}`,
                }))

            })
            .catch(err => {

                dispatch({type: UPLOAD_FAILURE, err: err});
                dispatch(showNotification({
                    status: 'err',
                    text: err.message,
                }))

            })
    }
}
