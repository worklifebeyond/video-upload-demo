import {
    UPLOAD_REQUEST,
    UPLOAD_FAILURE,
    UPLOAD_SUCCESS,
} from '../constants/Upload'

import {
    showNotification,
} from './NotificationActions'

const request = require('superagent-bluebird-promise');


export function uploadFile(file) {

    return dispatch => {
        dispatch({type: UPLOAD_REQUEST});

        let q = {
            AWSAccessKeyId: 'AKIAJLA3WHIZCXPXC3NQ',
            Expires: 1555940099,
            Signature: 'DoUv/P/b50WvteQWEHNxIAik6bo=',
        };

        return request.put('https://jwplatform-upload.s3-accelerate.amazonaws.com/T0sS8ENW')
            .query(q)
            .send(file)
            .then(res => {
                if (!res.ok) {
                    dispatch({type: UPLOAD_FAILURE});
                    dispatch(showNotification({
                        status: 'err',
                        text: 'something going wrong',
                    }))
                } else {
                    const data = JSON.parse(res.text);
                    dispatch({
                        type: UPLOAD_SUCCESS,
                        data,
                    });

                    /*const path = data.media.key;
                    const url = data.link.protocol + '://' + data.link.address + '/' + path;

                    let q = {
                        AWSAccessKeyId: data.link.query.AWSAccessKeyId,
                        Expires: data.link.query.Expires,
                        Signature: data.link.query.Signature,
                    };

                    return request.put(url)
                        .query(q)
                        .attach('file', file, file.name)*/
                }
            })
            /*.then(res => {
                dispatch({type: 'UPLOAD_TEST', res: res});
                const data = JSON.parse(res.text);
                if (!res.ok) {
                    dispatch({type: UPLOAD_FAILURE, err: res});
                    dispatch(showNotification({
                        status: 'err',
                        text: 'something going wrong',
                    }))
                } else {
                    dispatch({
                        type: UPLOAD_SUCCESS,
                        data,
                    });
                }
            })*/
            .catch(err => {

                dispatch({type: UPLOAD_FAILURE, err: err});
                dispatch(showNotification({
                    status: 'err',
                    text: err.message,
                }))

            })
    }
}
