import Image from 'next/image'

export default function Thanks() {
  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <Image src="/images/happy.svg" width={700} height={700} alt='' />
        <h1 className='text-4xl'>Thank you!</h1>
        <p className='text-lg'>Your order has been successfully proceded.</p>
        <button className='btn btn-info text-whiteBg my-10'>Home</button>
      </div>
      <div className='grow'></div>
    </>
  );
}
