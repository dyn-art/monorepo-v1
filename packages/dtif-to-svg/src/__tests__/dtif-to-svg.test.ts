import { renderText } from '..';

describe('dtif-to-svg library tests', () => {
  it('should work', async () => {
    // Arrange
    const dtif = '';

    // Act
    console.time();
    const result = await renderText(
      'http://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJDUc1NECPY.ttf',
      'From',
      96
    );
    console.timeEnd();

    console.log(result);

    // Assert
    expect(result).toBe('');
  });
});
