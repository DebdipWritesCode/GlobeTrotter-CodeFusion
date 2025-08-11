import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState<boolean>(true)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      handleVerifyEmail(tokenParam)
    } else {
      setError("Token not found in URL")
      setVerifying(false)
    }
  }, [])

  const handleVerifyEmail = async (queryToken: string) => {
    setVerifying(true)
    setError(null)
    try {
      const token = parseInt(queryToken, 10)
      if (isNaN(token)) throw new Error("Invalid token format")

      const response = await api.post("/verify_email", { token })
      if (response.status === 200) {
        setSuccess(true)
      } else {
        throw new Error("Verification failed")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unknown error")
      setSuccess(false)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {verifying ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            <p className="text-gray-700 text-lg font-medium">Verifying your email...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="h-10 w-10 text-red-500" />
            <p className="text-lg text-red-600 font-semibold">Verification Failed</p>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="text-lg text-green-600 font-semibold">Email Verified Successfully!</p>
            <p className="text-sm text-gray-600">You may now log in and enjoy all features.</p>
            <Button
              onClick={() => navigate("/login")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Go to Login
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default VerifyEmail
