import { nameRegex, phoneRegex, emailRegex, messageRegex } from './regex';
import type { Validations } from './useForm';

const validations: Validations<Contact> = {
  firstName: {
    required: 'Vous devez entrer votre prénom',
    pattern: {
      value: nameRegex,
      message: 'Prénom invalide',
    },
  },
  lastName: {
    required: 'Vous devez entrer votre nom',
    pattern: {
      value: nameRegex,
      message: 'Nom invalide',
    },
  },
  email: {
    required: 'Vous devez entrer votre email',
    pattern: {
      value: emailRegex,
      message: 'Email invalide',
    },
  },
  phone: {
    pattern: {
      value: phoneRegex,
      message: 'Numéro de téléphone invalide',
    },
  },
  message: {
    required: "Merci d'indiquer un message",
    pattern: {
      value: messageRegex,
      message: 'Votre message est invalide',
    },
  },
};

export default validations;
