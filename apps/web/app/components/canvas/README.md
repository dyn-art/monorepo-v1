# Design Decisions

## Local Definition of Defs

In SVG, the `<defs>` element is used to define graphical elements that can be reused later with the `<use>` tag or as a clipping path, gradient definition, etc. Typically, these `<defs>` elements are defined at the top level of the SVG, which provides a centralized repository of reusable elements.

However, in complex, dynamic SVG structures, it can be more practical and efficient to define `<defs>` locally within each grouping (`<g>`) element. This approach keeps each grouping unit contained with its clip path and transformations. 

One of the key reasons to choose local definition of `<defs>` is the consideration for performance and maintainability. Specifically, in a dynamic and interactive application where SVG elements are frequently updated, moved, or transformed, local `<defs>` help avoid the overhead of traversing the SVG tree multiple times and synchronize transformations across different parts of the SVG. 

While not the most "typical" approach, local definition of `<defs>` is a valid and often beneficial strategy for managing complex and dynamic SVG structures.

# Good To Know

## G Elements and Width/Height

In SVG, the `<g>` element is used to group SVG shapes together. Once grouped, transformations and styles can be applied to the whole group as a single entity. However, unlike some other SVG elements such as `<rect>`, the `<g>` element does not have `width` and `height` attributes.

The dimensions of a `<g>` element are determined by the contents within it. Any attempt to apply `width` or `height` directly to a `<g>` element will have no effect. This is because `<g>` elements are not directly rendered; their purpose is to group other elements.

For example, consider the following SVG structure:

```html
<svg width="200" height="200" viewBox="0 0 200 200">
  <g width="50" height="50" fill="green">
    <rect width="50" height="50" fill="blue"></rect>
  </g>
</svg>
```

In this case, the `<rect>` inside the `<g>` element is set to be 50 units wide and 50 units high. However, the `width` and `height` attributes applied to the `<g>` element are ignored. The size of the `<g>` element is determined by the dimensions and positions of its content, not by any `width` or `height` attributes applied directly to the `<g>` itself.

## Transformations on G Elements and Child Element Positioning

When a transformation (such as translate, rotate, scale, etc.) is applied to a `<g>` element, it affects the coordinate system for that group and all of its child elements. This means the positions of the child elements become relative to the coordinate system of the parent `<g>` element, not the overall SVG.

For example, consider the following SVG structure:

```html
<svg width="200" height="200" viewBox="0 0 200 200">
  <g transform="translate(50,50)">
    <rect width="50" height="50" fill="blue"></rect>
  </g>
</svg>
```

In this case, a `translate(50,50)` transformation is applied to the `<g>` element. This means that the origin of the coordinate system for this group is moved 50 units to the right and 50 units down. As a result, the `<rect>` inside the `<g>` element, which is positioned at (0,0) relative to the `<g>`, will actually appear at the (50,50) position in the overall SVG. This is because the rectangle's position is relative to its parent group, not the overall SVG.