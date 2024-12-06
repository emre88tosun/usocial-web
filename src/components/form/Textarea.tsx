'use client';

import React, { forwardRef } from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Textarea, type TextAreaProps } from '@nextui-org/react';

const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextAreaProps & { testId?: string }
>((props, ref) => {
  return (
    <Textarea
      {...props}
      ref={ref}
      {...(props.testId && { 'data-testid': props.testId })}
    />
  );
});
TextArea.displayName = 'TextArea';

export default function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'> &
    TextAreaProps & { testId?: string }
) {
  const { name, defaultValue, classNames, ...rest } = props;
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <TextArea
          variant="bordered"
          labelPlacement="outside"
          color="primary"
          size="lg"
          radius="sm"
          classNames={{
            label: 'top-[60%]',
            ...classNames,
          }}
          {...rest}
          {...field}
          isInvalid={!!fieldState.error?.message}
          errorMessage={fieldState.error?.message}
          testId={props.testId}
        />
      )}
    />
  );
}
