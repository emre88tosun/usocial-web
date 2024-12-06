import React from 'react';
import { Modal, ModalBody, ModalContent, Spinner } from '@nextui-org/react';

export interface IFullPageLoaderModal {
  readonly isOpen: boolean;
}

export default function FullPageLoaderModal(
  props: IFullPageLoaderModal
): React.ReactElement {
  const { isOpen } = props;

  return (
    <Modal
      id="FullPageLoaderModal"
      isOpen={isOpen}
      size="full"
      className="rounded-2xl"
      hideCloseButton
      placement="center"
      scrollBehavior="inside"
      classNames={{
        base: 'shadow-none',
        backdrop: 'bg-overlay/20',
      }}
    >
      <ModalContent className="bg-transparent">
        <ModalBody
          id="FullPageLoaderModal_Body"
          className="flex items-center justify-center gap-0 p-6 pt-0"
        >
          <Spinner color="primary" size="md" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
