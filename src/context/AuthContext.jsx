import React,{createContext,useState,useContext,useEffect} from "react";
import api from "../services/api";
import { toast } from "sonner";

const AuthContext = createContext({});

export const AuthProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);
    
    useEffect(()=>{
        const token = localStorage.getItem("accessToken");
        if(token){
            api.get("/auth/me",{headers:{Authorization:`Bearer ${token}`}})
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                localStorage.removeItem("accessToken");
                setUser(null);
            })
            .finally(()=>{
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    },[]);

    const Login = async(email,password)=>{
        try{
            const response = await api.post("/auth/login",{email,password});
            const {accessToken,user} = response.data;
            localStorage.setItem("accessToken",accessToken);
            setUser(user);
            toast.success("Howdy! You are logged in.");
        } catch(error){
            toast.error(error.response?.data?.message || "Login failed please try again.");
          throw error;  
        }
    }

    const Logout = ()=>{
        localStorage.removeItem("accessToken");
        setUser(null);
        toast.info("You have been logged out.");
    }

 const register = async (name, email, password) => {
  try {
    await api.post("/auth/register", { name, email, password });
    toast.success("Welcome! Your account has been created. Please log in.");
    return { success: true };   
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed, please try again.");
    return { success: false, error: error.response?.data?.message };
  }
};

    const forgotPassword = async(email)=>{
        try{
            await api.post("/auth/forgot-password",{email});
            toast.success("Password reset link has been sent to your email.");
        } catch(error){
            toast.error(error.response?.data?.message || "Howdy! Failed to send password reset link, Please try again my friend.");
        }
    }
    const resetPassword = async(token, newPassword)=>{
        try{
            await api.post("/auth/reset-password",{token, newPassword});
            toast.success("Your password has been reset successfully.");
        } catch(error){
            toast.error(error.response?.data?.message || "Howdy! Failed to reset password,please try again.");
        }
    }
    const value = {
        user,loading,Login,register,Logout,forgotPassword,resetPassword, isAuthenticated:!!user
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );    
}
export const useAuth = ()=>{
    return useContext(AuthContext);
}
   
