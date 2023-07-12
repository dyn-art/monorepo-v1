import { dtifToSVG } from '..';

describe('dtif-to-svg library tests', async () => {
  it('should work', async () => {
    // Arrange
    const dtif = '';

    // Act
    const result = await dtifToSVG();

    // Assert
    expect(result).toBe('');
  });
});
