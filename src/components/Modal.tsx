import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | null;

interface ModalProps {
  size: ModalSize;
  isOpen: boolean;
  handleOpen: (open?: boolean) => void;
  headerText?: string;
  footerChildren?: React.ReactNode;
  children?: React.ReactNode;
}

export function Modal({
  size,
  isOpen,
  handleOpen,
  headerText = 'Default Header',
  footerChildren,
  children,
}: ModalProps) {
  return (
      <Dialog
        open={isOpen}
        size={size || 'md'}
        handler={handleOpen}
      >
        <DialogHeader className="flex justify-between items-center">
          {headerText}
          <IconButton variant="text" color="blue-gray" onClick={() => handleOpen(false)}>
            <XMarkIcon className="w-5 h-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="pb-4">{children}</DialogBody>
        {footerChildren && <DialogFooter>{footerChildren}</DialogFooter>}
      </Dialog>
  );
}
