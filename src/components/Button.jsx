import React from 'react'
import { useNavigate } from 'react-router'

const Button = ({text, navigate}) => {
    const route = useNavigate();
  return (
    <button onClick={() => route(`/${navigate}`)} className='border border-2 px-5 py-3 rounded font-bold text-3xl shadow-white/20 shadow-2xl hover:scale-110 hover:text-white/50 hover:border-white/50 hover:outline hover:outline-white/20 transition-all duration-300 active:scale-90'>{text}</button>
  )
}

export default Button