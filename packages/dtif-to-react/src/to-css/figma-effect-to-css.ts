import {
  TBlurEffect,
  TDropShadowEffect,
  TEffect,
  TInnerShadowEffect,
} from '@pda/types/dtif';
import React from 'react';
import { figmaRGBToCss } from './figma-rgb-to-css';

/**
 * Helper function to translate a Figma effect into equivalent CSS string.
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
  const effect = effects[0]; // TODO: support multiple effect layer
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

// Handle drop shadow effect
function dropShadowEffectToCSS(effect: TDropShadowEffect): React.CSSProperties {
  return {
    boxShadow: `${effect.offset.x}px ${effect.offset.y}px ${effect.radius}px ${
      effect.spread ?? 0
    }px ${figmaRGBToCss(effect.color)})`,
    visibility: effect.visible ? 'visible' : 'hidden',
    // ...figmaBlendModeToCSS(blendMode), // Not supported as long as no support for multiple shadow layers
  };
}

// Handle inner shadow effect
function innerShadowEffectToCSS(
  effect: TInnerShadowEffect
): React.CSSProperties {
  return {
    boxShadow: `inset ${effect.offset.x}px ${effect.offset.y}px ${
      effect.radius
    }px ${effect.spread ?? 0}px ${figmaRGBToCss(effect.color)})`,
    visibility: effect.visible ? 'visible' : 'hidden',
    // ...figmaBlendModeToCSS(effect.blendMode), // Not supported as long as no support for multiple shadow layers
  };
}

// Handle blur effect
function blurEffectToCSS(effect: TBlurEffect): React.CSSProperties {
  return {
    filter: `blur(${effect.radius}px)`,
    visibility: effect.visible ? 'visible' : 'hidden',
  };
}
