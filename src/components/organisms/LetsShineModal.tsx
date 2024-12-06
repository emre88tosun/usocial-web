import React from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm, useFormState, FormProvider } from 'react-hook-form';
import safeString from '@helpers/safeString';
import FormTextInput from '@components/form/TextInput';
import useInfluencersActions from '@hooks/influencer/useInfluencersActions';
import HTTP_CODES_ENUM from '@constants/http';
import toast from 'react-hot-toast';
import FormTextarea from '@components/form/Textarea';

const Schema = z.object({
  bio: z.string().min(1, 'Bio is required'),
  gem_cost_per_dm: z.string().min(1, 'Cost per DM is required'),
});

type FormType = z.infer<typeof Schema>;

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
      Let&apos;s Shine!
    </Button>
  );
}

type Props = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export default function LetsShineModal(props: Props) {
  const { isOpen, onClose } = props;
  const {
    become: { mutateAsync: become },
  } = useInfluencersActions();
  const methods = useForm<FormType>({
    defaultValues: {
      bio: '',
      gem_cost_per_dm: '10',
    },
    mode: 'all',
    reValidateMode: 'onChange',
    resolver: zodResolver(Schema),
  });

  const { handleSubmit, setError } = methods;
  const onSubmit = handleSubmit(async (formData) => {
    const result = await become({
      bio: formData.bio,
      gem_cost_per_dm: Number(formData.gem_cost_per_dm),
    });
    const { status, data } = result;
    if (status === HTTP_CODES_ENUM.CREATED) {
      toast.success('You have successfully became an influencer');
      onClose();
    }
    if (status === HTTP_CODES_ENUM.BAD_REQUEST) {
      toast.error(safeString(data.message));
    }
    if (status === HTTP_CODES_ENUM.UNPROCESSABLE_ENTITY) {
      const errors = data.errors;
      Object.entries(errors).forEach(([key, value]) => {
        setError(key as keyof FormType, {
          type: 'custom',
          message: value.join('\n'),
        });
      });
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
        <ModalHeader>Become an Influencer</ModalHeader>
        <ModalBody className="pb-4 pt-0">
          <FormProvider {...methods}>
            <form
              className="flex w-full flex-col gap-2"
              noValidate
              onSubmit={onSubmit}
            >
              <p>
                Unlock your potential by becoming an influencer! Share your
                passions, connect with followers, and set your own gem cost for
                direct messages. Fill out your bio to let people know who you
                are and start earning gems today!
              </p>
              <FormTextarea<FormType> name="bio" label="Bio" isRequired />
              <FormTextInput<FormType>
                name="gem_cost_per_dm"
                label="Cost per DM"
                type="number"
                isRequired
              />
              <FormActions />
            </form>
          </FormProvider>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
