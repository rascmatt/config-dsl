import * as ohm from "ohm-js";

export const grammar = ohm.grammar(`
Configuration {

  Definition
    = Category? ConfigKey? Modifier* Properties

  Category
    = "category" key

  ConfigKey
    = "key" key

  key
    = key_fragment ("." key_fragment)*

  key_fragment
    = (alnum | "-" | "_")+

  Modifier
    = Type          -- type
    | Multiplicity  -- multi
    | Visibility    -- visible
    | Editable      -- edit

  Type
    = "basic"
    | "domain"

  Multiplicity
    = "single"
    | "multi"

  Visibility
    = "visible" orgType

  Editable
    = "edit" orgType

  orgType
    = "country"
    | "tenantgrp"
    | "tenant"
    | "companygrp"
    | "legalorg"
    | "sitegrp"
    | "site"

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
   | "text"
   | "ref"

  EnumType
    = "(" enumValue ("," enumValue)* ")"

  enumValue
    = alnum+
}
`);
