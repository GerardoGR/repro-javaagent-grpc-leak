import http from 'k6/http';

export const options = {
  scenarios: {
    hello: {
      executor: 'constant-vus',
      vus: 100,
      duration: '240m',
    },
  },
  noConnectionReuse: true,
};

export default function () {
  const response = http.get(`http://localhost:${__ENV.SERVER_PORT}/ping`);
}
