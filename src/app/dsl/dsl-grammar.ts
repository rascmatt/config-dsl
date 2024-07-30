import * as ohm from "ohm-js";

export const grammar = ohm.grammar(`
Configuration {

  Definition
    = Type? Multiplicity? Properties

  Type
    = "basic"
    | "domain"

  Multiplicity
    = "single"
    | "multi"

  Properties
    = "{" Property ("," Property)* "}"

  Property
    = name PropType? Validation? Properties?

  Validation
    = "notnull"

  literal
    = alnum*

  name
    = letter alnum*

  PropType
    = EnumType
    | primitiveType

  primitiveType
   = "string"
   | "code"
   | "number"
   | "bool"
   | "multi"

  EnumType
    = "(" enumValue ("," enumValue)* ")"

  enumValue
    = alnum+
}
`);
