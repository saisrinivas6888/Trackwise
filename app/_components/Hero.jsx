import React from 'react'

function Hero() {
  return (
    <div>
        <section className="bg-white lg:grid lg:h-screen lg:place-content-center dark:bg-gray-900">
  <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
    <div className="max-w-prose">
      <h1 className="text-9xl font-bold text-gray-900 sm:text-6xl dark:text-white">
      Understand Your Money Flow and 
        <strong className="text-indigo-600"> increase </strong>
        Your Financial Control
      </h1>

      <p className="mt-7 text-base text-pretty text-gray-700 sm:text-lg/relaxed dark:text-gray-200">
      Tired of complicated budgeting and scattered expense records? Our intuitive platform automatically categorizes your transactions, visualizes your spending patterns, and offers personalized recommendations to optimize your finances. Gain a clear understanding of your money flow, identify areas for savings, and take control of your financial future.
      </p>

      <div className="mt-4 flex gap-4 sm:mt-6">
        <a
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          href="/sign-in"
        >
          Get Started
        </a>

     
     
      </div>
    </div>
  </div>
</section>
    </div>
  )
}

export default Hero