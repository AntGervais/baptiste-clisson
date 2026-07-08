import { useForm } from '~/utils/useForm';
import type { Contact } from '~/types';
import sanitize from '~/utils/sanitize';
import validations from '~/utils/validations';
import { useState } from 'react';
import Input from './Input';
import PulseSpinner from '../common/PulseSpinner';
import TextArea from './TextArea';

export default function ContactForm() {
  const [serverError, setServerError] = useState('');
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
  });

  return (
    <div className="w-full lg:absolute lg:right-12">
      <div className="rounded-sm bg-zinc-100">
        <div className="form-container relative w-full rounded-sm bg-white shadow-lg">
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

          <form onSubmit={handleSubmit} noValidate className="relative w-full rounded-sm p-4 sm:py-6 md:px-10 md:py-8">
            {serverError && (
              <div className="mb-4 rounded-sm bg-red-600 py-4 text-center sm:mb-6">
                <p className="text-lg text-white">{serverError}</p>
              </div>
            )}
            {submitted && (
              <div className="bg-primary mb-4 rounded-sm py-4 text-center sm:mb-6">
                <p className="text-lg text-white">Message envoyé — je vous recontacte au plus vite.</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Input name="name" label="Nom" required {...register('name')} />
              <Input name="email" label="Email" required {...register('email')} />
              <Input name="phone" label="Numéro de téléphone" {...register('phone')} />
              <TextArea name="message" label="Message" height="h-40" required {...register('message')} />
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={submitting || submitted}
                className="btn bg-primary hover:bg-accent hover:border-accent text-beige w-full rounded-sm p-2 font-semibold tracking-wide uppercase hover:text-white disabled:text-zinc-300 disabled:opacity-60"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
