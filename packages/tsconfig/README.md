# `@pda/tsconfig`

This package provides a set of TypeScript configuration files that can be used in various development contexts. The goal is to ensure consistent TypeScript configuration across multiple projects or within different parts of the same project. The package contains the following configuration files:

## `base.json`
The 'base' configuration provides a general-purpose TypeScript configuration that is suitable for a wide variety of projects. It sets several important flags to ensure the best balance of development experience and runtime performance. This file can be used as a basis for other configurations or on its own in projects that don't have specific needs.

## `node.json`
The 'node' configuration extends the 'base' configuration with settings that are optimized for Node.js development. This includes setting the 'target' to 'esnext' and the 'module' to 'commonjs'. The 'node' configuration also specifies a 'rootDir' and 'outDir' to organize the source and compiled files.

## `react-base.json`
The 'react-base' configuration extends the 'base' configuration with settings that are optimized for React.js development. This includes enabling JSX syntax and including the 'dom' and 'dom.iterable' libraries. The 'module' is set to 'esnext' and the 'target' is set to 'es6', making it compatible with most modern browsers.

## `shared-library.json`
The 'shared-libraries' configuration extends the 'base' configuration and is designed for developing libraries that will be shared between different projects, specifically those that can be used in both Node.js and React.js environments. The 'target' is set to 'es6' and the 'module' is set to 'commonjs'. Like the 'node' configuration, 'shared-libraries' also specifies a 'rootDir' and 'outDir' to organize the source and compiled files.

## Usage
To use one of these configurations in your project, you'll need to install the `@pda/tsconfig` package and extend the desired configuration in your tsconfig.json file. For example, to use the 'react-base' configuration, your tsconfig.json file would look like this:

```json
{
  "extends": "@pda/tsconfig/react-base.json"
}
```
You can override specific settings by adding them to your tsconfig.json file. For example, to change the 'target' setting when using the 'react-base' configuration, you would do:

```json
{
  "extends": "@pda/tsconfig/react-base.json",
  "compilerOptions": {
    "target": "es5"
  }
}
