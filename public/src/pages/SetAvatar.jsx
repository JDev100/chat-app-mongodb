
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import loader from '../assets/loader.gif'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes'
import { Buffer } from 'buffer'
import Avatar from "react-avatar-edit";

const SetAvatar = () => {
    // const api = 'https://api .multiavatar.com'
    const navigate = useNavigate()
    const [avatars, setAvatars] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedAvatar, setSelectedAvatar] = useState(undefined)
    const [preview, setPreview] = useState(null);

    function onClose() {
        setPreview(null);
    }
    function onCrop(pv) {
        setPreview(pv);
        console.log(pv)
    }
    function onBeforeFileLoad(elem) {
        if (elem.target.files[0].size > 2000000) {
            toast.error("File is too big", toastOptions)

            elem.target.value = "";
        }
    }
    function onFileLoad(file) {
        console.log(file)
        setPreview(file);

        console.log(preview)
    }
    const toastOptions = {
        position: "top-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    const labelOptions = {
        fontSize: '1.25em',
        fontWeight: '700',
        color: 'white',
        display: 'inline-block',
        // fontFamily: 'sans-serif',
        cursor: 'pointer'
    }

    useEffect(() => {
        async function doStuff() {
            if (!localStorage.getItem('chat-app-user')) {
                navigate('/login')
            }

        }
        doStuff()
    }, [])
    const setProfilePicture = async () => {
        if (preview === null) {
            toast.error("Set an avatar", toastOptions)
        }
        else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"))
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: preview
            })

            console.log(data)

            if (data.isSet) {
                user.isAvatarImageSet = true
                user.avatarImage = data.image
                localStorage.setItem("chat-app-user", JSON.stringify(user))
                navigate('/')
            }
            else {
                toast.error('Error setting avatar. Please try again', toastOptions)
            }
        }
    }
    // useEffect(async () => {
    //     const data = []

    //     for (let i = 0; i < 4; i++) {
    //         const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
    //         const buffer = new Buffer(image.data)
    //         data.push(buffer.toString('base64'))
    //     }
    //     setAvatars(data)
    //     setIsLoading(false)
    // }, [])



    return (
        <>
            <Container>
                <div className="title-container">
                    <h1>Pick an avatar as your profile picture</h1>
                </div>
                <div className="avatars">
                    <div>
                        <Avatar
                            width={600}
                            height={300}
                            onCrop={onCrop}
                            onClose={onClose}
                            onBeforeFileLoad={onBeforeFileLoad}
                            onFileLoad={onFileLoad}
                            src={null}
                            labelStyle={labelOptions}
                            backgroundColor='#23272a'
                        />

                    </div>
                    <br />
                    <div>
                        <button className='submit-btn' onClick={setProfilePicture}>Apply</button>

                    </div>
                    {/* {preview && (
                        <>
                            <img src={preview} alt="Preview" />
                            <a href={preview} download="avatar">
                                Download image
                            </a>
                        </>
                    )} */}
                </div>
            </Container>
            <ToastContainer />
        </>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    color: white;

    button {
        margin: auto;
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
    .loader {
        max-inline-size: 100%
    }
    .title-container {
    }
    .avatars {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
    }
`;

export default SetAvatar