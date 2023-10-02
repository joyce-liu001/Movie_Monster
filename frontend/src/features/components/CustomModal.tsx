import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  handleSuccess: () => void;
  title: string;
  body: string | React.ReactNode;
}

const CustomModal = ({ open, handleClose, handleSuccess, title, body }: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: 750,
          },
        },
      }}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {body}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Cancel
        </Button>
        <Button onClick={handleSuccess} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
