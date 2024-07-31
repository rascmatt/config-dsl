import {ActionDict} from "ohm-js";

// Stack to keep track of the current property being processed, as Ohm doesn't provide a way to pass context to the
// semantics.
const pStack: string[] = [];

const orgTypes = [
  "COUNTRY",
  "TENANTGRP",
  "TENANT",
  "COMPANYGRP",
  "LEGALORG",
  "SITEGRP",
  "SITE"
];

/**
 * Visitor to transform the Ohm CST to an object according to the semantics of the configuration metadata DSL.
 */
export const semantics: ActionDict<any> = {

  Definition: (category, configKey, modifiers, props) => {
    const mod = modifiers['metadata'].reduce((acc: any, m: any) => ({...acc, ...m}), {});
    console.log('Modifiers:', mod);


    const properties = props['metadata'];
    const validations: any[] = [];

    const extractValidations = (props: any[]) => {
      for (const property of props) {
        if (property.validation) {
          validations.push(property.validation);
          delete property.validation;
        }
        if (property.subAttributes) {
          extractValidations(property.subAttributes);
        }
      }
    }
    extractValidations(properties);


    const result: any = {
      category: category['metadata'].length ? category['metadata'][0] : '...',
      configKey: configKey['metadata'].length ? configKey['metadata'][0] : '...',
      alternateKeys: [],
      status: 'PRODUCTION',
      visibleAt: mod.visibleAt || [
        "COUNTRY",
        "TENANTGRP",
        "TENANT",
        "COMPANYGRP",
        "LEGALORG",
        "SITEGRP",
        "SITE"
      ],
      editableAt: mod.editableAt || [
        "COUNTRY",
        "TENANTGRP",
        "TENANT",
        "COMPANYGRP",
        "LEGALORG",
        "SITEGRP",
        "SITE"
      ],
      multiplicity: mod.multiplicity || 'MULTIPLE',
      type: mod.configType || 'DOMAIN',
      attributes: properties,
      constraints: undefined,
      usedByApplications: [],
    }

    if (validations.length) {
      result.constraints = validations;
    }

    return result;
  },
  Category: (_, key) => {
    return key.sourceString;
  },
  ConfigKey: (_, key) => {
    return key.sourceString;
  },
  Modifier_type: (type) => {
    const result = {configType: 'DOMAIN'};
    if (type.sourceString) {
      result.configType = type.sourceString.toUpperCase() === 'DOMAIN' ? 'DOMAIN' : 'BASIC';
    }
    return result;
  },
  Modifier_multi: (multi) => {
    const result = {multiplicity: 'MULTIPLE'};
    if (multi.sourceString) {
      result.multiplicity = multi.sourceString.toUpperCase() === 'SINGLE' ? 'SINGLE' : 'MULTIPLE';
    }
    return result;
  },
  Modifier_visible: (orgType) => {
    return orgType['metadata'];
  },
  Modifier_edit: (orgType) => {
    return orgType['metadata'];
  },
  Visibility: (_, orgType) => {
    // Choose all the org types down to the selected one.
    const result = [];
    for (const t of orgTypes) {
      result.push(t);
      if (orgType.sourceString.toUpperCase() === t) {
        break;
      }
    }
    return {visibleAt: result};
  },
  Editable: (_, orgType) => {
    // Choose all the org types down to the selected one.
    const result = [];
    for (const t of orgTypes) {
      result.push(t);
      if (orgType.sourceString.toUpperCase() === t) {
        break;
      }
    }
    return {editableAt: result};
  },
  Properties: (_0, p1, _1, ps, _2) => {
    return [p1['metadata'], ...ps['metadata']];
  },

  Property: (name, type, validation, subProps) => {
    const t = type['metadata']?.[0] || {type: 'STRING'};

    // Infer the type if it's a multi property
    if (subProps.numChildren && !type.sourceString) {
      t.type = 'MULTI_PROPERTY';
    }

    pStack.push(name.sourceString);
    const result: any = {
      name: name.sourceString,
      dataType: t.type
    }

    if (t.type === 'ENUM') {
      result['options'] = t.options;
    }

    if (t.type === 'MULTI_PROPERTY') {
      result['subAttributes'] = subProps['metadata']?.[0] || [];
    }

    if (validation.sourceString) {
      validation['args'] = {attribute: name.sourceString};
      result['validation'] = validation['metadata'];
    }

    pStack.pop();
    return result;
  },

  Validation: (value) => {
    return {
      type: value.sourceString.toUpperCase(),
      attribute: pStack.join('/')
    };
  },

  PropType: (type) => {
    return type['metadata'];
  },

  EnumType: (_, e1, _1, en, _2) => {
    return {
      type: 'ENUM',
      options: [e1["metadata"], ...en["metadata"]]
    }
  },

  enumValue: (value) => {
    return value.sourceString;
  },

  primitiveType: (value) => {
    const result = {
      type: 'STRING',
      options: []
    }
    const v = value.sourceString?.toUpperCase();
    if (v === 'STRING' || v === 'CODE' || v === 'NUMBER' || v === 'TEXT') {
      result.type = v;
    }
    if (v === 'BOOL') {
      result.type = 'BOOLEAN';
    }
    if (v === 'MULTI') {
      result.type = 'MULTI_PROPERTY';
    }
    if (v === 'REF') {
      result.type = 'REFERENCE';
    }
    return result;
  },

  _iter(...children) {
    return children.map(c => c['metadata']);
  },

  _terminal() {
    return this.sourceString;
  }
}
