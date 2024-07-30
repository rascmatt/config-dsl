import {ActionDict} from "ohm-js";

/**
 * Visitor to transform the Ohm CST to an object according to the semantics of the configuration metadata DSL.
 */
export const semantics: ActionDict<any> = {

  Definition: (type, multi, props) => {
    let configType: 'DOMAIN' | 'BASIC' = 'DOMAIN';
    if (type.sourceString) {
      configType = type.sourceString.toUpperCase() === 'DOMAIN' ? 'DOMAIN' : 'BASIC';
    }
    let multiplicity: 'SINGLE' | 'MULTIPLE' = 'MULTIPLE';
    if (multi.sourceString) {
      multiplicity = multi.sourceString.toUpperCase() === 'SINGLE' ? 'SINGLE' : 'MULTIPLE';
    }

    const properties = props['metadata'];
    const validations = [];

    for (const property of properties) {
      if (property.validation) {
        validations.push(property.validation);
        delete property.validation;
      }
    }


    const result: any = {
      category: '...',
      configKey: '...',
      alternateKeys: [],
      status: 'PRODUCTION',
      visibleAt: [
        "COUNTRY",
        "TENANTGRP",
        "TENANT",
        "COMPANYGRP",
        "LEGALORG",
        "SITEGRP",
        "SITE"
      ],
      editableAt: [
        "COUNTRY",
        "TENANTGRP",
        "TENANT",
        "COMPANYGRP",
        "LEGALORG",
        "SITEGRP",
        "SITE"
      ],
      multiplicity,
      type: configType,
      attributes: props['metadata'],
      usedByApplications: [],
    }

    if (validations.length) {
      result['constraints'] = validations;
    }

    return result;
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

    const result: any = {
      name: name.sourceString,
      dataType: t.type
    }

    if (t.type === 'ENUM') {
      result['options'] = t.options;
    }

    if (t.type === 'MULTI_PROPERTY') {
      result['subAttributes'] = subProps['metadata'];
    }

    if (validation.sourceString) {
      result['validation'] = validation['metadata'];
      // Set the attribute name for the validation
      for (const v of validation['metadata']) {
        v["attribute"] = name.sourceString;
      }
    }

    return result;
  },

  Validation: (value) => {
    return {
      type: value.sourceString.toUpperCase(),
      attribute: '' // Will be set by the parent node
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
    if (v === 'STRING' || v === 'CODE' || v === 'NUMBER') {
      result.type = v;
    }
    if (v === 'BOOL') {
      result.type = 'BOOLEAN';
    }
    if (v === 'MULTI') {
      result.type = 'MULTI_PROPERTY';
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
