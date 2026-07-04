
import { useForm } from '~/utils/useForm';
import type { Contact } from '~/types';
import sanitize from '~/utils/sanitize';
import validations from '~/utils/validations';
import { useState } from 'react';
import Input from './Input';
import PulseSpinner from '../common/PulseSpinner';
import TextArea from './TextArea';

export default function ContactForm() {
  const [serverError, setServerError] = useState('')
  const { submitting, submitted, register, handleSubmit } = useForm<Contact>({
    validations,
    sanitizeFn: sanitize,
    onSubmit: async (data) => {
      try {
        const body = new URLSearchParams({ 'form-name': 'contact', ...data }).toString();
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        return true;
      } catch (_err) {
        const err = _err as Error;
        console.error(err);
        setServerError("L'envoi a échoué. Merci de réessayer.");
        return false;
      }
    },
  })

  return (
    <div className='lg:absolute lg:right-12 w-full'>
      <div className="bg-zinc-100 rounded-sm">
        <div className="form-container relative w-full rounded-sm shadow-lg bg-white">
          <div
            className={[
              'form-overlay',
              'absolute',
              'h-full',
              'inset-0',
              'rounded-sm',
              'z-20',
              'bg-gray-900',
              'opacity-70',
              submitting ? 'centered' : 'hidden',
            ].join(' ')}
          >
            <PulseSpinner />
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="relative w-full p-4 sm:py-6 md:py-8 md:px-10 rounded-sm"
          >
            {serverError && (
              <div className="mb-4 sm:mb-6 bg-red-600 py-4 rounded-sm text-center">
                <p className="text-lg text-white">{serverError}</p>
              </div>
            )}
            {submitted && (
              <div className="mb-4 sm:mb-6 bg-primary py-4 rounded-sm text-center">
                <p className="text-lg text-white">Message envoyé — je vous recontacte au plus vite.</p>
              </div>
            )}
            <div className="flex flex-col gap-2">

              <Input
                name="name"
                label="Nom"
                required
                {...register('name')}
              />
              <Input
                name="email"
                label="Email"
                required
                {...register('email')}
              />
              <Input
                name="phone"
                label="Numéro de téléphone"
                {...register('phone')}
              />
              <TextArea
                name="message"
                label="Message"
                height="h-40"
                required
                {...register('message')}
              />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={submitting || submitted}
                className="btn w-full p-2 rounded-sm bg-primary hover:bg-accent hover:border-accent hover:text-white text-beige font-semibold uppercase tracking-wide disabled:opacity-60 disabled:text-zinc-300"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
