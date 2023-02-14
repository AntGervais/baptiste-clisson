
import { useForm } from '@/utils/useForm';
import sanitize from '@/utils/sanitize';
import validations from '@/utils/validations';
import { useState } from 'react';
import Input from './Input';
import PulseSpinner from './PulseSpinner';
import TextArea from './TextArea';

export default function ContactForm() {
  const [serverError, setServerError] = useState('')
  const { submitting, submitted, register, handleSubmit } = useForm<Contact>({
    validations,
    sanitizeFn: sanitize,
    onSubmit: async (data) => {
      try {
        const res = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(JSON.stringify(await res.json()))
        }

        return true
      } catch (_err) {
        const err = _err as Error
        console.error(err)
        setServerError('Something went wrong, please try again later')
        return false
      }
    },
  })

  return (
    <div className="container max-w-sm sm:max-w-lg my-2 lg:my-0 bg-gray-100">
      <div className="form-container relative w-full rounded-xl shadow-lg bg-blackAlpha-600">
        <div
          className={[
            'form-overlay',
            'absolute',
            'h-full',
            'inset-0',
            'rounded-xl',
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
          className="relative w-full p-4 px-6 sm:py-6 md:py-8 md:px-10"
        >
          <div className="pb-6 px-12 text-center">
            <span className="text-gray-600 font-semibold text-lg text-center">
              Enter your contact info and we will get back to as soon as possible!
            </span>
          </div>
          {serverError && (
            <div className="mb-4 sm:mb-6 bg-red-500 py-4 rounded-md text-center">
              <h3 className="text2xl text-white">{serverError}</h3>
            </div>
          )}
          {submitted && (
            <div className="mb-4 sm:mb-6 bg-green-500 py-4 rounded-md text-center">
              <h3 className="text2xl text-white">Message successfully sent!</h3>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Input
              name="firstName"
              label="First name"
              required
              bg="bg-gray-100"
              {...register('firstName')}
            />
            <Input
              name="lastName"
              label="Last name"
              required
              bg="bg-gray-100"
              {...register('lastName')}
            />
            <Input
              name="email"
              label="Email address"
              required
              bg="bg-gray-100"
              {...register('email')}
            />
            <Input name="phone" label="Phone number" bg="bg-gray-100" {...register('phone')} />
            <TextArea
              name="message"
              label="Message"
              height="h-48"
              required
              bg="bg-gray-100"
              {...register('message')}
            />
          </div>

          <div className="py-4 mt-4">
            <button
              type="submit"
              disabled={submitting || submitted}
              className="w-full px-2 py-4 rounded-md text-white text-lg font-semibold uppercase bg-green-600 hover:bg-green-700 disabled:bg-green-900 disabled:text-gray-300"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}