import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  type RadioProps,
  Radio,
  cn,
  useDisclosure,
} from '@nextui-org/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useForm,
  useFormState,
  FormProvider,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import FormRadioGroup from '@components/form/RadioGroup';
import { IconDiamond } from '@tabler/icons-react';
import safeString from '@helpers/safeString';
import FormTextInput from '@components/form/TextInput';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import loadStripe from '@helpers/stripe';
import useMe from '@hooks/auth/useMe';
import FullPageLoaderModal from '@components/atoms/FullPageLoaderModal';
import { useToggle } from 'usehooks-ts';
import useGemsActions from '@hooks/gem/useGemsActions';
import HTTP_CODES_ENUM from '@constants/http';
import toast from 'react-hot-toast';

const StripeSchema = z.object({
  cardHolderName: z.string().min(1, 'Card holder name is required'),
});

type StripeFormType = z.infer<typeof StripeSchema>;

function StripeFormActions(props: { readonly amount: string }) {
  const { amount } = props;
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
      {`Pay (${amount} USD)`}
    </Button>
  );
}

type StripeModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess: () => void;
  readonly amount: number;
};
function StripeModal(props: StripeModalProps) {
  const { isOpen, onClose, amount, onSuccess } = props;
  const [loading, , toggle] = useToggle(false);
  const {
    purchase: { mutateAsync: purchase },
  } = useGemsActions();
  const { data: user } = useMe();
  const stripe = useStripe();
  const elements = useElements();
  const methods = useForm<StripeFormType>({
    resolver: zodResolver(StripeSchema),
    defaultValues: {
      cardHolderName: safeString(user?.name),
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { handleSubmit } = methods;
  const onSubmit = handleSubmit(async (formData) => {
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) return;
    toggle(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      billing_details: {
        email: safeString(user?.email),
        name: safeString(formData.cardHolderName),
      },
      card,
    });

    if (!paymentMethod || error) {
      toggle(false);
      return;
    }
    const result = await purchase({
      amount: Number(amount),
      paymentMethodId: safeString(paymentMethod.id),
    });
    toggle(false);
    if (result.status === HTTP_CODES_ENUM.OK) {
      toast.success('Successfully purchased gems');
      onClose();
      onSuccess();
      return;
    }
    if (result.status === HTTP_CODES_ENUM.INTERNAL_SERVER_ERROR) {
      toast.error(safeString(result.data?.message));
      return;
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      placement="center"
      scrollBehavior="inside"
    >
      <ModalContent className="text-zinc-900 dark:text-white">
        <ModalHeader>Pay</ModalHeader>
        <ModalBody className="pb-4 pt-0">
          <FormProvider {...methods}>
            <form
              className="flex w-full flex-col gap-2"
              noValidate
              onSubmit={onSubmit}
            >
              <FormTextInput<StripeFormType>
                name="cardHolderName"
                label="Card Holder Name"
                placeholder="Card Holder Name"
                isRequired
              />
              <CardElement
                options={{
                  hidePostalCode: true,
                  classes: {
                    base: 'tap-highlight-transparent !text-medium [&_*]:text-medium [&_input]:text-zinc-900 dark:text-white flex flex-col items-center [&>div]:!w-full shadow-sm px-3 border-medium border-default-200 hover:border-default-400 min-h-10 rounded-small items-start justify-center gap-0 transition-background !duration-150 transition-colors motion-reduce:transition-none h-12 py-2',
                    focus: '!border-primary',
                    invalid: '!border-danger !text-danger',
                  },
                }}
              />
              <StripeFormActions amount={safeString(amount)} />
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
      {loading && <FullPageLoaderModal isOpen={loading} />}
    </Modal>
  );
}

const Schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
});

type FormType = z.infer<typeof Schema>;

function FormActions() {
  const methods = useFormContext<FormType>();
  const { control } = methods;
  const { isSubmitting } = useFormState();
  const amount = useWatch({ control, name: 'amount' });

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
      {`Buy (${amount} USD)`}
    </Button>
  );
}

export const CustomRadio = (props: RadioProps) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          'm-0 inline-flex items-center justify-between bg-content1 hover:bg-content2',
          'cursor-pointer flex-row-reverse gap-4 rounded-lg border-2 border-transparent p-2',
          'data-[selected=true]:bg-primary [&_*]:transition-colors [&_*]:duration-100 [&_*]:data-[selected=true]:text-white',
          '[&>div]:!mx-0 [&>span]:hidden'
        ),
        label: 'flex flex-row gap-2',
      }}
    >
      {children}
    </Radio>
  );
};

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export default function BuyGemsModal(props: Props) {
  const { isOpen, onClose } = props;
  const [amount, setAmount] = useState('');
  const {
    isOpen: isStripeOpen,
    onClose: onStripeClose,
    onOpen: onStripeOpen,
  } = useDisclosure({ id: 'stripeModal' });
  const methods = useForm<FormType>({
    defaultValues: {
      amount: '10',
    },
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(Schema),
  });

  const { handleSubmit } = methods;
  const onSubmit = handleSubmit((formData) => {
    if (Number(formData.amount) < 1) return;
    setAmount(safeString(formData.amount));
    onStripeOpen();
  });

  return (
    <Elements
      stripe={loadStripe(
        'pk_test_51QRWYcCIwJSLeHW6HlvVJ5FUk3jQzJSTTqybwNL08t4pD6skt4tNpthSvagqOWBleg0tVi5OU6ZHA4r9E8RahRam007SqGz74n'
      )}
    >
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        placement="center"
        scrollBehavior="inside"
      >
        <ModalContent className="text-zinc-900 dark:text-white">
          <ModalHeader>Buy Gems</ModalHeader>
          <ModalBody className="pb-4 pt-0">
            <FormProvider {...methods}>
              <form
                className="flex w-full flex-col gap-2"
                noValidate
                onSubmit={onSubmit}
              >
                <p>
                  Select a gem package to purchase. Gems can be used to send
                  messages.
                </p>
                <FormRadioGroup<FormType>
                  name="amount"
                  label="Amount"
                  orientation="horizontal"
                  isRequired
                >
                  {[10, 20, 50, 100, 200].map((amount) => (
                    <CustomRadio key={amount} value={safeString(amount)}>
                      <IconDiamond />
                      {amount}
                    </CustomRadio>
                  ))}
                </FormRadioGroup>
                <FormActions />
              </form>
            </FormProvider>
          </ModalBody>
        </ModalContent>
        {isStripeOpen && (
          <StripeModal
            isOpen={isStripeOpen}
            onClose={onStripeClose}
            amount={Number(amount)}
            onSuccess={onClose}
          />
        )}
      </Modal>
    </Elements>
  );
}
