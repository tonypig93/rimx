import { RxStoreFactory } from '../../src/base/factory';

describe('RxStoreFactory', () => {
  test('Factory can be instanted', () => {
    const store = new RxStoreFactory();
    expect(store).toBeInstanceOf(RxStoreFactory);
  })
});
