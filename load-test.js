import http from 'k6/http';
import { check, sleep } from 'k6';

//가상 유저 100명 생성 1번씩만 요청
export const options = {
    scenarios: {
        buy_one_time: {
            executor: 'per-vu-iterations',

            vus: 100,

            iterations: 1,

            maxDuration: '30s',
        }
    }
}

export default function () {
    const url = 'http://127.0.0.1:3000/order';

    const payload = JSON.stringify({
        productId: 1,
        color: "White",
        size: "250"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'is status 201': (r) => r.status === 201,
    });
}