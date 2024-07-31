# Configuration DSL Documentation

## Overview

The Configuration DSL allows for the concise creation of configuration values, which are then transformed into the Configuration Metadata DSL (in JSON format). This document provides an overview of the grammar and usage of the Configuration DSL.

## Grammar

The Configuration DSL follows a specific grammar to define configuration values. Below is the detailed grammar:

### Definition

A configuration definition consists of an optional `Category`, an optional `ConfigKey`, zero or more `Modifiers`, and `Properties`.

```
Definition
  = Category? ConfigKey? Modifier* Properties
```

### Category

The `Category` is defined with the keyword "category" followed by a `key`.

```
Category
  = "category" key
```

### ConfigKey

The `ConfigKey` is defined with the keyword "key" followed by a `key`.

```
ConfigKey
  = "key" key
```

### Key

A `key` consists of one or more `key_fragments` separated by dots.

```
key
  = key_fragment ("." key_fragment)*
```

### Key Fragment

A `key_fragment` is a sequence of alphanumeric characters, hyphens, or underscores.

```
key_fragment
  = (alnum | "-" | "_")+
```

### Modifier

A `Modifier` can be one of the following types: `Type`, `Multiplicity`, `Visibility`, or `Editable`.

```
Modifier
  = Type          -- type
  | Multiplicity  -- multi
  | Visibility    -- visible
  | Editable      -- edit
```

### Type

The `Type` can be either "basic" or "domain".

```
Type
  = "basic"
  | "domain"
```

### Multiplicity

The `Multiplicity` can be either "single" or "multi".

```
Multiplicity
  = "single"
  | "multi"
```

### Visibility

The `Visibility` is defined with the keyword "visible" followed by an `orgType`.

```
Visibility
  = "visible" orgType
```

### Editable

The `Editable` is defined with the keyword "edit" followed by an `orgType`.

```
Editable
  = "edit" orgType
```

### OrgType

The `orgType` can be one of the following: "country", "tenantgrp", "tenant", "companygrp", "legalorg", "sitegrp", or "site".

```
orgType
  = "country"
  | "tenantgrp"
  | "tenant"
  | "companygrp"
  | "legalorg"
  | "sitegrp"
  | "site"
```

### Properties

The `Properties` are enclosed in curly braces `{}` and consist of one or more `Property` elements separated by commas.

```
Properties
  = "{" Property ("," Property)* "}"
```

### Property

A `Property` consists of a `name`, an optional `PropType`, an optional `Validation`, and optional nested `Properties`.

```
Property
  = name PropType? Validation? Properties?
```

### Validation

The `Validation` can specify that a property must not be null.

```
Validation
  = "notnull"
```

### Literal

A `literal` is a sequence of alphanumeric characters.

```
literal
  = alnum*
```

### Name

A `name` starts with a letter followed by zero or more alphanumeric characters.

```
name
  = letter alnum*
```

### PropType

A `PropType` can be either an `EnumType` or a `primitiveType`.

```
PropType
  = EnumType
  | primitiveType
```

### PrimitiveType

A `primitiveType` can be one of the following: "string", "code", "number", "bool", "multi", "text", or "ref".

```
primitiveType
  = "string"
  | "code"
  | "number"
  | "bool"
  | "multi"
  | "text"
  | "ref"
```

### EnumType

An `EnumType` is a set of enum values enclosed in parentheses `()` and separated by commas.

```
EnumType
  = "(" enumValue ("," enumValue)* ")"
```

### EnumValue

An `enumValue` is a sequence of one or more alphanumeric characters.

```
enumValue
  = alnum+
```

## Example Usage

Here are some examples of how to use the Configuration DSL:

### Example 1: Basic Single Property

```
basic single {
  propertyName string
}
```

### Example 2: Domain Multi Property with Validation

```
domain multi {
  propertyName code notnull,
  anotherProperty (value1, value2, value3)
}
```

### Example 3: Nested Properties

```
basic single {
  outerProperty string {
    innerProperty number notnull,
    anotherInnerProperty bool
  }
}
```

### Example 4: Configuration with Category and Key

```
category myCategory key myKey {
  propertyName text
}
```

### Example 5: Configuration with Visibility and Editable Modifiers

```
visible tenant edit site {
  propertyName string,
  anotherProperty number notnull
}
```

These examples illustrate the flexibility and conciseness of the Configuration DSL. By following the grammar rules and examples provided, you can create complex configuration values with ease.
