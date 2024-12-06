'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, useFormState, FormProvider } from 'react-hook-form';
import { Button, Card, CardBody } from '@nextui-org/react';
import FormTextInput from '@components/form/TextInput';
import withPageRequiredGuest from '@hocs/withPageRequiredGuest';
import useAuthService from '@hooks/auth/useAuthService';
import HTTP_CODES_ENUM from '@constants/http';
import { Link, useNavigate } from 'react-router-dom';

const Schema = z
  .object({
    email: z
      .string()
      .email('Please provide a valid e-mail address')
      .min(1, 'Email is required'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(1, 'Password is required'),
    password_confirmation: z
      .string()
      .min(1, 'Password confirmation is required'),
  })
  .superRefine(({ password, password_confirmation }, ctx) => {
    if (password !== password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      });
    }
  });

type RegisterFormData = z.infer<typeof Schema>;

function FormActions() {
  const { isSubmitting } = useFormState();

  return (
    <Button
      isLoading={isSubmitting}
      isDisabled={isSubmitting}
      color="primary"
      variant="solid"
      radius="sm"
      type="submit"
      className="mt-2"
      fullWidth
    >
      Register
    </Button>
  );
}

function Content() {
  const navigate = useNavigate();
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: '',
      password: '',
      password_confirmation: '',
      name: '',
    },
  });
  const { handleSubmit, setError } = methods;
  const {
    register: { mutateAsync: register },
  } = useAuthService();

  const onSubmit = handleSubmit(async (formData) => {
    const response = await register(formData);
    const { status, data } = response;
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      const errors = data.errors;
      Object.entries(errors).forEach(([key, value]) => {
        setError(key as keyof RegisterFormData, {
          type: 'custom',
          message: value.join('\n'),
        });
      });
      return;
    }
    if (status === HTTP_CODES_ENUM.CREATED) {
      toast.success('You have successfully registered');
      navigate('/login', { replace: true });
    }
  });

  return (
    <div className="flex h-screen w-screen">
      <section className="m-auto w-full px-4 lg:!w-1/3">
        <div className="">
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-bold">uSocial</p>
            <Card className="mx-auto w-full max-w-md p-4">
              <CardBody>
                <FormProvider {...methods}>
                  <form className="w-full" onSubmit={onSubmit} noValidate>
                    <div className="2xl:mt-2 2xl:text-3xl mt-2 text-2xl font-bold text-default-900">
                      Hey, Hello 👋
                    </div>
                    <div className="2xl:text-lg 2xl:mt-2 pb-2 text-base leading-6 text-default-600">
                      Enter the information to register.
                    </div>
                    <FormTextInput<RegisterFormData>
                      name="name"
                      className="py-2"
                      label="Name"
                      placeholder="Name"
                      testId="register-name"
                      isRequired
                      autoFocus
                    />
                    <FormTextInput<RegisterFormData>
                      name="email"
                      className="py-2"
                      label="E-mail"
                      placeholder="E-mail"
                      type="email"
                      testId="login-email"
                      isRequired
                    />
                    <FormTextInput<RegisterFormData>
                      name="password"
                      className="py-2"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      testId="login-password"
                      isRequired
                    />
                    <FormTextInput<RegisterFormData>
                      name="password_confirmation"
                      className="py-2"
                      label="Confirm Password"
                      placeholder="Confirm Password"
                      type="password"
                      testId="login-confirm-password"
                      isRequired
                    />
                    <div className="my-2 flex justify-end">
                      <Link
                        color="primary"
                        to="/login"
                        className="font-semibold text-primary hover:underline"
                      >
                        Login
                      </Link>
                    </div>
                    <FormActions />
                  </form>
                </FormProvider>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default withPageRequiredGuest(Content);
