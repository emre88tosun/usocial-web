import React, { ChangeEvent, forwardRef } from 'react';
import {
  cn,
  RadioGroup as NextRadioGroup,
  RadioGroupProps,
} from '@nextui-org/react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import safeString from '@helpers/safeString';

const RadioGroup = forwardRef<
  HTMLDivElement | null,
  RadioGroupProps & {
    name: string;
    value: string;
    onChange: (value: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  }
>(function RadioGroupInput(props, ref) {
  return (
    <NextRadioGroup
      ref={ref}
      size="md"
      fullWidth
      {...props}
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
  );
});

function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'> &
    RadioGroupProps
) {
  return (
    <Controller
      name={props.name}
      defaultValue={props.defaultValue}
      render={({ field, fieldState }) => (
        <RadioGroup
          {...field}
          {...props}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          errorMessage={fieldState.error?.message}
          isInvalid={!!fieldState.error}
          color={fieldState.error ? 'danger' : 'primary'}
          classNames={{
            ...props.classNames,
            label: cn({
              [safeString(props.classNames?.label)]: !!props.classNames?.label,
              '!text-danger': !!fieldState.error,
            }),
          }}
        />
      )}
    />
  );
}

export default FormRadioGroup;
