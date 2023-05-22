import {
  TBlurEffect,
  TDropShadowEffect,
  TEffect,
  TInnerShadowEffect,
} from '@pda/shared-types';
import React from 'react';
import { figmaBlendModeToCSS } from './figma-blend-mode-to-css';

/**
 * Helper function to translates a Figma effect into equivalent CSS string.
 *
 * @param effect - The Figma effect to be translated.
 * @returns An object representing the CSS properties equivalent to the Figma effect.
 */
export function figmaEffectToCSS(
  effects: ReadonlyArray<TEffect>
): React.CSSProperties {
  if (effects.length === 0) {
    return {};
  }
  const effect = effects[0]; // TODO: support multiple fill layer
  let effectStyle: React.CSSProperties = {};

  // Handle different effect types
  switch (effect.type) {
    case 'DROP_SHADOW':
      effectStyle = dropShadowEffectToCSS(effect);
      break;
    case 'INNER_SHADOW':
      effectStyle = innerShadowEffectToCSS(effect);
      break;
    case 'LAYER_BLUR':
    case 'BACKGROUND_BLUR':
      effectStyle = blurEffectToCSS(effect);
      break;
    default:
    // do nothing
  }

  return effectStyle;
}

// Function to handle drop shadow effect
function dropShadowEffectToCSS(effect: TDropShadowEffect): React.CSSProperties {
  const { color, offset, radius, spread, visible, blendMode } = effect;
  return {
    boxShadow: `${offset.x}px ${offset.y}px ${radius}px ${spread ?? 0}px rgba(${
      color.r * 255
    }, ${color.g * 255}, ${color.b * 255}, ${color.a})`,
    visibility: visible ? 'visible' : 'hidden',
    ...figmaBlendModeToCSS(blendMode),
  };
}

// Function to handle inner shadow effect
function innerShadowEffectToCSS(
  effect: TInnerShadowEffect
): React.CSSProperties {
  const { color, offset, radius, spread, visible, blendMode } = effect;
  return {
    boxShadow: `inset ${offset.x}px ${offset.y}px ${radius}px ${
      spread ?? 0
    }px rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a})`,
    visibility: visible ? 'visible' : 'hidden',
    ...figmaBlendModeToCSS(blendMode),
  };
}

// Function to handle blur effect
function blurEffectToCSS(effect: TBlurEffect): React.CSSProperties {
  const { radius, visible } = effect;
  return {
    filter: `blur(${radius}px)`,
    visibility: visible ? 'visible' : 'hidden',
  };
}
