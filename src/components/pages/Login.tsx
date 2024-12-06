'use client';

import React from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, useFormState, FormProvider } from 'react-hook-form';
import { Button, Card, CardBody } from '@nextui-org/react';
import FormTextInput from '@components/form/TextInput';
import withPageRequiredGuest from '@hocs/withPageRequiredGuest';
import useAuthActions from '@hooks/auth/useAuthActions';
import useAuthService from '@hooks/auth/useAuthService';
import useAuthTokens from '@hooks/auth/useAuthTokens';
import HTTP_CODES_ENUM from '@constants/http';
import { Link } from 'react-router-dom';
import safeString from '@helpers/safeString';

const Schema = z.object({
  email: z
    .string()
    .email('Please provide a valid e-mail address')
    .min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof Schema>;

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
      Login
    </Button>
  );
}

function Content() {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(Schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { handleSubmit } = methods;
  const {
    login: { mutateAsync: login },
  } = useAuthService();
  const { setUser } = useAuthActions();
  const { setTokensInfo } = useAuthTokens();

  const onSubmit = handleSubmit(async (formData) => {
    const response = await login(formData);
    const { status, data } = response;
    if (status === HTTP_CODES_ENUM.UNAUTHORIZED) {
      toast.error(safeString(data.message));
      return;
    }
    if (status === HTTP_CODES_ENUM.OK) {
      toast.success('You have successfully logged in');
      try {
        setTokensInfo({
          token: data.token,
          refresh_token: data.refresh_token,
          chat_token: data.chat_token,
          expires_at: data.expires_at,
        });
        setUser(data.user);
      } catch (error) {
        console.error(error);
      }
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
                      Enter the information to proceed.
                    </div>
                    <FormTextInput<LoginFormData>
                      name="email"
                      className="py-2"
                      label="E-mail"
                      placeholder="E-mail"
                      type="email"
                      testId="login-email"
                      isRequired
                      autoFocus
                    />
                    <FormTextInput<LoginFormData>
                      name="password"
                      className="py-2"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      testId="login-password"
                      isRequired
                    />
                    <div className="my-2 flex justify-end">
                      <Link
                        color="primary"
                        to="/register"
                        className="font-semibold text-primary hover:underline"
                      >
                        Register
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
