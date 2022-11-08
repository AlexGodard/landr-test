import React, { useState } from "react";
import { useField } from "formik";
import { Button, FormGroup, Intent } from "@blueprintjs/core";
import { times } from "lodash";
import { faker } from "@faker-js/faker";
import classNames from "classnames";

type AvatarFieldProps = {
  name?: string;
};

const generateAvatars = (count: number) => {
  return times(count, () => faker.image.avatar());
};

export const AvatarField: React.FC<AvatarFieldProps> = ({
  name = "avatar",
}) => {
  const [field, meta, helpers] = useField(name);
  const [avatars, setAvatars] = useState([
    ...(field.value ? [field.value] : generateAvatars(1)),
    ...generateAvatars(5),
  ]);

  return (
    <FormGroup
      label="Avatar"
      labelInfo="(required)"
      helperText={meta.touched && meta.error}
      intent={meta.touched && meta.error ? Intent.DANGER : undefined}
    >
      <div
        className={classNames("flex p-1", {
          "border border-red-500": meta.touched && meta.error,
        })}
      >
        {avatars.map((avatar) => {
          return (
            <div key={avatar} className="inline-block mr-2 cursor-pointer">
              <img
                className={classNames(
                  "h-10 w-10 rounded-full",
                  field.value === avatar && "ring-2 ring-blue-500"
                )}
                src={avatar}
                alt=""
                onClick={() => {
                  helpers.setValue(avatar);
                }}
              />
            </div>
          );
        })}
        <Button
          minimal
          small
          outlined
          onClick={() => {
            const newAvatars = generateAvatars(6);
            setAvatars(newAvatars);
            helpers.setValue(newAvatars[0]);
          }}
        >
          Regenerate
        </Button>
      </div>
    </FormGroup>
  );
};
