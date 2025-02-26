import * as linepayHelper from '../helpers/linepayHelper.js';
import * as payModel from '../model/payModel.js';

test('產生Line payments request body', () => {
  //arrange
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
      orderId: 'MKSI_S_20180904_1000003',
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
        confirmUrl: 'https://pay-store.example.com/order/payment/authorize',
        cancelUrl: 'https://pay-store.example.com/order/payment/cancel',
      },
    },
  } as payModel.linePayPRInputOption;
  // act
  const result = linepayHelper.createLinePRrequestOption(input);
  //asser
  expect(result).toStrictEqual(expectedResult);
});
