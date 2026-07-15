import {useState} from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/UserSlice'

const Login = () => {
  const [showPassword, setShowPassword]= useState(false)
      const [loading, setLoading]= useState(false)
      const[formData, setFormData]= useState({
          email:"",
          password:"",
      })
      const navigate= useNavigate()
      const dispatch= useDispatch();
      const [searchParams] = useSearchParams();
      const redirect = searchParams.get("redirect") || "/";
      const handleChange= (e)=>{
          const {name, value} =e.target;
          setFormData((prev)=>({
              ...prev,
              [name]:value
          }))
      }
  const submitHandler= async(e)=>{
      e.preventDefault()
      console.log(formData);
      try {
          setLoading(true)
          const res= await axios.post(`http://localhost:8000/api/v1/user/login`,formData,{
              headers:{
                  "Content-Type":"application/json"
              }
          })
          if(res.data.success){
              localStorage.setItem("accessToken", res.data.accessToken);
              dispatch(setUser(res.data.user));
              toast.success(res.data.message);
              navigate(redirect === "checkout" ? "/checkout" : redirect);
          }
      } catch (error) {
          toast.error(error.response?.data?.message || error.message || "An error occurred")
          console.log(error);
  
      } finally {
      setLoading(false);
    }
  }
  return (
    <div>
       <div className='flex justify-center items-center min-h-screen bg-red-100'>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email and password to login
        </CardDescription>
      </CardHeader>
      <CardContent>
       
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              
              
            </div>
            <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className='relative'>
              <Input 
                    id="password" 
                    name="password"
                    placeholder="Enter a password"
                    type={showPassword ? 'text':'password'}
                    required 
                    value={formData.password}
                    onChange={handleChange}
                />
                {
                    showPassword ? <EyeOff onClick={()=>setShowPassword(false)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2'/>:
                    <Eye onClick={()=>setShowPassword(true)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2'/>
                }

              </div>
            </div>
          </div>
        
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={submitHandler} className="w-full bg-pink-500">

          {loading? <><Loader2 className='h-4 w-4 animate-spin mr-2'/>Please wait</>:'Log In'}
        </Button>
        <p>Don't have an account? <Link to={'/signup'} className='hover:underline cursor-pointer text-pink-800'>Sign up</Link></p>
      </CardFooter>
    </Card>
    </div>
    </div>
  )
}

export default Login
