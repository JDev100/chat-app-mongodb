import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes'

const Register = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        password2: ""
    })
    
    useEffect(() => {
        if (localStorage.getItem('chat-app-user')) {
            navigate('/')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // alert("form")
        if (handleValidation()) {
            const { username, email, password } = values
            const { data } = await axios.post(registerRoute, {
                username,
                email,
                password,
            })

            if (data.status === false) {
                toast.error(data.msg, toastOptions)
            }

            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user))
            }

            navigate('/')
        }
    }
    const toastOptions = {
        position: "top-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    const handleValidation = () => {
        const { username, email, password, password2 } = values
        var validate = true;
        if (password !== password2) {
            toast.error('Both passwords should be the same', toastOptions)
            validate = false
        }
        else if (password.length < 8) {
            toast.error('Password should be at least 8 characters', toastOptions)
            validate = false

        }
        if (username.length < 3) {
            toast.error('Username should be at least 3 characters', toastOptions)
            validate = false

        }
        if (email === '') {
            toast.error('Email is required', toastOptions)
            validate = false

        }
        return validate
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
        // console.log(values)
    }

    return (
        <>
            {/* <ToastContainer> */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/* Same as */}
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>Super Chat</h1>
                    </div>
                    <input type="text" placeholder='Username' name='username' onChange={e => handleChange(e)} />
                    <input type="email" placeholder='Email' name='email' onChange={e => handleChange(e)} />
                    <input type="password" placeholder='Password' name='password' onChange={e => handleChange(e)} />
                    <input type="password" placeholder='Confirm Password' name='password2' onChange={e => handleChange(e)} />
                    <button type='submit'>Create User</button>
                    <span>Already have an account? <Link to={'/login'}>Login</Link></span>
                </form>
            </FormContainer>
            <ToastContainer />
            {/* </ToastContainer> */}
        </>
    )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
             
        }
        h1 {
            color:white;
            text-transform: uppercase;

        }
    }
    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;

        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;
            &:focus {
                border: .1rem solid #997af0;
                outline: none
            }
        }
        button {
            background-color:  #4e0eff ;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: .25s ease-in-out;
            &:hover, &:focus {
                background-color: #997af0;
                outline: none;
            }
        }
        span {
            color: white;
            text-transform: uppercase;
            a {
                color: #4d0eff;
                /* text-transform: none; */
                font-weight: bold;
                text-decoration: none;
            } 
        }
    }
`

export default Register