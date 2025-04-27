import * as linepayHelper from '../helpers/linepayHelper.js';
import * as payModel from '../model/payModel.js';
import { vi, test, expect } from 'vitest'; // 引入 Vitest 的功能

test('產生Line payments request body', () => {
  // arrange
  const input = {
    name: 'Pen Brown',
    quantity: 2,
    price: 50,
  } as payModel.linePayPRFI;
  const expectedResult = {
    method: 'POST',
    baseUrl: 'https://sandbox-api-pay.line.me',
    apiPath: '/v3/payments/request',
    queryString: '',
    data: {
      amount: 100,
      currency: 'TWD',
      orderId: 'MKSI_S_20180904_1000001',
      packages: [
        {
          id: '1',
          amount: 100,
          products: [
            {
              name: 'Pen Brown',
              quantity: 2,
              price: 50,
            },
          ],
        },
      ],
      redirectUrls: {
        confirmUrl: 'http://localhost:5173/linepay/confirm',
        cancelUrl: 'http://localhost:5173/linepay/cancel',
      },
    },
  } as payModel.linePayPRInputOption;

  // act
  const result = linepayHelper.createLinePRrequestOption(input);

  // assert
  expect(result).toStrictEqual(expectedResult);
});
