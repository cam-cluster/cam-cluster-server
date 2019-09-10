import cameras from '../cameras.js';
describe('store state: cameras', () => {
  describe('reducer', () => {
    const {
      reducer
    } = cameras;
    it('should return an empty default state', () => {
      const state = reducer();
      expect(state).toEqual({});
    });
  });
});