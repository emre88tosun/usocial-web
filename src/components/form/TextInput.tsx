'use client';

import React, { forwardRef } from 'react';
import clsx from 'clsx';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
} from 'react-hook-form';
import { Input, Button, type InputProps } from '@nextui-org/react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useToggle } from 'usehooks-ts';

const TextInput = forwardRef<
  HTMLInputElement,
  InputProps & { testId?: string }
>((props, ref) => {
  const [on, toggle] = useToggle(false);
  const toggleVisibility = () => toggle();

  return (
    <Input
      {...(props.type === 'number' && {
        onKeyDown: (e) =>
          ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault(),
      })}
      {...props}
      ref={ref}
      type={props.type === 'password' && on ? 'text' : props.type}
      endContent={
        props.type === 'password' ? (
          <Button
            size="sm"
            variant="flat"
            color="primary"
            radius="sm"
            className="relative"
            onClick={toggleVisibility}
            isIconOnly
          >
            <IconEyeOff
              className={clsx('absolute transition-opacity duration-200', {
                'opacity-0': !on,
                'opacity-100': on,
              })}
            />
            <IconEye
              className={clsx('absolute transition-opacity duration-200', {
                'opacity-0': on,
                'opacity-100': !on,
              })}
            />
          </Button>
        ) : (
          props.endContent
        )
      }
      {...(props.testId && { 'data-testid': props.testId })}
    />
  );
});
TextInput.displayName = 'TextInput';

export default function FormTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: Pick<ControllerProps<TFieldValues, TName>, 'name' | 'defaultValue'> &
    InputProps & { testId?: string }
) {
  const { name, defaultValue, classNames, ...rest } = props;
  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <TextInput
          variant="bordered"
          labelPlacement="outside"
          color="primary"
          size="lg"
          radius="sm"
          classNames={{
            label: 'top-[60%]',
            ...classNames,
          }}
          {...(props.isClearable &&
            !props.onClear && { onClear: () => field.onChange('') })}
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
