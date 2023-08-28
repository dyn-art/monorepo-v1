import { describe, expect, it } from 'vitest';
import { OptionalAttributes, defineConfig } from '../define-config';

describe('defineConfig() method tests', () => {
  type TTestConfig = {
    prop1: string;
    prop2: number;
    prop3?: boolean;
    prop4?: string;
  };

  const defaultConfig: Required<OptionalAttributes<TTestConfig>> = {
    prop3: true,
    prop4: 'default',
  };

  it('should merge source into target with default values', () => {
    // Arrange
    const target: TTestConfig = {
      prop1: 'custom',
      prop2: 42,
    };

    // Act
    const result = defineConfig(target, defaultConfig);

    // Assert
    expect(result).toEqual({
      prop1: 'custom',
      prop2: 42,
      prop3: true,
      prop4: 'default',
    });
  });

  it('should not overwrite defined properties in target', () => {
    // Arrange
    const target: TTestConfig = {
      prop1: 'custom',
      prop2: 42,
      prop3: false,
    };

    // Act
    const result = defineConfig(target, defaultConfig);

    // Assert
    expect(result).toEqual({
      prop1: 'custom',
      prop2: 42,
      prop3: false,
      prop4: 'default',
    });
  });

  it('should overwrite undefined properties in target when overwriteUndefinedProperties is true', () => {
    // Arrange
    const target: TTestConfig = {
      prop1: 'custom',
      prop2: 42,
      prop3: undefined,
    };

    // Act
    const result = defineConfig(target, defaultConfig, true);

    // Assert
    expect(result).toEqual({
      prop1: 'custom',
      prop2: 42,
      prop3: true,
      prop4: 'default',
    });
  });

  it('should not overwrite undefined properties in target when overwriteUndefinedProperties is false', () => {
    // Arrange
    const target: TTestConfig = {
      prop1: 'custom',
      prop2: 42,
      prop3: undefined,
    };

    // Act
    const result = defineConfig(target, defaultConfig, false);

    // Assert
    expect(result).toEqual({
      prop1: 'custom',
      prop2: 42,
      prop3: undefined,
      prop4: 'default',
    });
  });
});
