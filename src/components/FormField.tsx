import React from "react";
import { Field, FieldProps, useField } from "formik";
import { FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import titleize from "titleize";
import { lowerCase } from "lodash";

type FormFieldProps = {
  name: string;
};

export const FormField: React.FC<FormFieldProps> = ({ name }) => {
  const [field, meta] = useField(name);
  return (
    <FormGroup
      label={titleize(lowerCase(name))}
      labelInfo="(required)"
      helperText={meta.touched && meta.error}
      intent={meta.touched && meta.error ? Intent.DANGER : undefined}
    >
      <InputGroup
        large
        intent={meta.touched && meta.error ? Intent.DANGER : undefined}
        {...field}
      />
    </FormGroup>
  );
};
