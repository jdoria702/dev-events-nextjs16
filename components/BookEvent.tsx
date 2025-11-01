'use client'

import React, { useState } from 'react'

const BookEvent = () => {
  // states:
  // email will start with ''
  // submitted will start with false
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    // prevent reload
    e.preventDefault();

    // wait 1000 ms before setting submit state to true
    setTimeout(() => {
      setSubmitted(true);
    }, 1000)
  }

  return (
    <div id="book-event">
      {submitted ? (
        // if submitted is true --> return thank you sign
        <p className="text-sm">Thank you for signing up!</p>
      ): (
        // else --> create form and set submit to true when submitted
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder='Enter your email Address'
            />
          </div>

          <button type="submit" className="button-submit">Submit</button>
        </form>
      )}
    </div>
  )
}

export default BookEvent