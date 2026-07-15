
const Verify = () => {
  return (
    <div className='relative w-full min-h-screen overflow-hidden'>
      <div className='min-h-screen flex items-center justify-center bg-pink-100 px-4'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
          <h2 className='text-2xl font-semibold text-green-500 mb-4'>✅ Check your Email</h2>
          <p className='text-gray-400 text-sm'>
            We have sent you an email to verify your account. please check your inbox in an email and click the verification link.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Verify
