import { renderByCompositionName } from '../renderer';

describe('renderer tests', () => {
  it('renders image', async () => {
    // Act
    const { outputPath, clear } = await renderByCompositionName(
      'spotify-player-v1',
      'png'
    );

    // Assert
    expect(outputPath).not.toBeNull();
    console.log(outputPath);

    // Teardown
    await clear();
  });
});
