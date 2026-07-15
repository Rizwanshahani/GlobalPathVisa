import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const VerifyEmail = () => {
    const {token} = useParams()
    const [status, setStatus]= useState("verifing....")
    const navigate= useNavigate()
    const verifyEmail= async()=>{
        try {
            const res= await axios.post(`http://localhost:8000/api/v1/user/verify?`,{},{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            if(res.data.success){
                setStatus('✅ Email verified Successfully')
                setTimeout(()=>{
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            console.log(error);
            setStatus("❌ Verification failed. Please try again")
            
        }
    }
    useEffect(()=>{
        const timer = setTimeout(() => {
            verifyEmail();
        }, 0);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token])
  return (
    <div className='relative w-full min-h-screen bg-pink-100 overflow-hidden'>
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-6 rounded-2xl shadow-md text-center w-full max-w-md'>
                <h2 className='text-xl font-semibold text-gray-800 '>{status}</h2>
            </div>

        </div>
      
    </div>
  )
}

export default VerifyEmail